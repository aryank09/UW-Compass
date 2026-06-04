import { createHash } from 'crypto';
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { embed, extractNeeds, selectResources, summarize } from '@/lib/ai';
import { getAllResources, countResources } from '@/lib/db';
import { rank } from '@/lib/recommend';
import { createRateLimiter } from '@/lib/ratelimit';
import {
  CAMPUSES,
  CATEGORIES,
  ExtractedNeed,
  RecommendResponse,
  StudentContext,
  TokenUsage,
  ZERO_USAGE,
  addUsage,
} from '@/lib/types';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

// ---------------------------------------------------------------------------
// Rate limiter — 20 req/min per IP (per-instance; see ratelimit.ts for notes)
// ---------------------------------------------------------------------------
const isRateLimited = createRateLimiter(20, 60_000);

// ---------------------------------------------------------------------------
// In-memory response cache — keyed by sha256(campus:input), 5-minute TTL.
// Same per-instance caveat as the rate limiter above.
// Cache is keyed only on (campus, input) — not on two_pass / use_ai_ranker /
// student_context so that power-user options always bypass the cache.
// ---------------------------------------------------------------------------
const CACHE_TTL_MS = 5 * 60_000;

interface CacheEntry {
  data: RecommendResponse;
  expiresAt: number;
}

const responseCache = new Map<string, CacheEntry>();

function getCacheKey(input: string, campus: string): string {
  return createHash('sha256').update(`${campus}:${input}`).digest('hex');
}

function getCached(key: string): RecommendResponse | null {
  const entry = responseCache.get(key);
  if (!entry) return null;
  if (Date.now() >= entry.expiresAt) {
    responseCache.delete(key);
    return null;
  }
  return entry.data;
}

function setCached(key: string, data: RecommendResponse): void {
  responseCache.set(key, { data, expiresAt: Date.now() + CACHE_TTL_MS });
}

// ---------------------------------------------------------------------------
// Need-merging for conversational follow-up
// ---------------------------------------------------------------------------

function mergeNeeds(prior: ExtractedNeed[], fresh: ExtractedNeed[]): ExtractedNeed[] {
  const merged = new Map<string, ExtractedNeed>(prior.map((n) => [n.category, n]));
  for (const n of fresh) {
    const existing = merged.get(n.category);
    if (!existing || n.intensity >= existing.intensity) {
      merged.set(n.category, n);
    } else {
      merged.set(n.category, {
        ...existing,
        tags: [...new Set([...existing.tags, ...n.tags])],
      });
    }
  }
  return [...merged.values()];
}

// ---------------------------------------------------------------------------
// Route handler
// ---------------------------------------------------------------------------

const StudentContextSchema = z
  .object({
    year: z
      .enum(['freshman', 'sophomore', 'junior', 'senior', 'graduate', 'transfer'])
      .optional(),
    commuter: z.boolean().optional(),
    first_gen: z.boolean().optional(),
  })
  .optional();

const RequestSchema = z.object({
  input: z.string().min(3, 'Tell us at least a few words about what you need.').max(2000),
  campus: z.enum(CAMPUSES).optional().default('all'),
  advisor: z.boolean().optional().default(false),
  shareQuery: z.boolean().optional().default(false),
  prior_needs: z
    .array(
      z.object({
        // Use z.enum so invalid categories are rejected instead of silently propagating.
        category: z.enum(CATEGORIES),
        intensity: z.number().int().min(1).max(5),
        confidence: z.enum(['high', 'medium', 'low']).optional(),
        evidence: z.string(),
        tags: z.array(z.string()),
        urgent: z.boolean(),
      })
    )
    .optional(),
  student_context: StudentContextSchema,
  two_pass: z.boolean().optional().default(false),
  use_ai_ranker: z.boolean().optional().default(false),
});

/** Strip obvious PII patterns before storing a query in the gallery. */
function sanitizeQuery(q: string): string {
  return q
    .replace(/[\w.+]+@[\w.]+\.\w+/g, '[email]')
    .replace(/\b\d{7,9}\b/g, '[id]')
    .replace(/\b\d{3}[-.\s]?\d{3}[-.\s]?\d{4}\b/g, '[phone]');
}

// ---------------------------------------------------------------------------
// Streaming helper — wraps an async pipeline in a NDJSON ReadableStream.
// Non-streaming error paths (rate limit, bad input, empty DB) still return
// normal NextResponse.json() so error handling in the client stays simple.
// ---------------------------------------------------------------------------

type StreamEmit = (event: Record<string, unknown>) => void;

// Classify a thrown pipeline error into a user-facing message. OpenAI SDK
// errors expose a numeric `status` and a string `code`; a 429 (quota exhausted
// or upstream rate limit) is transient and worth a distinct, friendlier note
// than a generic failure.
function errorMessageFor(err: unknown): string {
  const e = err as { status?: number; code?: string } | null;
  const status = e?.status;
  const code = e?.code;
  if (status === 429 || code === 'insufficient_quota' || code === 'rate_limit_exceeded') {
    return 'The recommendation service is busy right now. Please wait a moment and try again.';
  }
  if (status === 401 || code === 'invalid_api_key') {
    return 'The recommendation service is temporarily unavailable. Please try again later.';
  }
  return 'An error occurred. Please try again.';
}

function ndjsonStream(
  fn: (emit: StreamEmit) => Promise<void>,
  extraHeaders?: Record<string, string>
): Response {
  const encoder = new TextEncoder();
  const stream = new ReadableStream({
    async start(controller) {
      const emit: StreamEmit = (event) => {
        controller.enqueue(encoder.encode(JSON.stringify(event) + '\n'));
      };
      try {
        await fn(emit);
      } catch (err) {
        console.error('[/api/recommend] pipeline error:', err);
        emit({ type: 'error', error: errorMessageFor(err) });
      } finally {
        controller.close();
      }
    },
  });

  return new Response(stream, {
    headers: {
      'Content-Type': 'application/x-ndjson',
      'Cache-Control': 'no-cache, no-store',
      ...extraHeaders,
    },
  });
}

export async function POST(req: NextRequest) {
  const requestStart = Date.now();

  // Rate limiting
  const ip =
    req.headers.get('x-forwarded-for')?.split(',')[0].trim() ??
    req.headers.get('x-real-ip') ??
    'unknown';

  if (isRateLimited(ip)) {
    return NextResponse.json(
      { error: 'Too many requests. Please wait a minute before trying again.' },
      { status: 429, headers: { 'Retry-After': '60' } }
    );
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body.' }, { status: 400 });
  }

  const parsed = RequestSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? 'Invalid request.' },
      { status: 400 }
    );
  }
  const { input, campus, advisor, shareQuery, prior_needs, student_context, two_pass, use_ai_ranker } =
    parsed.data;

  if (countResources() === 0) {
    return NextResponse.json(
      { error: 'Resource database is empty. Run `npm run seed` after setting OPENAI_API_KEY.' },
      { status: 503 }
    );
  }

  // Pre-filter resources by campus so we can return 404 before opening the stream.
  const campusResources = getAllResources().filter(
    (r) => campus === 'all' || r.campus === campus || r.campus === 'all'
  );
  if (campusResources.length === 0) {
    return NextResponse.json(
      { error: `No resources are tagged for the ${campus} campus yet.` },
      { status: 404 }
    );
  }

  const bypassCache = advisor || two_pass || use_ai_ranker || !!student_context || !!prior_needs;
  const cacheKey = getCacheKey(input, campus);

  return ndjsonStream(
    async (emit) => {
      // L1: in-memory cache hit
      if (!bypassCache) {
        const cached = getCached(cacheKey);
        if (cached) {
          emit({ type: 'done', ...cached });
          return;
        }
      }

      // L2: Supabase persistent cache hit
      if (!bypassCache && process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY) {
        try {
          const { supabase } = await import('@/lib/supabase');
          const { data } = await supabase
            .from('query_cache')
            .select('response')
            .eq('cache_key', cacheKey)
            .maybeSingle();
          if (data?.response) {
            const persisted = data.response as RecommendResponse;
            setCached(cacheKey, persisted); // warm L1
            emit({ type: 'done', ...persisted });
            return;
          }
        } catch {
          // cache unavailable — fall through to AI pipeline
        }
      }

      let totalUsage: TokenUsage = { ...ZERO_USAGE };

      // -----------------------------------------------------------------------
      // Step 1 — embed + extract needs (in parallel)
      // -----------------------------------------------------------------------
      const [inputEmbedding, { needs: extractedNeeds, usage: extractUsage }] = await Promise.all([
        embed(input),
        extractNeeds(input, {
          studentContext: student_context as StudentContext | undefined,
          twoPass: two_pass,
        }),
      ]);
      totalUsage = addUsage(totalUsage, extractUsage);

      const needs = prior_needs ? mergeNeeds(prior_needs as ExtractedNeed[], extractedNeeds) : extractedNeeds;

      // Stream needs immediately so the UI can show "What we heard" while
      // ranking and summarizing are still in progress.
      emit({ type: 'needs', needs });

      // -----------------------------------------------------------------------
      // Step 2 — rank (cosine baseline; optionally supplement with LLM ranker)
      // -----------------------------------------------------------------------
      const { recommendations: cosineRanked, advisorData } = rank(
        inputEmbedding,
        needs,
        campusResources,
        { topK: use_ai_ranker ? 20 : 5, advisor }
      );

      let rankedForSummary = cosineRanked.slice(0, 5);
      let rankerLabel: 'cosine' | 'llm' | 'hybrid' = 'cosine';

      if (use_ai_ranker) {
        const { ids: llmIds, usage: selectUsage } = await selectResources(
          input,
          needs,
          cosineRanked.map((r) => r.resource),
          5
        );
        totalUsage = addUsage(totalUsage, selectUsage);

        const idOrder = new Map(llmIds.map((id, i) => [id, i]));
        const llmPicked = cosineRanked
          .filter((r) => idOrder.has(r.resource.id))
          .sort((a, b) => (idOrder.get(a.resource.id) ?? 99) - (idOrder.get(b.resource.id) ?? 99));

        rankedForSummary = llmPicked.length >= 3 ? llmPicked : cosineRanked.slice(0, 5);
        rankerLabel = llmPicked.length >= 3 ? 'hybrid' : 'cosine';
      }

      // -----------------------------------------------------------------------
      // Step 3 — generate student-facing summaries
      // -----------------------------------------------------------------------
      const { output: summary, usage: summaryUsage } = await summarize({
        studentInput: input,
        needs,
        topResources: rankedForSummary.map((r) => ({
          id: r.resource.id,
          name: r.resource.name,
          category: r.resource.category,
          description: r.resource.description,
        })),
      });
      totalUsage = addUsage(totalUsage, summaryUsage);

      const recommendations = rankedForSummary.map((r) => ({
        ...r,
        why: summary.per_resource[r.resource.id] ?? '',
        evidence_quote: summary.evidence_quotes[r.resource.id],
      }));

      // -----------------------------------------------------------------------
      // Step 4 — assemble and emit final response
      // -----------------------------------------------------------------------
      const latency_ms = Date.now() - requestStart;

      console.log(
        `[/api/recommend] latency=${latency_ms}ms ranker=${rankerLabel} two_pass=${two_pass}`,
        `tokens: prompt=${totalUsage.prompt_tokens} completion=${totalUsage.completion_tokens} total=${totalUsage.total_tokens}`
      );

      const response: RecommendResponse = {
        needs,
        recommendations,
        next_steps: summary.next_steps,
        ...(advisor && advisorData
          ? {
              advisorData: {
                ...advisorData,
                allResults: advisorData.allResults.map((r) => ({
                  ...r,
                  why: summary.per_resource[r.resource.id] ?? '',
                  evidence_quote: summary.evidence_quotes[r.resource.id],
                })),
              },
            }
          : {}),
        ...(bypassCache
          ? {
              meta: {
                tokens: totalUsage,
                latency_ms,
                ranker: rankerLabel,
              },
            }
          : {}),
      };

      if (!bypassCache) setCached(cacheKey, response);

      emit({ type: 'done', ...response });

      // Write to Supabase persistent cache (after response is sent to client)
      if (!bypassCache && process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY) {
        try {
          const { supabase } = await import('@/lib/supabase');
          await supabase.from('query_cache').upsert(
            { cache_key: cacheKey, response: response as unknown as Record<string, unknown> },
            { onConflict: 'cache_key' }
          );
        } catch (err) {
          console.error('[/api/recommend] Cache write failed:', err);
        }
      }

      // Gallery opt-in
      if (shareQuery && input.length > 20) {
        const safe = sanitizeQuery(input);
        try {
          if (process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY) {
            const { supabase } = await import('@/lib/supabase');
            console.log('[/api/recommend] Writing to gallery:', safe.slice(0, 40));
            const { error: insertError } = await supabase.from('gallery_queries').insert({ query: safe });
            if (insertError) console.error('[/api/recommend] Insert error:', insertError);
            // Keep only the 50 most recent entries — fetch IDs beyond rank 50 and delete them
            const { data: overflow } = await supabase
              .from('gallery_queries')
              .select('id')
              .order('created_at', { ascending: false })
              .range(50, 9999);
            if (overflow && overflow.length > 0) {
              const ids = overflow.map((r: { id: string }) => r.id);
              await supabase.from('gallery_queries').delete().in('id', ids);
            }
          } else {
            const { appendFileSync } = await import('fs');
            const { join } = await import('path');
            appendFileSync(join(process.cwd(), 'data', 'gallery.jsonl'), safe + '\n', 'utf-8');
          }
        } catch (err) {
          console.error('[/api/recommend] Gallery write failed:', err);
        }
      }
    },
    bypassCache ? undefined : undefined
  );
}

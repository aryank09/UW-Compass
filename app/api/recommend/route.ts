import { createHash } from 'crypto';
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { embed, extractNeeds, selectResources, summarize } from '@/lib/ai';
import { getAllResources, countResources } from '@/lib/db';
import { rank } from '@/lib/recommend';
import {
  CAMPUSES,
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
// In-memory rate limiter — sliding window, keyed by IP.
// Note: in a multi-instance Vercel deployment each instance has its own map,
// so this is "per-instance" rather than globally shared. It still prevents
// bursts from a single IP hitting the same cold-started function repeatedly.
// For strict global limits, swap in @upstash/ratelimit with Vercel KV.
// ---------------------------------------------------------------------------
const RATE_LIMIT_REQUESTS = 20;
const RATE_LIMIT_WINDOW_MS = 60_000; // 1 minute

interface RateLimitEntry {
  count: number;
  resetAt: number;
}

const rateLimitMap = new Map<string, RateLimitEntry>();

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const entry = rateLimitMap.get(ip);
  if (!entry || now >= entry.resetAt) {
    rateLimitMap.set(ip, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS });
    return false;
  }
  if (entry.count >= RATE_LIMIT_REQUESTS) return true;
  entry.count++;
  return false;
}

// ---------------------------------------------------------------------------
// In-memory response cache — keyed by sha256(campus:input), 5-minute TTL.
// Same per-instance caveat as the rate limiter above.
// Cache is keyed only on (campus, input) — not on two_pass / use_ai_ranker /
// student_context so that power-user options always bypass the cache.
// ---------------------------------------------------------------------------
const CACHE_TTL_MS = 5 * 60_000; // 5 minutes

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

/**
 * Merge prior conversation needs with freshly extracted needs.
 * Fresh needs override prior ones in the same category when intensity ≥ prior.
 * Otherwise the prior need is kept and its tags are extended with any new ones.
 */
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
  /** When true, include per-signal scores and all resources in the response. */
  advisor: z.boolean().optional().default(false),
  /** When true, save the (sanitized) query to the anonymous gallery. */
  shareQuery: z.boolean().optional().default(false),
  /**
   * Needs from a previous turn. When provided, fresh needs are merged into
   * these before ranking — enabling stateless conversational refinement.
   */
  prior_needs: z
    .array(
      z.object({
        category: z.string(),
        intensity: z.number().int().min(1).max(5),
        confidence: z.enum(['high', 'medium', 'low']).optional(),
        evidence: z.string(),
        tags: z.array(z.string()),
        urgent: z.boolean(),
      })
    )
    .optional(),
  /** Optional persona context; shapes need extraction without changing the response schema. */
  student_context: StudentContextSchema,
  /**
   * Run a second self-critique LLM pass to prune over-stated needs and
   * false-urgent flags. Adds one extra cheap chat call.
   */
  two_pass: z.boolean().optional().default(false),
  /**
   * Use the LLM function-calling ranker (in addition to cosine) to select
   * resources. When true the response includes meta.ranker = "hybrid".
   */
  use_ai_ranker: z.boolean().optional().default(false),
});

/** Strip obvious PII patterns before storing a query in the gallery. */
function sanitizeQuery(q: string): string {
  return q
    .replace(/[\w.+]+@[\w.]+\.\w+/g, '[email]')        // email addresses
    .replace(/\b\d{7,9}\b/g, '[id]')                    // student/employee IDs
    .replace(/\b\d{3}[-.\s]?\d{3}[-.\s]?\d{4}\b/g, '[phone]'); // phone numbers
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

  // Cache is bypassed when any power-user option is active.
  const bypassCache = advisor || two_pass || use_ai_ranker || !!student_context || !!prior_needs;
  const cacheKey = getCacheKey(input, campus);
  if (!bypassCache) {
    const cached = getCached(cacheKey);
    if (cached) {
      return NextResponse.json(cached, { headers: { 'X-Cache': 'HIT' } });
    }
  }

  try {
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

    // Merge with prior-turn needs if the client sent them
    const needs = prior_needs ? mergeNeeds(prior_needs as ExtractedNeed[], extractedNeeds) : extractedNeeds;

    // -----------------------------------------------------------------------
    // Step 2 — filter resources by campus
    // -----------------------------------------------------------------------
    const resources = getAllResources().filter(
      (r) => campus === 'all' || r.campus === campus || r.campus === 'all'
    );
    if (resources.length === 0) {
      return NextResponse.json(
        { error: `No resources are tagged for the ${campus} campus yet.` },
        { status: 404 }
      );
    }

    // -----------------------------------------------------------------------
    // Step 3 — rank (cosine baseline; optionally supplement with LLM ranker)
    // -----------------------------------------------------------------------
    const { recommendations: cosineRanked, advisorData } = rank(
      inputEmbedding,
      needs,
      resources,
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
    // Step 4 — generate student-facing summaries
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
    // Step 5 — assemble response
    // -----------------------------------------------------------------------
    const latency_ms = Date.now() - requestStart;

    // Always log cost+latency — data for the final report
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
      // Include meta in advisor mode (and whenever power-user options were active)
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

    // Gallery opt-in
    if (shareQuery && input.length > 20) {
      const safe = sanitizeQuery(input);
      try {
        if (process.env.KV_REST_API_URL) {
          const { kv } = await import('@vercel/kv');
          await kv.lpush('gallery:queries', safe);
          await kv.ltrim('gallery:queries', 0, 49);
        } else {
          const { appendFileSync } = await import('fs');
          const { join } = await import('path');
          appendFileSync(join(process.cwd(), 'data', 'gallery.jsonl'), safe + '\n', 'utf-8');
        }
      } catch (err) {
        console.error('[/api/recommend] Gallery write failed:', err);
      }
    }

    return NextResponse.json(response, { headers: { 'X-Cache': 'MISS' } });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error.';
    console.error('[/api/recommend]', err);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

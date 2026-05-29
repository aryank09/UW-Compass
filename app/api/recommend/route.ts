import { createHash } from 'crypto';
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { embed, extractNeeds, summarize } from '@/lib/ai';
import { getAllResources, countResources } from '@/lib/db';
import { rank } from '@/lib/recommend';
import { CAMPUSES, RecommendResponse } from '@/lib/types';

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
// Route handler
// ---------------------------------------------------------------------------

const RequestSchema = z.object({
  input: z.string().min(3, 'Tell us at least a few words about what you need.').max(2000),
  campus: z.enum(CAMPUSES).optional().default('all'),
  /** When true, include per-signal scores and all resources in the response. */
  advisor: z.boolean().optional().default(false),
  /** When true, save the (sanitized) query to the anonymous gallery. */
  shareQuery: z.boolean().optional().default(false),
});

/** Strip obvious PII patterns before storing a query in the gallery. */
function sanitizeQuery(q: string): string {
  return q
    .replace(/[\w.+]+@[\w.]+\.\w+/g, '[email]') // email addresses
    .replace(/\b\d{7,9}\b/g, '[id]')              // student/employee IDs
    .replace(/\b\d{3}[-.\s]?\d{3}[-.\s]?\d{4}\b/g, '[phone]'); // phone numbers
}

export async function POST(req: NextRequest) {
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
  const { input, campus, advisor, shareQuery } = parsed.data;

  if (countResources() === 0) {
    return NextResponse.json(
      { error: 'Resource database is empty. Run `npm run seed` after setting OPENAI_API_KEY.' },
      { status: 503 }
    );
  }

  // Cache is bypassed in advisor mode (advisor wants live scores, not cached top-5).
  const cacheKey = getCacheKey(input, campus);
  if (!advisor) {
    const cached = getCached(cacheKey);
    if (cached) {
      return NextResponse.json(cached, { headers: { 'X-Cache': 'HIT' } });
    }
  }

  try {
    const [inputEmbedding, needs] = await Promise.all([embed(input), extractNeeds(input)]);

    const resources = getAllResources().filter(
      (r) => campus === 'all' || r.campus === campus || r.campus === 'all'
    );
    if (resources.length === 0) {
      return NextResponse.json(
        { error: `No resources are tagged for the ${campus} campus yet.` },
        { status: 404 }
      );
    }

    const { recommendations: ranked, advisorData } = rank(inputEmbedding, needs, resources, {
      topK: 5,
      advisor,
    });

    const summary = await summarize({
      studentInput: input,
      needs,
      topResources: ranked.map((r) => ({
        id: r.resource.id,
        name: r.resource.name,
        category: r.resource.category,
        description: r.resource.description,
      })),
    });

    const recommendations = ranked.map((r) => ({
      ...r,
      why: summary.per_resource[r.resource.id] ?? '',
    }));

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
              })),
            },
          }
        : {}),
    };

    if (!advisor) setCached(cacheKey, response);

    // Gallery opt-in: save sanitized query to KV or local file.
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

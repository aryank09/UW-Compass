import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { createRateLimiter } from '@/lib/ratelimit';

export const runtime = 'nodejs';

// 50 feedback votes per minute per IP — more lenient than /api/recommend
// because one recommend call can produce several feedback votes.
const isRateLimited = createRateLimiter(50, 60_000);

const FeedbackSchema = z.object({
  resourceId: z.string().min(1).max(100),
  query: z.string().max(2000),
  campus: z.string().max(20),
  helpful: z.boolean(),
});

export async function POST(req: NextRequest) {
  const ip =
    req.headers.get('x-forwarded-for')?.split(',')[0].trim() ??
    req.headers.get('x-real-ip') ??
    'unknown';

  if (isRateLimited(ip)) {
    return NextResponse.json(
      { error: 'Too many requests. Please wait a minute.' },
      { status: 429, headers: { 'Retry-After': '60' } }
    );
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON.' }, { status: 400 });
  }

  const parsed = FeedbackSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: 'Invalid request.' }, { status: 400 });
  }

  const entry = JSON.stringify({ ...parsed.data, ts: Date.now() });

  try {
    if (process.env.KV_REST_API_URL) {
      const { kv } = await import('@vercel/kv');
      const date = new Date().toISOString().slice(0, 10);
      await kv.rpush(`feedback:${date}`, entry);
    } else {
      const { appendFileSync } = await import('fs');
      const { join } = await import('path');
      appendFileSync(join(process.cwd(), 'data', 'feedback.jsonl'), entry + '\n', 'utf-8');
    }
  } catch (err) {
    console.error('[/api/feedback] Failed to persist entry:', err);
  }

  return NextResponse.json({ ok: true });
}

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

  const { resourceId, query, campus, helpful } = parsed.data;

  try {
    if (process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY) {
      const { supabase } = await import('@/lib/supabase');
      const { error } = await supabase
        .from('feedback')
        .insert({ resource_id: resourceId, query, campus, helpful });

      if (error) throw error;
    } else {
      const { appendFileSync } = await import('fs');
      const { join } = await import('path');
      const entry = JSON.stringify({ resourceId, query, campus, helpful, ts: Date.now() });
      appendFileSync(join(process.cwd(), 'data', 'feedback.jsonl'), entry + '\n', 'utf-8');
    }
  } catch (err) {
    console.error('[/api/feedback] Failed to persist entry:', err);
  }

  return NextResponse.json({ ok: true });
}

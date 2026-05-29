import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

export const runtime = 'nodejs';

const FeedbackSchema = z.object({
  resourceId: z.string().min(1).max(100),
  query: z.string().max(2000),
  campus: z.string().max(20),
  helpful: z.boolean(),
});

export async function POST(req: NextRequest) {
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
      // Vercel KV: append to a daily list key.
      const { kv } = await import('@vercel/kv');
      const date = new Date().toISOString().slice(0, 10);
      await kv.rpush(`feedback:${date}`, entry);
    } else {
      // Local development: append to data/feedback.jsonl.
      const { appendFileSync } = await import('fs');
      const { join } = await import('path');
      appendFileSync(join(process.cwd(), 'data', 'feedback.jsonl'), entry + '\n', 'utf-8');
    }
  } catch (err) {
    // Feedback logging should never break the UX.
    console.error('[/api/feedback] Failed to persist entry:', err);
  }

  return NextResponse.json({ ok: true });
}

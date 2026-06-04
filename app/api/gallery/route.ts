import { NextResponse } from 'next/server';

export const runtime = 'nodejs';

const GALLERY_KEY = 'gallery:queries';

/** Seed queries shown when no user-contributed queries exist yet. */
const SEED_QUERIES = [
  "I'm overwhelmed with finals and struggling with my mental health.",
  'I commute from Bellevue and need help paying for the bus pass.',
  "I'm running low on food and can't afford groceries this week.",
  'I need a quiet place to study late at night near campus.',
  "I'm a transfer student looking for internships — my resume needs work.",
  "I have a financial hold on my account and I don't know why.",
  "I'm feeling isolated and looking for community on campus.",
  "I need help with FAFSA — I don't understand what forms to fill out.",
];

async function withTimeout<T>(promise: Promise<T>, ms: number): Promise<T> {
  const timeout = new Promise<never>((_, reject) =>
    setTimeout(() => reject(new Error('timeout')), ms)
  );
  return Promise.race([promise, timeout]);
}

export async function GET() {
  // Option A: Vercel KV / Upstash REST API
  if (process.env.KV_REST_API_URL) {
    try {
      const { kv } = await import('@vercel/kv');
      const queries = (await withTimeout(kv.lrange(GALLERY_KEY, 0, 9), 3000)) as string[];
      if (queries.length > 0) return NextResponse.json({ queries });
    } catch (err) {
      console.error('[/api/gallery] KV read failed:', err);
    }
  }

  // Option B: Standard Redis via REDIS_URL (any provider)
  if (process.env.REDIS_URL) {
    try {
      const { createClient } = await import('redis');
      const client = createClient({ url: process.env.REDIS_URL });
      await withTimeout(client.connect(), 3000);
      const queries = await withTimeout(client.lRange(GALLERY_KEY, 0, 9), 3000);
      await client.disconnect();
      if (queries.length > 0) return NextResponse.json({ queries });
    } catch (err) {
      console.error('[/api/gallery] Redis read failed:', err);
    }
  }

  // Option C: Local dev — read from data/gallery.jsonl
  try {
    const { existsSync, readFileSync } = await import('fs');
    const { join } = await import('path');
    const filePath = join(process.cwd(), 'data', 'gallery.jsonl');
    if (existsSync(filePath)) {
      const lines = readFileSync(filePath, 'utf-8')
        .split('\n')
        .map((l) => l.trim())
        .filter(Boolean);
      if (lines.length > 0) return NextResponse.json({ queries: lines.slice(-10).reverse() });
    }
  } catch (err) {
    console.error('[/api/gallery] local file read failed:', err);
  }

  return NextResponse.json({ queries: SEED_QUERIES });
}

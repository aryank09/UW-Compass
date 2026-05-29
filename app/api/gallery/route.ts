import { NextResponse } from 'next/server';

export const runtime = 'nodejs';

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

export async function GET() {
  if (process.env.KV_REST_API_URL) {
    try {
      const { kv } = await import('@vercel/kv');
      const queries = (await kv.lrange('gallery:queries', 0, 9)) as string[];
      if (queries.length > 0) {
        return NextResponse.json({ queries });
      }
    } catch (err) {
      console.error('[/api/gallery] KV read failed:', err);
    }
  }
  return NextResponse.json({ queries: SEED_QUERIES });
}

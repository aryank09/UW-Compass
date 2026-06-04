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
  if (process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY) {
    try {
      const { supabase } = await import('@/lib/supabase');
      const { data, error } = await supabase
        .from('gallery_queries')
        .select('query')
        .order('created_at', { ascending: false })
        .limit(10);

      if (error) throw error;

      const queries = (data ?? []).map((row: { query: string }) => row.query);
      if (queries.length > 0) return NextResponse.json({ queries });
    } catch (err) {
      console.error('[/api/gallery] Supabase read failed:', err);
    }
  }

  // Local dev fallback — read from data/gallery.jsonl
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

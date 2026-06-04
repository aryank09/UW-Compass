import { NextResponse } from 'next/server';

export const runtime = 'nodejs';

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
      return NextResponse.json({ queries });
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

  return NextResponse.json({ queries: [] });
}

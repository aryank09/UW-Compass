import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { embed, extractNeeds, summarize } from '@/lib/ai';
import { getAllResources, countResources } from '@/lib/db';
import { rank } from '@/lib/recommend';
import { RecommendResponse } from '@/lib/types';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const RequestSchema = z.object({
  input: z.string().min(3, 'Tell us at least a few words about what you need.').max(2000),
});

export async function POST(req: NextRequest) {
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
  const { input } = parsed.data;

  if (countResources() === 0) {
    return NextResponse.json(
      {
        error:
          'Resource database is empty. Run `npm run seed` after setting OPENAI_API_KEY.',
      },
      { status: 503 }
    );
  }

  try {
    const [inputEmbedding, needs] = await Promise.all([embed(input), extractNeeds(input)]);
    const resources = getAllResources();
    const ranked = rank(inputEmbedding, needs, resources, { topK: 5 });

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
    };
    return NextResponse.json(response);
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error.';
    console.error('[/api/recommend]', err);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

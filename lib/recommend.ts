import {
  AdvisorData,
  Category,
  ExtractedNeed,
  Recommendation,
  ResourceWithEmbedding,
} from './types';

export function cosineSimilarity(a: number[], b: number[]): number {
  if (a.length !== b.length) {
    throw new Error(`Embedding length mismatch: ${a.length} vs ${b.length}`);
  }
  let dot = 0;
  let normA = 0;
  let normB = 0;
  for (let i = 0; i < a.length; i++) {
    dot += a[i] * b[i];
    normA += a[i] * a[i];
    normB += b[i] * b[i];
  }
  if (normA === 0 || normB === 0) return 0;
  return dot / (Math.sqrt(normA) * Math.sqrt(normB));
}

export function resourceEmbeddingText(r: {
  name: string;
  category: string;
  description: string;
  tags: string[];
}): string {
  return `${r.name}. Category: ${r.category}. ${r.description} Tags: ${r.tags.join(', ')}.`;
}

interface RankOptions {
  topK: number;
  /** When true, return all resources sorted by score with per-signal scores — no diversification cap. */
  advisor?: boolean;
  weights: {
    embedding: number;
    categoryMatch: number;
    tagOverlap: number;
    urgencyBoost: number;
  };
}

export const DEFAULT_WEIGHTS: RankOptions['weights'] = {
  embedding: 0.5,
  categoryMatch: 0.25,
  tagOverlap: 0.15,
  urgencyBoost: 0.1,
};

const DEFAULT_OPTIONS: RankOptions = {
  topK: 5,
  advisor: false,
  weights: DEFAULT_WEIGHTS,
};

export function rank(
  inputEmbedding: number[],
  needs: ExtractedNeed[],
  resources: ResourceWithEmbedding[],
  options: Partial<RankOptions> = {}
): { recommendations: Recommendation[]; advisorData?: AdvisorData } {
  const opts: RankOptions = {
    ...DEFAULT_OPTIONS,
    ...options,
    weights: { ...DEFAULT_OPTIONS.weights, ...(options.weights ?? {}) },
  };
  const neededCategories = new Set<Category>(needs.map((n) => n.category));
  const neededTags = new Set<string>(needs.flatMap((n) => n.tags));
  const studentIsUrgent = needs.some((n) => n.urgent);

  const scored: Recommendation[] = resources.map((r) => {
    const sim = cosineSimilarity(inputEmbedding, r.embedding);
    // Normalize cosine from [-1,1] to [0,1]; OpenAI embeddings live ~[0,1] already.
    const normSim = (sim + 1) / 2;

    const categoryScore = neededCategories.has(r.category) ? 1 : 0;
    const matchedTags = r.tags.filter((t) => neededTags.has(t));
    const tagScore = neededTags.size === 0 ? 0 : matchedTags.length / neededTags.size;
    const urgencyScore = studentIsUrgent && r.urgent ? 1 : 0;

    const score =
      opts.weights.embedding * normSim +
      opts.weights.categoryMatch * categoryScore +
      opts.weights.tagOverlap * tagScore +
      opts.weights.urgencyBoost * urgencyScore;

    return {
      resource: {
        id: r.id,
        name: r.name,
        category: r.category,
        campus: r.campus,
        description: r.description,
        url: r.url,
        tags: r.tags,
        urgent: r.urgent,
      },
      score,
      embedding_similarity: sim,
      matched_needs: neededCategories.has(r.category) ? r.category : null,
      matched_tags: matchedTags,
      why: '', // filled in by the summarizer
      scores: { embedding: normSim, category: categoryScore, tags: tagScore, urgency: urgencyScore },
    };
  });

  scored.sort((a, b) => b.score - a.score);

  if (opts.advisor) {
    return {
      recommendations: scored.slice(0, opts.topK),
      advisorData: { allResults: scored, weights: opts.weights },
    };
  }

  // Diversify: cap at 2 resources per category in the top K.
  const final: Recommendation[] = [];
  const perCategory = new Map<Category, number>();
  for (const rec of scored) {
    const c = perCategory.get(rec.resource.category) ?? 0;
    if (c >= 2 && final.length < opts.topK) continue;
    final.push(rec);
    perCategory.set(rec.resource.category, c + 1);
    if (final.length >= opts.topK) break;
  }
  // Top up if diversification left us short.
  if (final.length < opts.topK) {
    for (const rec of scored) {
      if (final.includes(rec)) continue;
      final.push(rec);
      if (final.length >= opts.topK) break;
    }
  }

  return { recommendations: final };
}

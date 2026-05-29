import { describe, it, expect } from 'vitest';
import { cosineSimilarity, rank, resourceEmbeddingText } from '@/lib/recommend';
import type { ExtractedNeed, ResourceWithEmbedding } from '@/lib/types';

function makeResource(
  id: string,
  overrides: Partial<ResourceWithEmbedding> = {}
): ResourceWithEmbedding {
  return {
    id,
    name: `Resource ${id}`,
    category: 'academic',
    campus: 'seattle',
    description: 'test description',
    url: 'https://example.com',
    tags: [],
    urgent: false,
    embedding: [1, 0, 0],
    ...overrides,
  };
}

describe('cosineSimilarity', () => {
  it('returns 1 for identical vectors', () => {
    expect(cosineSimilarity([1, 0, 0], [1, 0, 0])).toBe(1);
  });

  it('returns 0 for orthogonal vectors', () => {
    expect(cosineSimilarity([1, 0, 0], [0, 1, 0])).toBe(0);
  });

  it('returns -1 for opposite vectors', () => {
    expect(cosineSimilarity([1, 0], [-1, 0])).toBe(-1);
  });

  it('returns 0 when either vector is all zeros', () => {
    expect(cosineSimilarity([0, 0, 0], [1, 1, 1])).toBe(0);
  });

  it('throws when vectors have different lengths', () => {
    expect(() => cosineSimilarity([1, 0], [1, 0, 0])).toThrow(/length mismatch/);
  });
});

describe('resourceEmbeddingText', () => {
  it('includes name, category, description, and tags', () => {
    const text = resourceEmbeddingText({
      name: 'Math Center',
      category: 'academic',
      description: 'Free math help.',
      tags: ['math', 'tutoring'],
    });
    expect(text).toContain('Math Center');
    expect(text).toContain('academic');
    expect(text).toContain('Free math help.');
    expect(text).toContain('math');
    expect(text).toContain('tutoring');
  });
});

describe('rank', () => {
  const needs: ExtractedNeed[] = [
    {
      category: 'academic',
      intensity: 3,
      evidence: 'failing math',
      tags: ['math', 'tutoring'],
      urgent: false,
    },
  ];

  it('puts the highest-similarity resource at the top when categories match', () => {
    const resources = [
      makeResource('a', { embedding: [1, 0, 0], tags: ['math', 'tutoring'] }),
      makeResource('b', { embedding: [0.1, 0, 0], tags: ['math'] }),
      makeResource('c', { embedding: [0, 1, 0], category: 'career' }),
    ];
    const { recommendations } = rank([1, 0, 0], needs, resources, { topK: 3 });
    expect(recommendations[0].resource.id).toBe('a');
  });

  it('boosts urgent resources only when the student is urgent', () => {
    const urgentNeeds: ExtractedNeed[] = [
      { ...needs[0], urgent: true, category: 'wellness' },
    ];
    const resources = [
      makeResource('crisis', {
        category: 'wellness',
        urgent: true,
        embedding: [0.2, 0.2, 0.2],
      }),
      makeResource('non-urgent', {
        category: 'wellness',
        urgent: false,
        embedding: [0.5, 0.5, 0.5],
      }),
    ];
    const { recommendations } = rank([0.3, 0.3, 0.3], urgentNeeds, resources, { topK: 2 });
    expect(recommendations[0].resource.id).toBe('crisis');
  });

  it('diversifies categories — no more than 2 from the same category in the top K', () => {
    const resources = [
      makeResource('a1', { category: 'academic', embedding: [1, 0, 0] }),
      makeResource('a2', { category: 'academic', embedding: [0.99, 0, 0] }),
      makeResource('a3', { category: 'academic', embedding: [0.98, 0, 0] }),
      makeResource('a4', { category: 'academic', embedding: [0.97, 0, 0] }),
      makeResource('w1', { category: 'wellness', embedding: [0.5, 0, 0] }),
    ];
    const { recommendations } = rank([1, 0, 0], needs, resources, { topK: 3 });
    const academicCount = recommendations.filter((r) => r.resource.category === 'academic').length;
    expect(academicCount).toBeLessThanOrEqual(2);
  });

  it('returns matched_tags reflecting the overlap with extracted need tags', () => {
    const resources = [
      makeResource('a', {
        tags: ['math', 'calculus', 'tutoring', 'unrelated'],
      }),
    ];
    const { recommendations } = rank([1, 0, 0], needs, resources, { topK: 1 });
    expect(recommendations[0].matched_tags.sort()).toEqual(['math', 'tutoring']);
  });
});

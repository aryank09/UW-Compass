/**
 * Scenario coverage for the 5 evaluation prompts from §9 of the proposal.
 *
 * These tests bypass OpenAI: instead of calling extractNeeds() (which would
 * cost money and be brittle), we hand-craft the ExtractedNeed[] that we'd
 * expect the model to produce, then let the real rank() function score
 * them against the real precomputed embeddings in
 * data/resources.embedded.json.
 *
 * What this catches:
 *  - regressions in rank() weights / diversification
 *  - missing or mis-tagged resources in data/resources.json
 *  - schema drift between ExtractedNeed and Resource categories/tags
 */
import { describe, it, expect } from 'vitest';
import { rank } from '@/lib/recommend';
import type { Category, ExtractedNeed, ResourceWithEmbedding } from '@/lib/types';
import embedded from '@/data/resources.embedded.json';

const RESOURCES = embedded as ResourceWithEmbedding[];
const DIM = RESOURCES[0].embedding.length;
const ZERO_EMBEDDING = new Array(DIM).fill(0); // forces ranker to rely on tag/category signals

function need(
  category: Category,
  tags: string[],
  evidence: string,
  intensity: 1 | 2 | 3 | 4 | 5 = 3,
  urgent = false
): ExtractedNeed {
  return { category, intensity, evidence, tags, urgent };
}

interface Scenario {
  name: string;
  needs: ExtractedNeed[];
  expectedCategories: Category[];
}

const SCENARIOS: Scenario[] = [
  {
    name: 'I am failing calculus and need help.',
    needs: [need('academic', ['math', 'calculus', 'tutoring'], 'failing calculus')],
    expectedCategories: ['academic'],
  },
  {
    name: 'I am stressed and cannot focus.',
    needs: [need('wellness', ['stress', 'anxiety', 'mental_health'], 'stressed and cannot focus')],
    expectedCategories: ['wellness'],
  },
  {
    name: 'I commute and need transportation help.',
    needs: [need('transportation', ['commuter', 'transit', 'upass'], 'commute and need transportation help')],
    expectedCategories: ['transportation'],
  },
  {
    name: 'I need food support and financial help.',
    needs: [
      need('basic_needs', ['food', 'pantry', 'food_insecurity'], 'need food support'),
      need('financial', ['financial_aid', 'emergency_fund'], 'need financial help'),
    ],
    expectedCategories: ['basic_needs', 'financial'],
  },
  {
    name: 'I need a quiet place to study and career guidance.',
    needs: [
      need('study_space', ['quiet_study', 'library'], 'quiet place to study'),
      need('career', ['career_coaching', 'resume', 'internships'], 'career guidance'),
    ],
    expectedCategories: ['study_space', 'career'],
  },
];

describe('Proposal §9 — evaluation scenarios', () => {
  for (const scenario of SCENARIOS) {
    it(`"${scenario.name}" surfaces at least one resource in every expected category`, () => {
      const { recommendations } = rank(ZERO_EMBEDDING, scenario.needs, RESOURCES, { topK: 5 });
      const topCategories = new Set(recommendations.map((r) => r.resource.category));
      for (const expected of scenario.expectedCategories) {
        expect(
          topCategories.has(expected),
          `top-5 missing ${expected}; got ${[...topCategories].join(', ')}`
        ).toBe(true);
      }
    });

    it(`"${scenario.name}" produces 5 results without duplicates`, () => {
      const { recommendations } = rank(ZERO_EMBEDDING, scenario.needs, RESOURCES, { topK: 5 });
      expect(recommendations.length).toBe(5);
      const ids = recommendations.map((r) => r.resource.id);
      expect(new Set(ids).size).toBe(ids.length);
    });
  }

  it('multi-need scenarios route the urgency signal to flagged resources', () => {
    const urgentNeeds: ExtractedNeed[] = [
      need('wellness', ['crisis', 'mental_health'], 'thinking about hurting myself', 5, true),
    ];
    const { recommendations } = rank(ZERO_EMBEDDING, urgentNeeds, RESOURCES, { topK: 3 });
    const hasUrgent = recommendations.some((r) => r.resource.urgent);
    expect(hasUrgent, 'top-3 should include at least one urgent resource').toBe(true);
  });
});

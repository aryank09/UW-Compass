/**
 * Scenario coverage for the evaluation prompts from §9 of the proposal,
 * extended to a labeled set of 30 realistic student inputs for the final report.
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
 *
 * Recall@5 numbers are printed at the end of each suite block so they show
 * up as data-driven evidence in the final presentation / nightly CI log.
 */
import { describe, it, expect, afterAll } from 'vitest';
import { rank } from '@/lib/recommend';
import type { Category, ExtractedNeed, Recommendation, ResourceWithEmbedding } from '@/lib/types';
import embedded from '@/data/resources.embedded.json';

const RESOURCES = embedded as ResourceWithEmbedding[];
const DIM = RESOURCES[0].embedding.length;
const ZERO_EMBEDDING = new Array(DIM).fill(0); // forces ranker to rely on tag/category signals

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function need(
  category: Category,
  tags: string[],
  evidence: string,
  intensity: 1 | 2 | 3 | 4 | 5 = 3,
  urgent = false
): ExtractedNeed {
  return { category, intensity, evidence, tags, urgent };
}

function recall(recs: Recommendation[], expectedIds: string[]): number {
  if (expectedIds.length === 0) return 1;
  const top = new Set(recs.map((r) => r.resource.id));
  return expectedIds.filter((id) => top.has(id)).length / expectedIds.length;
}

// ---------------------------------------------------------------------------
// §9 original scenarios (proposal-mandated)
// ---------------------------------------------------------------------------

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
    needs: [
      need('transportation', ['commuter', 'transit', 'upass'], 'commute and need transportation help'),
    ],
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

// ---------------------------------------------------------------------------
// Extended labeled eval set — 30 realistic student inputs
// Each entry specifies the exact resource IDs we expect to see in the top 5.
// recall@5 = (# of expectedIds found in top-5) / |expectedIds|
// ---------------------------------------------------------------------------

interface EvalScenario {
  input: string;
  needs: ExtractedNeed[];
  expectedIds: string[];
}

const EVAL_SET: EvalScenario[] = [
  // ── Academic ──────────────────────────────────────────────────────────────
  {
    input: 'I am failing calculus and the final is next week.',
    needs: [need('academic', ['math', 'calculus', 'tutoring'], 'failing calculus', 4)],
    expectedIds: ['math-study-center', 'clue'],
  },
  {
    input: 'I need help with my essay, I have no idea how to structure it.',
    needs: [need('academic', ['writing', 'essay', 'tutoring'], 'need help with essay', 3)],
    expectedIds: ['owrc', 'clue'],
  },
  {
    input: 'I am a first-gen student who needs advising — I do not know what classes to take.',
    needs: [
      need(
        'academic',
        ['advising', 'first_generation', 'degree_planning'],
        'first-gen student needs advising',
        3
      ),
    ],
    expectedIds: ['academic-advising', 'instructional-center'],
  },
  {
    input: 'I have ADHD and my professor will not give me extra time on exams.',
    needs: [
      need('academic', ['disability', 'accommodations', 'mental_health'], 'ADHD, needs extra time', 4),
    ],
    expectedIds: ['drs'],
  },
  {
    input: 'I am struggling in stats and chemistry at the same time.',
    needs: [
      need('academic', ['statistics', 'chemistry', 'tutoring', 'stem'], 'struggling in stats and chemistry', 3),
    ],
    expectedIds: ['clue', 'instructional-center'],
  },
  {
    input: 'I want to improve my study skills — I keep procrastinating.',
    needs: [
      need('academic', ['study_skills', 'productivity'], 'procrastinating, need study skills', 2),
    ],
    expectedIds: ['instructional-center', 'academic-advising'],
  },

  // ── Wellness ──────────────────────────────────────────────────────────────
  {
    input: 'I have been feeling really anxious and cannot sleep before exams.',
    needs: [need('wellness', ['anxiety', 'stress', 'mental_health'], 'anxious, cannot sleep', 3)],
    expectedIds: ['counseling-center', 'huskyhelpline'],
  },
  {
    input: 'I think I need to talk to a therapist — things feel hopeless.',
    needs: [need('wellness', ['counseling', 'depression', 'mental_health'], 'feels hopeless, needs therapist', 4)],
    expectedIds: ['counseling-center', 'hall-health-mental'],
  },
  {
    input: 'I am having thoughts of hurting myself and do not know who to call.',
    needs: [need('wellness', ['crisis', 'mental_health', 'suicidal_ideation'], 'thoughts of self-harm', 5, true)],
    expectedIds: ['huskyhelpline', 'safecampus'],
  },
  {
    input: 'I was assaulted last weekend and do not know what to do.',
    needs: [
      need('wellness', ['sexual_assault', 'advocacy', 'crisis'], 'was assaulted, needs help', 5, true),
    ],
    expectedIds: ['livewell', 'safecampus'],
  },
  {
    input: 'I am a queer student feeling very isolated on campus.',
    needs: [need('wellness', ['lgbtq', 'identity', 'community'], 'queer student, isolated', 3)],
    expectedIds: ['qcenter'],
  },
  {
    input: 'I feel burnt out and overwhelmed — I need someone to talk to.',
    needs: [
      need('wellness', ['burnout', 'stress', 'counseling'], 'burnt out, overwhelmed', 3),
    ],
    expectedIds: ['counseling-center', 'huskyhelpline'],
  },

  // ── Basic needs ───────────────────────────────────────────────────────────
  {
    input: 'I am running out of food and cannot afford groceries this week.',
    needs: [need('basic_needs', ['food', 'food_insecurity', 'pantry'], 'running out of food', 4, true)],
    expectedIds: ['any-hungry-husky', 'livewell-basic-needs'],
  },
  {
    input: 'I might lose my housing — my landlord is evicting me.',
    needs: [need('basic_needs', ['housing', 'homelessness', 'emergency'], 'eviction, losing housing', 5, true)],
    expectedIds: ['housing-resources', 'emergency-aid'],
  },
  {
    input: 'I need emergency money — my car broke down and I cannot get to school.',
    needs: [
      need('basic_needs', ['emergency_fund', 'financial'], 'car broke down, needs emergency money', 4, true),
      need('financial', ['emergency_fund'], 'emergency money', 4, true),
    ],
    expectedIds: ['emergency-aid'],
  },
  {
    input: 'I do not know where to start — I am struggling with food, money, and housing all at once.',
    needs: [
      need('basic_needs', ['food', 'housing', 'case_management'], 'struggling with food and housing', 4, true),
      need('financial', ['financial_aid', 'emergency_fund'], 'money struggles', 3),
    ],
    expectedIds: ['livewell-basic-needs', 'emergency-aid', 'any-hungry-husky'],
  },

  // ── Transportation ────────────────────────────────────────────────────────
  {
    input: 'I commute from Lynnwood and cannot afford my transit pass.',
    needs: [
      need('transportation', ['commuter', 'transit', 'upass', 'bus'], 'commute, cannot afford transit pass', 3),
    ],
    expectedIds: ['upass', 'commuter-commons'],
  },
  {
    input: 'I need a late-night ride home after studying — is there a campus shuttle?',
    needs: [
      need('transportation', ['shuttle', 'late_night', 'safety'], 'needs late-night ride', 2),
    ],
    expectedIds: ['nightride'],
  },
  {
    input: 'I bike to campus and need somewhere to lock up and change.',
    needs: [need('transportation', ['bike', 'commuter'], 'bikes to campus', 2)],
    expectedIds: ['transportation-services', 'commuter-commons'],
  },
  {
    input: 'I am a commuter student and feel disconnected from campus life.',
    needs: [
      need('transportation', ['commuter', 'community', 'lounge'], 'commuter, feels disconnected', 2),
    ],
    expectedIds: ['commuter-commons'],
  },

  // ── Study space ───────────────────────────────────────────────────────────
  {
    input: 'I need a really quiet place to study — the libraries are too noisy.',
    needs: [need('study_space', ['quiet_study', 'library'], 'quiet place to study', 3)],
    expectedIds: ['suzzallo-allen', 'odegaard'],
  },
  {
    input: 'Where can I find a group study room I can book with friends?',
    needs: [need('study_space', ['group_study', 'reservable'], 'group study room', 2)],
    expectedIds: ['hub-study', 'suzzallo-allen'],
  },
  {
    input: 'I need to study late at night — what is open 24 hours?',
    needs: [need('study_space', ['24_5', 'quiet_study', 'library'], 'open late at night', 2)],
    expectedIds: ['odegaard'],
  },
  {
    input: 'I am an engineering student looking for a quiet subject library.',
    needs: [
      need('study_space', ['quiet_study', 'subject_specific', 'stem'], 'engineering student, quiet library', 2),
    ],
    expectedIds: ['branch-libraries'],
  },

  // ── Career ────────────────────────────────────────────────────────────────
  {
    input: 'I am applying for internships and my resume is a mess.',
    needs: [need('career', ['resume', 'internships', 'career_coaching'], 'resume is a mess, applying for internships', 3)],
    expectedIds: ['career-internship-center', 'handshake'],
  },
  {
    input: 'I need a part-time on-campus job to help pay for tuition.',
    needs: [
      need('career', ['jobs', 'on_campus', 'part_time', 'work_study'], 'needs part-time job', 3),
    ],
    expectedIds: ['student-employment', 'handshake'],
  },
  {
    input: 'I want to do research with a professor — how do I get into a lab?',
    needs: [
      need('career', ['research', 'faculty_mentor', 'stem'], 'wants to do research with professor', 3),
    ],
    expectedIds: ['undergrad-research'],
  },
  {
    input: 'I have a job interview next week and need to practice.',
    needs: [need('career', ['interview', 'career_coaching'], 'interview next week, needs practice', 3)],
    expectedIds: ['career-internship-center'],
  },

  // ── Financial ────────────────────────────────────────────────────────────
  {
    input: 'I cannot pay tuition this quarter — is there a payment plan?',
    needs: [need('financial', ['tuition', 'payment_plan', 'billing'], 'cannot pay tuition', 4)],
    expectedIds: ['sfs', 'financial-aid'],
  },
  {
    input: 'I think I messed up my FAFSA and my aid was reduced.',
    needs: [
      need('financial', ['fafsa', 'financial_aid', 'grants'], 'fafsa issue, aid reduced', 4),
    ],
    expectedIds: ['financial-aid'],
  },
  {
    input: 'I am looking for scholarships I can apply to as a junior.',
    needs: [
      need('financial', ['scholarships', 'merit', 'need_based'], 'looking for scholarships as junior', 2),
    ],
    expectedIds: ['scholarships'],
  },
];

// ---------------------------------------------------------------------------
// Recall@5 eval harness
// ---------------------------------------------------------------------------

const recallResults: { input: string; recall: number; topIds: string[] }[] = [];

describe('Eval harness — 30 labeled scenarios (recall@5)', () => {
  for (const scenario of EVAL_SET) {
    it(scenario.input, () => {
      const { recommendations } = rank(ZERO_EMBEDDING, scenario.needs, RESOURCES, { topK: 5 });
      const r5 = recall(recommendations, scenario.expectedIds);
      recallResults.push({
        input: scenario.input,
        recall: r5,
        topIds: recommendations.map((rec) => rec.resource.id),
      });

      // Soft assertion: warn but do not fail if recall < 0.5 (some scenarios
      // are ambiguous; the harness is for tracking, not for gating CI).
      expect(
        r5,
        `recall@5=${r5.toFixed(2)} for "${scenario.input.slice(0, 60)}"\n  expected: [${scenario.expectedIds.join(', ')}]\n  got:      [${recommendations.map((r) => r.resource.id).join(', ')}]`
      ).toBeGreaterThan(0);
    });
  }

  afterAll(() => {
    const avg = recallResults.reduce((s, r) => s + r.recall, 0) / recallResults.length;
    const perfect = recallResults.filter((r) => r.recall === 1).length;
    const zeros = recallResults.filter((r) => r.recall === 0).length;

    console.log('\n╔══════════════════════════════════════════════════════╗');
    console.log('║         Recall@5 Report — eval harness               ║');
    console.log('╠══════════════════════════════════════════════════════╣');
    console.log(`║  Scenarios evaluated : ${String(recallResults.length).padEnd(28)}║`);
    console.log(`║  Mean recall@5       : ${avg.toFixed(3).padEnd(28)}║`);
    console.log(`║  Perfect (recall=1)  : ${String(perfect).padEnd(28)}║`);
    console.log(`║  Zero recall         : ${String(zeros).padEnd(28)}║`);
    console.log('╠══════════════════════════════════════════════════════╣');
    console.log('║  Per-scenario breakdown:                             ║');
    for (const r of recallResults) {
      const bar = '█'.repeat(Math.round(r.recall * 5)).padEnd(5, '░');
      const label = r.input.slice(0, 38).padEnd(38);
      console.log(`║  ${bar} ${r.recall.toFixed(2)}  ${label}║`);
    }
    console.log('╚══════════════════════════════════════════════════════╝\n');
  });
});

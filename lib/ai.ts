import OpenAI from 'openai';
import {
  CATEGORIES,
  Category,
  ExtractedNeed,
  Recommendation,
  ResourceWithEmbedding,
  StudentContext,
  TokenUsage,
  ZERO_USAGE,
  addUsage,
} from './types';

const EMBEDDING_MODEL = process.env.OPENAI_EMBEDDING_MODEL ?? 'text-embedding-3-small';
const CHAT_MODEL = process.env.OPENAI_CHAT_MODEL ?? 'gpt-4o-mini';

let _client: OpenAI | null = null;
function client(): OpenAI {
  if (_client) return _client;
  const key = process.env.OPENAI_API_KEY;
  if (!key) {
    throw new Error(
      'OPENAI_API_KEY is not set. Add it to .env.local (see .env.example) before running.'
    );
  }
  _client = new OpenAI({ apiKey: key });
  return _client;
}

function usageFrom(res: { usage?: OpenAI.CompletionUsage | null }): TokenUsage {
  return {
    prompt_tokens: res.usage?.prompt_tokens ?? 0,
    completion_tokens: res.usage?.completion_tokens ?? 0,
    total_tokens: res.usage?.total_tokens ?? 0,
  };
}

export async function embed(text: string): Promise<number[]> {
  const res = await client().embeddings.create({
    model: EMBEDDING_MODEL,
    input: text,
  });
  return res.data[0].embedding;
}

export async function embedBatch(texts: string[]): Promise<number[][]> {
  const res = await client().embeddings.create({
    model: EMBEDDING_MODEL,
    input: texts,
  });
  return res.data.map((d) => d.embedding);
}

// ---------------------------------------------------------------------------
// Need extraction — first pass
// ---------------------------------------------------------------------------

const NEED_EXTRACTION_TOOL = {
  type: 'function' as const,
  function: {
    name: 'record_student_needs',
    description:
      'Record the structured needs identified in the student request, including category, intensity, supporting evidence, fine-grained tags, and urgency.',
    parameters: {
      type: 'object',
      properties: {
        needs: {
          type: 'array',
          description: 'One entry per distinct need detected in the student input.',
          items: {
            type: 'object',
            properties: {
              category: {
                type: 'string',
                enum: [...CATEGORIES],
                description: 'High-level support category.',
              },
              intensity: {
                type: 'integer',
                minimum: 1,
                maximum: 5,
                description:
                  '1 = passing mention, 5 = primary crisis-level need. Use language cues (e.g. "failing", "overwhelmed") to gauge.',
              },
              confidence: {
                type: 'string',
                enum: ['high', 'medium', 'low'],
                description: 'Confidence that this need is accurate based on the text.',
              },
              evidence: {
                type: 'string',
                description: 'Short quote or paraphrase from the input that justifies this need.',
              },
              tags: {
                type: 'array',
                items: { type: 'string' },
                description:
                  'Fine-grained tags such as "math", "writing", "anxiety", "food", "commuter", "quiet_study", "internships", "fafsa". Use snake_case.',
              },
              urgent: {
                type: 'boolean',
                description:
                  'True only if the student appears in crisis or describes a time-critical situation (safety, immediate housing/food, suicidal ideation, etc.).',
              },
            },
            required: ['category', 'intensity', 'confidence', 'evidence', 'tags', 'urgent'],
            additionalProperties: false,
          },
        },
      },
      required: ['needs'],
      additionalProperties: false,
    },
  },
};

function buildExtractionSystemPrompt(studentContext?: StudentContext): string {
  const personaLines: string[] = [];
  if (studentContext?.year) personaLines.push(`- Student year: ${studentContext.year}`);
  if (studentContext?.commuter) personaLines.push('- Commuter student');
  if (studentContext?.first_gen) personaLines.push('- First-generation college student');

  const personaBlock =
    personaLines.length > 0
      ? `\nStudent persona context (use to disambiguate borderline cases and add relevant tags):\n${personaLines.join('\n')}\n`
      : '';

  return `You analyze short messages from University of Washington students and identify the support categories they need.${personaBlock}
Categories (use exactly these strings):
- academic: tutoring, advising, study skills, course-specific help, disability accommodations
- wellness: mental health, counseling, stress/anxiety, identity-based support, sexual-assault advocacy, crisis support
- basic_needs: food insecurity, housing emergencies, hygiene, emergency aid
- transportation: U-PASS, parking, bike, commute, shuttle, transit
- study_space: places to study (quiet, group, library, lounge)
- career: jobs, internships, resumes, interviews, research opportunities
- financial: tuition, financial aid, scholarships, payment plans, work-study

Guidelines:
- Return one need per distinct concept the student mentions. Do not invent needs that aren't supported by the text.
- intensity is calibrated to the student's language, not how serious the underlying issue is in absolute terms.
- urgent=true should be rare — only for safety risk, immediate food/housing crisis, or explicit self-harm.
- Use snake_case for tags.
- If the student is a commuter, add "commuter" to transportation tags even if not explicitly stated.
- If the student is first-generation, add "first_generation" to academic/career tags when relevant.
- Detect the language of the student's input. Write the evidence field in that same language. Keep all tag values in English snake_case.`;
}

// ---------------------------------------------------------------------------
// Need extraction — second pass (self-critique)
// ---------------------------------------------------------------------------

const CRITIQUE_TOOL = {
  type: 'function' as const,
  function: {
    name: 'refine_student_needs',
    description:
      'Review the initial needs extracted from a student message and return a refined list. Remove or downgrade needs that are over-stated or speculative. Add any obvious needs that were missed. Keep urgent=true ONLY for genuine, time-critical crises.',
    parameters: {
      type: 'object',
      properties: {
        needs: {
          type: 'array',
          description: 'Refined list of needs after critique.',
          items: {
            type: 'object',
            properties: {
              category: { type: 'string', enum: [...CATEGORIES] },
              intensity: { type: 'integer', minimum: 1, maximum: 5 },
              confidence: { type: 'string', enum: ['high', 'medium', 'low'] },
              evidence: { type: 'string' },
              tags: { type: 'array', items: { type: 'string' } },
              urgent: { type: 'boolean' },
            },
            required: ['category', 'intensity', 'confidence', 'evidence', 'tags', 'urgent'],
            additionalProperties: false,
          },
        },
        critique_summary: {
          type: 'string',
          description: 'One sentence describing what you changed and why.',
        },
      },
      required: ['needs', 'critique_summary'],
      additionalProperties: false,
    },
  },
};

async function critiqueNeeds(
  studentInput: string,
  initialNeeds: ExtractedNeed[]
): Promise<{ needs: ExtractedNeed[]; usage: TokenUsage }> {
  const needsBlock = JSON.stringify(initialNeeds, null, 2);
  const res = await client().chat.completions.create({
    model: CHAT_MODEL,
    temperature: 0,
    max_tokens: 800,
    messages: [
      {
        role: 'system',
        content:
          'You are a careful reviewer of AI-extracted student needs. Be conservative: only flag urgent=true for genuine crisis situations. Downgrade intensity if the language is mild. Remove needs not supported by the text.',
      },
      {
        role: 'user',
        content: `Student input: "${studentInput}"\n\nInitial needs:\n${needsBlock}\n\nDid the first pass miss anything important? Did it over-state any need or falsely mark urgent=true? Return the refined list.`,
      },
    ],
    tools: [CRITIQUE_TOOL],
    tool_choice: { type: 'function', function: { name: 'refine_student_needs' } },
  });

  const toolCall = res.choices[0].message.tool_calls?.[0];
  if (!toolCall || toolCall.type !== 'function') {
    // Fall back to initial needs if critique fails
    return { needs: initialNeeds, usage: usageFrom(res) };
  }
  const parsed = JSON.parse(toolCall.function.arguments) as {
    needs: ExtractedNeed[];
    critique_summary: string;
  };
  if (parsed.critique_summary) {
    console.log('[extractNeeds/critique]', parsed.critique_summary);
  }
  return {
    needs: parsed.needs.filter((n) => CATEGORIES.includes(n.category as Category)),
    usage: usageFrom(res),
  };
}

// ---------------------------------------------------------------------------
// Public: extractNeeds
// ---------------------------------------------------------------------------

export interface ExtractNeedsOptions {
  studentContext?: StudentContext;
  /** Run a cheap second LLM pass to self-critique and prune false-urgent flags. */
  twoPass?: boolean;
}

export async function extractNeeds(
  studentInput: string,
  options: ExtractNeedsOptions = {}
): Promise<{ needs: ExtractedNeed[]; usage: TokenUsage }> {
  const systemPrompt = buildExtractionSystemPrompt(options.studentContext);

  const res = await client().chat.completions.create({
    model: CHAT_MODEL,
    temperature: 0.1,
    messages: [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: studentInput },
    ],
    tools: [NEED_EXTRACTION_TOOL],
    tool_choice: { type: 'function', function: { name: 'record_student_needs' } },
  });

  const toolCall = res.choices[0].message.tool_calls?.[0];
  if (!toolCall || toolCall.type !== 'function') {
    throw new Error('Need-extraction tool call missing from model response.');
  }
  const parsed = JSON.parse(toolCall.function.arguments) as { needs: ExtractedNeed[] };
  const firstPass = parsed.needs.filter((n) => CATEGORIES.includes(n.category as Category));
  const firstUsage = usageFrom(res);

  if (!options.twoPass) {
    return { needs: firstPass, usage: firstUsage };
  }

  const { needs: refined, usage: critiqueUsage } = await critiqueNeeds(studentInput, firstPass);
  return { needs: refined, usage: addUsage(firstUsage, critiqueUsage) };
}

// ---------------------------------------------------------------------------
// LLM-based resource selector (function-calling ranker)
// ---------------------------------------------------------------------------

const SELECT_RESOURCES_TOOL = {
  type: 'function' as const,
  function: {
    name: 'recommend_resources',
    description:
      'Select the resources that best match this student from the provided candidate list. Order them from most to least relevant.',
    parameters: {
      type: 'object',
      properties: {
        ids: {
          type: 'array',
          description:
            'IDs of selected resources, ordered from most to least relevant. Include between 1 and topK IDs.',
          items: { type: 'string' },
          minItems: 1,
        },
        reasoning: {
          type: 'string',
          description: 'One or two sentences explaining the selection.',
        },
      },
      required: ['ids', 'reasoning'],
      additionalProperties: false,
    },
  },
};

export interface SelectResourcesResult {
  ids: string[];
  reasoning: string;
  usage: TokenUsage;
}

/**
 * Ask the model to choose the best resources from a candidate pool.
 * Typically called with the top-20 candidates from the cosine ranker so the
 * prompt stays small. Returns an ordered list of resource IDs.
 */
export async function selectResources(
  studentInput: string,
  needs: ExtractedNeed[],
  candidates: Pick<ResourceWithEmbedding, 'id' | 'name' | 'category' | 'description' | 'tags'>[],
  topK = 5
): Promise<SelectResourcesResult> {
  const needsBlock = needs
    .map((n) => `- ${n.category} (intensity ${n.intensity}${n.urgent ? ', URGENT' : ''}): ${n.evidence}`)
    .join('\n');

  const resourceBlock = candidates
    .map(
      (r) =>
        `[${r.id}] ${r.name} (${r.category})\n  ${r.description}\n  Tags: ${r.tags.join(', ')}`
    )
    .join('\n\n');

  const res = await client().chat.completions.create({
    model: CHAT_MODEL,
    temperature: 0,
    messages: [
      {
        role: 'system',
        content: `You are a UW student-resource advisor. Given a student's needs and a list of candidate resources, select the ${topK} most helpful ones. Prioritize relevance to the student's specific situation, urgency flags, and diversity across need categories.`,
      },
      {
        role: 'user',
        content: `Student request: "${studentInput}"\n\nIdentified needs:\n${needsBlock || '(none)'}\n\nCandidate resources:\n${resourceBlock}\n\nSelect the best ${topK} resources.`,
      },
    ],
    tools: [SELECT_RESOURCES_TOOL],
    tool_choice: { type: 'function', function: { name: 'recommend_resources' } },
  });

  const toolCall = res.choices[0].message.tool_calls?.[0];
  if (!toolCall || toolCall.type !== 'function') {
    return { ids: candidates.slice(0, topK).map((c) => c.id), reasoning: '', usage: usageFrom(res) };
  }
  const parsed = JSON.parse(toolCall.function.arguments) as { ids: string[]; reasoning: string };
  return {
    ids: parsed.ids.slice(0, topK),
    reasoning: parsed.reasoning ?? '',
    usage: usageFrom(res),
  };
}

// ---------------------------------------------------------------------------
// Summarizer
// ---------------------------------------------------------------------------

export interface SummaryInput {
  studentInput: string;
  needs: ExtractedNeed[];
  topResources: { id: string; name: string; category: Category; description: string }[];
}

export interface SummaryOutput {
  per_resource: Record<string, string>;
  /** 1–3 word quote from the student's own input anchoring each explanation. */
  evidence_quotes: Record<string, string>;
  next_steps: string[];
}

const SUMMARY_TOOL = {
  type: 'function' as const,
  function: {
    name: 'write_recommendations',
    description:
      'Write short student-facing explanations for each recommended resource and a prioritized next-step action plan.',
    parameters: {
      type: 'object',
      properties: {
        per_resource: {
          type: 'array',
          description: 'One entry per recommended resource explaining why it matches this student.',
          items: {
            type: 'object',
            properties: {
              id: { type: 'string' },
              why: {
                type: 'string',
                description:
                  '1–2 sentence student-facing explanation of why this resource matches their situation. Reference their words. Plain, warm language. No marketing fluff.',
              },
              evidence_quote: {
                type: 'string',
                description:
                  'Exact 1–4 word quote copied verbatim from the student\'s input that most directly motivated this recommendation. Example: "failing calculus", "can\'t afford rent".',
              },
            },
            required: ['id', 'why', 'evidence_quote'],
            additionalProperties: false,
          },
        },
        next_steps: {
          type: 'array',
          description:
            '2–4 ordered steps the student can take this week. Most urgent or foundational first. Each step is a single sentence, action-oriented.',
          items: { type: 'string' },
          minItems: 2,
          maxItems: 4,
        },
      },
      required: ['per_resource', 'next_steps'],
      additionalProperties: false,
    },
  },
};

const SUMMARY_SYSTEM_PROMPT = `You write short, warm, practical recommendations for University of Washington students. Tone: a knowledgeable peer, not a marketing brochure. Reference the student's own situation when explaining each resource. Never invent resources beyond the list provided. For each resource, quote 1–4 exact words from the student's input as the evidence_quote — this grounds the recommendation in their own voice. Detect the language of the student's input and respond in that same language for all human-facing text (why, next_steps). Resource names and evidence_quote values may stay in English.`;

export async function summarize(
  input: SummaryInput
): Promise<{ output: SummaryOutput; usage: TokenUsage }> {
  const resourcesBlock = input.topResources
    .map((r) => `[${r.id}] ${r.name} (${r.category})\n${r.description}`)
    .join('\n\n');

  const needsBlock = input.needs
    .map(
      (n) =>
        `- ${n.category} (intensity ${n.intensity}${n.urgent ? ', URGENT' : ''}): ${n.evidence}`
    )
    .join('\n');

  const userPrompt = `Student request:
"${input.studentInput}"

Identified needs:
${needsBlock || '(none)'}

Recommended resources (in ranked order):
${resourcesBlock}

For each resource, write a 1–2 sentence explanation of why it matches this student, plus a short verbatim quote from their input as evidence_quote. Then write 2–4 ordered next steps for them to take this week.`;

  const res = await client().chat.completions.create({
    model: CHAT_MODEL,
    temperature: 0.3,
    messages: [
      { role: 'system', content: SUMMARY_SYSTEM_PROMPT },
      { role: 'user', content: userPrompt },
    ],
    tools: [SUMMARY_TOOL],
    tool_choice: { type: 'function', function: { name: 'write_recommendations' } },
  });

  const toolCall = res.choices[0].message.tool_calls?.[0];
  if (!toolCall || toolCall.type !== 'function') {
    throw new Error('Summary tool call missing from model response.');
  }
  const parsed = JSON.parse(toolCall.function.arguments) as {
    per_resource: { id: string; why: string; evidence_quote: string }[];
    next_steps: string[];
  };
  const per_resource: Record<string, string> = {};
  const evidence_quotes: Record<string, string> = {};
  for (const entry of parsed.per_resource) {
    per_resource[entry.id] = entry.why;
    if (entry.evidence_quote) evidence_quotes[entry.id] = entry.evidence_quote;
  }
  return {
    output: { per_resource, evidence_quotes, next_steps: parsed.next_steps },
    usage: usageFrom(res),
  };
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

export { ZERO_USAGE, addUsage };

/** Annotate a list with summary text (used in tests/debugging). */
export function attachSummaries(
  recs: Recommendation[],
  summaries: Record<string, string>
): Recommendation[] {
  return recs.map((r) => ({ ...r, why: summaries[r.resource.id] ?? r.why }));
}

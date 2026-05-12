import OpenAI from 'openai';
import { CATEGORIES, Category, ExtractedNeed, Recommendation } from './types';

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
            required: ['category', 'intensity', 'evidence', 'tags', 'urgent'],
            additionalProperties: false,
          },
        },
      },
      required: ['needs'],
      additionalProperties: false,
    },
  },
};

const NEED_SYSTEM_PROMPT = `You analyze short messages from University of Washington students and identify the support categories they need.

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
- Use snake_case for tags.`;

export async function extractNeeds(studentInput: string): Promise<ExtractedNeed[]> {
  const res = await client().chat.completions.create({
    model: CHAT_MODEL,
    temperature: 0.1,
    messages: [
      { role: 'system', content: NEED_SYSTEM_PROMPT },
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
  return parsed.needs.filter((n) => CATEGORIES.includes(n.category as Category));
}

export interface SummaryInput {
  studentInput: string;
  needs: ExtractedNeed[];
  topResources: { id: string; name: string; category: Category; description: string }[];
}

export interface SummaryOutput {
  per_resource: Record<string, string>;
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
            },
            required: ['id', 'why'],
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

const SUMMARY_SYSTEM_PROMPT = `You write short, warm, practical recommendations for University of Washington students. Tone: a knowledgeable peer, not a marketing brochure. Reference the student's own situation when explaining each resource. Never invent resources beyond the list provided.`;

export async function summarize(input: SummaryInput): Promise<SummaryOutput> {
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

For each resource, write a 1–2 sentence explanation of why it matches this student. Then write 2–4 ordered next steps for them to take this week.`;

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
    per_resource: { id: string; why: string }[];
    next_steps: string[];
  };
  const per_resource: Record<string, string> = {};
  for (const entry of parsed.per_resource) per_resource[entry.id] = entry.why;
  return { per_resource, next_steps: parsed.next_steps };
}

// Helper for tests / debugging — annotate a list with summary text.
export function attachSummaries(
  recs: Recommendation[],
  summaries: Record<string, string>
): Recommendation[] {
  return recs.map((r) => ({ ...r, why: summaries[r.resource.id] ?? r.why }));
}

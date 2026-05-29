export interface TokenUsage {
  prompt_tokens: number;
  completion_tokens: number;
  total_tokens: number;
}

/** Additive helper — safe to call with undefined operands. */
export function addUsage(a: TokenUsage, b?: TokenUsage | null): TokenUsage {
  if (!b) return a;
  return {
    prompt_tokens: a.prompt_tokens + b.prompt_tokens,
    completion_tokens: a.completion_tokens + b.completion_tokens,
    total_tokens: a.total_tokens + b.total_tokens,
  };
}

export const ZERO_USAGE: TokenUsage = { prompt_tokens: 0, completion_tokens: 0, total_tokens: 0 };

/** Optional persona context the student (or the UI) can supply. */
export interface StudentContext {
  year?: 'freshman' | 'sophomore' | 'junior' | 'senior' | 'graduate' | 'transfer';
  commuter?: boolean;
  first_gen?: boolean;
}

export const CATEGORIES = [
  'academic',
  'wellness',
  'basic_needs',
  'transportation',
  'study_space',
  'career',
  'financial',
] as const;

export type Category = (typeof CATEGORIES)[number];

export const CATEGORY_LABELS: Record<Category, string> = {
  academic: 'Tutoring & Academic Support',
  wellness: 'Wellness & Counseling',
  basic_needs: 'Food & Basic Needs',
  transportation: 'Transportation & Commuter',
  study_space: 'Study Spaces',
  career: 'Career & Campus Jobs',
  financial: 'Financial Support',
};

export const CAMPUSES = ['seattle', 'bothell', 'tacoma', 'all'] as const;
export type Campus = (typeof CAMPUSES)[number];

export interface Resource {
  id: string;
  name: string;
  category: Category;
  campus: Campus;
  description: string;
  url: string;
  tags: string[];
  urgent: boolean;
}

export interface ResourceWithEmbedding extends Resource {
  embedding: number[];
}

export interface ExtractedNeed {
  category: Category;
  intensity: 1 | 2 | 3 | 4 | 5;
  /** Populated by the AI; not used by the ranker but displayed in the UI. */
  confidence?: 'high' | 'medium' | 'low';
  evidence: string;
  tags: string[];
  urgent: boolean;
}

/** Per-signal scores exposed in advisor mode. */
export interface ResourceScores {
  embedding: number;
  category: number;
  tags: number;
  urgency: number;
}

export interface Recommendation {
  resource: Resource;
  score: number;
  embedding_similarity: number;
  /** The student need category this resource satisfies, or null if none matched. */
  matched_needs: Category | null;
  matched_tags: string[];
  why: string;
  /** 1–3 word quote from the student's own input that grounded this recommendation. */
  evidence_quote?: string;
  /** Populated when the request is made in advisor mode. */
  scores?: ResourceScores;
}

export interface AdvisorData {
  allResults: Recommendation[];
  weights: {
    embedding: number;
    categoryMatch: number;
    tagOverlap: number;
    urgencyBoost: number;
  };
}

export interface RecommendResponse {
  needs: ExtractedNeed[];
  recommendations: Recommendation[];
  next_steps: string[];
  /** Present only when advisor=true is sent in the request. */
  advisorData?: AdvisorData;
  /** Cost and latency metadata; always present in advisor mode, omitted in production cache hits. */
  meta?: {
    tokens: TokenUsage;
    latency_ms: number;
    ranker: 'cosine' | 'llm' | 'hybrid';
  };
}

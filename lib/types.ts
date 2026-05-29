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
  evidence: string;
  tags: string[];
  urgent: boolean;
}

export interface Recommendation {
  resource: Resource;
  score: number;
  embedding_similarity: number;
  /** The student need category this resource satisfies, or null if none matched. */
  matched_needs: Category | null;
  matched_tags: string[];
  why: string;
}

export interface RecommendResponse {
  needs: ExtractedNeed[];
  recommendations: Recommendation[];
  next_steps: string[];
}

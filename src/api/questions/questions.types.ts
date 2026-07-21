export type BackendDifficulty = "EASY" | "MEDIUM" | "HARD";

// Shared shape for /questions and /bookmarks — both return the full MCQ
// (options + correctIndex + explanation) since both are study tools, not the
// answer-blind /practice/next endpoint.
export type LibraryQuestion = {
  id: string;
  subject: { id: string; name: string };
  exam: { body: string } | null;
  topic: string | null;
  difficulty: BackendDifficulty;
  questionText: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  provenance: { documentName: string; page: number | null } | null;
  isBookmarked: boolean;
};

export type ListQuestionsParams = {
  q?: string;
  subjectId?: string;
  examId?: string;
  difficulty?: BackendDifficulty;
  bookmarked?: boolean;
  cursor?: string;
  limit?: number;
};

export type ListQuestionsResponse = {
  items: LibraryQuestion[];
  total: number;
  hasMore: boolean;
  nextCursor: string | null;
};

export type RelatedQuestionsResponse = {
  items: LibraryQuestion[];
};

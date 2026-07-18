export type Exam = {
  id: string;
  slug: string;
  body: string;
  name: string;
  level: string;
  questionCount: number;
  durationMins: number;
  negativeMark: number;
  negLabel: string;
};

export type AttemptQuestion = {
  order: number;
  id: string;
  subject: { name: string };
  questionText: string;
  options: string[];
};

export type ResumeAttemptQuestion = AttemptQuestion & {
  selectedIndex: number | null;
  flagged: boolean;
};

export type StartAttemptResponse = {
  attemptId: string;
  exam: {
    id: string;
    name: string;
    durationMins: number;
    negativeMark: number;
    totalQuestions: number;
  };
  expiresAt: string;
  questions: AttemptQuestion[];
};

export type ResumeAttemptResponse = {
  attemptId: string;
  exam: {
    id: string;
    name: string;
    durationMins: number;
    negativeMark: number;
    totalQuestions: number;
  };
  state: "IN_PROGRESS" | "SUBMITTED" | "EXPIRED";
  expiresAt: string;
  questions: ResumeAttemptQuestion[];
};

export type PatchAttemptAnswersPayload = {
  attemptId: string;
  answers?: Record<string, number>;
  flags?: Record<string, boolean>;
};

export type ExamResultSubject = {
  name: string;
  correct: number;
  attempted: number;
  acc: number;
};

export type ExamResultReviewRow = {
  order: number;
  questionId: string;
  subject: string;
  questionText: string;
  options: string[];
  correct: number;
  your: number | null;
  status: "CORRECT" | "WRONG" | "SKIPPED" | null;
};

export type ExamResult = {
  attemptId: string;
  exam: { id: string; name: string; negativeMark: number };
  score: number;
  total: number;
  passMark: number;
  passed: boolean;
  verdict: string;
  correct: number;
  wrong: number;
  skipped: number;
  attempted: number;
  acc: number;
  pct: number;
  rank: string;
  negLost: number;
  taken: number;
  bySubject: ExamResultSubject[];
  review: ExamResultReviewRow[];
  analysis: string;
};

export type RecentAttempt = {
  attemptId: string;
  examName: string;
  score: number;
  total: number;
  rank: string;
  submittedAt: string;
};

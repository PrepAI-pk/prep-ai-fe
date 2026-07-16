import type { MockExam as ApiMockExam } from "../../api/mock-exams/mock-exams.types";

export type MockExam = ApiMockExam;

export type EstimatedRank = "Top 6%" | "Top 18%" | "Top 35%" | "Top 60%";

export type RunnerQuestion = {
  id: number;
  subject: string;
  text: string;
  options: string[];
  correctIndex: number;
};

export type MockExamQuestionReview = {
  questionId: number;
  subject: string;
  yourAnswerIndex: number | null;
  correctIndex: number;
  isCorrect: boolean;
};

export type SubjectBreakdownItem = {
  subject: string;
  attempted: number;
  correct: number;
  accuracy: number;
};

export type MockExamRunResult = {
  exam: MockExam;
  answers: Record<number, number>;
  flags: Record<number, boolean>;
  totalQuestions: number;
  attempted: number;
  correct: number;
  wrong: number;
  skipped: number;
  score: number;
  maxScore: number;
  accuracy: number;
  estimatedRank: EstimatedRank;
  passMark: number;
  isQualified: boolean;
  timeTakenSeconds: number;
  breakdown: {
    correct: number;
    wrong: number;
    skipped: number;
  };
  subjectBreakdown: SubjectBreakdownItem[];
  review: MockExamQuestionReview[];
};

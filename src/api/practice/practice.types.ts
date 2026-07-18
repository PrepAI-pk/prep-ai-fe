import type { BackendDifficulty } from "../questions/questions.types";

export type PracticeNextParams = {
  subjectId?: string;
  difficulty?: BackendDifficulty;
};

export type PracticeUsage = {
  answeredToday: number;
  dailyLimit: number | null;
  resetsAt: string | null;
};

// Never carries correctIndex/explanation — grading happens server-side.
export type PracticeNextQuestion = {
  id: string;
  subject: { name: string };
  difficulty: BackendDifficulty;
  questionText: string;
  options: string[];
  isBookmarked: boolean;
  usage: PracticeUsage;
};

export type PracticeAnswerPayload = {
  questionId: string;
  selectedIndex: number;
  timeSpentSec?: number;
  source?: "practice" | "library" | "daily_challenge";
};

export type PracticeAnswerResponse = {
  isCorrect: boolean;
  correctIndex: number;
  explanation: string;
  provenance: { documentName: string; page: number | null } | null;
  xpEarned: number;
  streak: { current: number; extendedToday: boolean };
  subjectStat: { subjectId: string; acc: number; attempted: number };
};

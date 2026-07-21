export type BackendTimeline = "1 month" | "3 months" | "6 months" | "Just exploring";
export type BackendStudyLevel = "FRESH_START" | "SOME_PREPARATION" | "WELL_PREPARED";
export type BackendDailyHours = "1h" | "2h" | "3h" | "4h+";

export type OnboardingProfileResponse = {
  userId: string;
  goalExamId: string | null;
  timeline: BackendTimeline;
  dailyHours: BackendDailyHours;
  level: BackendStudyLevel;
  diagnosticOptIn: boolean;
  completedAt: string | null;
  skipped: boolean;
};

export type OnboardingPatchPayload = {
  goalExamId?: string;
  timeline?: BackendTimeline;
  dailyHours?: BackendDailyHours;
  level?: BackendStudyLevel;
  diagnosticOptIn?: boolean;
};

export type DiagnosticQuestion = {
  id: string;
  subjectId: string;
  difficulty: string;
  questionText: string;
  options: string[];
};

export type DiagnosticAnswerPayload = {
  answers: { questionId: string; selectedIndex: number }[];
};

export type StudyPlanTaskType = "PRACTICE" | "FLASHCARDS" | "REVISION" | "MOCK" | "NOTES" | "REVIEW";
export type StudyPlanTaskPriority = "HIGH" | "MED" | "LOW";

export type StudyPlanTask = {
  id: string;
  date: string;
  type: StudyPlanTaskType;
  priority: StudyPlanTaskPriority;
  subjectLabel: string;
  title: string;
  minutes: number;
  done: boolean;
  targetRef: string | null;
};

export type StudyPlanWeekDay = {
  d: "Mon" | "Tue" | "Wed" | "Thu" | "Fri" | "Sat" | "Sun";
  date: string;
  done: number;
  total: number;
  today: boolean;
};

export type StudyPlanResponse = {
  planId: string;
  weekStart: string;
  goal: { examId: string; name: string } | null;
  dailyHours: string;
  rationale: string | null;
  focusSubjects: { name: string; acc: number }[];
  week: StudyPlanWeekDay[];
  tasks: StudyPlanTask[];
  todayFocus: { minutesDone: number; minutesTotal: number; pct: number };
};

export type PatchStudyPlanRequest = {
  goalExamId?: string | null;
  dailyHours?: "1h" | "2h" | "3h" | "4h+";
};

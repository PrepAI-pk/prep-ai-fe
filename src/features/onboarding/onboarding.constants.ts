import type { CurrentLevel, DailyHours, StudyTimeline } from "./onboarding.types";

export const ONBOARDING_STEPS = ["Goal", "Schedule", "Level", "Ready"] as const;

// "Goal" stays a local-only UI choice for now — sending it to the backend
// requires a real Exam id (goalExamId), and GET /exams doesn't exist until
// Batch 2's taxonomy endpoints land.
export const EXAM_GOAL_OPTIONS = [
  "CSS",
  "PMS",
  "FPSC",
  "NTS",
  "Custom",
] as const;

export const STUDY_TIMELINE_OPTIONS: StudyTimeline[] = [
  "1 month",
  "3 months",
  "6 months",
  "Just exploring",
];

export const DAILY_HOURS_OPTIONS: DailyHours[] = ["1h", "2h", "3h", "4h+"];

export const CURRENT_LEVEL_OPTIONS: CurrentLevel[] = [
  "FRESH_START",
  "SOME_PREPARATION",
  "WELL_PREPARED",
];

export const CURRENT_LEVEL_LABELS: Record<CurrentLevel, string> = {
  FRESH_START: "Fresh start",
  SOME_PREPARATION: "Some preparation",
  WELL_PREPARED: "Well prepared",
};

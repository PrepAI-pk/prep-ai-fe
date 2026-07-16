import type { CurrentLevel, StudyTimeline } from "./onboarding.types";

export const ONBOARDING_STEPS = ["Goal", "Schedule", "Level", "Ready"] as const;

export const EXAM_GOAL_OPTIONS = [
  "CSS",
  "PMS",
  "FPSC",
  "NTS",
  "Custom",
] as const;

export const STUDY_TIMELINE_OPTIONS: StudyTimeline[] = [
  "30 days",
  "60 days",
  "90 days",
];

export const DAILY_HOURS_OPTIONS = [1, 2, 3, 4] as const;

export const CURRENT_LEVEL_OPTIONS: CurrentLevel[] = [
  "Beginner",
  "Intermediate",
  "Advanced",
];

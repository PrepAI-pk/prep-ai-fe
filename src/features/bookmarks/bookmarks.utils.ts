import type { WeakAreaStatus } from "./bookmarks.types";

export function normalizeSubjectName(subject: string): string {
  return subject.replace(/\s*\([^)]*\)\s*/g, "").trim();
}

export function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

export function getStatus(accuracy: number): WeakAreaStatus {
  if (accuracy < 50) {
    return "Needs work";
  }

  if (accuracy < 70) {
    return "Improving";
  }

  return "Strong";
}

export function difficultyWeight(difficulty: string): number {
  const value = difficulty.toLowerCase();
  if (value.includes("hard")) {
    return 3;
  }

  if (value.includes("medium")) {
    return 2;
  }

  return 1;
}
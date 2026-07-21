export function activityBarColor(isToday: boolean): string {
  return isToday ? "primary.main" : "primary.light";
}

export function subjectAccuracyColor(accuracy: number): string {
  if (accuracy >= 80) return "success.main";
  if (accuracy < 60) return "error.main";
  return "primary.main";
}

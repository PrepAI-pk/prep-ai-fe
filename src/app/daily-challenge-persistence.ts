const DAILY_DONE_KEY = "prepai_daily_done";

function getTodayKey(): string {
  return new Date().toISOString().slice(0, 10);
}

export function markDailyChallengeDoneToday(): void {
  try {
    localStorage.setItem(DAILY_DONE_KEY, getTodayKey());
  } catch {
    // Ignore localStorage write failures.
  }
}

export function isDailyChallengeDoneToday(): boolean {
  try {
    return localStorage.getItem(DAILY_DONE_KEY) === getTodayKey();
  } catch {
    return false;
  }
}

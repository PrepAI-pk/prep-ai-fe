import type { DailyChallengeWeekDay } from "../../api/daily-challenge/daily-challenge.types";
import type { WeekDayStatus } from "./daily-challenge.types";

// `dateKey` is the server's `date` field ("YYYY-MM-DD", Asia/Karachi) —
// parsed at noon UTC so no local-timezone shift can roll it onto the
// adjacent calendar day.
export function formatDateLabel(dateKey?: string): string {
  const d = dateKey ? new Date(`${dateKey}T12:00:00Z`) : new Date();
  const weekday = d.toLocaleDateString("en-US", { weekday: "long", timeZone: dateKey ? "UTC" : undefined }).toUpperCase();
  const month = d.toLocaleDateString("en-US", { month: "long", timeZone: dateKey ? "UTC" : undefined }).toUpperCase();
  const date = dateKey ? d.getUTCDate() : d.getDate();
  const year = dateKey ? d.getUTCFullYear() : d.getFullYear();
  return `${weekday} · ${date} ${month} ${year}`;
}

export function mapWeek(week: DailyChallengeWeekDay[]): WeekDayStatus[] {
  return week.map((day, index) => ({
    dateKey: `${day.d}-${index}`,
    label: day.d,
    isToday: Boolean(day.today),
    isDone: Boolean(day.done),
    isLocked: Boolean(day.locked),
  }));
}

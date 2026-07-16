import { DAY_LABELS } from "./daily-challenge.constants";
import type { WeekDayStatus } from "./daily-challenge.types";

export function getTodayKey(): string {
  return new Date().toISOString().slice(0, 10);
}

export function formatDateLabel(): string {
  const d = new Date();
  const weekday = d.toLocaleDateString("en-US", { weekday: "long" }).toUpperCase();
  const month = d.toLocaleDateString("en-US", { month: "long" }).toUpperCase();
  return `${weekday} · ${d.getDate()} ${month} ${d.getFullYear()}`;
}

export function getWeekDays(weekHistory: Record<string, boolean>): WeekDayStatus[] {
  const today = new Date();
  const todayKey = getTodayKey();
  const daysFromMonday = (today.getDay() + 6) % 7;
  const monday = new Date(today);
  monday.setDate(today.getDate() - daysFromMonday);

  return DAY_LABELS.map((label, index) => {
    const d = new Date(monday);
    d.setDate(monday.getDate() + index);
    const dateKey = d.toISOString().slice(0, 10);
    const isToday = dateKey === todayKey;
    const isLocked = dateKey > todayKey;
    return {
      dateKey,
      label,
      isToday,
      isDone: Boolean(weekHistory[dateKey]),
      isLocked,
    };
  });
}
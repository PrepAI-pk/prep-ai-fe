import type {
  NotificationCategoryRow,
  NotificationChannelRow,
  NotificationDigest,
} from "./notification-settings.types";

export const CHANNEL_ROWS: NotificationChannelRow[] = [
  {
    key: "push",
    label: "Push notifications",
    desc: "On this device and the mobile app",
    icon: "📱",
  },
  {
    key: "email",
    label: "Email",
    desc: "Sent to your account email",
    icon: "✉",
  },
  {
    key: "sms",
    label: "SMS",
    desc: "For critical alerts only",
    icon: "💬",
  },
];

// The real 5 categories (DATABASE.md) — the frontend used to show 6 invented
// ones (mockResults/badges/newContent/plan/payments) that didn't match the
// backend's actual NotifCategory enum.
export const CATEGORY_ROWS: NotificationCategoryRow[] = [
  { key: "reminder", label: "Daily reminder nudges" },
  { key: "streak", label: "Streak alerts" },
  { key: "content", label: "New content for my exam" },
  { key: "leaderboard", label: "Leaderboard movement" },
  { key: "results", label: "Mock results & analysis" },
];

export const DIGEST_OPTIONS: NotificationDigest[] = ["OFF", "DAILY", "WEEKLY"];

export const DIGEST_LABELS: Record<NotificationDigest, string> = {
  OFF: "Off",
  DAILY: "Daily",
  WEEKLY: "Weekly",
};

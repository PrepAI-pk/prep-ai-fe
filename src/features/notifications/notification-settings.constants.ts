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
    desc: "ayesha.khan@gmail.com",
    icon: "✉",
  },
  {
    key: "sms",
    label: "SMS",
    desc: "For critical alerts only",
    icon: "💬",
  },
];

export const CATEGORY_ROWS: NotificationCategoryRow[] = [
  { key: "streak", label: "Streak alerts" },
  { key: "newContent", label: "New content for my exam" },
  { key: "mockResults", label: "Mock results & analysis" },
  { key: "plan", label: "Leaderboard movement" },
  { key: "badges", label: "Badge unlocks" },
];

export const DIGEST_OPTIONS: NotificationDigest[] = ["Off", "Daily", "Weekly"];
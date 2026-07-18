import type { NotifCategoryKey } from "../../api/me/me.types";

export const SettingsTab = {
  Profile: "profile",
  Preferences: "preferences",
  Notifications: "notifications",
  Subscription: "subscription",
  Account: "account",
} as const;

export type SettingsTab = (typeof SettingsTab)[keyof typeof SettingsTab];

export type SettingsTabItem = {
  key: SettingsTab;
  label: string;
};

export const SETTINGS_TABS: SettingsTabItem[] = [
  { key: SettingsTab.Profile, label: "Profile" },
  { key: SettingsTab.Preferences, label: "Preferences" },
  { key: SettingsTab.Notifications, label: "Notifications" },
  { key: SettingsTab.Subscription, label: "Subscription" },
  { key: SettingsTab.Account, label: "Account" },
];

export type NotificationRow = {
  key: NotifCategoryKey;
  label: string;
  desc: string;
};

// The real 5 categories (DATABASE.md) — see notification-settings.constants.ts.
export const SETTINGS_NOTIFICATION_ROWS: NotificationRow[] = [
  { key: "results", label: "Mock results", desc: "Get updates when an exam result is generated" },
  { key: "streak", label: "Streak reminders", desc: "Daily challenge reminders to protect your streak" },
  { key: "content", label: "New content", desc: "Alerts for fresh MCQs, notes and lessons" },
  { key: "leaderboard", label: "Leaderboard movement", desc: "Notifications when your ranking changes" },
  { key: "reminder", label: "Daily reminder nudges", desc: "A nudge to keep your streak going" },
];

export const ACCENT_SWATCHES = [
  { key: "indigo" as const, color: "#33508c", name: "Indigo" },
  { key: "emerald" as const, color: "#2f7d5b", name: "Emerald" },
  { key: "plum" as const, color: "#7d4a86", name: "Plum" },
];

export const DEFAULT_DIFFICULTIES = ["Adaptive", "Easy", "Medium", "Hard"] as const;
export const CONTENT_LANGUAGES = ["English", "Urdu"] as const;

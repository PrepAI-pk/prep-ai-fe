import type { NotificationPrefs } from "../../app/settings-persistence";

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
  key: keyof NotificationPrefs["notif"];
  label: string;
  desc: string;
};

export const SETTINGS_NOTIFICATION_ROWS: NotificationRow[] = [
  { key: "mockResults", label: "Mock results", desc: "Get updates when an exam result is generated" },
  { key: "streak", label: "Streak reminders", desc: "Daily challenge reminders to protect your streak" },
  { key: "badges", label: "Badge unlocks", desc: "Know when you earn new achievement badges" },
  { key: "newContent", label: "New content", desc: "Alerts for fresh MCQs, notes and lessons" },
  { key: "plan", label: "Study plan updates", desc: "Notifications when your weekly plan is refreshed" },
  { key: "payments", label: "Payment and plan alerts", desc: "Billing receipts and subscription notices" },
];

export const ACCENT_SWATCHES = [
  { key: "indigo" as const, color: "#33508c", name: "Indigo" },
  { key: "emerald" as const, color: "#2f7d5b", name: "Emerald" },
  { key: "plum" as const, color: "#7d4a86", name: "Plum" },
];

export const DEFAULT_DIFFICULTIES = ["Easy", "Medium", "Hard"] as const;
export const CONTENT_LANGUAGES = ["English", "Urdu"] as const;

import type { NotificationPrefs } from "../../app/settings-persistence";

export type NotificationChannelKey = keyof NotificationPrefs["nsChannels"];
export type NotificationCategoryKey = keyof NotificationPrefs["notif"];
export type NotificationDigest = NotificationPrefs["nsDigest"];

export type NotificationChannelRow = {
  key: NotificationChannelKey;
  label: string;
  desc: string;
  icon: string;
};

export type NotificationCategoryRow = {
  key: NotificationCategoryKey;
  label: string;
};
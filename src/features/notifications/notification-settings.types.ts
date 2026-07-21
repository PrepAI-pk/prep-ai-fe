import type {
  BackendDigestFreq,
  NotifCategoryKey,
  NotifChannelKey,
} from "../../api/me/me.types";

export type NotificationChannelKey = NotifChannelKey;
export type NotificationCategoryKey = NotifCategoryKey;
export type NotificationDigest = BackendDigestFreq;

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

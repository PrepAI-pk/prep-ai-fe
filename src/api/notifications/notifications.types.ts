export type NotificationTone = "p" | "a" | "g";
export type NotificationType = "RESULT" | "STREAK" | "BADGE" | "CONTENT" | "PLAN" | "SYSTEM";
export type NotificationCategory = "REMINDER" | "STREAK" | "CONTENT" | "LEADERBOARD" | "RESULTS";

export type NotificationItem = {
  id: string;
  type: NotificationType;
  category: NotificationCategory;
  icon: string | null;
  tone: NotificationTone;
  title: string;
  body: string;
  time: string;
  targetRef: string | null;
  unread: boolean;
};

export type GetNotificationsResponse = {
  unreadCount: number;
  items: NotificationItem[];
  total: number;
  page: number;
  pageSize: number;
};

export type GetNotificationsParams = {
  unreadOnly?: boolean;
  page?: number;
  pageSize?: number;
};

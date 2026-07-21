export const ManagerTab = {
  Categories: "categories",
  Exams: "exams",
  Users: "users",
} as const;

export type ManagerTab = (typeof ManagerTab)[keyof typeof ManagerTab];

export type RowBadgeKind = "good" | "accent" | "info" | "mut";

export type ManagerRow = {
  c1: string;
  c2: string;
  c3: string;
  c4: string;
  kind: RowBadgeKind;
  // Only populated for Users-tab rows, to drive the inline role editor.
  userId?: string;
  rawRole?: "STUDENT" | "REVIEWER" | "ADMIN";
};

export const MANAGER_TABS = [
  { key: ManagerTab.Categories, label: "Categories" },
  { key: ManagerTab.Exams, label: "Exams" },
  { key: ManagerTab.Users, label: "Users" },
] as const;

import type { AppScreen } from "../../app/screens";

export type StatTone = "good" | "muted";

export type StatCard = {
  label: string;
  value: string;
  delta: string;
  tone: StatTone;
};

export type WeeklyBar = {
  day: string;
  value: number;
};

export type SubjectBar = {
  name: string;
  acc: number;
};

export type RecommendedItem = {
  tag: string;
  topic: string;
  reason: string;
  target: AppScreen;
};

export const DASHBOARD_STAT_CARDS: StatCard[] = [
  { label: "Questions solved", value: "3,482", delta: "+126 this week", tone: "good" },
  { label: "Overall accuracy", value: "78%", delta: "+4% vs last week", tone: "good" },
  { label: "Mock rank", value: "Top 6%", delta: "Maintained", tone: "muted" },
  { label: "Study time", value: "42h", delta: "This month", tone: "muted" },
];

export const DASHBOARD_WEEKLY_BARS: WeeklyBar[] = [
  { day: "M", value: 46 },
  { day: "T", value: 72 },
  { day: "W", value: 54 },
  { day: "T", value: 90 },
  { day: "F", value: 63 },
  { day: "S", value: 98 },
  { day: "S", value: 40 },
];

export const DASHBOARD_SUBJECT_BARS: SubjectBar[] = [
  { name: "Pakistan Affairs", acc: 82 },
  { name: "Current Affairs", acc: 57 },
  { name: "English", acc: 74 },
  { name: "Islamiat", acc: 79 },
  { name: "General Science", acc: 63 },
];

export const DASHBOARD_RECOMMENDED: RecommendedItem[] = [
  {
    tag: "Priority",
    topic: "Current Affairs: Regional security trends",
    reason: "Accuracy dipped in last three sessions.",
    target: "practice",
  },
  {
    tag: "Improve",
    topic: "Pakistan Affairs: Constitution milestones",
    reason: "Frequent errors in timeline sequencing.",
    target: "mcqLibrary",
  },
  {
    tag: "New",
    topic: "Mini mock: FPSC mixed practice set",
    reason: "Good fit for your current completion pace.",
    target: "mockExams",
  },
];

export function activityBarColor(index: number): string {
  return index === 5 ? "primary.main" : "primary.light";
}

export function subjectAccuracyColor(accuracy: number): string {
  if (accuracy >= 80) return "success.main";
  if (accuracy < 60) return "error.main";
  return "primary.main";
}

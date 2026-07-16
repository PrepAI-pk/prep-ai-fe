import type { AdminDraftStatus } from "./admin.types";

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
};

export type AgentRun = {
  agent: string;
  tokens: string;
  status: AgentRunStatus;
};

export type AgentRunStatus = "success" | "running" | "warning" | "idle";

export const AGENT_RUNS: AgentRun[] = [
  { agent: "Document Extraction", tokens: "12.4k", status: "running" },
  { agent: "Categorization", tokens: "5.2k", status: "success" },
  { agent: "MCQ Generation", tokens: "17.3k", status: "running" },
  { agent: "Duplicate Detection", tokens: "4.4k", status: "success" },
];

export const SUBJECT_ROWS = [
  { name: "Pakistan Affairs", count: 412 },
  { name: "Current Affairs", count: 268 },
  { name: "General Knowledge", count: 331 },
  { name: "Islamiat", count: 190 },
  { name: "English", count: 224 },
  { name: "Everyday Science", count: 176 },
  { name: "Pak Constitution", count: 98 },
];

export const EXAM_ROWS = [
  { name: "FIA Assistant Director", body: "FIA", questions: 100 },
  { name: "FIA Inspector / SI", body: "FIA", questions: 100 },
  { name: "CSS Screening (MPT)", body: "FPSC", questions: 200 },
  { name: "PMS General Ability", body: "PPSC", questions: 100 },
  { name: "PPSC Assistant (BS-16)", body: "PPSC", questions: 100 },
  { name: "FPSC Lecturer", body: "FPSC", questions: 100 },
  { name: "NTS NAT-I", body: "NTS", questions: 90 },
  { name: "ISSB Intelligence", body: "ISSB", questions: 100 },
];

export const USER_ROWS = [
  { name: "Ayesha Khan", role: "Student", activity: "2h ago", plan: "Pro" },
  { name: "Bilal Ahmed", role: "Student", activity: "Yesterday", plan: "Free" },
  { name: "Sara Malik", role: "Reviewer", activity: "20m ago", plan: "Staff" },
  { name: "Admin (You)", role: "Admin", activity: "Online", plan: "Owner" },
  { name: "Usman Tariq", role: "Student", activity: "3d ago", plan: "Pro" },
];

export const MANAGER_TABS = [
  { key: ManagerTab.Categories, label: "Categories" },
  { key: ManagerTab.Exams, label: "Exams" },
  { key: ManagerTab.Users, label: "Users" },
] as const;

export const AGENT_LOG_RUNS = [
  { name: "Document Extraction Agent", note: "Extracted 71 pages from PDF", tokens: "12.4k", duration: "1.84s", status: "success" },
  { name: "Categorization Agent", note: "Tagged as Everyday Science", tokens: "2.1k", duration: "0.42s", status: "success" },
  { name: "MCQ Generation Agent", note: "Generating a batch of 12...", tokens: "8.7k", duration: "—", status: "running" },
  { name: "Duplicate Detection Agent", note: "2 near-duplicates skipped", tokens: "1.3k", duration: "0.26s", status: "success" },
  { name: "Validation Agent", note: "1 answer flagged for review", tokens: "3.0k", duration: "0.51s", status: "warning" },
  { name: "Translation Agent", note: "Urdu translation queued", tokens: "—", duration: "—", status: "idle" },
] as const satisfies ReadonlyArray<{
  name: string;
  note: string;
  tokens: string;
  duration: string;
  status: AgentRunStatus;
}>;

export const PROCESS_STAGES = [
  "Upload",
  "OCR",
  "Extract text",
  "AI processing",
  "Generate MCQs",
  "Explanations",
  "Notes",
  "Categorize",
  "Save draft",
  "Review",
] as const;

export const PROCESS_FILE_NAME = "PA_July_Module_3.pdf";

export const REVIEW_ACTIONS: AdminDraftStatus[] = ["approved", "rejected"];

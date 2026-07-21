import type { AppScreen } from "../../app/screens";

export type SearchType = "all" | "mcq" | "notes" | "exams" | "subjects";

export type SearchTone = "p" | "a" | "g";

export type SearchTonePalette = {
  bg: string;
  fg: string;
};

export type SearchResult = {
  id: string;
  type: Exclude<SearchType, "all">;
  kind: "MCQ" | "Note" | "Exam" | "Subject";
  title: string;
  meta: string;
  icon: string;
  tone: SearchTone;
  targetScreen: AppScreen;
  subject?: string;
};

export const SEARCH_TYPE_CHIPS = [
  { key: "all" as const, label: "All" },
  { key: "mcq" as const, label: "MCQs" },
  { key: "notes" as const, label: "Notes" },
  { key: "exams" as const, label: "Exams" },
  { key: "subjects" as const, label: "Subjects" },
];

export const SEARCH_SUGGESTION_TERMS = [
  "Objectives Resolution",
  "1973 Constitution",
  "Pakistan Affairs",
  "IMF",
  "FIA",
  "Current Affairs",
] as const;

export function resultTone(tone: SearchTone): SearchTonePalette {
  if (tone === "a") {
    return { bg: "secondary.light", fg: "secondary.main" };
  }

  if (tone === "g") {
    return { bg: "success.light", fg: "success.main" };
  }

  return { bg: "primary.light", fg: "primary.main" };
}

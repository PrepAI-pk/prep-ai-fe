import type { Lesson, LessonState, PersistedVideoState } from "./video-lessons.types";

export const STORAGE_KEY = "prepai_vid";

export const VIDEO_LESSONS: Lesson[] = [
  {
    id: "lesson-1",
    subject: "Pakistan Affairs",
    title: "Constitutional Evolution: 1956 to 1973",
    tutor: "Dr. Fahad Ansari",
    duration: "18:20",
    transcript: [
      { time: "00:18", text: "Today we map constitutional transitions and exam framing." },
      { time: "02:05", text: "Start with 1956 features and federal principles." },
      { time: "05:42", text: "1962 introduced presidential centralization patterns." },
      { time: "09:14", text: "1973 balanced federation and parliamentary continuity." },
      { time: "13:55", text: "For exams, compare eras with one policy implication." },
    ],
  },
  {
    id: "lesson-2",
    subject: "Current Affairs",
    title: "Water Security and Policy Response",
    tutor: "Ms. Nida Tariq",
    duration: "15:40",
    transcript: [
      { time: "00:15", text: "Water stress must be answered with data and policy." },
      { time: "03:27", text: "Explain treaty context, climate pressure, and storage." },
      { time: "07:08", text: "Discuss inter-provincial coordination and governance." },
      { time: "11:50", text: "Conclude with implementable short and long-term actions." },
    ],
  },
  {
    id: "lesson-3",
    subject: "General Knowledge",
    title: "Rapid Revision: Capitals, Geography, Bodies",
    tutor: "Mr. Saad Waseem",
    duration: "12:10",
    transcript: [
      { time: "00:09", text: "Use clustered memory cues for retention." },
      { time: "02:48", text: "Link regions with capitals and strategic facts." },
      { time: "06:31", text: "Practice mixed recall instead of isolated memorization." },
      { time: "09:56", text: "Finish with timed active retrieval." },
    ],
  },
];

export function defaultLessonStates(): Record<string, LessonState> {
  return {
    "lesson-1": { state: "playing", prog: 36 },
    "lesson-2": { state: "next", prog: 0 },
    "lesson-3": { state: "locked", prog: 0 },
  };
}

export function readPersistedState(): PersistedVideoState | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return null;
    }

    const parsed = JSON.parse(raw) as PersistedVideoState;
    if (!parsed || typeof parsed !== "object") {
      return null;
    }

    if (typeof parsed.cur !== "string" || !parsed.states || typeof parsed.states !== "object") {
      return null;
    }

    return parsed;
  } catch {
    return null;
  }
}

export function writePersistedState(state: PersistedVideoState): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // Ignore storage write errors.
  }
}

export function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

export function highlightText(text: string, query: string): Array<{ value: string; marked: boolean }> {
  const trimmed = query.trim();
  if (!trimmed) {
    return [{ value: text, marked: false }];
  }

  const regex = new RegExp(`(${escapeRegExp(trimmed)})`, "ig");
  return text
    .split(regex)
    .filter(Boolean)
    .map((segment) => ({
      value: segment,
      marked: segment.toLowerCase() === trimmed.toLowerCase(),
    }));
}

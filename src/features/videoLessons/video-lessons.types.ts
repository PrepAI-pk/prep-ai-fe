import type { AppScreen } from "../../app/screens";

export type TranscriptItem = {
  time: string;
  text: string;
};

export type Lesson = {
  id: string;
  subject: string;
  title: string;
  tutor: string;
  duration: string;
  transcript: TranscriptItem[];
};

export type LessonState = {
  state: "watched" | "playing" | "next" | "locked";
  prog: number;
};

export type PersistedVideoState = {
  cur: string;
  states: Record<string, LessonState>;
};

export type VideoLessonsPageProps = {
  onNavigateScreen?: (screen: AppScreen) => void;
};

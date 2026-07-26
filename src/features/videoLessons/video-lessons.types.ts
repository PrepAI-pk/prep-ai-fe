import type { AppScreen } from "../../app/screens";

export type VideoLessonsPageProps = {
  onNavigateScreen?: (screen: AppScreen) => void;
  // Falls back to COURSE_ID (video-lessons.utils.ts) when omitted — keeps the
  // single-course callers (older links, tests) working unchanged.
  courseId?: string;
};

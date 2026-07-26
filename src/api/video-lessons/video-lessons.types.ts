export type LessonPlaybackState = "LOCKED" | "NEXT" | "PLAYING" | "WATCHED";

export type CourseSummary = {
  id: string;
  slug: string;
  title: string;
  lessonCount: number;
  totalDurationSec: number;
  subjects: string[];
};

export type CoursesResponse = { items: CourseSummary[] };

export type CourseLessonSummary = {
  id: string;
  order: number;
  title: string;
  durationSec: number;
  mins: string;
  tutorName: string;
  subject: { name: string; colorTint: string | null };
  state: LessonPlaybackState;
  prog?: number;
};

export type CourseResponse = {
  id: string;
  title: string;
  overallProgressPct: number;
  currentLessonId?: string;
  lessons: CourseLessonSummary[];
};

export type LessonResponse = {
  id: string;
  courseId: string;
  title: string;
  tutorName: string;
  subject: { name: string; colorTint: string | null };
  durationSec: number;
  mins: string;
  videoUrl: string;
  state: LessonPlaybackState;
  progressPct: number;
  lastPositionSec: number;
};

export type TranscriptSegment = {
  id: string;
  t: string;
  s: number;
  text: string;
  matches?: [number, number][];
};

export type TranscriptResponse = { segments: TranscriptSegment[] };

export type LessonProgressResponse = {
  state: LessonPlaybackState;
  progressPct: number;
  lastPositionSec: number;
};

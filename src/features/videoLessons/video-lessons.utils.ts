// There's exactly one seeded course (no course-catalog/browse screen — the
// "Video Lessons" nav item goes straight to it) and no `GET /courses` list
// endpoint in the API spec, so the id is a shared, hardcoded constant —
// matches backend/prisma/seed.ts's `course-video-lessons` id.
export const COURSE_ID = "course-video-lessons";

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

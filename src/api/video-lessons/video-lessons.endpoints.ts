import { prepaiApi } from "../baseApi";
import type {
  CourseResponse,
  CoursesResponse,
  LessonProgressResponse,
  LessonResponse,
  TranscriptResponse,
} from "./video-lessons.types";

function buildQueryString(params: Record<string, string | number | undefined>): string {
  const search = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined && value !== "") {
      search.set(key, String(value));
    }
  }
  const query = search.toString();
  return query ? `?${query}` : "";
}

export const videoLessonsApi = prepaiApi.injectEndpoints({
  endpoints: (builder) => ({
    listCourses: builder.query<CoursesResponse, void>({
      query: () => "/courses",
      providesTags: ["VideoLessons"],
    }),
    getCourse: builder.query<CourseResponse, string>({
      query: (courseId) => `/courses/${courseId}`,
      providesTags: ["VideoLessons"],
    }),
    getLesson: builder.query<LessonResponse, string>({
      query: (lessonId) => `/lessons/${lessonId}`,
      providesTags: ["VideoLessons"],
    }),
    getTranscript: builder.query<TranscriptResponse, { lessonId: string; q?: string }>({
      query: ({ lessonId, q }) => `/lessons/${lessonId}/transcript${buildQueryString({ q })}`,
    }),
    downloadTranscript: builder.mutation<string, string>({
      query: (lessonId) => ({
        url: `/lessons/${lessonId}/transcript/download`,
        responseHandler: (response: Response) => response.text(),
      }),
    }),
    updateLessonProgress: builder.mutation<
      LessonProgressResponse,
      { lessonId: string; progressPct: number; lastPositionSec: number }
    >({
      query: ({ lessonId, progressPct, lastPositionSec }) => ({
        url: `/lessons/${lessonId}/progress`,
        method: "PUT",
        body: { progressPct, lastPositionSec },
      }),
      invalidatesTags: ["VideoLessons"],
    }),
  }),
  overrideExisting: true,
});

export const {
  useListCoursesQuery,
  useGetCourseQuery,
  useGetLessonQuery,
  useGetTranscriptQuery,
  useDownloadTranscriptMutation,
  useUpdateLessonProgressMutation,
} = videoLessonsApi;

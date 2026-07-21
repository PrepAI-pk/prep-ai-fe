import { prepaiApi } from "../baseApi";
import type {
  Exam,
  ExamResult,
  PatchAttemptAnswersPayload,
  RecentAttempt,
  ResumeAttemptResponse,
  StartAttemptResponse,
} from "./mock-exams.types";

export const mockExamsApi = prepaiApi.injectEndpoints({
  endpoints: (builder) => ({
    getExams: builder.query<Exam[], void>({
      query: () => "/exams",
      transformResponse: (response: { items: Exam[] }) => response.items,
    }),
    getRecentAttempts: builder.query<RecentAttempt[], void>({
      query: () => "/exam-attempts/recent",
      transformResponse: (response: { items: RecentAttempt[] }) => response.items,
      providesTags: [{ type: "MockExam" as const, id: "RECENT" }],
    }),
    startAttempt: builder.mutation<StartAttemptResponse, string>({
      query: (examId) => ({ url: `/exams/${examId}/attempts`, method: "POST" }),
    }),
    getAttempt: builder.query<ResumeAttemptResponse, string>({
      query: (attemptId) => `/exam-attempts/${attemptId}`,
    }),
    patchAttemptAnswers: builder.mutation<{ success: true }, PatchAttemptAnswersPayload>({
      query: ({ attemptId, ...body }) => ({
        url: `/exam-attempts/${attemptId}/answers`,
        method: "PATCH",
        body,
      }),
    }),
    submitAttempt: builder.mutation<ExamResult, string>({
      query: (attemptId) => ({ url: `/exam-attempts/${attemptId}/submit`, method: "POST" }),
      invalidatesTags: [{ type: "MockExam" as const, id: "RECENT" }],
    }),
    getResult: builder.query<ExamResult, string>({
      query: (attemptId) => `/exam-attempts/${attemptId}/result`,
    }),
  }),
  overrideExisting: true,
});

export const {
  useGetExamsQuery,
  useGetRecentAttemptsQuery,
  useStartAttemptMutation,
  useGetAttemptQuery,
  usePatchAttemptAnswersMutation,
  useSubmitAttemptMutation,
  useGetResultQuery,
} = mockExamsApi;

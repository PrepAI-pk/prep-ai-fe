import { prepaiApi } from "../baseApi";
import type {
  CheckPracticeAnswerPayload,
  CheckPracticeAnswerResponse,
  PracticeQuestion,
  PracticeQuestionDetail,
} from "./practice.types";

export const practiceApi = prepaiApi.injectEndpoints({
  endpoints: (builder) => ({
    getPracticeQuestions: builder.query<PracticeQuestion[], number | void>({
      query: (limit = 50) => `/questions?limit=${limit}`,
      providesTags: (result) =>
        result
          ? [
              ...result.map((question) => ({
                type: "PracticeQuestion" as const,
                id: question.id,
              })),
              { type: "PracticeQuestion" as const, id: "LIST" },
            ]
          : [{ type: "PracticeQuestion" as const, id: "LIST" }],
    }),
    getPracticeQuestionById: builder.query<PracticeQuestionDetail, number>({
      query: (questionId) => `/questions/${questionId}?includeAnswer=true`,
      providesTags: (_result, _error, questionId) => [
        { type: "PracticeQuestion" as const, id: questionId },
      ],
    }),
    checkPracticeAnswer: builder.mutation<
      CheckPracticeAnswerResponse,
      CheckPracticeAnswerPayload
    >({
      query: ({ questionId, selectedIndex }) => ({
        url: `/questions/${questionId}/check`,
        method: "POST",
        body: { selectedIndex },
      }),
    }),
  }),
  overrideExisting: true,
});

export const {
  useGetPracticeQuestionsQuery,
  useGetPracticeQuestionByIdQuery,
  useCheckPracticeAnswerMutation,
} = practiceApi;

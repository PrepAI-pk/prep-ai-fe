import { prepaiApi } from "../baseApi";
import type {
  ListQuestionsParams,
  ListQuestionsResponse,
  RelatedQuestionsResponse,
} from "./questions.types";

function toQueryString(params: ListQuestionsParams): string {
  const search = new URLSearchParams();
  if (params.q) search.set("q", params.q);
  if (params.subjectId) search.set("subjectId", params.subjectId);
  if (params.examId) search.set("examId", params.examId);
  if (params.difficulty) search.set("difficulty", params.difficulty);
  if (params.bookmarked !== undefined) search.set("bookmarked", String(params.bookmarked));
  if (params.cursor) search.set("cursor", params.cursor);
  search.set("limit", String(params.limit ?? 50));
  return search.toString();
}

export const questionsApi = prepaiApi.injectEndpoints({
  endpoints: (builder) => ({
    listQuestions: builder.query<ListQuestionsResponse, ListQuestionsParams | void>({
      query: (params) => `/questions?${toQueryString(params ?? {})}`,
      providesTags: (result) =>
        result
          ? [
              ...result.items.map((item) => ({ type: "LibraryQuestion" as const, id: item.id })),
              { type: "LibraryQuestion" as const, id: "LIST" },
            ]
          : [{ type: "LibraryQuestion" as const, id: "LIST" }],
    }),
    getRelatedQuestions: builder.query<RelatedQuestionsResponse, { questionId: string; limit?: number }>({
      query: ({ questionId, limit = 3 }) => `/questions/${questionId}/related?limit=${limit}`,
    }),
  }),
  overrideExisting: true,
});

export const { useListQuestionsQuery, useGetRelatedQuestionsQuery } = questionsApi;

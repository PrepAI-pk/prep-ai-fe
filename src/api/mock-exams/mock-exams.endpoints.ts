import { prepaiApi } from "../baseApi";
import type { MockExam } from "./mock-exams.types";

export const mockExamsApi = prepaiApi.injectEndpoints({
  endpoints: (builder) => ({
    getMockExams: builder.query<MockExam[], number | void>({
      query: (limit = 20) => `/mock-exams?limit=${limit}`,
      providesTags: (result) =>
        result
          ? [
              ...result.map((exam) => ({ type: "MockExam" as const, id: exam.id })),
              { type: "MockExam" as const, id: "LIST" },
            ]
          : [{ type: "MockExam" as const, id: "LIST" }],
    }),
  }),
  overrideExisting: true,
});

export const { useGetMockExamsQuery } = mockExamsApi;

import { prepaiApi } from "../baseApi";
import type {
  PracticeAnswerPayload,
  PracticeAnswerResponse,
  PracticeNextParams,
  PracticeNextQuestion,
} from "./practice.types";

export const practiceApi = prepaiApi.injectEndpoints({
  endpoints: (builder) => ({
    // Deliberately uncacheable by RTK Query's normal tag system — the server
    // hands back a random question, so a "refetch" is just calling this again,
    // never a cache invalidation.
    getPracticeNext: builder.query<PracticeNextQuestion, PracticeNextParams | void>({
      query: (params) => {
        const search = new URLSearchParams();
        if (params?.subjectId) search.set("subjectId", params.subjectId);
        if (params?.difficulty) search.set("difficulty", params.difficulty);
        const qs = search.toString();
        return qs ? `/practice/next?${qs}` : "/practice/next";
      },
    }),
    submitPracticeAnswer: builder.mutation<PracticeAnswerResponse, PracticeAnswerPayload>({
      query: (body) => ({ url: "/practice/answer", method: "POST", body }),
    }),
  }),
  overrideExisting: true,
});

export const { useGetPracticeNextQuery, useSubmitPracticeAnswerMutation } = practiceApi;

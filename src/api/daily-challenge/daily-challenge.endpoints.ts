import { prepaiApi } from "../baseApi";
import type {
  DailyChallengeAnswerRequest,
  DailyChallengeAnswerResponse,
  DailyChallengeCompleteRequest,
  DailyChallengeCompleteResponse,
  DailyChallengeResponse,
  DailyChallengeStartResponse,
} from "./daily-challenge.types";

export const dailyChallengeApi = prepaiApi.injectEndpoints({
  endpoints: (builder) => ({
    getDailyChallenge: builder.query<DailyChallengeResponse, void>({
      query: () => ({ url: "/daily-challenge" }),
      providesTags: ["DailyChallenge"],
    }),
    startDailyChallenge: builder.mutation<DailyChallengeStartResponse, void>({
      query: () => ({ url: "/daily-challenge/start", method: "POST" }),
    }),
    answerDailyChallenge: builder.mutation<DailyChallengeAnswerResponse, DailyChallengeAnswerRequest>({
      query: (body) => ({ url: "/daily-challenge/answer", method: "POST", body }),
    }),
    completeDailyChallenge: builder.mutation<DailyChallengeCompleteResponse, DailyChallengeCompleteRequest>({
      query: (body) => ({ url: "/daily-challenge/complete", method: "POST", body }),
      invalidatesTags: ["DailyChallenge", "Badge", "XpHistory", "Me"],
    }),
  }),
  overrideExisting: true,
});

export const {
  useGetDailyChallengeQuery,
  useStartDailyChallengeMutation,
  useAnswerDailyChallengeMutation,
  useCompleteDailyChallengeMutation,
} = dailyChallengeApi;

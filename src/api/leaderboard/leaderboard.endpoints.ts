import { prepaiApi } from "../baseApi";
import type { LbPeriod, LbScope, LeaderboardResponse } from "./leaderboard.types";

export const leaderboardApi = prepaiApi.injectEndpoints({
  endpoints: (builder) => ({
    getLeaderboard: builder.query<LeaderboardResponse, { scope: LbScope; period: LbPeriod; page?: number }>({
      query: ({ scope, period, page }) => ({ url: "/leaderboard", params: { scope, period, page } }),
      providesTags: ["Leaderboard"],
    }),
  }),
  overrideExisting: true,
});

export const { useGetLeaderboardQuery } = leaderboardApi;

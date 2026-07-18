import { prepaiApi } from "../baseApi";
import type { BadgesResponse } from "./badges.types";

export const badgesApi = prepaiApi.injectEndpoints({
  endpoints: (builder) => ({
    getBadges: builder.query<BadgesResponse, void>({
      query: () => ({ url: "/badges" }),
      providesTags: ["Badge"],
    }),
  }),
  overrideExisting: true,
});

export const { useGetBadgesQuery } = badgesApi;

import { prepaiApi } from "../baseApi";
import type { WeakAreasResponse } from "./stats.types";

export const statsApi = prepaiApi.injectEndpoints({
  endpoints: (builder) => ({
    getWeakAreas: builder.query<WeakAreasResponse, void>({
      query: () => "/stats/weak-areas",
    }),
  }),
  overrideExisting: true,
});

export const { useGetWeakAreasQuery } = statsApi;

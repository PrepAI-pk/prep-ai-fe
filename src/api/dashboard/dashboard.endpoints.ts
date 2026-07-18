import { prepaiApi } from "../baseApi";
import type { DashboardResponse } from "./dashboard.types";

export const dashboardApi = prepaiApi.injectEndpoints({
  endpoints: (builder) => ({
    getDashboard: builder.query<DashboardResponse, void>({
      query: () => "/dashboard",
    }),
  }),
  overrideExisting: true,
});

export const { useGetDashboardQuery } = dashboardApi;

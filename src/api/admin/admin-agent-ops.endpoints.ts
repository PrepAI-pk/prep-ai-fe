import { prepaiApi } from "../baseApi";
import type { AdminAgentRunsResponse, AdminOverview, AdminPromptSummary } from "./admin.types";

export const adminAgentOpsApi = prepaiApi.injectEndpoints({
  endpoints: (builder) => ({
    getAdminOverview: builder.query<AdminOverview, void>({
      query: () => "/admin/overview",
    }),
    getAdminAgentRuns: builder.query<AdminAgentRunsResponse, { page?: number } | void>({
      query: (params) => ({ url: "/admin/agent-runs", params: params ?? undefined }),
      providesTags: ["AdminAgentRun"],
    }),
    getAdminPrompts: builder.query<AdminPromptSummary[], void>({
      query: () => "/admin/prompts",
      providesTags: ["AdminPrompt"],
    }),
    saveAdminPrompt: builder.mutation<unknown, { agent: string; content: string }>({
      query: ({ agent, content }) => ({ url: `/admin/prompts/${agent}`, method: "PUT", body: { content } }),
      invalidatesTags: ["AdminPrompt"],
    }),
  }),
  overrideExisting: true,
});

export const {
  useGetAdminOverviewQuery,
  useGetAdminAgentRunsQuery,
  useGetAdminPromptsQuery,
  useSaveAdminPromptMutation,
} = adminAgentOpsApi;

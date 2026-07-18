import { prepaiApi } from "../baseApi";
import type { PatchStudyPlanRequest, StudyPlanResponse } from "./study-plan.types";

export const studyPlanApi = prepaiApi.injectEndpoints({
  endpoints: (builder) => ({
    getStudyPlan: builder.query<StudyPlanResponse, { weekStart?: string } | void>({
      query: (params) => ({ url: "/study-plan", params: params ?? undefined }),
      providesTags: ["StudyPlan"],
    }),
    generateStudyPlan: builder.mutation<StudyPlanResponse, void>({
      query: () => ({ url: "/study-plan/generate", method: "POST" }),
      invalidatesTags: ["StudyPlan"],
    }),
    patchStudyPlan: builder.mutation<StudyPlanResponse, PatchStudyPlanRequest>({
      query: (body) => ({ url: "/study-plan", method: "PATCH", body }),
      invalidatesTags: ["StudyPlan"],
    }),
    patchStudyPlanTask: builder.mutation<{ success: true }, { id: string; done: boolean }>({
      query: ({ id, done }) => ({ url: `/study-plan/tasks/${id}`, method: "PATCH", body: { done } }),
      invalidatesTags: ["StudyPlan"],
    }),
  }),
  overrideExisting: true,
});

export const {
  useGetStudyPlanQuery,
  useGenerateStudyPlanMutation,
  usePatchStudyPlanMutation,
  usePatchStudyPlanTaskMutation,
} = studyPlanApi;

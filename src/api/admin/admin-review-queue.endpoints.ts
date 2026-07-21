import { prepaiApi } from "../baseApi";
import type { AdminReviewQueueResponse } from "./admin.types";

export const adminReviewQueueApi = prepaiApi.injectEndpoints({
  endpoints: (builder) => ({
    getAdminReviewQueue: builder.query<AdminReviewQueueResponse, { subjectId?: string; page?: number } | void>({
      query: (params) => ({ url: "/admin/review-queue", params: params ?? undefined }),
      providesTags: ["AdminReviewQueue"],
    }),
    approveAdminQuestion: builder.mutation<unknown, string>({
      query: (id) => ({ url: `/admin/questions/${id}/approve`, method: "POST" }),
      invalidatesTags: ["AdminReviewQueue"],
    }),
    rejectAdminQuestion: builder.mutation<unknown, { id: string; reason: string }>({
      query: ({ id, reason }) => ({ url: `/admin/questions/${id}/reject`, method: "POST", body: { reason } }),
      invalidatesTags: ["AdminReviewQueue"],
    }),
    editAdminQuestion: builder.mutation<
      unknown,
      { id: string; questionText?: string; options?: string[]; correctIndex?: number; explanation?: string }
    >({
      query: ({ id, ...body }) => ({ url: `/admin/questions/${id}`, method: "PATCH", body }),
      invalidatesTags: ["AdminReviewQueue"],
    }),
  }),
  overrideExisting: true,
});

export const {
  useGetAdminReviewQueueQuery,
  useApproveAdminQuestionMutation,
  useRejectAdminQuestionMutation,
  useEditAdminQuestionMutation,
} = adminReviewQueueApi;

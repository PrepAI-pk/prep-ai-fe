import { prepaiApi } from "../baseApi";
import type { AdminDocumentsResponse, PipelineSnapshot, RegisterDocumentPayload } from "./admin.types";

export const adminDocumentsApi = prepaiApi.injectEndpoints({
  endpoints: (builder) => ({
    getAdminUploadUrl: builder.mutation<{ uploadUrl: string; storageKey: string }, { fileName: string; contentType: string }>({
      query: (body) => ({ url: "/admin/documents/upload-url", method: "POST", body }),
    }),
    registerAdminDocument: builder.mutation<{ document: unknown; pipelineRunId: string }, RegisterDocumentPayload>({
      query: (body) => ({ url: "/admin/documents", method: "POST", body }),
      invalidatesTags: ["AdminDocument"],
    }),
    getAdminDocuments: builder.query<AdminDocumentsResponse, { page?: number; pageSize?: number } | void>({
      query: (params) => ({ url: "/admin/documents", params: params ?? undefined }),
      providesTags: ["AdminDocument"],
    }),
    getAdminPipeline: builder.query<PipelineSnapshot, string>({
      query: (documentId) => `/admin/documents/${documentId}/pipeline`,
    }),
    retryAdminPipeline: builder.mutation<{ document: unknown; pipelineRunId: string }, string>({
      query: (documentId) => ({ url: `/admin/documents/${documentId}/retry`, method: "POST" }),
      invalidatesTags: ["AdminDocument"],
    }),
  }),
  overrideExisting: true,
});

export const {
  useGetAdminUploadUrlMutation,
  useRegisterAdminDocumentMutation,
  useGetAdminDocumentsQuery,
  useGetAdminPipelineQuery,
  useRetryAdminPipelineMutation,
} = adminDocumentsApi;

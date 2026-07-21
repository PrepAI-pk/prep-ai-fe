import { prepaiApi } from "../baseApi";
import type {
  AdminExamRow,
  AdminNotesResponse,
  AdminSubjectRow,
  AdminUserPatchPayload,
  AdminUsersResponse,
} from "./admin.types";

export const adminContentManagerApi = prepaiApi.injectEndpoints({
  endpoints: (builder) => ({
    getAdminSubjects: builder.query<AdminSubjectRow[], void>({
      query: () => "/admin/subjects",
      providesTags: ["AdminSubject"],
    }),
    getAdminExams: builder.query<AdminExamRow[], void>({
      query: () => "/admin/exams",
      providesTags: ["AdminExam"],
    }),
    getAdminNotes: builder.query<AdminNotesResponse, { page?: number } | void>({
      query: (params) => ({ url: "/admin/notes", params: params ?? undefined }),
      providesTags: ["AdminNote"],
    }),
    getAdminUsers: builder.query<AdminUsersResponse, { page?: number } | void>({
      query: (params) => ({ url: "/admin/users", params: params ?? undefined }),
      providesTags: ["AdminUser"],
    }),
    patchAdminUser: builder.mutation<AdminUsersResponse["items"][number], AdminUserPatchPayload>({
      query: ({ id, ...body }) => ({ url: `/admin/users/${id}`, method: "PATCH", body }),
      invalidatesTags: ["AdminUser"],
    }),
  }),
  overrideExisting: true,
});

export const {
  useGetAdminSubjectsQuery,
  useGetAdminExamsQuery,
  useGetAdminNotesQuery,
  useGetAdminUsersQuery,
  usePatchAdminUserMutation,
} = adminContentManagerApi;

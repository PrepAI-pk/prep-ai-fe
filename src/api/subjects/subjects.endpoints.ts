import { prepaiApi } from "../baseApi";
import type { Subject } from "./subjects.types";

export const subjectsApi = prepaiApi.injectEndpoints({
  endpoints: (builder) => ({
    getSubjects: builder.query<Subject[], void>({
      query: () => "/subjects",
      providesTags: [{ type: "Subject", id: "LIST" }],
    }),
  }),
  overrideExisting: true,
});

export const { useGetSubjectsQuery } = subjectsApi;

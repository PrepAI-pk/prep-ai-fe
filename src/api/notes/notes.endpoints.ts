import { prepaiApi } from "../baseApi";
import type { ListFlashcardsResponse, ListNotesResponse, NoteDetail } from "./notes.types";

function buildQueryString(params: Record<string, string | number | undefined>): string {
  const search = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined && value !== "") {
      search.set(key, String(value));
    }
  }
  const query = search.toString();
  return query ? `?${query}` : "";
}

export const notesApi = prepaiApi.injectEndpoints({
  endpoints: (builder) => ({
    listNotes: builder.query<ListNotesResponse, { subjectId?: string; q?: string; page?: number } | void>({
      query: (params) => `/notes${buildQueryString({ ...params })}`,
    }),
    getNote: builder.query<NoteDetail, string>({
      query: (id) => `/notes/${id}`,
    }),
    listFlashcards: builder.query<ListFlashcardsResponse, { subjectId?: string } | void>({
      query: (params) => `/flashcards${buildQueryString({ ...params })}`,
    }),
    getNotePdf: builder.mutation<{ url: string }, string>({
      query: (id) => ({ url: `/notes/${id}/pdf`, method: "GET" }),
    }),
  }),
  overrideExisting: true,
});

export const { useListNotesQuery, useGetNoteQuery, useListFlashcardsQuery, useGetNotePdfMutation } = notesApi;

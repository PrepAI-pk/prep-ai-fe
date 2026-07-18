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
  }),
  overrideExisting: true,
});

export const { useListNotesQuery, useGetNoteQuery, useListFlashcardsQuery } = notesApi;

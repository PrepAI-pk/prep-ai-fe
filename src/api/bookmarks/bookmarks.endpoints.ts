import { prepaiApi } from "../baseApi";
import type { ListBookmarksResponse } from "./bookmarks.types";

export const bookmarksApi = prepaiApi.injectEndpoints({
  endpoints: (builder) => ({
    getBookmarks: builder.query<ListBookmarksResponse, void>({
      query: () => "/bookmarks",
      providesTags: [{ type: "Bookmark", id: "LIST" }],
    }),
    starQuestion: builder.mutation<{ success: true }, string>({
      query: (questionId) => ({ url: `/bookmarks/${questionId}`, method: "PUT" }),
      invalidatesTags: [{ type: "Bookmark", id: "LIST" }, { type: "LibraryQuestion", id: "LIST" }],
    }),
    unstarQuestion: builder.mutation<{ success: true }, string>({
      query: (questionId) => ({ url: `/bookmarks/${questionId}`, method: "DELETE" }),
      invalidatesTags: [{ type: "Bookmark", id: "LIST" }, { type: "LibraryQuestion", id: "LIST" }],
    }),
  }),
  overrideExisting: true,
});

export const { useGetBookmarksQuery, useStarQuestionMutation, useUnstarQuestionMutation } =
  bookmarksApi;

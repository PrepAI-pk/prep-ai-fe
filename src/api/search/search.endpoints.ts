import { prepaiApi } from "../baseApi";
import type { SearchParams, SearchResponse, SearchSuggestionsResponse } from "./search.types";

export const searchApi = prepaiApi.injectEndpoints({
  endpoints: (builder) => ({
    search: builder.query<SearchResponse, SearchParams>({
      query: (params) => ({ url: "/search", params }),
    }),
    getSearchSuggestions: builder.query<SearchSuggestionsResponse, void>({
      query: () => "/search/suggestions",
    }),
  }),
  overrideExisting: true,
});

export const { useSearchQuery, useGetSearchSuggestionsQuery } = searchApi;

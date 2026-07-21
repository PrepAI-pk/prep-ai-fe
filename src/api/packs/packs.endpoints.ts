import { prepaiApi } from "../baseApi";
import type { GetPacksResponse } from "./packs.types";

export const packsApi = prepaiApi.injectEndpoints({
  endpoints: (builder) => ({
    getPacks: builder.query<GetPacksResponse, void>({
      query: () => "/packs",
      providesTags: ["Pack"],
    }),
    downloadPack: builder.mutation<GetPacksResponse, string>({
      query: (id) => ({ url: `/packs/${id}/download`, method: "POST" }),
      invalidatesTags: ["Pack"],
    }),
    removePack: builder.mutation<GetPacksResponse, string>({
      query: (id) => ({ url: `/packs/${id}`, method: "DELETE" }),
      invalidatesTags: ["Pack"],
    }),
  }),
  overrideExisting: true,
});

export const { useGetPacksQuery, useDownloadPackMutation, useRemovePackMutation } = packsApi;

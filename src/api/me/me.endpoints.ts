import { prepaiApi } from "../baseApi";
import type {
  MePatchPayload,
  MeResponse,
  NotificationPreferencesPayload,
  NotificationPreferencesResponse,
  PreferencesPayload,
  PreferencesResponse,
} from "./me.types";

export const meApi = prepaiApi.injectEndpoints({
  endpoints: (builder) => ({
    getMe: builder.query<MeResponse, void>({
      query: () => "/me",
      providesTags: ["Me"],
    }),
    updateMe: builder.mutation<MeResponse, MePatchPayload>({
      query: (body) => ({ url: "/me", method: "PATCH", body }),
      invalidatesTags: ["Me"],
    }),
    deleteMe: builder.mutation<{ success: true }, void>({
      query: () => ({ url: "/me", method: "DELETE" }),
      invalidatesTags: ["Me"],
    }),
    exportMe: builder.mutation<Record<string, unknown>, void>({
      query: () => "/me/export",
    }),
    getPreferences: builder.query<PreferencesResponse, void>({
      query: () => "/me/preferences",
      providesTags: ["Me"],
    }),
    updatePreferences: builder.mutation<PreferencesResponse, PreferencesPayload>({
      query: (body) => ({ url: "/me/preferences", method: "PUT", body }),
      invalidatesTags: ["Me"],
    }),
    getNotificationPreferences: builder.query<NotificationPreferencesResponse, void>({
      query: () => "/me/notification-preferences",
      providesTags: ["Me"],
    }),
    updateNotificationPreferences: builder.mutation<
      NotificationPreferencesResponse,
      NotificationPreferencesPayload
    >({
      query: (body) => ({ url: "/me/notification-preferences", method: "PUT", body }),
      invalidatesTags: ["Me"],
    }),
  }),
  overrideExisting: true,
});

export const {
  useGetMeQuery,
  useLazyGetMeQuery,
  useUpdateMeMutation,
  useDeleteMeMutation,
  useExportMeMutation,
  useGetPreferencesQuery,
  useUpdatePreferencesMutation,
  useGetNotificationPreferencesQuery,
  useUpdateNotificationPreferencesMutation,
} = meApi;

import { prepaiApi } from "../baseApi";
import type { GetNotificationsParams, GetNotificationsResponse } from "./notifications.types";

export const notificationsApi = prepaiApi.injectEndpoints({
  endpoints: (builder) => ({
    getNotifications: builder.query<GetNotificationsResponse, GetNotificationsParams | void>({
      query: (params) => ({ url: "/notifications", params: params ?? undefined }),
      providesTags: ["Notification"],
    }),
    markNotificationRead: builder.mutation<{ success: true }, string>({
      query: (id) => ({ url: `/notifications/${id}/read`, method: "POST" }),
      invalidatesTags: ["Notification"],
    }),
    markAllNotificationsRead: builder.mutation<{ success: true }, void>({
      query: () => ({ url: "/notifications/read-all", method: "POST" }),
      invalidatesTags: ["Notification"],
    }),
  }),
  overrideExisting: true,
});

export const {
  useGetNotificationsQuery,
  useMarkNotificationReadMutation,
  useMarkAllNotificationsReadMutation,
} = notificationsApi;

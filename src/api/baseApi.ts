import {
  createApi,
  fetchBaseQuery,
  type BaseQueryFn,
  type FetchArgs,
  type FetchBaseQueryError,
} from "@reduxjs/toolkit/query/react";
import { API_BASE_URL } from "../config/api";
import { accessTokenRefreshed, authEnded, selectAccessToken } from "../store/slices/auth-slice";
import type { RootState } from "../store/store";

const rawBaseQuery = fetchBaseQuery({
  baseUrl: API_BASE_URL,
  // Sends/receives the httpOnly refresh-token cookie the backend sets.
  credentials: "include",
  prepareHeaders: (headers, { getState }) => {
    const token = selectAccessToken(getState() as RootState);
    if (token) {
      headers.set("Authorization", `Bearer ${token}`);
    }
    return headers;
  },
});

// Guards against firing multiple concurrent /auth/refresh calls when several
// requests 401 around the same time — later callers await the same promise.
let refreshPromise: Promise<string | null> | null = null;

function requestUrl(args: string | FetchArgs): string {
  return typeof args === "string" ? args : args.url;
}

const baseQueryWithReauth: BaseQueryFn<string | FetchArgs, unknown, FetchBaseQueryError> = async (
  args,
  api,
  extraOptions,
) => {
  let result = await rawBaseQuery(args, api, extraOptions);

  const isAuthRoute = requestUrl(args).startsWith("/auth/");

  if (result.error?.status === 401 && !isAuthRoute) {
    refreshPromise ??= (async () => {
      try {
        const refreshResult = await rawBaseQuery({ url: "/auth/refresh", method: "POST" }, api, extraOptions);
        const data = refreshResult.data as { accessToken?: string } | undefined;
        if (data?.accessToken) {
          api.dispatch(accessTokenRefreshed({ accessToken: data.accessToken }));
          return data.accessToken;
        }
        api.dispatch(authEnded());
        return null;
      } finally {
        refreshPromise = null;
      }
    })();

    const newToken = await refreshPromise;

    if (newToken) {
      result = await rawBaseQuery(args, api, extraOptions);
    }
  }

  return result;
};

export const prepaiApi = createApi({
  reducerPath: "prepaiApi",
  baseQuery: baseQueryWithReauth,
  tagTypes: ["LibraryQuestion", "Bookmark", "MockExam", "Me", "Subject", "Subscription", "Invoice"],
  endpoints: () => ({}),
});

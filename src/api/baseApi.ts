import {
  createApi,
  fetchBaseQuery,
  type BaseQueryFn,
  type FetchArgs,
  type FetchBaseQueryError,
} from "@reduxjs/toolkit/query/react";
import { navigateGlobally } from "../app/navigate";
import { API_BASE_URL } from "../config/api";
import { accessTokenRefreshed, authEnded, selectAccessToken } from "../store/slices/auth-slice";
import type { RootState } from "../store/store";

// True for a 403 role/permission error (RolesGuard's "Insufficient role.",
// EntitlementsGuard's non-plan denials, etc) as opposed to a 403 the UI
// handles inline — e.g. PLAN_REQUIRED, which renders a paywall instead of
// bouncing the user away.
function isRoleForbiddenError(result: { error?: FetchBaseQueryError }): boolean {
  const error = result.error;
  if (!error || error.status !== 403) {
    return false;
  }
  const data = error.data;
  if (typeof data !== "object" || data === null) {
    return true;
  }
  const code = (data as { code?: unknown }).code;
  return code !== "PLAN_REQUIRED";
}

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

  if (isRoleForbiddenError(result)) {
    navigateGlobally("/403");
  }

  return result;
};

export const prepaiApi = createApi({
  reducerPath: "prepaiApi",
  baseQuery: baseQueryWithReauth,
  tagTypes: [
    "LibraryQuestion",
    "Bookmark",
    "MockExam",
    "Me",
    "Subject",
    "Subscription",
    "Invoice",
    "StudyPlan",
    "DailyChallenge",
    "Badge",
    "Leaderboard",
    "XpHistory",
    "VideoLessons",
    "Notification",
    "Pack",
    "TutorConversation",
    "AdminDocument",
    "AdminReviewQueue",
    "AdminSubject",
    "AdminExam",
    "AdminNote",
    "AdminUser",
    "AdminAgentRun",
    "AdminPrompt",
  ],
  endpoints: () => ({}),
});

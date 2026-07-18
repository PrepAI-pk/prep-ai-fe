import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "../store";

export type BackendRole = "STUDENT" | "REVIEWER" | "ADMIN";

export type AuthUser = {
  id: string;
  fullName: string;
  avatarInitials: string | null;
  role: BackendRole;
  onboardedAt: string | null;
};

export type AuthStatus = "idle" | "loading" | "authenticated" | "unauthenticated";

export type AuthState = {
  accessToken: string | null;
  status: AuthStatus;
  user: AuthUser | null;
};

const initialState: AuthState = {
  accessToken: null,
  status: "idle",
  user: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    authLoading(state) {
      state.status = "loading";
    },
    authSucceeded(state, action: PayloadAction<{ accessToken: string; user: AuthUser }>) {
      state.accessToken = action.payload.accessToken;
      state.user = action.payload.user;
      state.status = "authenticated";
    },
    accessTokenRefreshed(state, action: PayloadAction<{ accessToken: string }>) {
      state.accessToken = action.payload.accessToken;
      state.status = "authenticated";
    },
    userUpdated(state, action: PayloadAction<Partial<AuthUser>>) {
      if (state.user) {
        Object.assign(state.user, action.payload);
      }
    },
    onboardingMarkedComplete(state) {
      if (state.user) {
        state.user.onboardedAt = new Date().toISOString();
      }
    },
    authEnded(state) {
      state.accessToken = null;
      state.user = null;
      state.status = "unauthenticated";
    },
  },
});

export const {
  authLoading,
  authSucceeded,
  accessTokenRefreshed,
  userUpdated,
  onboardingMarkedComplete,
  authEnded,
} = authSlice.actions;

export const authReducer = authSlice.reducer;

// Optional chaining throughout: some tests mount components against a
// minimal manual store that doesn't register the auth reducer (it's not
// relevant to what they're testing) — fall back to initialState's values
// rather than throwing, same as those slices simply not existing yet.
export const selectAuthStatus = (state: RootState): AuthStatus =>
  state.auth?.status ?? initialState.status;
export const selectAccessToken = (state: RootState): string | null =>
  state.auth?.accessToken ?? initialState.accessToken;
export const selectAuthUser = (state: RootState): AuthUser | null =>
  state.auth?.user ?? initialState.user;
export const selectIsOnboarded = (state: RootState): boolean =>
  (state.auth?.user ?? initialState.user)?.onboardedAt != null;

// True once the bootstrap sequence has a definitive answer: either logged out,
// or logged in *with* user data loaded. "authenticated but user still null"
// (the brief moment between the token being set and /me resolving) is
// deliberately not "ready" — route guards should keep showing a loading state
// through that gap rather than rendering with a null user.
export const selectIsAuthReady = (state: RootState): boolean => {
  const auth = state.auth ?? initialState;
  return auth.status === "unauthenticated" || (auth.status === "authenticated" && auth.user !== null);
};

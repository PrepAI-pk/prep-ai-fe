import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { prepaiApi } from "../api/baseApi";
import { loadState, saveState, type PersistedState } from "./persistence";
import { adminContentReducer } from "./slices/admin-content-slice";
import { authReducer } from "./slices/auth-slice";
import { dailyChallengeReducer } from "./slices/daily-challenge-slice";
import { practiceUiReducer } from "./slices/practice-Ui-slice";
import { sessionReducer } from "./slices/session-slice";

const rootReducer = combineReducers({
  practiceUi: practiceUiReducer,
  dailyChallenge: dailyChallengeReducer,
  session: sessionReducer,
  adminContent: adminContentReducer,
  // Real auth session (access token + backend user) — not persisted to
  // localStorage; the httpOnly refresh cookie is what survives a reload
  // (see useBootstrapAuth). Distinct from `session`, which remains the
  // client-only demo role-switcher for admin permission-gating UI.
  auth: authReducer,
  [prepaiApi.reducerPath]: prepaiApi.reducer,
});

export type RootState = ReturnType<typeof rootReducer>;

export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(prepaiApi.middleware),
  preloadedState: loadState(),
});

store.subscribe(() => {
  const state = store.getState();
  const persistedState: PersistedState = {
    practiceUi: state.practiceUi,
    dailyChallenge: state.dailyChallenge,
    session: state.session,
  };

  saveState(persistedState);
});

export type AppDispatch = typeof store.dispatch;

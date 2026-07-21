import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { prepaiApi } from "../api/baseApi";
import { loadState, saveState, type PersistedState } from "./persistence";
import { authReducer } from "./slices/auth-slice";
import { practiceUiReducer } from "./slices/practice-Ui-slice";

const rootReducer = combineReducers({
  practiceUi: practiceUiReducer,
  // Access token + backend user, incl. role. Not persisted to localStorage;
  // the httpOnly refresh cookie is what survives a reload (see
  // useBootstrapAuth), which re-fetches the user (and role) fresh.
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
  };

  saveState(persistedState);
});

export type AppDispatch = typeof store.dispatch;

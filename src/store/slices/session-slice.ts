import { createSelector, createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { Session } from "../../auth/auth.types";
import { permissionsForRoles, type Role } from "../../auth/permissions";
import type { RootState } from "../store";

export type SessionState = {
  session: Session;
};

const initialState: SessionState = {
  session: {
    user: {
      id: "demo-user",
      name: "Aisha Khan",
      email: "aisha.khan@example.com",
    },
    roles: ["student"],
  },
};

const sessionSlice = createSlice({
  name: "session",
  initialState,
  reducers: {
    /**
     * Dev-only stand-in for real login until backend auth exists — see the
     * "Demo role" control in Settings > Profile.
     */
    setActiveRoles(state, action: PayloadAction<Role[]>) {
      state.session.roles = action.payload.length > 0 ? action.payload : ["student"];
    },
  },
});

export const { setActiveRoles } = sessionSlice.actions;

export const sessionReducer = sessionSlice.reducer;

export const selectSession = (state: RootState): Session => state.session.session;

export const selectRoles = (state: RootState): Role[] => state.session.session.roles;

export const selectPermissions = createSelector(selectRoles, (roles) =>
  permissionsForRoles(roles),
);

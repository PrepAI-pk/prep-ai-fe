import { createSelector } from "@reduxjs/toolkit";
import { selectAuthUser } from "../store/slices/auth-slice";
import type { RootState } from "../store/store";
import { permissionsForRoles, roleFromBackendRole, type Permission, type Role } from "./permissions";

// Derives the active role straight from the authenticated user's real
// backend role — there is no separate client-side role state to fall out of
// sync with the server. An unauthenticated/loading user has no roles.
export const selectRoles = (state: RootState): Role[] => {
  const user = selectAuthUser(state);
  return user ? [roleFromBackendRole(user.role)] : [];
};

export const selectPermissions = createSelector(selectRoles, (roles): Permission[] =>
  permissionsForRoles(roles),
);

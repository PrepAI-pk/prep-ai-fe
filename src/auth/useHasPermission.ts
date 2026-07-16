import { useAppSelector } from "../store/hooks";
import { selectPermissions } from "../store/slices/session-slice";
import type { Permission } from "./permissions";

export function useHasPermission(permission: Permission): boolean {
  const permissions = useAppSelector(selectPermissions);
  return permissions.includes(permission);
}

export function useHasAnyPermission(permissions: Permission[]): boolean {
  const granted = useAppSelector(selectPermissions);
  return permissions.some((permission) => granted.includes(permission));
}

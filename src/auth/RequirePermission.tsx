import type { ReactNode } from "react";
import { useHasPermission } from "./useHasPermission";
import type { Permission } from "./permissions";

type RequirePermissionProps = {
  permission: Permission;
  children: ReactNode;
  fallback?: ReactNode;
};

export function RequirePermission(props: RequirePermissionProps) {
  const { permission, children, fallback = null } = props;
  const granted = useHasPermission(permission);

  return granted ? <>{children}</> : <>{fallback}</>;
}

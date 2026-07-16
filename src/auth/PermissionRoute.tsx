import { Navigate, Outlet } from "react-router-dom";
import { useHasPermission } from "./useHasPermission";
import type { Permission } from "./permissions";

type PermissionRouteProps = {
  permission: Permission;
};

export function PermissionRoute(props: PermissionRouteProps) {
  const granted = useHasPermission(props.permission);

  return granted ? <Outlet /> : <Navigate to="/403" replace />;
}

export type Permission =
  | "admin:overview:view"
  | "admin:processing:manage"
  | "admin:review:manage"
  | "admin:content:manage"
  | "admin:agentLogs:view"
  | "admin:users:manage";

export type Role = "student" | "contentReviewer" | "admin" | "superAdmin";

export const ALL_ROLES: Role[] = [
  "student",
  "contentReviewer",
  "admin",
  "superAdmin",
];

/**
 * Single source of truth for what each role can do — mirrors the server's
 * enforcement (RolesGuard in the backend) for client-side UI gating (route
 * guards, hidden nav items). The server is always authoritative; this map
 * only controls what the UI shows/allows before the request round-trips.
 */
export const ROLE_PERMISSIONS: Record<Role, Permission[]> = {
  student: [],
  contentReviewer: ["admin:overview:view", "admin:review:manage"],
  admin: [
    "admin:overview:view",
    "admin:processing:manage",
    "admin:review:manage",
    "admin:content:manage",
    "admin:agentLogs:view",
    "admin:users:manage",
  ],
  superAdmin: [
    "admin:overview:view",
    "admin:processing:manage",
    "admin:review:manage",
    "admin:content:manage",
    "admin:agentLogs:view",
    "admin:users:manage",
  ],
};

// Backend's Role enum (Prisma) has no SUPER_ADMIN counterpart yet, so it only
// ever maps into "student" | "contentReviewer" | "admin" — "superAdmin" stays
// a frontend-only concept until/unless the backend grows that role too.
export type BackendRole = "STUDENT" | "REVIEWER" | "ADMIN";

export function roleFromBackendRole(role: BackendRole): Role {
  switch (role) {
    case "ADMIN":
      return "admin";
    case "REVIEWER":
      return "contentReviewer";
    case "STUDENT":
    default:
      return "student";
  }
}

export function permissionsForRoles(roles: Role[]): Permission[] {
  const permissions = new Set<Permission>();

  for (const role of roles) {
    for (const permission of ROLE_PERMISSIONS[role]) {
      permissions.add(permission);
    }
  }

  return Array.from(permissions);
}

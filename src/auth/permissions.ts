export type Permission =
  | "admin:overview:view"
  | "admin:processing:manage"
  | "admin:review:manage"
  | "admin:content:manage"
  | "admin:agentLogs:view";

export type Role = "student" | "contentReviewer" | "admin" | "superAdmin";

export const ALL_ROLES: Role[] = [
  "student",
  "contentReviewer",
  "admin",
  "superAdmin",
];

/**
 * Single source of truth for what each role can do. When real backend auth
 * lands, the server becomes authoritative and this map just mirrors it for
 * client-side UI gating (route guards, hidden nav items) — the shape stays
 * the same, only where `Session.roles` comes from changes.
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
  ],
  superAdmin: [
    "admin:overview:view",
    "admin:processing:manage",
    "admin:review:manage",
    "admin:content:manage",
    "admin:agentLogs:view",
  ],
};

export function permissionsForRoles(roles: Role[]): Permission[] {
  const permissions = new Set<Permission>();

  for (const role of roles) {
    for (const permission of ROLE_PERMISSIONS[role]) {
      permissions.add(permission);
    }
  }

  return Array.from(permissions);
}

import { useMemo, useState } from "react";
import { Box, CircularProgress, MenuItem, Paper, Select, Typography, type SelectChangeEvent } from "@mui/material";
import type { AppScreen } from "../../../../app/screens";
import {
  useGetAdminExamsQuery,
  useGetAdminSubjectsQuery,
  useGetAdminUsersQuery,
  usePatchAdminUserMutation,
} from "../../../../api/admin/admin-content-manager.endpoints";
import { useHasPermission } from "../../../../auth";
import { MANAGER_TABS, ManagerTab, type ManagerRow } from "../../admin.constants";
import {
  adminContentManagerStyles,
  rowBadgeToneSx,
  tabPillStateSx,
} from "./admin-content-manager.styles";
import { adminSharedStyles } from "../../admin-shared.styles";
import { PracticeTopbar } from "../../../practice";

type AdminContentManagerPageProps = {
  onNavigateScreen?: (screen: AppScreen) => void;
};

function timeAgo(iso: string | null): string {
  if (!iso) {
    return "Never";
  }
  const diffMs = Date.now() - new Date(iso).getTime();
  const diffMin = Math.floor(diffMs / 60_000);
  if (diffMin < 1) return "Just now";
  if (diffMin < 60) return `${diffMin}m ago`;
  const diffHours = Math.floor(diffMin / 60);
  if (diffHours < 24) return `${diffHours}h ago`;
  return `${Math.floor(diffHours / 24)}d ago`;
}

export function AdminContentManagerPage(props: AdminContentManagerPageProps) {
  const { onNavigateScreen } = props;
  const [tab, setTab] = useState<ManagerTab>(ManagerTab.Categories);
  const canManageUsers = useHasPermission("admin:users:manage");

  const subjectsQuery = useGetAdminSubjectsQuery(undefined, { skip: tab !== ManagerTab.Categories });
  const examsQuery = useGetAdminExamsQuery(undefined, { skip: tab !== ManagerTab.Exams });
  const usersQuery = useGetAdminUsersQuery(undefined, { skip: tab !== ManagerTab.Users });
  const [patchUser] = usePatchAdminUserMutation();

  const isLoading =
    (tab === ManagerTab.Categories && subjectsQuery.isLoading) ||
    (tab === ManagerTab.Exams && examsQuery.isLoading) ||
    (tab === ManagerTab.Users && usersQuery.isLoading);

  const rows: ManagerRow[] = useMemo(() => {
    if (tab === ManagerTab.Categories) {
      return (subjectsQuery.data ?? []).map((s) => ({
        c1: s.name,
        c2: "Core subject",
        c3: `${s.questionCount} Q`,
        c4: "Published",
        kind: "good" as const,
      }));
    }
    if (tab === ManagerTab.Exams) {
      return (examsQuery.data ?? []).map((e) => ({
        c1: e.name,
        c2: e.body,
        c3: `${e.questionCount} Q`,
        c4: e.isActive ? "Live" : "Inactive",
        kind: e.isActive ? ("good" as const) : ("mut" as const),
      }));
    }
    return (usersQuery.data?.items ?? []).map((u) => ({
      c1: u.fullName,
      c2: u.role.charAt(0) + u.role.slice(1).toLowerCase(),
      c3: timeAgo(u.lastActiveDate),
      c4: u.plan.charAt(0) + u.plan.slice(1).toLowerCase(),
      kind: u.role === "ADMIN" ? ("accent" as const) : u.role === "REVIEWER" ? ("info" as const) : ("mut" as const),
      userId: u.id,
      rawRole: u.role,
    }));
  }, [tab, subjectsQuery.data, examsQuery.data, usersQuery.data]);

  function handleRoleChange(userId: string, event: SelectChangeEvent): void {
    void patchUser({ id: userId, role: event.target.value as "STUDENT" | "REVIEWER" | "ADMIN" });
  }

  const columns =
    tab === ManagerTab.Categories
      ? ["Subject", "Type", "MCQs", "Status"]
      : tab === ManagerTab.Exams
        ? ["Exam", "Body", "Length", "Status"]
        : ["User", "Role", "Last active", "Plan"];

  return (
    <Box sx={adminSharedStyles.shell}>
        <PracticeTopbar
          currentScreen="adminContentManager"
          title="Content Manager"
          subtitle="Manage categories, exams, and users from one panel"
          searchPlaceholder="Search Content"
          onOpenGlobalSearch={() => onNavigateScreen?.("globalSearch")}
          onOpenSettings={() => onNavigateScreen?.("settingsProfile")}
          onNavigateScreen={onNavigateScreen}
        />

        <Box sx={adminSharedStyles.scrollBody}>
          <Box sx={adminContentManagerStyles.wrap}>
            <Box sx={adminContentManagerStyles.tabsRow}>
              {MANAGER_TABS.map((item) => (
                <Box
                  key={item.key}
                  onClick={() => setTab(item.key)}
                  sx={{ ...adminContentManagerStyles.tabPill, ...tabPillStateSx(tab === item.key) }}
                >
                  {item.label}
                </Box>
              ))}
            </Box>

            <Paper variant="outlined" sx={{ borderRadius: "16px", overflow: "hidden" }}>
              <Box sx={adminContentManagerStyles.tableHeader}>
                {columns.map((heading) => (
                  <Typography key={heading} sx={adminContentManagerStyles.heading}>
                    {heading}
                  </Typography>
                ))}
              </Box>

              {isLoading && (
                <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
                  <CircularProgress size={24} />
                </Box>
              )}

              {!isLoading &&
                rows.map((row) => (
                  <Box key={row.userId ?? `${row.c1}-${row.c2}-${row.c3}`} sx={adminContentManagerStyles.row}>
                    <Typography sx={{ fontWeight: 600, fontSize: 14 }}>{row.c1}</Typography>
                    {tab === ManagerTab.Users && canManageUsers && row.userId && row.rawRole ? (
                      <Select
                        size="small"
                        value={row.rawRole}
                        onChange={(event) => handleRoleChange(row.userId!, event)}
                        sx={{ fontSize: 13, height: 32 }}
                      >
                        <MenuItem value="STUDENT">Student</MenuItem>
                        <MenuItem value="REVIEWER">Reviewer</MenuItem>
                        <MenuItem value="ADMIN">Admin</MenuItem>
                      </Select>
                    ) : (
                      <Typography sx={{ fontSize: 13, color: "text.secondary" }}>{row.c2}</Typography>
                    )}
                    <Typography sx={{ fontSize: 13, color: "text.secondary", fontFamily: '"Space Mono", monospace' }}>{row.c3}</Typography>
                    <Box sx={{ ...adminContentManagerStyles.statusBadge, ...rowBadgeToneSx(row.kind) }}>
                      {row.c4}
                    </Box>
                  </Box>
                ))}
            </Paper>
          </Box>
        </Box>
      </Box>
  );
}

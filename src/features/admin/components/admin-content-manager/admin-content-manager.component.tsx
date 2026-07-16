import { useState } from "react";
import { Box, Paper, Typography } from "@mui/material";
import type { AppScreen } from "../../../../app/screens";
import {
  EXAM_ROWS,
  MANAGER_TABS,
  ManagerTab,
  type ManagerRow,
  SUBJECT_ROWS,
  USER_ROWS,
} from "../../admin.constants";
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

export function AdminContentManagerPage(props: AdminContentManagerPageProps) {
  const { onNavigateScreen } = props;
  const [tab, setTab] = useState<ManagerTab>(ManagerTab.Categories);

  const rows: ManagerRow[] =
    tab === ManagerTab.Categories
      ? SUBJECT_ROWS.map((item) => ({ c1: item.name, c2: "Core subject", c3: `${item.count} Q`, c4: "Published", kind: "good" }))
      : tab === ManagerTab.Exams
        ? EXAM_ROWS.map((item) => ({ c1: item.name, c2: item.body, c3: `${item.questions} Q`, c4: "Live", kind: "good" }))
        : USER_ROWS.map((item) => ({
            c1: item.name,
            c2: item.role,
            c3: item.activity,
            c4: item.plan,
            kind: item.role === "Admin" ? "accent" : item.role === "Reviewer" ? "info" : "mut",
          }));

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

              {rows.map((row) => {
                return (
                  <Box key={`${row.c1}-${row.c2}-${row.c3}`} sx={adminContentManagerStyles.row}>
                    <Typography sx={{ fontWeight: 600, fontSize: 14 }}>{row.c1}</Typography>
                    <Typography sx={{ fontSize: 13, color: "text.secondary" }}>{row.c2}</Typography>
                    <Typography sx={{ fontSize: 13, color: "text.secondary", fontFamily: '"Space Mono", monospace' }}>{row.c3}</Typography>
                    <Box sx={{ ...adminContentManagerStyles.statusBadge, ...rowBadgeToneSx(row.kind) }}>
                      {row.c4}
                    </Box>
                  </Box>
                );
              })}
            </Paper>
          </Box>
        </Box>
      </Box>
  );
}

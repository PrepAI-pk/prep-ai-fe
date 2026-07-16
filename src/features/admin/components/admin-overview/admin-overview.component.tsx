import { Box, Button, LinearProgress, Paper, Typography } from "@mui/material";
import type { AppScreen } from "../../../../app/screens";
import type { AdminDraft } from "../../admin.types";
import { AGENT_RUNS } from "../../admin.constants";
import { adminOverviewStyles, deltaSx } from "./admin-overview.styles";
import { adminSharedStyles, statusToneStyles } from "../../admin-shared.styles";
import { PracticeTopbar } from "../../../practice";

type AdminOverviewPageProps = {
  drafts: AdminDraft[];
  onNavigateScreen?: (screen: AppScreen) => void;
};

export function AdminOverviewPage(props: AdminOverviewPageProps) {
  const { drafts, onNavigateScreen } = props;

  const pending = drafts.filter((draft) => draft.status === "pending").length;
  const procPct = 62;

  const statCards = [
    { label: "Documents processed", value: "128", delta: "+6 today", tone: "good" },
    { label: "MCQs pending review", value: String(pending), delta: "awaiting action", tone: "accent" },
    { label: "Published this week", value: "342", delta: "+58 vs last week", tone: "good" },
    { label: "Active students", value: "4,610", delta: "+212 this month", tone: "good" },
  ];

  return (
    <Box sx={adminSharedStyles.shell}>
        <PracticeTopbar
          currentScreen="adminOverview"
          title="Admin Overview"
          subtitle="Pipeline throughput, review queue health, and agent activity"
          searchPlaceholder="Search Admin"
          onOpenGlobalSearch={() => onNavigateScreen?.("globalSearch")}
          onOpenSettings={() => onNavigateScreen?.("settingsProfile")}
          onNavigateScreen={onNavigateScreen}
        />

        <Box sx={adminSharedStyles.scrollBody}>
          <Box sx={adminOverviewStyles.wrap}>
            <Box sx={adminOverviewStyles.statGrid}>
              {statCards.map((item) => (
                <Paper key={item.label} variant="outlined" sx={adminOverviewStyles.statCard}>
                  <Typography sx={adminOverviewStyles.statLabel}>{item.label}</Typography>
                  <Typography sx={adminOverviewStyles.statValue}>{item.value}</Typography>
                  <Typography sx={deltaSx(item.tone)}>{item.delta}</Typography>
                </Paper>
              ))}
            </Box>

            <Box sx={adminOverviewStyles.splitGrid}>
              <Paper variant="outlined" sx={adminOverviewStyles.card}>
                <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: "14px" }}>
                  <Typography sx={adminOverviewStyles.title}>Live processing</Typography>
                  <Typography
                    onClick={() => onNavigateScreen?.("adminProcessing")}
                    sx={{ fontSize: 13, color: "primary.main", fontWeight: 600, cursor: "pointer" }}
                  >
                    Open pipeline →
                  </Typography>
                </Box>
                <Typography sx={{ fontWeight: 600, fontSize: 14 }}>Pakistan Affairs Notes v2.pdf</Typography>
                <LinearProgress
                  variant="determinate"
                  value={procPct}
                  sx={{ mt: "12px", mb: "8px", height: 8, borderRadius: 99, backgroundColor: "background.default" }}
                />
                <Typography sx={{ fontSize: 12.5, color: "text.secondary", fontFamily: '"Space Mono", monospace' }}>
                  Stage 4 of 7 · generating MCQs
                </Typography>
              </Paper>

              <Paper variant="outlined" sx={{ ...adminOverviewStyles.card, display: "flex", flexDirection: "column" }}>
                <Box>
                  <Typography sx={{ ...adminOverviewStyles.title, mb: "6px" }}>Review queue</Typography>
                  <Box sx={{ display: "flex", alignItems: "baseline", gap: "8px" }}>
                    <Typography sx={{ fontFamily: '"Source Serif 4", serif', fontSize: 34, fontWeight: 700, color: "secondary.main", lineHeight: 1 }}>{pending}</Typography>
                    <Typography sx={{ fontSize: 13, color: "text.secondary" }}>MCQs awaiting review</Typography>
                  </Box>
                </Box>
                <Box sx={{ flex: 1 }} />
                <Button
                  variant="contained"
                  onClick={() => onNavigateScreen?.("adminReviewQueue")}
                  sx={{ mt: "14px", py: "11px", borderRadius: "11px", fontWeight: 600, fontSize: 14 }}
                >
                  Go to review queue
                </Button>
              </Paper>
            </Box>

            <Paper variant="outlined" sx={{ p: "20px 22px", borderRadius: "16px" }}>
              <Typography sx={{ ...adminOverviewStyles.title, mb: "8px" }}>AI agent activity</Typography>
              <Box sx={{ display: "grid" }}>
                {AGENT_RUNS.map((run) => {
                  const tone = statusToneStyles(run.status);
                  return (
                    <Box key={run.agent} sx={adminOverviewStyles.row}>
                      <Box sx={{ width: 9, height: 9, borderRadius: "50%", flex: "none", bgcolor: tone.dot }} />
                      <Typography sx={{ fontWeight: 600, fontSize: 14, flex: 1 }}>{run.agent}</Typography>
                      <Typography sx={{ fontSize: 12, color: "text.secondary", fontFamily: '"Space Mono", monospace' }}>{run.tokens}</Typography>
                      <Box sx={{ ...adminOverviewStyles.statusBadge, backgroundColor: tone.bg, color: tone.fg }}>
                        {run.status}
                      </Box>
                    </Box>
                  );
                })}
              </Box>
            </Paper>
          </Box>
        </Box>
      </Box>
  );
}

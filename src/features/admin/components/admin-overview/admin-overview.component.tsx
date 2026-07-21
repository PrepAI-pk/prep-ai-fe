import { Alert, Box, Button, CircularProgress, LinearProgress, Paper, Typography } from "@mui/material";
import type { AppScreen } from "../../../../app/screens";
import { toApiErrorMessage } from "../../../../api/error";
import { useGetAdminOverviewQuery } from "../../../../api/admin/admin-agent-ops.endpoints";
import { adminOverviewStyles, deltaSx } from "./admin-overview.styles";
import { adminSharedStyles, statusToneStyles } from "../../admin-shared.styles";
import { PracticeTopbar } from "../../../practice";

type AdminOverviewPageProps = {
  onNavigateScreen?: (screen: AppScreen) => void;
};

export function AdminOverviewPage(props: AdminOverviewPageProps) {
  const { onNavigateScreen } = props;
  const overviewQuery = useGetAdminOverviewQuery(undefined, { pollingInterval: 15_000 });
  const overview = overviewQuery.data;

  const statCards = overview
    ? [
        { label: "Documents processed", value: String(overview.stats.documentsProcessed), tone: "good" as const },
        { label: "MCQs pending review", value: String(overview.stats.mcqsPendingReview), tone: "accent" as const },
        { label: "Published this week", value: String(overview.stats.publishedThisWeek), tone: "good" as const },
        { label: "Active students", value: String(overview.stats.activeStudents), tone: "good" as const },
      ]
    : [];

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
            {overviewQuery.isError && (
              <Alert severity="error" sx={{ borderRadius: 2 }}>
                Could not load the overview. {toApiErrorMessage(overviewQuery.error, "Please try again.")}
              </Alert>
            )}

            {overviewQuery.isLoading && (
              <Box sx={{ display: "flex", justifyContent: "center", py: 6 }}>
                <CircularProgress size={26} />
              </Box>
            )}

            {overview && (
              <>
                <Box sx={adminOverviewStyles.statGrid}>
                  {statCards.map((item) => (
                    <Paper key={item.label} variant="outlined" sx={adminOverviewStyles.statCard}>
                      <Typography sx={adminOverviewStyles.statLabel}>{item.label}</Typography>
                      <Typography sx={adminOverviewStyles.statValue}>{item.value}</Typography>
                      <Typography sx={deltaSx(item.tone)}>&nbsp;</Typography>
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
                    {overview.liveProcessing ? (
                      <>
                        <Typography sx={{ fontWeight: 600, fontSize: 14 }}>{overview.liveProcessing.name}</Typography>
                        <LinearProgress
                          variant="determinate"
                          value={overview.liveProcessing.progress}
                          sx={{ mt: "12px", mb: "8px", height: 8, borderRadius: 99, backgroundColor: "background.default" }}
                        />
                        <Typography sx={{ fontSize: 12.5, color: "text.secondary", fontFamily: '"Space Mono", monospace' }}>
                          {overview.liveProcessing.stageLabel ?? "Processing"}
                        </Typography>
                      </>
                    ) : (
                      <Typography sx={{ fontSize: 13, color: "text.secondary" }}>Nothing is processing right now.</Typography>
                    )}
                  </Paper>

                  <Paper variant="outlined" sx={{ ...adminOverviewStyles.card, display: "flex", flexDirection: "column" }}>
                    <Box>
                      <Typography sx={{ ...adminOverviewStyles.title, mb: "6px" }}>Review queue</Typography>
                      <Box sx={{ display: "flex", alignItems: "baseline", gap: "8px" }}>
                        <Typography sx={{ fontFamily: '"Source Serif 4", serif', fontSize: 34, fontWeight: 700, color: "secondary.main", lineHeight: 1 }}>
                          {overview.reviewQueue.count}
                        </Typography>
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
                    {overview.agentActivity.map((run, index) => {
                      const tone = statusToneStyles(run.status.toLowerCase());
                      return (
                        <Box key={`${run.agent}-${index}`} sx={adminOverviewStyles.row}>
                          <Box sx={{ width: 9, height: 9, borderRadius: "50%", flex: "none", bgcolor: tone.dot }} />
                          <Typography sx={{ fontWeight: 600, fontSize: 14, flex: 1 }}>{run.label}</Typography>
                          <Typography sx={{ fontSize: 12, color: "text.secondary", fontFamily: '"Space Mono", monospace' }}>{run.tokens}</Typography>
                          <Box sx={{ ...adminOverviewStyles.statusBadge, backgroundColor: tone.bg, color: tone.fg }}>
                            {run.status.toLowerCase()}
                          </Box>
                        </Box>
                      );
                    })}
                    {overview.agentActivity.length === 0 && (
                      <Typography sx={{ fontSize: 13, color: "text.secondary" }}>No agent activity yet.</Typography>
                    )}
                  </Box>
                </Paper>
              </>
            )}
          </Box>
        </Box>
      </Box>
  );
}

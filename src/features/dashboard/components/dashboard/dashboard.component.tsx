import { Alert, Box, Paper, Typography } from "@mui/material";
import type { AppScreen } from "../../../../app/screens";
import { toApiErrorMessage } from "../../../../api/error";
import { useGetDashboardQuery } from "../../../../api/dashboard/dashboard.endpoints";
import { PracticeSkeleton } from "../../../../components/loading/practice-skeleton";
import { PracticeTopbar, usePracticeUi } from "../../../practice";
import { activityBarColor, subjectAccuracyColor } from "../../dashboard.constants";
import {
  continueProgressFillSx,
  dashboardStyles,
  statDeltaSx,
  subjectFillSx,
  weeklyBarFillSx,
} from "./dashboard.styles";

type DashboardPageProps = {
  onNavigateScreen?: (screen: AppScreen) => void;
};

// The backend only ever emits "practice:<subjectId>" today (see
// dashboard.service.ts's `recommended` builder) — this stays a narrow parse
// rather than a general router, matching what's actually produced.
function parseTargetRef(targetRef: string): { screen: AppScreen; subjectId?: string } {
  const [prefix, subjectId] = targetRef.split(":");
  if (prefix === "practice") {
    return { screen: "practice", subjectId };
  }
  return { screen: "dashboard" };
}

export function DashboardPage(props: DashboardPageProps = {}) {
  const { onNavigateScreen } = props;
  const practiceUi = usePracticeUi();
  const dashboardQuery = useGetDashboardQuery();

  if (dashboardQuery.isLoading) {
    return (
      <Box sx={dashboardStyles.shell}>
        <Box sx={{ ...dashboardStyles.scrollBody, ...dashboardStyles.wrap }}>
          <PracticeSkeleton />
        </Box>
      </Box>
    );
  }

  if (dashboardQuery.isError || !dashboardQuery.data) {
    return (
      <Box sx={dashboardStyles.shell}>
        <Box sx={dashboardStyles.scrollBody}>
          <Alert severity="error" sx={{ borderRadius: 2 }}>
            Could not load the dashboard.{" "}
            {toApiErrorMessage(dashboardQuery.error, "Please try again.")}
          </Alert>
        </Box>
      </Box>
    );
  }

  const dashboard = dashboardQuery.data;
  const maxWeekly = Math.max(1, ...dashboard.weeklyActivity.map((bar) => bar.v));

  function handleRecommendedClick(targetRef: string): void {
    const { screen, subjectId } = parseTargetRef(targetRef);
    if (subjectId) {
      const subject = dashboard.accuracyBySubject.find((s) => s.subjectId === subjectId);
      if (subject) {
        practiceUi.setSelectedSubject(subject.name);
      }
    }
    onNavigateScreen?.(screen);
  }

  function handleContinueClick(): void {
    if (dashboard.continue) {
      practiceUi.setSelectedSubject(dashboard.continue.subjectName);
    }
    onNavigateScreen?.("practice");
  }

  const statCards = [
    { label: "Questions solved", stat: dashboard.stats.questionsSolved },
    { label: "Overall accuracy", stat: dashboard.stats.accuracy },
    { label: "Mock rank", stat: dashboard.stats.mockRank },
    { label: "Study time", stat: dashboard.stats.studyTime },
  ];

  return (
    <Box sx={dashboardStyles.shell}>
        <PracticeTopbar
          currentScreen="dashboard"
          title="Dashboard"
          subtitle="Your daily overview for practice, plans, and exams"
          searchPlaceholder="Search MCQs, notes..."
          onOpenGlobalSearch={() => onNavigateScreen?.("globalSearch")}
          onOpenSettings={() => onNavigateScreen?.("settingsProfile")}
          onNavigateScreen={onNavigateScreen}
        />

        <Box sx={dashboardStyles.scrollBody}>
          <Box sx={dashboardStyles.wrap}>
            <Box sx={dashboardStyles.heroRow}>
              <Box sx={dashboardStyles.heroCopy}>
                <Typography variant="h2" sx={dashboardStyles.heroGreeting}>
                  Good {dashboard.greeting.partOfDay}, {dashboard.greeting.name}.
                </Typography>
                <Typography sx={dashboardStyles.heroMessage}>
                  Here's where to focus next.
                </Typography>
              </Box>

              <Paper sx={dashboardStyles.heroCard}>
                <Box sx={dashboardStyles.heroCardContent}>
                  <Typography sx={dashboardStyles.continueLabel}>
                    Continue
                  </Typography>
                  <Typography sx={dashboardStyles.continueTopic}>
                    {dashboard.continue?.topicTitle ?? "Start your first practice set"}
                  </Typography>
                  <Box sx={dashboardStyles.continueProgressTrack}>
                    <Box sx={continueProgressFillSx(`${dashboard.continue?.progressPct ?? 0}%`)} />
                  </Box>
                  <Typography sx={dashboardStyles.continueProgressText}>
                    {dashboard.continue
                      ? `${dashboard.continue.subjectName} - ${dashboard.continue.progressPct}% complete`
                      : "No practice sessions yet"}
                  </Typography>
                </Box>
                <Box onClick={handleContinueClick} sx={dashboardStyles.continueBadge}>
                  ▸
                </Box>
              </Paper>
            </Box>

            <Box sx={dashboardStyles.statsGrid}>
              {statCards.map((card) => (
                <Paper key={card.label} variant="outlined" sx={dashboardStyles.statCard}>
                  <Typography sx={dashboardStyles.statCardLabel}>{card.label}</Typography>
                  <Typography variant="h3" sx={dashboardStyles.statCardValue}>
                    {card.stat.value}
                  </Typography>
                  <Typography sx={statDeltaSx(card.stat.good ? "good" : "muted")}>
                    {card.stat.delta}
                  </Typography>
                </Paper>
              ))}
            </Box>

            <Box sx={dashboardStyles.panelsGrid}>
              <Paper variant="outlined" sx={dashboardStyles.panel}>
                <Box sx={dashboardStyles.panelHeaderRow}>
                  <Typography sx={dashboardStyles.panelTitle}>
                    Weekly activity
                  </Typography>
                  <Typography sx={dashboardStyles.panelMeta}>
                    questions / day
                  </Typography>
                </Box>
                <Box sx={dashboardStyles.barsRow}>
                  {dashboard.weeklyActivity.map((bar, index) => (
                    <Box key={`${bar.d}-${index}`} sx={dashboardStyles.barColumn}>
                      <Box
                        sx={weeklyBarFillSx(
                          Math.round((bar.v / maxWeekly) * 100),
                          activityBarColor(bar.isToday),
                        )}
                      />
                      <Typography sx={dashboardStyles.barDayLabel}>{bar.d}</Typography>
                    </Box>
                  ))}
                </Box>
              </Paper>

              <Paper variant="outlined" sx={dashboardStyles.panel}>
                <Typography sx={dashboardStyles.subjectTitle}>
                  Accuracy by subject
                </Typography>
                {dashboard.accuracyBySubject.length === 0 && (
                  <Typography sx={{ fontSize: 13, color: "text.secondary" }}>
                    Practice a few questions to see subject accuracy here.
                  </Typography>
                )}
                <Box sx={dashboardStyles.subjectList}>
                  {dashboard.accuracyBySubject.map((subject) => (
                    <Box key={subject.subjectId}>
                      <Box sx={dashboardStyles.subjectRowHead}>
                        <Typography sx={dashboardStyles.subjectName}>{subject.name}</Typography>
                        <Typography sx={dashboardStyles.subjectAccuracy}>
                          {subject.acc}%
                        </Typography>
                      </Box>
                      <Box sx={dashboardStyles.subjectTrack}>
                        <Box sx={subjectFillSx(subject.acc, subjectAccuracyColor(subject.acc))} />
                      </Box>
                    </Box>
                  ))}
                </Box>
              </Paper>
            </Box>

            <Box sx={dashboardStyles.recommendationsHead}>
              <Typography sx={dashboardStyles.recommendationsTitle}>
                Recommended for you
              </Typography>
              <Typography sx={dashboardStyles.recommendationsSubtitle}>Prioritized by your weak areas</Typography>
            </Box>
            {dashboard.recommended.length === 0 && (
              <Alert severity="info" sx={{ borderRadius: 2 }}>
                Recommendations will appear once you've practiced a few subjects.
              </Alert>
            )}
            <Box sx={dashboardStyles.recommendationsGrid}>
              {dashboard.recommended.map((item) => (
                <Paper
                  key={item.topic}
                  variant="outlined"
                  onClick={() => handleRecommendedClick(item.targetRef)}
                  sx={dashboardStyles.recommendationCard}
                >
                  <Typography sx={dashboardStyles.recommendationTag}>
                    {item.tag}
                  </Typography>
                  <Typography sx={dashboardStyles.recommendationTopic}>
                    {item.topic}
                  </Typography>
                  <Typography sx={dashboardStyles.recommendationReason}>{item.reason}</Typography>
                  <Typography sx={dashboardStyles.recommendationAction}>Start practice →</Typography>
                </Paper>
              ))}
            </Box>
          </Box>
        </Box>
      </Box>
  );
}

import { Box, Paper, Typography } from "@mui/material";
import type { AppScreen } from "../../../../app/screens";
import { PracticeTopbar } from "../../../practice";
import {
  activityBarColor,
  DASHBOARD_RECOMMENDED,
  DASHBOARD_STAT_CARDS,
  DASHBOARD_SUBJECT_BARS,
  DASHBOARD_WEEKLY_BARS,
  subjectAccuracyColor,
} from "../../dashboard.constants";
import {
  DASHBOARD_CONTINUE_LABEL,
  DASHBOARD_CONTINUE_PROGRESS_TEXT,
  DASHBOARD_CONTINUE_PROGRESS_VALUE,
  DASHBOARD_CONTINUE_TOPIC,
  DASHBOARD_HERO_GREETING,
  DASHBOARD_HERO_MESSAGE,
} from "../../dashboard-page.constants";
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

export function DashboardPage(props: DashboardPageProps = {}) {
  const { onNavigateScreen } = props;

  const maxWeekly = Math.max(...DASHBOARD_WEEKLY_BARS.map((bar) => bar.value));

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
                  {DASHBOARD_HERO_GREETING}
                </Typography>
                <Typography sx={dashboardStyles.heroMessage}>
                  {DASHBOARD_HERO_MESSAGE}
                </Typography>
              </Box>

              <Paper sx={dashboardStyles.heroCard}>
                <Box sx={dashboardStyles.heroCardContent}>
                  <Typography sx={dashboardStyles.continueLabel}>
                    {DASHBOARD_CONTINUE_LABEL}
                  </Typography>
                  <Typography sx={dashboardStyles.continueTopic}>
                    {DASHBOARD_CONTINUE_TOPIC}
                  </Typography>
                  <Box sx={dashboardStyles.continueProgressTrack}>
                    <Box sx={continueProgressFillSx(DASHBOARD_CONTINUE_PROGRESS_VALUE)} />
                  </Box>
                  <Typography sx={dashboardStyles.continueProgressText}>{DASHBOARD_CONTINUE_PROGRESS_TEXT}</Typography>
                </Box>
                <Box onClick={() => onNavigateScreen?.("practice")} sx={dashboardStyles.continueBadge}>
                  ▸
                </Box>
              </Paper>
            </Box>

            <Box sx={dashboardStyles.statsGrid}>
              {DASHBOARD_STAT_CARDS.map((card) => (
                <Paper key={card.label} variant="outlined" sx={dashboardStyles.statCard}>
                  <Typography sx={dashboardStyles.statCardLabel}>{card.label}</Typography>
                  <Typography variant="h3" sx={dashboardStyles.statCardValue}>
                    {card.value}
                  </Typography>
                  <Typography sx={statDeltaSx(card.tone)}>
                    {card.delta}
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
                  {DASHBOARD_WEEKLY_BARS.map((bar, index) => (
                    <Box key={`${bar.day}-${index}`} sx={dashboardStyles.barColumn}>
                      <Box
                        sx={weeklyBarFillSx(
                          Math.round((bar.value / maxWeekly) * 100),
                          activityBarColor(index),
                        )}
                      />
                      <Typography sx={dashboardStyles.barDayLabel}>{bar.day}</Typography>
                    </Box>
                  ))}
                </Box>
              </Paper>

              <Paper variant="outlined" sx={dashboardStyles.panel}>
                <Typography sx={dashboardStyles.subjectTitle}>
                  Accuracy by subject
                </Typography>
                <Box sx={dashboardStyles.subjectList}>
                  {DASHBOARD_SUBJECT_BARS.map((subject) => (
                    <Box key={subject.name}>
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
            <Box sx={dashboardStyles.recommendationsGrid}>
              {DASHBOARD_RECOMMENDED.map((item) => (
                <Paper
                  key={item.topic}
                  variant="outlined"
                  onClick={() => onNavigateScreen?.(item.target)}
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

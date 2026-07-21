import { Alert, Box, Button, Paper, Typography } from "@mui/material";
import type { AppScreen } from "../../../../app/screens";
import { toApiErrorMessage } from "../../../../api/error";
import { useGetResultQuery } from "../../../../api/mock-exams/mock-exams.endpoints";
import { PracticeSkeleton } from "../../../../components/loading/practice-skeleton";
import { PracticeTopbar } from "../../../practice";
import {
  mockExamsStyles,
  resultBreakdownSegmentSx,
  resultDonutSx,
  resultReviewStatusSx,
  resultSubjectFillSx,
} from "../../mock-exams.styles";

type MockExamResultPageProps = {
  attemptId: string;
  onNavigateScreen?: (screen: AppScreen) => void;
  onRetake?: (examId: string) => void;
  onBackToExams?: () => void;
};

function formatDuration(seconds: number): string {
  const minutes = Math.floor(seconds / 60);
  const remain = seconds % 60;
  return `${minutes}m ${remain}s`;
}

export function MockExamResultPage(props: MockExamResultPageProps) {
  const { attemptId, onNavigateScreen, onRetake, onBackToExams } = props;
  const resultQuery = useGetResultQuery(attemptId);

  if (resultQuery.isLoading) {
    return (
      <Box sx={mockExamsStyles.shell}>
        <Box sx={{ ...mockExamsStyles.scrollBody, ...mockExamsStyles.resultContentWrap }}>
          <PracticeSkeleton />
        </Box>
      </Box>
    );
  }

  if (resultQuery.isError || !resultQuery.data) {
    return (
      <Box sx={mockExamsStyles.shell}>
        <Box sx={mockExamsStyles.scrollBody}>
          <Alert severity="error" sx={mockExamsStyles.stateCard}>
            Could not load this result.{" "}
            {toApiErrorMessage(resultQuery.error, "Please try again.")}
          </Alert>
        </Box>
      </Box>
    );
  }

  const result = resultQuery.data;
  // The donut is accuracy of ATTEMPTED (acc); the rank band is of TOTAL (pct)
  // — they diverge whenever anything is skipped, so they're kept distinct.
  const donutDegrees = Math.round((result.acc / 100) * 360);
  const correctWidth = (result.correct / result.total) * 100;
  const wrongWidth = (result.wrong / result.total) * 100;
  const skippedWidth = (result.skipped / result.total) * 100;

  return (
    <Box sx={mockExamsStyles.shell}>
        <PracticeTopbar
          currentScreen="mockExamResult"
          title="Mock Exam Result"
          subtitle={`${result.exam.name} · analysis`}
          searchPlaceholder="Search Result"
          onOpenGlobalSearch={() => onNavigateScreen?.("globalSearch")}
          onOpenSettings={() => onNavigateScreen?.("settingsProfile")}
          onNavigateScreen={onNavigateScreen}
        />

        <Box sx={mockExamsStyles.scrollBody}>
          <Box sx={mockExamsStyles.resultContentWrap}>
          <Paper sx={mockExamsStyles.resultHeroCard}>
            <Box>
              <Typography sx={mockExamsStyles.resultHeroKicker}>
                Net Score
              </Typography>
              <Typography variant="h1" sx={mockExamsStyles.resultHeroScore}>
                {result.score} / {result.total}
              </Typography>
              <Box sx={mockExamsStyles.resultHeroBadge}>
                {result.verdict} · Pass mark {result.passMark}
              </Box>
            </Box>

            <Box sx={resultDonutSx(donutDegrees)}>
              <Box sx={mockExamsStyles.resultDonutInner}>
                <Typography sx={mockExamsStyles.resultDonutText}>
                  {result.acc}%
                </Typography>
              </Box>
            </Box>
          </Paper>

          <Box sx={mockExamsStyles.resultStatsGrid}>
            {[
              { label: "Attempted", value: `${result.attempted}/${result.total}` },
              { label: "Accuracy", value: `${result.acc}%` },
              { label: "Est. rank", value: result.rank },
              { label: "Time taken", value: formatDuration(result.taken) },
            ].map((item) => (
              <Paper key={item.label} variant="outlined" sx={mockExamsStyles.resultStatCard}>
                <Typography sx={mockExamsStyles.resultStatLabel}>{item.label}</Typography>
                <Typography variant="h3" sx={mockExamsStyles.resultStatValue}>{item.value}</Typography>
              </Paper>
            ))}
          </Box>

          <Paper variant="outlined" sx={mockExamsStyles.resultPanel}>
            <Typography sx={mockExamsStyles.resultPanelTitle}>Answer breakdown</Typography>
            <Box sx={mockExamsStyles.resultBreakdownTrack}>
              <Box sx={resultBreakdownSegmentSx(correctWidth, "success.main")} />
              <Box sx={resultBreakdownSegmentSx(wrongWidth, "error.main")} />
              <Box sx={resultBreakdownSegmentSx(skippedWidth, "divider")} />
            </Box>
            <Box sx={mockExamsStyles.resultBreakdownLegend}>
              <Typography sx={mockExamsStyles.resultLegendGood}>Correct: {result.correct}</Typography>
              <Typography sx={mockExamsStyles.resultLegendBad}>Wrong: {result.wrong}</Typography>
              <Typography>Skipped: {result.skipped}</Typography>
            </Box>
          </Paper>

          <Paper variant="outlined" sx={mockExamsStyles.resultPanel}>
            <Typography sx={mockExamsStyles.resultPanelTitle}>Subject-wise breakdown</Typography>
            <Box sx={mockExamsStyles.resultSubjectsGrid}>
              {result.bySubject.map((item) => (
                <Box key={item.name}>
                  <Box sx={mockExamsStyles.resultSubjectHeader}>
                    <Typography sx={mockExamsStyles.resultSubjectText}>{item.name}</Typography>
                    <Typography sx={mockExamsStyles.resultSubjectText}>{item.correct}/{item.attempted} · {item.acc}%</Typography>
                  </Box>
                  <Box sx={mockExamsStyles.resultSubjectTrack}>
                    <Box sx={resultSubjectFillSx(item.acc)} />
                  </Box>
                </Box>
              ))}
            </Box>
          </Paper>

          <Paper variant="outlined" sx={mockExamsStyles.resultInsight}>
            <Typography sx={mockExamsStyles.resultInsightKicker}>
              AI Analysis
            </Typography>
            <Typography sx={mockExamsStyles.resultInsightText}>
              {result.analysis}
            </Typography>
          </Paper>

          <Paper variant="outlined" sx={mockExamsStyles.resultPanel}>
            <Typography sx={mockExamsStyles.resultPanelTitle}>Question review</Typography>
            <Box sx={mockExamsStyles.resultReviewGrid}>
              {result.review.map((row) => (
                <Box key={row.questionId} sx={mockExamsStyles.resultReviewRow}>
                  <Typography sx={mockExamsStyles.resultReviewId}>Q{row.order}</Typography>
                  <Typography sx={mockExamsStyles.resultReviewSubject}>{row.subject}</Typography>
                  <Typography sx={resultReviewStatusSx(row.status === "CORRECT", row.status === "SKIPPED")}>
                    {row.your === null
                      ? "Skipped"
                      : `Your ${String.fromCharCode(65 + row.your)} · Correct ${String.fromCharCode(65 + row.correct)}`}
                  </Typography>
                </Box>
              ))}
            </Box>
          </Paper>

          <Box sx={mockExamsStyles.resultActions}>
            <Button variant="outlined" onClick={onBackToExams}>Back to exams</Button>
            <Button variant="contained" onClick={() => onRetake?.(result.exam.id)}>Retake exam</Button>
            <Button variant="contained" color="success" onClick={() => onNavigateScreen?.("aiTutor")}>Practice weak areas</Button>
          </Box>
          </Box>
        </Box>
      </Box>
  );
}

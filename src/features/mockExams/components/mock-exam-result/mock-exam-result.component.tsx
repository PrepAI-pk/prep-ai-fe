import { Box, Button, Paper, Typography } from "@mui/material";
import type { AppScreen } from "../../../../app/screens";
import type { MockExamRunResult } from "../../mock-exams.types";
import { PracticeTopbar } from "../../../practice";
import {
  mockExamsStyles,
  resultBreakdownSegmentSx,
  resultDonutSx,
  resultReviewStatusSx,
  resultSubjectFillSx,
} from "../../mock-exams.styles";

type MockExamResultPageProps = {
  result: MockExamRunResult;
  onNavigateScreen?: (screen: AppScreen) => void;
  onRetake?: () => void;
  onBackToExams?: () => void;
};

function formatDuration(seconds: number): string {
  const minutes = Math.floor(seconds / 60);
  const remain = seconds % 60;
  return `${minutes}m ${remain}s`;
}

export function MockExamResultPage(props: MockExamResultPageProps) {
  const { result, onNavigateScreen, onRetake, onBackToExams } = props;
  const donutDegrees = Math.round((result.correct / Math.max(result.totalQuestions, 1)) * 360);
  const flaggedCount = Object.values(result.flags).filter(Boolean).length;
  const correctWidth = (result.breakdown.correct / result.totalQuestions) * 100;
  const wrongWidth = (result.breakdown.wrong / result.totalQuestions) * 100;
  const skippedWidth = (result.breakdown.skipped / result.totalQuestions) * 100;

  return (
    <Box sx={mockExamsStyles.shell}>
        <PracticeTopbar
          currentScreen="mockExamResult"
          title="Mock Exam Result"
          subtitle={`${result.exam.title} · analysis`}
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
                {result.score.toFixed(2)} / {result.maxScore}
              </Typography>
              <Box sx={mockExamsStyles.resultHeroBadge}>
                {result.isQualified ? "Qualified" : "Below cut-off"} · Pass mark {result.passMark}
              </Box>
            </Box>

            <Box sx={resultDonutSx(donutDegrees)}>
              <Box sx={mockExamsStyles.resultDonutInner}>
                <Typography sx={mockExamsStyles.resultDonutText}>
                  {result.accuracy}%
                </Typography>
              </Box>
            </Box>
          </Paper>

          <Box sx={mockExamsStyles.resultStatsGrid}>
            {[
              { label: "Attempted", value: `${result.attempted}/${result.totalQuestions}` },
              { label: "Accuracy", value: `${result.accuracy}%` },
              { label: "Est. rank", value: result.estimatedRank },
              { label: "Time taken", value: formatDuration(result.timeTakenSeconds) },
            ].map((item) => (
              <Paper key={item.label} variant="outlined" sx={mockExamsStyles.resultStatCard}>
                <Typography sx={mockExamsStyles.resultStatLabel}>{item.label}</Typography>
                <Typography variant="h3" sx={mockExamsStyles.resultStatValue}>{item.value}</Typography>
              </Paper>
            ))}
          </Box>

          <Typography sx={mockExamsStyles.resultHint}>
            Flagged questions in run: {flaggedCount}
          </Typography>

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
              {result.subjectBreakdown.map((item) => (
                <Box key={item.subject}>
                  <Box sx={mockExamsStyles.resultSubjectHeader}>
                    <Typography sx={mockExamsStyles.resultSubjectText}>{item.subject}</Typography>
                    <Typography sx={mockExamsStyles.resultSubjectText}>{item.correct}/{item.attempted} · {item.accuracy}%</Typography>
                  </Box>
                  <Box sx={mockExamsStyles.resultSubjectTrack}>
                    <Box sx={resultSubjectFillSx(item.accuracy)} />
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
              Accuracy dropped most in low-confidence flagged items. Prioritize practice on the two weakest subjects, then retake a timed mini mock for score recovery.
            </Typography>
          </Paper>

          <Paper variant="outlined" sx={mockExamsStyles.resultPanel}>
            <Typography sx={mockExamsStyles.resultPanelTitle}>Question review</Typography>
            <Box sx={mockExamsStyles.resultReviewGrid}>
              {result.review.slice(0, 30).map((row) => (
                <Box key={row.questionId} sx={mockExamsStyles.resultReviewRow}>
                  <Typography sx={mockExamsStyles.resultReviewId}>Q{row.questionId}</Typography>
                  <Typography sx={mockExamsStyles.resultReviewSubject}>{row.subject}</Typography>
                  <Typography sx={resultReviewStatusSx(row.isCorrect, row.yourAnswerIndex === null)}>
                    {row.yourAnswerIndex === null
                      ? "Skipped"
                      : `Your ${String.fromCharCode(65 + row.yourAnswerIndex)} · Correct ${String.fromCharCode(65 + row.correctIndex)}`}
                  </Typography>
                </Box>
              ))}
            </Box>
          </Paper>

          <Box sx={mockExamsStyles.resultActions}>
            <Button variant="outlined" onClick={onBackToExams}>Back to exams</Button>
            <Button variant="contained" onClick={onRetake}>Retake exam</Button>
            <Button variant="contained" color="success" onClick={() => onNavigateScreen?.("aiTutor")}>Practice weak areas</Button>
          </Box>
          </Box>
        </Box>
      </Box>
  );
}

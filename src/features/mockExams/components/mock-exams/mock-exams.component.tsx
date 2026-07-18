import { useState } from "react";
import { Alert, Box, Button, Chip, Paper, Typography } from "@mui/material";
import type { AppScreen } from "../../../../app/screens";
import { toApiErrorMessage } from "../../../../api/error";
import { useGetRecentAttemptsQuery, useStartAttemptMutation } from "../../../../api/mock-exams/mock-exams.endpoints";
import type { Exam, StartAttemptResponse } from "../../mock-exams.types";
import { PracticeTopbar } from "../../../practice";
import {
  MOCK_EXAMS_EMPTY_TEXT,
  MOCK_EXAMS_LOADING_TEXT,
  MOCK_EXAMS_PAGE_SUBTITLE,
  MOCK_EXAMS_PAGE_TITLE,
  MOCK_EXAMS_START_BUTTON_TEXT,
} from "../../mock-exams.constants";
import { useMockExams } from "../../hooks/use-mock-exams.hook";
import { mockExamsStyles, recentAttemptScoreSx } from "../../mock-exams.styles";

type MockExamsPageProps = {
  onNavigateScreen?: (screen: AppScreen) => void;
  onStarted?: (start: StartAttemptResponse) => void;
};

export function MockExamsPage(props: MockExamsPageProps = {}) {
  const { onNavigateScreen, onStarted } = props;
  const mockExamsQuery = useMockExams();
  const recentQuery = useGetRecentAttemptsQuery();
  const [startAttempt, { isLoading: isStarting }] = useStartAttemptMutation();
  const [startingExamId, setStartingExamId] = useState<string | null>(null);
  const [startError, setStartError] = useState<string | null>(null);

  const mockExams = mockExamsQuery.data ?? [];
  const recentAttempts = recentQuery.data ?? [];

  async function handleStart(exam: Exam): Promise<void> {
    setStartError(null);
    setStartingExamId(exam.id);
    try {
      const start = await startAttempt(exam.id).unwrap();
      onStarted?.(start);
    } catch (error) {
      setStartError(toApiErrorMessage(error, "Could not start this exam. Please try again."));
    } finally {
      setStartingExamId(null);
    }
  }

  return (
    <Box sx={mockExamsStyles.shell}>
        <PracticeTopbar
          currentScreen="mockExams"
          title="Mock Exams"
          subtitle="Timed assessments with scoring and rank analysis"
          searchPlaceholder="Search Exams"
          onOpenGlobalSearch={() => onNavigateScreen?.("globalSearch")}
          onOpenSettings={() => onNavigateScreen?.("settingsProfile")}
          onNavigateScreen={onNavigateScreen}
        />

        <Box sx={mockExamsStyles.scrollBody}>
          <Box sx={mockExamsStyles.contentWrap}>
            <Typography variant="h3" sx={mockExamsStyles.pageTitle}>
              {MOCK_EXAMS_PAGE_TITLE}
            </Typography>
            <Typography sx={mockExamsStyles.pageSubtitle}>
              {MOCK_EXAMS_PAGE_SUBTITLE}
            </Typography>

            {mockExamsQuery.isLoading && (
              <Paper variant="outlined" sx={mockExamsStyles.stateCard}>
                <Typography sx={mockExamsStyles.stateText}>
                  {MOCK_EXAMS_LOADING_TEXT}
                </Typography>
              </Paper>
            )}

            {mockExamsQuery.isError && (
              <Alert severity="error" sx={mockExamsStyles.stateCard}>
                Could not load mock exams.{" "}
                {toApiErrorMessage(mockExamsQuery.error, "Please try again.")}
              </Alert>
            )}

            {startError && (
              <Alert severity="error" sx={mockExamsStyles.stateCard} onClose={() => setStartError(null)}>
                {startError}
              </Alert>
            )}

            {!mockExamsQuery.isLoading && !mockExamsQuery.isError && mockExams.length === 0 && (
              <Alert severity="info" sx={mockExamsStyles.stateCard}>
                {MOCK_EXAMS_EMPTY_TEXT}
              </Alert>
            )}

            <Box sx={mockExamsStyles.examsGrid}>
              {mockExams.map((exam) => (
                <Paper key={exam.slug} variant="outlined" sx={mockExamsStyles.examCard}>
                  <Box sx={mockExamsStyles.examMetaRow}>
                    <Chip label={exam.body} size="small" sx={mockExamsStyles.examBodyChip} />
                    <Typography sx={mockExamsStyles.examLevel}>
                      {exam.level}
                    </Typography>
                  </Box>

                  <Typography variant="h3" sx={mockExamsStyles.examTitle}>
                    {exam.name}
                  </Typography>

                  <Typography sx={mockExamsStyles.examDetails}>
                    {exam.questionCount} Q · {exam.durationMins} min · {exam.negLabel}
                  </Typography>

                  <Button
                    variant="contained"
                    sx={mockExamsStyles.startButton}
                    onClick={() => void handleStart(exam)}
                    disabled={isStarting && startingExamId === exam.id}
                  >
                    {isStarting && startingExamId === exam.id ? "Starting…" : MOCK_EXAMS_START_BUTTON_TEXT}
                  </Button>
                </Paper>
              ))}
            </Box>

            {recentAttempts.length > 0 && (
              <>
                <Typography sx={mockExamsStyles.recentAttemptsTitle}>Recent attempts</Typography>
                {recentAttempts.map((attempt) => {
                  const pct = attempt.total ? Math.round((attempt.score / attempt.total) * 100) : 0;
                  return (
                    <Paper key={attempt.attemptId} variant="outlined" sx={mockExamsStyles.recentAttemptRow}>
                      <Box>
                        <Typography sx={mockExamsStyles.recentAttemptExam}>{attempt.examName}</Typography>
                        <Typography sx={mockExamsStyles.recentAttemptMeta}>{attempt.rank}</Typography>
                      </Box>
                      <Typography sx={recentAttemptScoreSx(pct)}>
                        {attempt.score} / {attempt.total}
                      </Typography>
                    </Paper>
                  );
                })}
              </>
            )}
          </Box>
        </Box>
      </Box>
  );
}

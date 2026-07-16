import { Alert, Box, Button, Chip, Paper, Typography } from "@mui/material";
import type { AppScreen } from "../../../../app/screens";
import { toApiErrorMessage } from "../../../../api/error";
import type { MockExam } from "../../mock-exams.types";
import { PracticeTopbar } from "../../../practice";
import {
  MOCK_EXAMS_EMPTY_TEXT,
  MOCK_EXAMS_LOADING_TEXT,
  MOCK_EXAMS_PAGE_SUBTITLE,
  MOCK_EXAMS_PAGE_TITLE,
  MOCK_EXAMS_START_BUTTON_TEXT,
} from "../../mock-exams.constants";
import { useMockExams } from "../../hooks/use-mock-exams.hook";
import { mockExamsStyles } from "../../mock-exams.styles";

type MockExamsPageProps = {
  onNavigateScreen?: (screen: AppScreen) => void;
  onStartExam?: (exam: MockExam) => void;
};

export function MockExamsPage(props: MockExamsPageProps = {}) {
  const { onNavigateScreen, onStartExam } = props;
  const mockExamsQuery = useMockExams();
  const mockExams = mockExamsQuery.data ?? [];

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
                    {exam.title}
                  </Typography>

                  <Typography sx={mockExamsStyles.examDetails}>
                    {exam.questionsCount} Q · {exam.durationMinutes} min ·
                    {exam.negativeMarking > 0
                      ? ` -${exam.negativeMarking} neg`
                      : " no neg"}
                  </Typography>

                  <Button
                    variant="contained"
                    sx={mockExamsStyles.startButton}
                    onClick={() => onStartExam?.(exam)}
                  >
                    {MOCK_EXAMS_START_BUTTON_TEXT}
                  </Button>
                </Paper>
              ))}
            </Box>
          </Box>
        </Box>
      </Box>
  );
}
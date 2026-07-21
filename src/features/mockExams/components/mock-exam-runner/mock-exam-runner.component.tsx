import { useEffect, useRef, useState } from "react";
import { Alert, Box, Button, Chip, Paper, Typography } from "@mui/material";
import type { AppScreen } from "../../../../app/screens";
import { toApiErrorMessage } from "../../../../api/error";
import {
  useGetAttemptQuery,
  usePatchAttemptAnswersMutation,
  useSubmitAttemptMutation,
} from "../../../../api/mock-exams/mock-exams.endpoints";
import { PracticeSkeleton } from "../../../../components/loading/practice-skeleton";
import { PracticeTopbar } from "../../../practice";
import {
  mockExamsStyles,
  runnerOptionBadgeSx,
  runnerOptionCardSx,
  runnerPaletteItemSx,
  runnerTimerValueSx,
} from "../../mock-exams.styles";

const AUTOSAVE_INTERVAL_MS = 5000;

type MockExamRunnerPageProps = {
  attemptId: string;
  onNavigateScreen?: (screen: AppScreen) => void;
  onSubmitted?: (attemptId: string) => void;
};

function formatRemainingTime(totalSeconds: number): string {
  const safeSeconds = Math.max(totalSeconds, 0);
  const minutes = Math.floor(safeSeconds / 60);
  const seconds = safeSeconds % 60;
  return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
}

// 410 EXPIRED means the server already auto-graded a late submission — that's
// not a failure from the runner's point of view, just a signal to move on.
function isExpiredError(error: unknown): boolean {
  return (
    typeof error === "object" &&
    error !== null &&
    "status" in error &&
    (error as { status?: unknown }).status === 410
  );
}

export function MockExamRunnerPage(props: MockExamRunnerPageProps) {
  const { attemptId, onNavigateScreen, onSubmitted } = props;

  const attemptQuery = useGetAttemptQuery(attemptId);
  const [patchAnswers] = usePatchAttemptAnswersMutation();
  const [submitAttempt, { isLoading: isSubmitting }] = useSubmitAttemptMutation();

  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [flags, setFlags] = useState<Record<string, boolean>>({});
  const [remainingSeconds, setRemainingSeconds] = useState(0);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const hasSeededRef = useRef(false);
  const dirtyRef = useRef<{ answers: Record<string, number>; flags: Record<string, boolean> }>({
    answers: {},
    flags: {},
  });
  const submitTriggeredRef = useRef(false);

  // Seed local state once, either from a fresh start or a resumed attempt —
  // subsequent background refetches must not stomp on in-progress edits.
  useEffect(() => {
    if (hasSeededRef.current || !attemptQuery.data) {
      return;
    }
    hasSeededRef.current = true;

    const seededAnswers: Record<string, number> = {};
    const seededFlags: Record<string, boolean> = {};
    for (const question of attemptQuery.data.questions) {
      if (question.selectedIndex !== null) {
        seededAnswers[question.id] = question.selectedIndex;
      }
      if (question.flagged) {
        seededFlags[question.id] = true;
      }
    }
    setAnswers(seededAnswers);
    setFlags(seededFlags);
  }, [attemptQuery.data]);

  const questions = attemptQuery.data?.questions ?? [];
  const currentQuestion = questions[currentIndex];
  const answeredCount = Object.keys(answers).length;

  async function flushDirty(): Promise<void> {
    const pending = dirtyRef.current;
    if (Object.keys(pending.answers).length === 0 && Object.keys(pending.flags).length === 0) {
      return;
    }
    dirtyRef.current = { answers: {}, flags: {} };
    try {
      await patchAnswers({ attemptId, answers: pending.answers, flags: pending.flags }).unwrap();
    } catch {
      // Best-effort autosave — the next flush (or the submit-time flush) retries.
    }
  }

  useEffect(() => {
    const intervalId = window.setInterval(() => void flushDirty(), AUTOSAVE_INTERVAL_MS);
    return () => {
      window.clearInterval(intervalId);
      void flushDirty();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [attemptId]);

  // A "latest callback" ref, kept current via an effect (not a render-time
  // assignment) so both the timer effect and the submit button always call
  // the version closed over the freshest attemptId/state without needing to
  // re-run the 1s timer effect on every render.
  const handleSubmit = useRef<() => Promise<void>>(async () => {});
  useEffect(() => {
    handleSubmit.current = async () => {
      if (submitTriggeredRef.current) {
        return;
      }
      submitTriggeredRef.current = true;
      await flushDirty();
      try {
        await submitAttempt(attemptId).unwrap();
        onSubmitted?.(attemptId);
      } catch (error) {
        if (isExpiredError(error)) {
          onSubmitted?.(attemptId);
          return;
        }
        submitTriggeredRef.current = false;
        setSubmitError(toApiErrorMessage(error, "Could not submit this attempt. Please try again."));
      }
    };
  });

  // Ticks from the server-issued expiresAt, not a client-owned countdown —
  // reloading recomputes from the same instant instead of resetting the clock.
  useEffect(() => {
    const expiresAt = attemptQuery.data?.expiresAt;
    if (!expiresAt) {
      return;
    }

    function tick(): void {
      const secondsLeft = Math.round((new Date(expiresAt as string).getTime() - Date.now()) / 1000);
      setRemainingSeconds(Math.max(secondsLeft, 0));
      if (secondsLeft <= 0) {
        void handleSubmit.current();
      }
    }

    tick();
    const intervalId = window.setInterval(tick, 1000);
    return () => window.clearInterval(intervalId);
  }, [attemptQuery.data?.expiresAt]);

  function handleSelectOption(optionIndex: number): void {
    if (!currentQuestion) {
      return;
    }
    setAnswers((previous) => ({ ...previous, [currentQuestion.id]: optionIndex }));
    dirtyRef.current.answers[currentQuestion.id] = optionIndex;
  }

  function handleToggleFlag(): void {
    if (!currentQuestion) {
      return;
    }
    const next = !flags[currentQuestion.id];
    setFlags((previous) => ({ ...previous, [currentQuestion.id]: next }));
    dirtyRef.current.flags[currentQuestion.id] = next;
  }

  if (attemptQuery.isLoading) {
    return (
      <Box sx={mockExamsStyles.shell}>
        <Box sx={{ ...mockExamsStyles.scrollBody, ...mockExamsStyles.runnerContentWrap }}>
          <PracticeSkeleton />
        </Box>
      </Box>
    );
  }

  if (attemptQuery.isError || !attemptQuery.data || !currentQuestion) {
    return (
      <Box sx={mockExamsStyles.shell}>
        <Box sx={mockExamsStyles.scrollBody}>
          <Alert severity="error" sx={mockExamsStyles.stateCard}>
            Could not load this exam attempt.{" "}
            {toApiErrorMessage(attemptQuery.error, "Please start a new one.")}
          </Alert>
        </Box>
      </Box>
    );
  }

  const { exam } = attemptQuery.data;

  return (
    <Box sx={mockExamsStyles.shell}>
        <PracticeTopbar
          currentScreen="mockExamRunner"
          title="Mock Exam Runner"
          subtitle={`${exam.name} · ${questions.length} questions`}
          searchPlaceholder="Search Question"
          onOpenGlobalSearch={() => onNavigateScreen?.("globalSearch")}
          onOpenSettings={() => onNavigateScreen?.("settingsProfile")}
          onNavigateScreen={onNavigateScreen}
        />

        <Box sx={mockExamsStyles.scrollBody}>
          <Box sx={mockExamsStyles.runnerContentWrap}>
          {submitError && (
            <Alert severity="error" sx={{ ...mockExamsStyles.stateCard, gridColumn: "1 / -1" }}>
              {submitError}
            </Alert>
          )}

          <Paper
            variant="outlined"
            sx={mockExamsStyles.runnerQuestionCard}
          >
            <Box sx={mockExamsStyles.runnerQuestionMetaRow}>
              <Chip
                label={exam.name}
                size="small"
                sx={mockExamsStyles.runnerQuestionChip}
              />
              <Typography sx={mockExamsStyles.runnerQuestionMetaText}>
                {currentIndex + 1} / {questions.length} · {currentQuestion.subject.name}
              </Typography>
            </Box>

            <Typography variant="h3" sx={mockExamsStyles.runnerQuestionTitle}>
              {currentQuestion.questionText}
            </Typography>

            <Box sx={mockExamsStyles.runnerOptionsGrid}>
              {currentQuestion.options.map((option, optionIndex) => {
                const selected = answers[currentQuestion.id] === optionIndex;

                return (
                  <Paper
                    key={`${currentQuestion.id}-${optionIndex}`}
                    variant="outlined"
                    onClick={() => handleSelectOption(optionIndex)}
                    sx={runnerOptionCardSx(selected)}
                  >
                    <Box sx={mockExamsStyles.runnerOptionRow}>
                      <Box sx={runnerOptionBadgeSx(selected)}>
                        {String.fromCharCode(65 + optionIndex)}
                      </Box>
                      <Typography sx={mockExamsStyles.runnerOptionText}>{option}</Typography>
                    </Box>
                  </Paper>
                );
              })}
            </Box>

            <Box sx={mockExamsStyles.runnerActionsRow}>
              <Button
                variant="outlined"
                onClick={() => setCurrentIndex((index) => Math.max(index - 1, 0))}
                disabled={currentIndex === 0}
              >
                Prev
              </Button>

              <Button
                variant={flags[currentQuestion.id] ? "contained" : "outlined"}
                color="secondary"
                onClick={handleToggleFlag}
              >
                Flag
              </Button>

              <Button
                variant="contained"
                onClick={() => setCurrentIndex((index) => Math.min(index + 1, questions.length - 1))}
                disabled={currentIndex === questions.length - 1}
              >
                Next
              </Button>
            </Box>
          </Paper>

          <Box sx={mockExamsStyles.runnerSidebar}>
            <Paper variant="outlined" sx={mockExamsStyles.runnerPanel}>
              <Typography sx={mockExamsStyles.runnerTimerLabel}>
                Time remaining
              </Typography>
              <Typography sx={runnerTimerValueSx(remainingSeconds)}>
                {formatRemainingTime(remainingSeconds)}
              </Typography>
            </Paper>

            <Paper variant="outlined" sx={mockExamsStyles.runnerPanelCompact}>
              <Typography sx={mockExamsStyles.runnerPaletteTitle}>
                Question palette
              </Typography>

              <Box sx={mockExamsStyles.runnerPaletteGrid}>
                {questions.map((question, index) => {
                  const isCurrent = index === currentIndex;
                  const isFlagged = !!flags[question.id];
                  const isAnswered = answers[question.id] !== undefined;

                  return (
                    <Box
                      key={question.id}
                      onClick={() => setCurrentIndex(index)}
                      sx={runnerPaletteItemSx(isCurrent, isFlagged, isAnswered)}
                    >
                      {question.order}
                    </Box>
                  );
                })}
              </Box>
            </Paper>

            <Button
              variant="contained"
              color="success"
              sx={mockExamsStyles.runnerSubmitButton}
              onClick={() => void handleSubmit.current()}
              disabled={isSubmitting}
            >
              {isSubmitting ? "Submitting…" : `Submit (${answeredCount}/${questions.length})`}
            </Button>
          </Box>
          </Box>
        </Box>
      </Box>
  );
}

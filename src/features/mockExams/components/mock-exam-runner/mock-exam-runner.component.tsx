import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Box, Button, Chip, Paper, Typography } from "@mui/material";
import type { AppScreen } from "../../../../app/screens";
import type {
  EstimatedRank,
  MockExam,
  MockExamRunResult,
  RunnerQuestion,
  SubjectBreakdownItem,
} from "../../mock-exams.types";
import { PracticeTopbar } from "../../../practice";
import {
  mockExamsStyles,
  runnerOptionBadgeSx,
  runnerOptionCardSx,
  runnerPaletteItemSx,
  runnerTimerValueSx,
} from "../../mock-exams.styles";

type MockExamRunnerPageProps = {
  exam: MockExam;
  onNavigateScreen?: (screen: AppScreen) => void;
  onSubmitRun?: (result: MockExamRunResult) => void;
};

function buildRunnerQuestions(exam: MockExam): RunnerQuestion[] {
  const subjectPool = [
    `${exam.body} Basics`,
    `${exam.body} Current Affairs`,
    `${exam.body} Analytical`,
    `${exam.body} Applied Knowledge`,
  ];

  return Array.from({ length: exam.questionsCount }, (_, index) => ({
    id: index + 1,
    subject: subjectPool[index % subjectPool.length],
    text: `${exam.title} · Question ${index + 1}`,
    options: [
      "Option A",
      "Option B",
      "Option C",
      "Option D",
    ],
    correctIndex: index % 4,
  }));
}

function formatRemainingTime(totalSeconds: number): string {
  const safeSeconds = Math.max(totalSeconds, 0);
  const minutes = Math.floor(safeSeconds / 60);
  const seconds = safeSeconds % 60;
  return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
}

function resolveEstimatedRank(percentCorrect: number): EstimatedRank {
  if (percentCorrect >= 85) {
    return "Top 6%";
  }

  if (percentCorrect >= 70) {
    return "Top 18%";
  }

  if (percentCorrect >= 50) {
    return "Top 35%";
  }

  return "Top 60%";
}

function buildSubjectBreakdown(
  reviewRows: MockExamRunResult["review"],
): SubjectBreakdownItem[] {
  const aggregate = new Map<string, { attempted: number; correct: number }>();

  for (const row of reviewRows) {
    const current = aggregate.get(row.subject) ?? { attempted: 0, correct: 0 };
    if (row.yourAnswerIndex !== null) {
      current.attempted += 1;
    }
    if (row.isCorrect) {
      current.correct += 1;
    }
    aggregate.set(row.subject, current);
  }

  return Array.from(aggregate.entries()).map(([subject, values]) => ({
    subject,
    attempted: values.attempted,
    correct: values.correct,
    accuracy: values.attempted > 0 ? Math.round((values.correct / values.attempted) * 100) : 0,
  }));
}

export function MockExamRunnerPage(props: MockExamRunnerPageProps) {
  const { exam, onNavigateScreen, onSubmitRun } = props;
  const questions = useMemo(() => buildRunnerQuestions(exam), [exam]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [flags, setFlags] = useState<Record<number, boolean>>({});
  const [remainingSeconds, setRemainingSeconds] = useState(exam.durationMinutes * 60);
  const submitTriggeredRef = useRef(false);
  const totalSeconds = exam.durationMinutes * 60;

  const currentQuestion = questions[currentIndex];
  const answeredCount = Object.keys(answers).length;

  function handleSelectOption(optionIndex: number): void {
    setAnswers((previous) => ({
      ...previous,
      [currentQuestion.id]: optionIndex,
    }));
  }

  function handleToggleFlag(): void {
    setFlags((previous) => ({
      ...previous,
      [currentQuestion.id]: !previous[currentQuestion.id],
    }));
  }

  function handleSubmit(): void {
    if (submitTriggeredRef.current) {
      return;
    }

    submitTriggeredRef.current = true;
    onSubmitRun?.(buildRunResult());
  }

  const buildRunResult = useCallback((): MockExamRunResult => {
    const review = questions.map((question) => {
      const yourAnswerIndex = answers[question.id] ?? null;
      const isCorrect = yourAnswerIndex !== null && yourAnswerIndex === question.correctIndex;

      return {
        questionId: question.id,
        subject: question.subject,
        yourAnswerIndex,
        correctIndex: question.correctIndex,
        isCorrect,
      };
    });

    const attempted = review.filter((row) => row.yourAnswerIndex !== null).length;
    const correct = review.filter((row) => row.isCorrect).length;
    const wrong = Math.max(attempted - correct, 0);
    const skipped = questions.length - attempted;
    const score = correct - wrong * exam.negativeMarking;
    const maxScore = questions.length;
    const accuracy = attempted > 0 ? Math.round((correct / attempted) * 100) : 0;
    const passMark = Math.round(maxScore * 0.4);
    const isQualified = score >= passMark;
    const percentCorrect = Math.round((correct / questions.length) * 100);
    const subjectBreakdown = buildSubjectBreakdown(review);
    const timeTakenSeconds = Math.max(totalSeconds - remainingSeconds, 0);

    return {
      exam,
      answers,
      flags,
      totalQuestions: questions.length,
      attempted,
      correct,
      wrong,
      skipped,
      score,
      maxScore,
      accuracy,
      estimatedRank: resolveEstimatedRank(percentCorrect),
      passMark,
      isQualified,
      timeTakenSeconds,
      breakdown: {
        correct,
        wrong,
        skipped,
      },
      subjectBreakdown,
      review,
    };
  }, [answers, exam, flags, questions, remainingSeconds, totalSeconds]);

  useEffect(() => {
    if (submitTriggeredRef.current) {
      return;
    }

    const intervalId = window.setInterval(() => {
      setRemainingSeconds((previous) => {
        if (previous <= 1) {
          if (!submitTriggeredRef.current) {
            submitTriggeredRef.current = true;
            onSubmitRun?.(buildRunResult());
          }
          window.clearInterval(intervalId);
          return 0;
        }

        return previous - 1;
      });
    }, 1000);

    return () => {
      window.clearInterval(intervalId);
    };
  }, [buildRunResult, onSubmitRun]);

  return (
    <Box sx={mockExamsStyles.shell}>
        <PracticeTopbar
          currentScreen="mockExamRunner"
          title="Mock Exam Runner"
          subtitle={`${exam.title} · ${exam.questionsCount} questions`}
          searchPlaceholder="Search Question"
          onOpenGlobalSearch={() => onNavigateScreen?.("globalSearch")}
          onOpenSettings={() => onNavigateScreen?.("settingsProfile")}
          onNavigateScreen={onNavigateScreen}
        />

        <Box sx={mockExamsStyles.scrollBody}>
          <Box sx={mockExamsStyles.runnerContentWrap}>
          <Paper
            variant="outlined"
            sx={mockExamsStyles.runnerQuestionCard}
          >
            <Box sx={mockExamsStyles.runnerQuestionMetaRow}>
              <Chip
                label={exam.body}
                size="small"
                sx={mockExamsStyles.runnerQuestionChip}
              />
              <Typography sx={mockExamsStyles.runnerQuestionMetaText}>
                {currentIndex + 1} / {questions.length} · {currentQuestion.subject}
              </Typography>
            </Box>

            <Typography variant="h3" sx={mockExamsStyles.runnerQuestionTitle}>
              {currentQuestion.text}
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
                onClick={() =>
                  setCurrentIndex((index) => Math.min(index + 1, questions.length - 1))
                }
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
                      {question.id}
                    </Box>
                  );
                })}
              </Box>
            </Paper>

            <Button
              variant="contained"
              color="success"
              sx={mockExamsStyles.runnerSubmitButton}
              onClick={handleSubmit}
            >
              Submit ({answeredCount}/{questions.length})
            </Button>
          </Box>
          </Box>
        </Box>
      </Box>
  );
}
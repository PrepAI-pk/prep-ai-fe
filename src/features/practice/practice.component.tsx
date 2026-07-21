import { Alert, Box } from "@mui/material";
import { useMemo, useState } from "react";
import type { AppScreen } from "../../app/screens";
import { toApiErrorMessage } from "../../api/error";
import { useStarQuestionMutation, useUnstarQuestionMutation } from "../../api/bookmarks/bookmarks.endpoints";
import type { PracticeNextQuestion } from "../../api/practice/practice.types";
import { useGetSubjectsQuery } from "../../api/subjects/subjects.endpoints";
import { PracticeSkeleton } from "../../components/loading/practice-skeleton";
import { PracticeFilters } from "./components/practice-filters/practice-filters.component";
import { PracticeQuestionCard } from "./components/practice-question-card/practice-question-card.component";
import { PracticeTopbar } from "./components/practice-topbar/practice-topbar.component";
import { useAnswerCheck } from "./hooks/use-answer-check.hook";
import { usePracticeNext } from "./hooks/use-practice-next.hook";
import { usePracticeUi } from "./hooks/use-practice-ui.hook";
import { getUsageProgressValue } from "./practice-ui.utils";

type PracticePageProps = {
  onNavigateScreen?: (screen: AppScreen) => void;
};

// Keyed by question id in the parent, so a new question means a fresh mount —
// interaction/selection/bookmark-override state resets "for free" instead of
// needing an effect to sync it back to idle on every id change.
type PracticeQuestionRunnerProps = {
  question: PracticeNextQuestion;
  questionCounter: string;
  onNextQuestion: () => void;
};

function PracticeQuestionRunner(props: PracticeQuestionRunnerProps) {
  const { question, questionCounter, onNextQuestion } = props;

  const [interactionState, setInteractionState] = useState<"idle" | "checking" | "revealed">(
    "idle",
  );
  const [selectedOptionIndex, setSelectedOptionIndex] = useState<number | null>(null);
  const [bookmarkOverride, setBookmarkOverride] = useState<boolean | null>(null);

  const checkMutation = useAnswerCheck();
  const [starQuestion] = useStarQuestionMutation();
  const [unstarQuestion] = useUnstarQuestionMutation();

  const isBookmarked = bookmarkOverride ?? question.isBookmarked;

  async function handleToggleBookmark(): Promise<void> {
    const next = !isBookmarked;
    setBookmarkOverride(next);

    try {
      await (next ? starQuestion(question.id) : unstarQuestion(question.id)).unwrap();
    } catch {
      setBookmarkOverride(!next);
    }
  }

  async function handleSelectOption(optionIndex: number): Promise<void> {
    if (interactionState !== "idle") {
      return;
    }

    setSelectedOptionIndex(optionIndex);
    setInteractionState("checking");

    try {
      await checkMutation.mutate({ questionId: question.id, selectedIndex: optionIndex }).unwrap();
      setInteractionState("revealed");
    } catch {
      setInteractionState("idle");
      setSelectedOptionIndex(null);
    }
  }

  function handleAskFollowUp(): void {
    // Reserved for AI Tutor navigation in the next vertical slice.
  }

  return (
    <>
      {checkMutation.isError && (
        <Alert severity="error" sx={{ borderRadius: 2.5, mb: 2 }}>
          Could not check your answer. {toApiErrorMessage(checkMutation.error, "Please try again.")}
        </Alert>
      )}

      <PracticeQuestionCard
        question={question}
        questionCounter={questionCounter}
        interactionState={interactionState}
        selectedOptionIndex={selectedOptionIndex}
        isLocked={interactionState !== "idle"}
        checkResult={checkMutation.data}
        isBookmarked={isBookmarked}
        onToggleBookmark={handleToggleBookmark}
        onSelectOption={handleSelectOption}
        onAskFollowUp={handleAskFollowUp}
        onSkipQuestion={onNextQuestion}
        onNextQuestion={onNextQuestion}
      />
    </>
  );
}

export function PracticePage(props: PracticePageProps = {}) {
  const { onNavigateScreen } = props;

  const practiceUi = usePracticeUi();
  const subjectsQuery = useGetSubjectsQuery();

  const subjectNames = useMemo(
    () => ["All", ...(subjectsQuery.data ?? []).map((subject) => subject.name).sort()],
    [subjectsQuery.data],
  );
  const selectedSubject = subjectNames.includes(practiceUi.selectedSubject)
    ? practiceUi.selectedSubject
    : "All";
  const selectedSubjectId =
    selectedSubject === "All"
      ? undefined
      : subjectsQuery.data?.find((subject) => subject.name === selectedSubject)?.id;

  const nextQuery = usePracticeNext({ subjectId: selectedSubjectId });
  const currentQuestion = nextQuery.data ?? null;

  function handleSubjectChange(subject: string): void {
    practiceUi.setSelectedSubject(subject);
  }

  function handleNextQuestion(): void {
    void nextQuery.refetch();
  }

  const isLoading = nextQuery.isLoading || subjectsQuery.isLoading;
  const progressValue = currentQuestion
    ? getUsageProgressValue(currentQuestion.usage.answeredToday, currentQuestion.usage.dailyLimit)
    : 0;
  const usageLabel = currentQuestion
    ? currentQuestion.usage.dailyLimit === null
      ? "Unlimited today"
      : `${currentQuestion.usage.answeredToday} / ${currentQuestion.usage.dailyLimit} today`
    : "";

  return (
    <Box sx={{ flex: 1, minWidth: 0, display: "flex", flexDirection: "column", height: "100vh", overflow: "hidden" }}>
        <PracticeTopbar
          currentScreen="practice"
          onOpenGlobalSearch={() => onNavigateScreen?.("globalSearch")}
          onOpenSettings={() => onNavigateScreen?.("settingsProfile")}
          onNavigateScreen={onNavigateScreen}
        />

        <Box sx={{ flex: 1, overflow: "auto", px: { xs: 2, md: 3.75 }, pt: { xs: 2.5, md: 3.75 }, pb: { xs: 5, md: 7.5 } }}>
          <Box sx={{ maxWidth: 820, mx: "auto" }}>
          <PracticeFilters
            subjects={subjectNames}
            selectedSubject={selectedSubject}
            progressValue={progressValue}
            onSelectSubject={handleSubjectChange}
          />

          {isLoading && <PracticeSkeleton />}

          {nextQuery.isError && (
            <Alert severity="error" sx={{ borderRadius: 2.5 }}>
              Could not load a question from backend. {" "}
              {toApiErrorMessage(nextQuery.error, "Please try again.")}
            </Alert>
          )}

          {!isLoading && !nextQuery.isError && !currentQuestion && (
            <Alert severity="info" sx={{ borderRadius: 2.5 }}>
              No questions found for this subject yet.
            </Alert>
          )}

          {!isLoading && !nextQuery.isError && currentQuestion && (
            <PracticeQuestionRunner
              key={currentQuestion.id}
              question={currentQuestion}
              questionCounter={usageLabel}
              onNextQuestion={handleNextQuestion}
            />
          )}
          </Box>
        </Box>
      </Box>
  );
}

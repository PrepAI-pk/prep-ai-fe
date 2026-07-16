import { Alert, Box } from "@mui/material";
import { useMemo, useState } from "react";
import type { AppScreen } from "../../app/screens";
import { toApiErrorMessage } from "../../api/error";
import { PracticeSkeleton } from "../../components/loading/practice-skeleton";
import { PracticeFilters } from "./components/practice-filters/practice-filters.component";
import { PracticeQuestionCard } from "./components/practice-question-card/practice-question-card.component";
import { PracticeTopbar } from "./components/practice-topbar/practice-topbar.component";
import { useAnswerCheck } from "./hooks/use-answer-check.hook";
import { usePracticeQuestions } from "./hooks/use-practice-questions.hook";
import { usePracticeUi } from "./hooks/use-practice-ui.hook";
import {
  deriveSubjects,
  filterQuestionsBySubject,
  getProgressValue,
} from "./practice-ui.utils";

type PracticePageProps = {
  onNavigateScreen?: (screen: AppScreen) => void;
};

export function PracticePage(props: PracticePageProps = {}) {
  const { onNavigateScreen } = props;

  const [interactionState, setInteractionState] = useState<
    "idle" | "checking" | "revealed"
  >("idle");
  const [selectedOptionIndex, setSelectedOptionIndex] = useState<number | null>(
    null,
  );

  const questionsQuery = usePracticeQuestions();
  const checkMutation = useAnswerCheck();
  const practiceUi = usePracticeUi();

  const questions = useMemo(() => questionsQuery.data ?? [], [questionsQuery.data]);

  const subjects = useMemo(() => deriveSubjects(questions), [questions]);
  const selectedSubject = subjects.includes(practiceUi.selectedSubject)
    ? practiceUi.selectedSubject
    : "All";

  const filteredQuestions = useMemo(
    () => filterQuestionsBySubject(questions, selectedSubject),
    [questions, selectedSubject],
  );
  const currentIndex =
    filteredQuestions.length === 0
      ? 0
      : Math.min(practiceUi.currentIndex, filteredQuestions.length - 1);

  const currentQuestion = filteredQuestions[currentIndex] ?? null;
  const progressValue = getProgressValue(currentIndex, filteredQuestions.length);

  function handleSubjectChange(subject: string): void {
    practiceUi.setSelectedSubject(subject);
    setInteractionState("idle");
    setSelectedOptionIndex(null);
    checkMutation.reset();
  }

  function handleNextQuestion(): void {
    if (filteredQuestions.length === 0) {
      return;
    }

    const nextIndex = (currentIndex + 1) % filteredQuestions.length;
    practiceUi.setCurrentIndex(nextIndex);
    setInteractionState("idle");
    setSelectedOptionIndex(null);
    checkMutation.reset();
  }

  function handleSkipQuestion(): void {
    handleNextQuestion();
  }

  function handleAskFollowUp(): void {
    // Reserved for AI Tutor navigation in the next vertical slice.
  }

  async function handleSelectOption(optionIndex: number): Promise<void> {
    if (!currentQuestion || interactionState !== "idle") {
      return;
    }

    setSelectedOptionIndex(optionIndex);
    setInteractionState("checking");

    try {
      await checkMutation.mutate({
        questionId: currentQuestion.id,
        selectedIndex: optionIndex,
      }).unwrap();
      setInteractionState("revealed");
    } catch {
      setInteractionState("idle");
      setSelectedOptionIndex(null);
    }
  }

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
            subjects={subjects}
            selectedSubject={selectedSubject}
            progressValue={progressValue}
            onSelectSubject={handleSubjectChange}
          />

          {questionsQuery.isLoading && <PracticeSkeleton />}

          {questionsQuery.isError && (
            <Alert severity="error" sx={{ borderRadius: 2.5 }}>
              Could not load questions from backend. {" "}
              {toApiErrorMessage(questionsQuery.error, "Please try again.")}
            </Alert>
          )}

          {checkMutation.isError && (
            <Alert severity="error" sx={{ borderRadius: 2.5, mb: 2 }}>
              Could not check your answer. {" "}
              {toApiErrorMessage(checkMutation.error, "Please try again.")}
            </Alert>
          )}

          {!questionsQuery.isLoading && !questionsQuery.isError && !currentQuestion && (
            <Alert severity="info" sx={{ borderRadius: 2.5 }}>
              No questions found for this subject yet.
            </Alert>
          )}

          {!questionsQuery.isLoading && !questionsQuery.isError && currentQuestion && (
            <PracticeQuestionCard
              question={currentQuestion}
              questionCounter={`${currentIndex + 1} / ${filteredQuestions.length}`}
              interactionState={interactionState}
              selectedOptionIndex={selectedOptionIndex}
              isLocked={interactionState !== "idle"}
              checkResult={checkMutation.data}
              bookmarks={practiceUi.bookmarks}
              onToggleBookmark={practiceUi.toggleBookmark}
              onSelectOption={handleSelectOption}
              onAskFollowUp={handleAskFollowUp}
              onSkipQuestion={handleSkipQuestion}
              onNextQuestion={handleNextQuestion}
            />
          )}
          </Box>
        </Box>
      </Box>
  );
}

import { useMemo, useState } from "react";
import {
  Alert,
  Box,
  Button,
  Chip,
  LinearProgress,
  Paper,
  Tab,
  Tabs,
  Typography,
} from "@mui/material";
import type { AppScreen } from "../../../../app/screens";
import { useGetPracticeQuestionByIdQuery } from "../../../../api/practice/practice.endpoints";
import {
  PracticeTopbar,
  usePracticeQuestions,
  usePracticeUi,
} from "../../../practice";
import type {
  BookmarkTab,
  WeakArea,
} from "../../bookmarks.types";
import {
  clamp,
  difficultyWeight,
  getStatus,
  normalizeSubjectName,
} from "../../bookmarks.utils";
import {
  bookmarksWeakAreasStyles,
  weakAreaStatusChipSx,
} from "./bookmarks-weak-areas.styles";

type BookmarksWeakAreasPageProps = {
  onNavigateScreen?: (screen: AppScreen) => void;
};

type BookmarkCardProps = {
  questionId: number;
  onUnsave: (questionId: number) => void;
  onPracticeSimilar: (subject: string) => void;
};

function BookmarkQuestionCard(props: BookmarkCardProps) {
  const { questionId, onUnsave, onPracticeSimilar } = props;
  const questionQuery = useGetPracticeQuestionByIdQuery(questionId);

  if (questionQuery.isLoading) {
    return (
      <Paper variant="outlined" sx={bookmarksWeakAreasStyles.loadingCard}>
        <Typography sx={bookmarksWeakAreasStyles.loadingText}>
          Loading bookmarked question...
        </Typography>
      </Paper>
    );
  }

  if (questionQuery.isError || !questionQuery.data) {
    return (
      <Paper variant="outlined" sx={bookmarksWeakAreasStyles.loadingCard}>
        <Typography sx={bookmarksWeakAreasStyles.loadingText}>
          This bookmarked question is unavailable right now.
        </Typography>
      </Paper>
    );
  }

  const detail = questionQuery.data;
  const correctIndex = typeof detail.correctIndex === "number" ? detail.correctIndex : 0;

  return (
    <Paper variant="outlined" sx={bookmarksWeakAreasStyles.loadingCard}>
      <Box sx={bookmarksWeakAreasStyles.cardHeader}>
        <Chip
          size="small"
          label={detail.subject}
          sx={bookmarksWeakAreasStyles.subjectChip}
        />
        <Chip size="small" label={detail.difficulty} />
      </Box>

      <Typography sx={bookmarksWeakAreasStyles.questionTitle}>{detail.questionText}</Typography>
      <Typography sx={bookmarksWeakAreasStyles.answer}>
        Answer: {String.fromCharCode(65 + correctIndex)}. {detail.options[correctIndex]}
      </Typography>

      <Paper variant="outlined" sx={bookmarksWeakAreasStyles.explanationCard}>
        <Typography sx={bookmarksWeakAreasStyles.explanationKicker}>
          Explanation
        </Typography>
        <Typography sx={bookmarksWeakAreasStyles.explanationText}>{detail.explanation}</Typography>
      </Paper>

      <Box sx={bookmarksWeakAreasStyles.actionsRow}>
        <Button size="small" variant="outlined" onClick={() => onUnsave(questionId)}>
          Un-save
        </Button>
        <Button
          size="small"
          variant="contained"
          onClick={() => onPracticeSimilar(normalizeSubjectName(detail.subject))}
        >
          Practice similar
        </Button>
      </Box>
    </Paper>
  );
}

export function BookmarksWeakAreasPage(props: BookmarksWeakAreasPageProps = {}) {
  const { onNavigateScreen } = props;
  const [activeTab, setActiveTab] = useState<BookmarkTab>("bookmarks");

  const questionsQuery = usePracticeQuestions();
  const practiceUi = usePracticeUi();

  const questions = useMemo(() => questionsQuery.data ?? [], [questionsQuery.data]);

  const bookmarkedQuestionIds = useMemo(
    () =>
      Object.entries(practiceUi.bookmarks)
        .filter(([, isBookmarked]) => isBookmarked)
        .map(([id]) => Number(id))
        .sort((a, b) => b - a),
    [practiceUi.bookmarks],
  );

  const weakAreas = useMemo<WeakArea[]>(() => {
    if (questions.length === 0) {
      return [];
    }

    const bySubject = new Map<
      string,
      {
        total: number;
        weightedDifficulty: number;
        bookmarked: number;
      }
    >();

    for (const question of questions) {
      const subject = normalizeSubjectName(question.subject);
      const current = bySubject.get(subject) ?? { total: 0, weightedDifficulty: 0, bookmarked: 0 };
      const isBookmarked = !!practiceUi.bookmarks[question.id];

      bySubject.set(subject, {
        total: current.total + 1,
        weightedDifficulty: current.weightedDifficulty + difficultyWeight(question.difficulty),
        bookmarked: current.bookmarked + (isBookmarked ? 1 : 0),
      });
    }

    return Array.from(bySubject.entries())
      .map(([subject, bucket]) => {
        const averageDifficulty = bucket.weightedDifficulty / bucket.total;
        const bookmarkRatio = bucket.bookmarked / bucket.total;

        const accuracy = clamp(Math.round(88 - averageDifficulty * 14 - bookmarkRatio * 24), 28, 92);
        const solvedCount = bucket.total * 3 + bucket.bookmarked * 2;

        return {
          subject,
          accuracy,
          solvedCount,
          status: getStatus(accuracy),
        };
      })
      .sort((a, b) => a.accuracy - b.accuracy);
  }, [practiceUi.bookmarks, questions]);

  const weakestSubjects = useMemo(
    () => weakAreas.slice(0, 2).map((item) => item.subject),
    [weakAreas],
  );

  function handlePracticeSimilar(subject: string): void {
    practiceUi.setSelectedSubject(subject);
    onNavigateScreen?.("practice");
  }

  function handleReviseSubject(): void {
    onNavigateScreen?.("notesRevision");
  }

  return (
    <Box sx={bookmarksWeakAreasStyles.shell}>
        <PracticeTopbar
          currentScreen="bookmarksWeakAreas"
          title="Bookmarks & Weak Areas"
          subtitle="Saved MCQs and subject-wise improvement priorities"
          searchPlaceholder="Search Bookmarks"
          onOpenGlobalSearch={() => onNavigateScreen?.("globalSearch")}
          onOpenSettings={() => onNavigateScreen?.("settingsProfile")}
          onNavigateScreen={onNavigateScreen}
        />

        <Box sx={bookmarksWeakAreasStyles.scrollBody}>
          <Box sx={bookmarksWeakAreasStyles.contentWrap}>
          <Paper variant="outlined" sx={bookmarksWeakAreasStyles.tabsCard}>
            <Tabs
              value={activeTab}
              onChange={(_, nextValue: BookmarkTab) => setActiveTab(nextValue)}
              sx={bookmarksWeakAreasStyles.tabs}
            >
              <Tab value="bookmarks" label="Bookmarks" />
              <Tab value="weakAreas" label="Weak Areas" />
            </Tabs>
          </Paper>

          {activeTab === "bookmarks" && (
            <Box sx={bookmarksWeakAreasStyles.sectionWrap}>
              <Typography sx={bookmarksWeakAreasStyles.countLabel}>
                {bookmarkedQuestionIds.length} saved MCQs
              </Typography>

              {bookmarkedQuestionIds.length === 0 && (
                <Alert severity="info" sx={bookmarksWeakAreasStyles.infoAlert}>
                  No bookmarks yet. Save questions from the MCQ Library to build your revision stack.
                </Alert>
              )}

              <Box sx={bookmarksWeakAreasStyles.bookmarksGrid}>
                {bookmarkedQuestionIds.map((questionId) => (
                  <BookmarkQuestionCard
                    key={questionId}
                    questionId={questionId}
                    onUnsave={practiceUi.toggleBookmark}
                    onPracticeSimilar={handlePracticeSimilar}
                  />
                ))}
              </Box>
            </Box>
          )}

          {activeTab === "weakAreas" && (
            <Box sx={bookmarksWeakAreasStyles.weakAreasGrid}>
              <Paper variant="outlined" sx={bookmarksWeakAreasStyles.insightCard}>
                <Typography sx={bookmarksWeakAreasStyles.insightKicker}>
                  AI Insight
                </Typography>
                <Typography sx={bookmarksWeakAreasStyles.insightText}>
                  Focus this week on {weakestSubjects[0] ?? "your least-accurate subject"}
                  {weakestSubjects[1] ? ` and ${weakestSubjects[1]}` : ""}. Run 10 timed MCQs, then
                  revise the linked concepts for faster score recovery.
                </Typography>
              </Paper>

              {weakAreas.length === 0 && (
                <Alert severity="info" sx={bookmarksWeakAreasStyles.infoAlert}>
                  Weak-area insights will appear once questions are available.
                </Alert>
              )}

              {weakAreas.map((area) => {
                return (
                  <Paper key={area.subject} variant="outlined" sx={bookmarksWeakAreasStyles.weakAreaCard}>
                    <Box sx={bookmarksWeakAreasStyles.weakAreaHeader}>
                      <Box>
                        <Typography sx={bookmarksWeakAreasStyles.weakAreaTitle}>{area.subject}</Typography>
                        <Typography sx={bookmarksWeakAreasStyles.weakAreaSolved}>
                          Solved: {area.solvedCount}
                        </Typography>
                      </Box>
                      <Chip
                        label={area.status}
                        size="small"
                        sx={weakAreaStatusChipSx(area.status)}
                      />
                    </Box>

                    <LinearProgress
                      variant="determinate"
                      value={area.accuracy}
                      sx={bookmarksWeakAreasStyles.accuracyBar}
                    />
                    <Typography sx={bookmarksWeakAreasStyles.accuracyLabel}>
                      Accuracy: {area.accuracy}%
                    </Typography>

                    <Box sx={bookmarksWeakAreasStyles.actionsRow}>
                      <Button
                        size="small"
                        variant="contained"
                        onClick={() => handlePracticeSimilar(area.subject)}
                      >
                        Practice
                      </Button>
                      <Button size="small" variant="outlined" onClick={handleReviseSubject}>
                        Revise
                      </Button>
                    </Box>
                  </Paper>
                );
              })}
            </Box>
          )}
          </Box>
        </Box>
      </Box>
  );
}
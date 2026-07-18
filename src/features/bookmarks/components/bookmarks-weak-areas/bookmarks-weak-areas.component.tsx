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
import { useUnstarQuestionMutation, useGetBookmarksQuery } from "../../../../api/bookmarks/bookmarks.endpoints";
import { useGetWeakAreasQuery } from "../../../../api/stats/stats.endpoints";
import type { LibraryQuestion } from "../../../../api/questions/questions.types";
import { toApiErrorMessage } from "../../../../api/error";
import { PracticeTopbar, usePracticeUi } from "../../../practice";
import type { BookmarkTab } from "../../bookmarks.types";
import {
  bookmarksWeakAreasStyles,
  WEAK_AREA_STATUS_LABELS,
  weakAreaStatusChipSx,
} from "./bookmarks-weak-areas.styles";

type BookmarksWeakAreasPageProps = {
  onNavigateScreen?: (screen: AppScreen) => void;
};

type BookmarkCardProps = {
  question: LibraryQuestion;
  onUnsave: (questionId: string) => void;
  onPracticeSimilar: (subject: string) => void;
};

function BookmarkQuestionCard(props: BookmarkCardProps) {
  const { question, onUnsave, onPracticeSimilar } = props;

  return (
    <Paper variant="outlined" sx={bookmarksWeakAreasStyles.loadingCard}>
      <Box sx={bookmarksWeakAreasStyles.cardHeader}>
        <Chip
          size="small"
          label={question.subject.name}
          sx={bookmarksWeakAreasStyles.subjectChip}
        />
        <Chip size="small" label={question.difficulty} />
      </Box>

      <Typography sx={bookmarksWeakAreasStyles.questionTitle}>{question.questionText}</Typography>
      <Typography sx={bookmarksWeakAreasStyles.answer}>
        Answer: {String.fromCharCode(65 + question.correctIndex)}. {question.options[question.correctIndex]}
      </Typography>

      <Paper variant="outlined" sx={bookmarksWeakAreasStyles.explanationCard}>
        <Typography sx={bookmarksWeakAreasStyles.explanationKicker}>
          Explanation
        </Typography>
        <Typography sx={bookmarksWeakAreasStyles.explanationText}>{question.explanation}</Typography>
      </Paper>

      <Box sx={bookmarksWeakAreasStyles.actionsRow}>
        <Button size="small" variant="outlined" onClick={() => onUnsave(question.id)}>
          Un-save
        </Button>
        <Button
          size="small"
          variant="contained"
          onClick={() => onPracticeSimilar(question.subject.name)}
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

  const bookmarksQuery = useGetBookmarksQuery();
  const [unstarQuestion] = useUnstarQuestionMutation();
  const practiceUi = usePracticeUi();

  const weakAreasQuery = useGetWeakAreasQuery();

  const bookmarks = useMemo(() => bookmarksQuery.data?.items ?? [], [bookmarksQuery.data]);
  const weakAreas = useMemo(() => weakAreasQuery.data?.subjects ?? [], [weakAreasQuery.data]);

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
                {bookmarks.length} saved MCQs
              </Typography>

              {bookmarksQuery.isError && (
                <Alert severity="error" sx={bookmarksWeakAreasStyles.infoAlert}>
                  Could not load bookmarks. {toApiErrorMessage(bookmarksQuery.error, "Please try again.")}
                </Alert>
              )}

              {!bookmarksQuery.isLoading && !bookmarksQuery.isError && bookmarks.length === 0 && (
                <Alert severity="info" sx={bookmarksWeakAreasStyles.infoAlert}>
                  No bookmarks yet. Save questions from the MCQ Library to build your revision stack.
                </Alert>
              )}

              <Box sx={bookmarksWeakAreasStyles.bookmarksGrid}>
                {bookmarks.map((question) => (
                  <BookmarkQuestionCard
                    key={question.id}
                    question={question}
                    onUnsave={(questionId) => void unstarQuestion(questionId)}
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
                  {weakAreasQuery.data?.insight ?? "Insights will appear once you've answered a few questions."}
                </Typography>
              </Paper>

              {weakAreasQuery.isError && (
                <Alert severity="error" sx={bookmarksWeakAreasStyles.infoAlert}>
                  Could not load weak areas. {toApiErrorMessage(weakAreasQuery.error, "Please try again.")}
                </Alert>
              )}

              {!weakAreasQuery.isLoading && !weakAreasQuery.isError && weakAreas.length === 0 && (
                <Alert severity="info" sx={bookmarksWeakAreasStyles.infoAlert}>
                  Weak-area insights will appear once you've answered a few practice questions.
                </Alert>
              )}

              {weakAreas.map((area) => {
                return (
                  <Paper key={area.subjectId} variant="outlined" sx={bookmarksWeakAreasStyles.weakAreaCard}>
                    <Box sx={bookmarksWeakAreasStyles.weakAreaHeader}>
                      <Box>
                        <Typography sx={bookmarksWeakAreasStyles.weakAreaTitle}>{area.name}</Typography>
                        <Typography sx={bookmarksWeakAreasStyles.weakAreaSolved}>
                          Solved: {area.solved}
                        </Typography>
                      </Box>
                      <Chip
                        label={WEAK_AREA_STATUS_LABELS[area.status]}
                        size="small"
                        sx={weakAreaStatusChipSx(area.status)}
                      />
                    </Box>

                    <LinearProgress
                      variant="determinate"
                      value={area.acc}
                      sx={bookmarksWeakAreasStyles.accuracyBar}
                    />
                    <Typography sx={bookmarksWeakAreasStyles.accuracyLabel}>
                      Accuracy: {area.acc}%
                    </Typography>

                    <Box sx={bookmarksWeakAreasStyles.actionsRow}>
                      <Button
                        size="small"
                        variant="contained"
                        onClick={() => handlePracticeSimilar(area.name)}
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

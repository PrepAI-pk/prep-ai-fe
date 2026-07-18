import { useMemo, useState } from "react";
import BookmarkBorderRounded from "@mui/icons-material/BookmarkBorderRounded";
import BookmarkRounded from "@mui/icons-material/BookmarkRounded";
import SearchRounded from "@mui/icons-material/SearchRounded";
import {
  Alert,
  Box,
  Chip,
  IconButton,
  Paper,
  TextField,
  Typography,
} from "@mui/material";
import type { AppScreen } from "../../../../app/screens";
import { toApiErrorMessage } from "../../../../api/error";
import { useStarQuestionMutation, useUnstarQuestionMutation } from "../../../../api/bookmarks/bookmarks.endpoints";
import { useGetRelatedQuestionsQuery, useListQuestionsQuery } from "../../../../api/questions/questions.endpoints";
import { useGetSubjectsQuery } from "../../../../api/subjects/subjects.endpoints";
import { PracticeTopbar } from "../../../practice";
import { LIBRARY_ALL_FILTER, normalize } from "../../mcq-library.constants";
import {
  answerOptionSx,
  filterChipSx,
  mcqLibraryStyles,
  smallSubjectChipSx,
} from "./mcq-library.styles";

type McqLibraryPageProps = {
  onNavigateScreen?: (screen: AppScreen) => void;
};

// The full library is 14 seed questions today — one generous page stands in
// for real infinite-scroll pagination until the Library needs more than that.
const LIBRARY_PAGE_LIMIT = 100;

export function McqLibraryPage(props: McqLibraryPageProps = {}) {
  const { onNavigateScreen } = props;

  const [searchValue, setSearchValue] = useState("");
  const [selectedSubject, setSelectedSubject] = useState(LIBRARY_ALL_FILTER);
  const [selectedExam, setSelectedExam] = useState(LIBRARY_ALL_FILTER);
  const [selectedLevel, setSelectedLevel] = useState(LIBRARY_ALL_FILTER);
  const [bookmarkedOnly, setBookmarkedOnly] = useState(false);
  const [expandedQuestionId, setExpandedQuestionId] = useState<string | null>(null);

  const subjectsQuery = useGetSubjectsQuery();
  const subjectId =
    selectedSubject === LIBRARY_ALL_FILTER
      ? undefined
      : subjectsQuery.data?.find((subject) => subject.name === selectedSubject)?.id;

  const questionsQuery = useListQuestionsQuery({
    limit: LIBRARY_PAGE_LIMIT,
    subjectId,
    difficulty: selectedLevel === LIBRARY_ALL_FILTER ? undefined : (selectedLevel as "EASY" | "MEDIUM" | "HARD"),
    bookmarked: bookmarkedOnly ? true : undefined,
  });

  const [starQuestion] = useStarQuestionMutation();
  const [unstarQuestion] = useUnstarQuestionMutation();

  const questions = useMemo(() => questionsQuery.data?.items ?? [], [questionsQuery.data]);
  const subjects = useMemo(
    () => [LIBRARY_ALL_FILTER, ...(subjectsQuery.data ?? []).map((subject) => subject.name).sort()],
    [subjectsQuery.data],
  );
  const exams = useMemo(() => {
    const unique = Array.from(
      new Set(questions.map((question) => question.exam?.body).filter((body): body is string => Boolean(body))),
    );
    return [LIBRARY_ALL_FILTER, ...unique.sort()];
  }, [questions]);
  const levels = [LIBRARY_ALL_FILTER, "EASY", "MEDIUM", "HARD"];

  // Subject/level/bookmarked are server-side filters (see the query above);
  // exam-body and free-text search stay client-side over the fetched page —
  // /questions only filters by a specific examId, not a body like "FPSC".
  const filteredQuestions = useMemo(() => {
    const q = normalize(searchValue);

    return questions.filter((question) => {
      const examOk = selectedExam === LIBRARY_ALL_FILTER || question.exam?.body === selectedExam;
      const searchOk =
        q.length === 0 ||
        normalize(question.questionText).includes(q) ||
        normalize(question.subject.name).includes(q) ||
        question.options.some((option) => normalize(option).includes(q));

      return examOk && searchOk;
    });
  }, [questions, searchValue, selectedExam]);

  const expandedQuestion = useMemo(
    () => filteredQuestions.find((question) => question.id === expandedQuestionId) ?? null,
    [expandedQuestionId, filteredQuestions],
  );

  const relatedQuery = useGetRelatedQuestionsQuery(
    { questionId: expandedQuestionId ?? "" },
    { skip: expandedQuestionId === null },
  );
  const relatedQuestions = relatedQuery.data?.items ?? [];

  function toggleExpanded(questionId: string): void {
    setExpandedQuestionId((previous) => (previous === questionId ? null : questionId));
  }

  function handleToggleBookmark(questionId: string, isBookmarked: boolean): void {
    void (isBookmarked ? unstarQuestion(questionId) : starQuestion(questionId));
  }

  return (
    <Box sx={mcqLibraryStyles.shell}>
        <PracticeTopbar
          currentScreen="mcqLibrary"
          title="MCQ Library"
          subtitle="Search, filter, and review explanation-rich questions"
          searchPlaceholder="Search Library"
          onOpenGlobalSearch={() => onNavigateScreen?.("globalSearch")}
          onOpenSettings={() => onNavigateScreen?.("settingsProfile")}
          onNavigateScreen={onNavigateScreen}
        />

        <Box sx={mcqLibraryStyles.scrollBody}>
          <Box sx={mcqLibraryStyles.wrap}>
          <Paper
            variant="outlined"
            sx={mcqLibraryStyles.searchBar}
          >
            <SearchRounded sx={{ color: "text.disabled", fontSize: 18 }} />
            <TextField
              fullWidth
              placeholder="Search the question bank - topic, subject or keyword..."
              value={searchValue}
              onChange={(event) => setSearchValue(event.target.value)}
              variant="standard"
              sx={mcqLibraryStyles.searchInput}
            />
          </Paper>

          <Box sx={mcqLibraryStyles.filterRows}>
            <Box sx={mcqLibraryStyles.filterRow}>
              <Typography sx={mcqLibraryStyles.filterLabel}>
                Subject
              </Typography>
              {subjects.map((subject) => (
                <Chip
                  key={subject}
                  label={subject}
                  onClick={() => setSelectedSubject(subject)}
                  sx={filterChipSx(selectedSubject === subject)}
                />
              ))}
            </Box>

            <Box sx={mcqLibraryStyles.filterRow}>
              <Typography sx={mcqLibraryStyles.filterLabel}>
                Exam
              </Typography>
              {exams.map((exam) => (
                <Chip
                  key={exam}
                  label={exam}
                  onClick={() => setSelectedExam(exam)}
                  sx={filterChipSx(selectedExam === exam)}
                />
              ))}
            </Box>

            <Box sx={mcqLibraryStyles.filterRowWithEndAction}>
              <Typography sx={mcqLibraryStyles.filterLabel}>
                Level
              </Typography>
              {levels.map((level) => (
                <Chip
                  key={level}
                  label={level}
                  onClick={() => setSelectedLevel(level)}
                  sx={filterChipSx(selectedLevel === level)}
                />
              ))}

              <Box sx={{ flex: 1 }} />
              <Chip
                label={bookmarkedOnly ? "Bookmarked only: On" : "Bookmarked only"}
                onClick={() => setBookmarkedOnly((previous) => !previous)}
                sx={filterChipSx(bookmarkedOnly)}
              />
            </Box>
          </Box>

          <Typography sx={{ color: "text.secondary", fontSize: 13, mb: 1.4 }}>
            {filteredQuestions.length} results
          </Typography>

          {questionsQuery.isError && (
            <Alert severity="error" sx={{ borderRadius: 2, mb: 2 }}>
              Could not load questions. {toApiErrorMessage(questionsQuery.error, "Please try again.")}
            </Alert>
          )}

          {!questionsQuery.isLoading && !questionsQuery.isError && filteredQuestions.length === 0 && (
            <Alert severity="info" sx={{ borderRadius: 2 }}>
              No questions match the current filters.
            </Alert>
          )}

          <Box sx={mcqLibraryStyles.questionsGrid}>
            {filteredQuestions.map((question) => {
              const isExpanded = expandedQuestionId === question.id;

              return (
                <Paper
                  key={question.id}
                  variant="outlined"
                  sx={mcqLibraryStyles.questionCard}
                >
                  <Box sx={mcqLibraryStyles.questionHead}>
                    <Box>
                      <Box sx={mcqLibraryStyles.questionMeta}>
                        <Chip
                          size="small"
                          label={question.subject.name}
                          sx={smallSubjectChipSx}
                        />
                        <Chip size="small" label={question.difficulty} />
                      </Box>

                      <Typography sx={{ fontWeight: 600, lineHeight: 1.45 }}>{question.questionText}</Typography>
                    </Box>

                    <Box sx={{ display: "flex", alignItems: "start", gap: 0.2 }}>
                      <IconButton
                        onClick={() => handleToggleBookmark(question.id, question.isBookmarked)}
                        size="small"
                      >
                        {question.isBookmarked ? <BookmarkRounded /> : <BookmarkBorderRounded />}
                      </IconButton>
                    </Box>
                  </Box>

                  <ButtonRow isExpanded={isExpanded} onToggle={() => toggleExpanded(question.id)} />

                  {isExpanded && (
                    <Box sx={mcqLibraryStyles.detailsGrid}>
                      {expandedQuestion?.options.map((option, index) => (
                        <Paper
                          key={`${question.id}-${index}`}
                          variant="outlined"
                          sx={answerOptionSx(expandedQuestion.correctIndex === index)}
                        >
                          <Typography sx={{ fontSize: 14 }}>
                            {String.fromCharCode(65 + index)}. {option}
                          </Typography>
                        </Paper>
                      ))}

                      <Paper
                        variant="outlined"
                        sx={mcqLibraryStyles.explanationCard}
                      >
                        <Typography sx={mcqLibraryStyles.explanationLabel}>
                          AI Explanation
                        </Typography>
                        <Typography sx={{ mt: 0.8, lineHeight: 1.7 }}>
                          {expandedQuestion?.explanation ?? "Loading explanation..."}
                        </Typography>
                      </Paper>

                      {relatedQuestions.length > 0 && (
                        <Box>
                          <Typography sx={{ fontSize: 12, color: "text.secondary", mb: 0.5 }}>
                            Related questions
                          </Typography>
                          <Box sx={mcqLibraryStyles.relatedChips}>
                            {relatedQuestions.map((related) => (
                              <Chip
                                key={related.id}
                                label={related.questionText.slice(0, 65)}
                                onClick={() => setExpandedQuestionId(related.id)}
                                sx={{ borderRadius: "20px", backgroundColor: "background.default" }}
                              />
                            ))}
                          </Box>
                        </Box>
                      )}
                    </Box>
                  )}
                </Paper>
              );
            })}
          </Box>
          </Box>
        </Box>
      </Box>
  );
}

function ButtonRow(props: { isExpanded: boolean; onToggle: () => void }) {
  const { isExpanded, onToggle } = props;

  return (
    <Box sx={{ mt: 0.8 }}>
      <Chip
        label={isExpanded ? "Hide details" : "Expand question"}
        onClick={onToggle}
        sx={{ borderRadius: "20px", backgroundColor: "background.default", color: "text.secondary" }}
      />
    </Box>
  );
}

import { useEffect, useMemo, useRef, useState } from "react";
import {
  Alert,
  Box,
  Paper,
  Typography,
} from "@mui/material";
import type { AppScreen } from "../../../../app/screens";
import { toApiErrorMessage } from "../../../../api/error";
import { useListQuestionsQuery } from "../../../../api/questions/questions.endpoints";
import { useGetSubjectsQuery } from "../../../../api/subjects/subjects.endpoints";
import { useMockExams } from "../../../mockExams";
import {
  PracticeTopbar,
  usePracticeUi,
} from "../../../practice";
import {
  normalize,
  NOTE_SEARCH_FIXTURES,
  resultTone,
  SEARCH_SUGGESTION_TERMS,
  SEARCH_TYPE_CHIPS,
  type SearchResult,
  type SearchType,
} from "../../global-search.constants";
import {
  globalSearchStyles,
  resultIconToneSx,
  resultKindSx,
  suggestionChipSx,
  typeChipSx,
} from "./global-search.styles";

type GlobalSearchPageProps = {
  onNavigateScreen?: (screen: AppScreen) => void;
};

export function GlobalSearchPage(props: GlobalSearchPageProps = {}) {
  const { onNavigateScreen } = props;
  const inputRef = useRef<HTMLInputElement | null>(null);

  const [query, setQuery] = useState("");
  const [activeType, setActiveType] = useState<SearchType>("all");

  const questionsQuery = useListQuestionsQuery({ limit: 100 });
  const subjectsQuery = useGetSubjectsQuery();
  const examsQuery = useMockExams();
  const practiceUi = usePracticeUi();

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const allResults = useMemo<SearchResult[]>(() => {
    const questions = questionsQuery.data?.items ?? [];
    const exams = examsQuery.data ?? [];

    const mcqResults: SearchResult[] = questions.map((question) => ({
      id: `mcq-${question.id}`,
      type: "mcq",
      kind: "MCQ",
      title: question.questionText,
      meta: `${question.subject.name} · Practice topic · ${question.difficulty}`,
      icon: "?",
      tone: "p",
      targetScreen: "mcqLibrary",
      subject: question.subject.name,
    }));

    const noteResults: SearchResult[] = NOTE_SEARCH_FIXTURES.map((note) => ({
      id: note.id,
      type: "notes",
      kind: "Note",
      title: note.title,
      meta: `${note.subject} · ${note.mins} min read`,
      icon: "▤",
      tone: "a",
      targetScreen: "notesRevision",
      subject: note.subject,
    }));

    const examResults: SearchResult[] = exams.map((exam) => ({
      id: `exam-${exam.id}`,
      type: "exams",
      kind: "Exam",
      title: exam.name,
      meta: `${exam.body} · ${exam.questionCount} Q · ${exam.durationMins} min`,
      icon: "◷",
      tone: "g",
      targetScreen: "mockExams",
    }));

    const subjectResults: SearchResult[] = (subjectsQuery.data ?? []).map((subject) => ({
      id: `subject-${subject.id}`,
      type: "subjects",
      kind: "Subject",
      title: subject.name,
      meta: "Practice available",
      icon: "◆",
      tone: "p",
      targetScreen: "practice",
      subject: subject.name,
    }));

    return [...mcqResults, ...noteResults, ...examResults, ...subjectResults];
  }, [examsQuery.data, questionsQuery.data, subjectsQuery.data]);

  const counts = useMemo(() => {
    const byType: Record<SearchType, number> = {
      all: allResults.length,
      mcq: 0,
      notes: 0,
      exams: 0,
      subjects: 0,
    };

    for (const result of allResults) {
      byType[result.type] += 1;
    }

    return byType;
  }, [allResults]);

  const filteredResults = useMemo(() => {
    const q = normalize(query);

    return allResults.filter((result) => {
      const typeOk = activeType === "all" || result.type === activeType;
      const queryOk =
        q.length === 0 ||
        normalize(result.title).includes(q) ||
        normalize(result.meta).includes(q);

      return typeOk && queryOk;
    });
  }, [activeType, allResults, query]);

  const hasQuery = query.trim().length > 0;

  function handleNavigate(result: SearchResult): void {
    if (result.type === "subjects" && result.subject) {
      practiceUi.setSelectedSubject(result.subject);
    }

    onNavigateScreen?.(result.targetScreen);
  }

  return (
    <Box sx={globalSearchStyles.shell}>
        <PracticeTopbar
          currentScreen="globalSearch"
          title="Global Search"
          subtitle="Find MCQs, notes, exams, and subjects in one place"
          searchPlaceholder="Search Across PrepAI"
          onOpenSettings={() => onNavigateScreen?.("settingsProfile")}
          onNavigateScreen={onNavigateScreen}
        />

        <Box sx={globalSearchStyles.scrollBody}>
          <Box sx={globalSearchStyles.wrap}>
          <Paper
            variant="outlined"
            sx={globalSearchStyles.searchInputShell}
          >
            <Box sx={globalSearchStyles.searchIcon} />
            <Box
              component="input"
              ref={inputRef}
              placeholder="Search across MCQs, notes, exams and subjects..."
              value={query}
              onChange={(event) => {
                setQuery(event.target.value);
                setActiveType("all");
              }}
              sx={globalSearchStyles.searchInput}
            />
          </Paper>

          {hasQuery && (
            <Box sx={globalSearchStyles.chipsRow}>
              {SEARCH_TYPE_CHIPS.map((chip) => (
                <Box
                  key={chip.key}
                  onClick={() => setActiveType(chip.key)}
                  sx={typeChipSx(activeType === chip.key)}
                >
                  {chip.label} ({counts[chip.key]})
                </Box>
              ))}
            </Box>
          )}

          {questionsQuery.isError && (
            <Alert severity="error" sx={{ borderRadius: 2, mt: 1.1 }}>
              Could not load MCQ search data. {toApiErrorMessage(questionsQuery.error, "Please try again.")}
            </Alert>
          )}

          {examsQuery.isError && (
            <Alert severity="error" sx={{ borderRadius: 2, mt: 1.1 }}>
              Could not load exam search data. {toApiErrorMessage(examsQuery.error, "Please try again.")}
            </Alert>
          )}

          {!hasQuery && (
            <Box sx={globalSearchStyles.suggestionsWrap}>
              <Typography sx={globalSearchStyles.suggestionHeading}>
                Try searching for
              </Typography>
              <Box sx={globalSearchStyles.suggestionsRow}>
                {SEARCH_SUGGESTION_TERMS.map((item) => (
                  <Box
                    key={item}
                    onClick={() => {
                      setQuery(item);
                      setActiveType("all");
                    }}
                    sx={suggestionChipSx}
                  >
                    {item}
                  </Box>
                ))}
              </Box>
            </Box>
          )}

          {hasQuery && filteredResults.length === 0 && (
            <Box sx={globalSearchStyles.noResults}>
              <Typography sx={{ fontFamily: '"Source Serif 4", serif', fontSize: 18, color: "text.secondary", mb: "6px" }}>
                No results found
              </Typography>
              <Typography sx={{ fontSize: 13.5, color: "text.disabled" }}>
                Try a different keyword, or ask the AI Tutor instead.
              </Typography>
            </Box>
          )}

          {hasQuery && filteredResults.length > 0 && (
            <Box sx={globalSearchStyles.resultsList}>
              {filteredResults.map((row) => {
                const tone = resultTone(row.tone);

                return (
                  <Box
                    key={row.id}
                    onClick={() => handleNavigate(row)}
                    sx={globalSearchStyles.resultCard}
                  >
                    <Box sx={resultIconToneSx(tone)}>
                      {row.icon}
                    </Box>
                    <Box sx={{ flex: 1, minWidth: 0 }}>
                      <Typography sx={resultKindSx(tone.fg)}>
                        {row.kind}
                      </Typography>
                      <Typography sx={{ fontFamily: '"Source Serif 4", serif', fontSize: 15, fontWeight: 600, lineHeight: 1.35, mt: "2px" }}>{row.title}</Typography>
                      <Typography sx={{ fontSize: 12.5, color: "text.secondary", mt: "3px" }}>{row.meta}</Typography>
                    </Box>
                    <Box sx={{ color: "text.disabled", fontSize: 16 }}>→</Box>
                  </Box>
                );
              })}
            </Box>
          )}
          </Box>
        </Box>
      </Box>
  );
}

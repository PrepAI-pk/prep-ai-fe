import { useEffect, useMemo, useRef, useState } from "react";
import {
  Alert,
  Box,
  Paper,
  Typography,
} from "@mui/material";
import type { AppScreen } from "../../../../app/screens";
import { toApiErrorMessage } from "../../../../api/error";
import { useGetSearchSuggestionsQuery, useSearchQuery } from "../../../../api/search/search.endpoints";
import type { SearchResultType } from "../../../../api/search/search.types";
import { PracticeTopbar, usePracticeUi } from "../../../practice";
import {
  resultTone,
  SEARCH_SUGGESTION_TERMS,
  SEARCH_TYPE_CHIPS,
  type SearchResult,
  type SearchTone,
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

const TYPE_META: Record<SearchResultType, { type: Exclude<SearchType, "all">; kind: SearchResult["kind"]; icon: string; tone: SearchTone }> = {
  MCQ: { type: "mcq", kind: "MCQ", icon: "?", tone: "p" },
  NOTE: { type: "notes", kind: "Note", icon: "▤", tone: "a" },
  EXAM: { type: "exams", kind: "Exam", icon: "◷", tone: "g" },
  SUBJECT: { type: "subjects", kind: "Subject", icon: "◆", tone: "p" },
};

const SEARCH_DEBOUNCE_MS = 300;

export function GlobalSearchPage(props: GlobalSearchPageProps = {}) {
  const { onNavigateScreen } = props;
  const inputRef = useRef<HTMLInputElement | null>(null);

  const [query, setQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [activeType, setActiveType] = useState<SearchType>("all");
  const practiceUi = usePracticeUi();

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  useEffect(() => {
    const handle = window.setTimeout(() => setDebouncedQuery(query.trim()), SEARCH_DEBOUNCE_MS);
    return () => window.clearTimeout(handle);
  }, [query]);

  const hasQuery = debouncedQuery.length > 0;

  const searchQuery = useSearchQuery({ q: debouncedQuery }, { skip: !hasQuery });
  const suggestionsQuery = useGetSearchSuggestionsQuery(undefined, { skip: hasQuery });

  const allResults = useMemo<SearchResult[]>(() => {
    const groups = searchQuery.data?.groups ?? [];
    return groups.flatMap((group) => {
      const meta = TYPE_META[group.type];
      return group.items.map((item) => ({
        id: `${meta.type}-${item.id}`,
        type: meta.type,
        kind: meta.kind,
        title: item.title,
        meta: item.meta,
        icon: meta.icon,
        tone: meta.tone,
        targetScreen: item.targetRef as AppScreen,
        subject: item.subjectName,
      }));
    });
  }, [searchQuery.data]);

  const counts = useMemo(() => {
    const c = searchQuery.data?.counts;
    return {
      all: c ? c.MCQ + c.NOTE + c.EXAM + c.SUBJECT : 0,
      mcq: c?.MCQ ?? 0,
      notes: c?.NOTE ?? 0,
      exams: c?.EXAM ?? 0,
      subjects: c?.SUBJECT ?? 0,
    };
  }, [searchQuery.data]);

  const filteredResults = useMemo(
    () => (activeType === "all" ? allResults : allResults.filter((result) => result.type === activeType)),
    [activeType, allResults],
  );

  const suggestions = suggestionsQuery.data?.items ?? SEARCH_SUGGESTION_TERMS;

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

          {searchQuery.isError && (
            <Alert severity="error" sx={{ borderRadius: 2, mt: 1.1 }}>
              Could not load search results. {toApiErrorMessage(searchQuery.error, "Please try again.")}
            </Alert>
          )}

          {!hasQuery && (
            <Box sx={globalSearchStyles.suggestionsWrap}>
              <Typography sx={globalSearchStyles.suggestionHeading}>
                Try searching for
              </Typography>
              <Box sx={globalSearchStyles.suggestionsRow}>
                {suggestions.map((item) => (
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

          {hasQuery && !searchQuery.isFetching && filteredResults.length === 0 && (
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

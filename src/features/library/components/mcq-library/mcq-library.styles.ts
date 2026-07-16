export const mcqLibraryStyles = {
  root: {
    minHeight: "100vh",
    backgroundColor: "background.default",
    display: "flex",
  },
  shell: {
    flex: 1,
    minWidth: 0,
    display: "flex",
    flexDirection: "column",
    height: "100vh",
    overflow: "hidden",
  },
  scrollBody: {
    flex: 1,
    overflow: "auto",
    px: { xs: 2, md: 3.75 },
    pt: { xs: 2.5, md: 3.75 },
    pb: { xs: 5, md: 7.5 },
  },
  wrap: { maxWidth: 880, mx: "auto" },
  searchBar: {
    mb: 2,
    borderRadius: "12px",
    borderColor: "divider",
    px: 2,
    py: 0.8,
    display: "flex",
    alignItems: "center",
    gap: 1,
    backgroundColor: "background.paper",
  },
  searchInput: {
    "& .MuiInput-root:before": { display: "none" },
    "& .MuiInput-root:after": { display: "none" },
    "& .MuiInputBase-input": {
      fontSize: 14.5,
    },
  },
  filterRows: { mb: 1.8, display: "grid", gap: 1.1 },
  filterRow: { display: "flex", gap: 0.8, flexWrap: "wrap" },
  filterRowWithEndAction: { display: "flex", gap: 0.8, flexWrap: "wrap", alignItems: "center" },
  filterLabel: {
    fontFamily: '"Space Mono", monospace',
    fontSize: 11,
    color: "text.disabled",
    letterSpacing: ".1em",
    textTransform: "uppercase",
    alignSelf: "center",
  },
  questionsGrid: { display: "grid", gap: 1.2 },
  questionCard: { borderRadius: "16px", borderColor: "divider", p: 2 },
  questionHead: { display: "flex", justifyContent: "space-between", gap: 1 },
  questionMeta: { display: "flex", gap: 0.7, alignItems: "center", mb: 0.6 },
  detailsGrid: { mt: 1.2, display: "grid", gap: 1 },
  optionCard: { p: 1.1, borderRadius: 1.6 },
  explanationCard: {
    p: 1.45,
    borderRadius: 1.8,
    borderLeft: "3px solid",
    borderLeftColor: "secondary.main",
    bgcolor: "background.default",
  },
  explanationLabel: {
    fontFamily: '"Space Mono", monospace',
    letterSpacing: ".1em",
    textTransform: "uppercase",
    color: "secondary.main",
    fontSize: 11,
    fontWeight: 700,
  },
  relatedChips: { display: "flex", gap: 0.7, flexWrap: "wrap" },
};

export const filterChipSx = (active: boolean) => ({
  borderRadius: "20px",
  border: "1px solid",
  borderColor: active ? "primary.main" : "divider",
  backgroundColor: active ? "primary.main" : "background.paper",
  color: active ? "#ffffff" : "text.secondary",
  fontWeight: active ? 600 : 500,
});

export const smallSubjectChipSx = {
  borderRadius: 2,
  bgcolor: "primary.light",
  color: "primary.main",
  fontSize: 11,
  fontFamily: '"Space Mono", monospace',
};

export const answerOptionSx = (isCorrect: boolean) => ({
  ...mcqLibraryStyles.optionCard,
  borderColor: isCorrect ? "success.main" : "divider",
  backgroundColor: isCorrect ? "success.light" : "background.paper",
});

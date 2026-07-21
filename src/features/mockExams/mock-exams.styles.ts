export const mockExamsStyles = {
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
  contentWrap: {
    maxWidth: 980,
    mx: "auto",
  },
  pageTitle: {
    fontSize: 24,
    mb: 1,
  },
  pageSubtitle: {
    color: "text.secondary",
    mb: 2.5,
  },
  stateCard: {
    p: 2,
    borderRadius: 2,
    borderColor: "divider",
    mb: 2,
  },
  stateText: {
    color: "text.secondary",
  },
  examsGrid: {
    display: "grid",
    gridTemplateColumns: { xs: "1fr", md: "repeat(2, minmax(270px, 1fr))" },
    gap: 2,
  },
  examCard: {
    p: 2.2,
    borderRadius: "16px",
    borderColor: "divider",
    boxShadow: "0 1px 2px rgba(24,24,32,.05)",
  },
  examMetaRow: {
    display: "flex",
    alignItems: "center",
    gap: 0.8,
    mb: 1.2,
  },
  examBodyChip: {
    borderRadius: 2,
    bgcolor: "primary.light",
    color: "primary.main",
    fontFamily: '"Space Mono", monospace',
    fontSize: 11,
  },
  examLevel: {
    fontSize: 12,
    color: "text.secondary",
    fontWeight: 600,
  },
  examTitle: {
    fontSize: 18,
    mb: 1.1,
  },
  examDetails: {
    color: "text.secondary",
    fontSize: 13,
    mb: 1.8,
  },
  startButton: {
    borderRadius: 2.2,
  },
  runnerContentWrap: {
    maxWidth: 1080,
    mx: "auto",
    display: "grid",
    gridTemplateColumns: { xs: "1fr", md: "1fr 260px" },
    gap: 2,
  },
  runnerQuestionCard: {
    p: { xs: 2.5, md: "28px 30px" },
    borderRadius: "20px",
    borderColor: "divider",
  },
  runnerQuestionMetaRow: { display: "flex", alignItems: "center", gap: 0.8, mb: 1.4 },
  runnerQuestionChip: {
    borderRadius: 2,
    bgcolor: "primary.light",
    color: "primary.main",
    fontFamily: '"Space Mono", monospace',
    fontSize: 11,
  },
  runnerQuestionMetaText: { color: "text.secondary", fontSize: 12, fontFamily: '"Space Mono", monospace' },
  runnerQuestionTitle: { fontSize: 24, mb: 2 },
  runnerOptionsGrid: { display: "grid", gap: 1.2 },
  runnerOptionRow: { display: "flex", alignItems: "center", gap: 1.2 },
  runnerOptionText: { flex: 1 },
  runnerActionsRow: { mt: 2.2, display: "flex", justifyContent: "space-between", gap: 1 },
  runnerSidebar: { display: "grid", gap: 1.4, alignSelf: "start" },
  runnerPanel: { p: 1.8, borderRadius: "16px", borderColor: "divider" },
  runnerPanelCompact: { p: 1.6, borderRadius: "16px", borderColor: "divider" },
  runnerTimerLabel: {
    fontFamily: '"Space Mono", monospace',
    fontSize: 11,
    letterSpacing: ".12em",
    textTransform: "uppercase",
    color: "text.secondary",
  },
  runnerPaletteTitle: { mb: 1, fontSize: 13, fontWeight: 600 },
  runnerPaletteGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(6, minmax(0, 1fr))",
    gap: 0.7,
  },
  runnerSubmitButton: { borderRadius: 2.2, py: 1.1 },
  resultContentWrap: { maxWidth: 1040, mx: "auto", display: "grid", gap: 2 },
  resultHeroCard: {
    p: { xs: 2.4, md: 3 },
    borderRadius: "18px",
    backgroundColor: "primary.main",
    color: "primary.contrastText",
    display: "grid",
    gridTemplateColumns: { xs: "1fr", md: "1fr 160px" },
    gap: 2,
    alignItems: "center",
  },
  resultHeroKicker: { fontSize: 12, letterSpacing: ".12em", textTransform: "uppercase", opacity: 0.9 },
  resultHeroScore: { fontSize: { xs: 42, md: 60 }, lineHeight: 1, mt: 0.4 },
  resultHeroBadge: {
    mt: 1.2,
    display: "inline-flex",
    px: 1.2,
    py: 0.4,
    borderRadius: 99,
    bgcolor: "rgba(255,255,255,0.18)",
    fontSize: 12,
    fontWeight: 700,
  },
  resultDonut: {
    width: 130,
    height: 130,
    borderRadius: "50%",
    display: "grid",
    placeItems: "center",
    mx: { xs: "auto", md: 0 },
  },
  resultDonutInner: { width: 92, height: 92, borderRadius: "50%", bgcolor: "primary.main", display: "grid", placeItems: "center" },
  resultDonutText: { fontFamily: '"Space Mono", monospace', fontSize: 16, fontWeight: 700 },
  resultStatsGrid: { display: "grid", gridTemplateColumns: { xs: "repeat(2,1fr)", md: "repeat(4,1fr)" }, gap: 1.2 },
  resultStatCard: { p: 1.6, borderRadius: "16px", borderColor: "divider" },
  resultStatLabel: { color: "text.secondary", fontSize: 12 },
  resultStatValue: { fontSize: 22, mt: 0.4 },
  resultHint: { color: "text.secondary", fontSize: 12, mt: -0.8 },
  resultPanel: { p: 1.8, borderRadius: "16px", borderColor: "divider" },
  resultPanelTitle: { fontWeight: 700, mb: 1 },
  resultBreakdownTrack: { height: 14, borderRadius: 99, overflow: "hidden", display: "flex", bgcolor: "background.default" },
  resultBreakdownLegend: { mt: 1, display: "flex", gap: 1.5, flexWrap: "wrap", color: "text.secondary", fontSize: 12 },
  resultLegendGood: { color: "success.main" },
  resultLegendBad: { color: "error.main" },
  resultSubjectsGrid: { display: "grid", gap: 1 },
  resultSubjectHeader: { display: "flex", justifyContent: "space-between", mb: 0.3, fontSize: 12, color: "text.secondary" },
  resultSubjectText: { fontSize: 12 },
  resultSubjectTrack: { height: 7, borderRadius: 99, bgcolor: "background.default", overflow: "hidden" },
  resultInsight: {
    p: 1.5,
    borderRadius: "16px",
    borderLeft: "3px solid",
    borderLeftColor: "secondary.main",
    bgcolor: "background.default",
  },
  resultInsightKicker: {
    fontFamily: '"Space Mono", monospace',
    letterSpacing: ".1em",
    textTransform: "uppercase",
    color: "secondary.main",
    fontSize: 11,
    fontWeight: 700,
  },
  resultInsightText: { mt: 0.7, fontSize: 13.5, color: "text.secondary", lineHeight: 1.65 },
  resultReviewGrid: { display: "grid", gap: 0.8, maxHeight: 320, overflow: "auto" },
  resultReviewRow: { display: "grid", gridTemplateColumns: "70px 1fr 180px", gap: 1, p: 1, borderRadius: 1.4, bgcolor: "background.default" },
  resultReviewId: { fontSize: 12, color: "text.secondary" },
  resultReviewSubject: { fontSize: 12 },
  resultActions: { display: "flex", gap: 1, flexWrap: "wrap" },
  recentAttemptsTitle: { fontWeight: 700, mt: 3, mb: 1.2 },
  recentAttemptRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    p: 1.4,
    borderRadius: "12px",
    borderColor: "divider",
    mb: 1,
  },
  recentAttemptExam: { fontSize: 13.5, fontWeight: 600 },
  recentAttemptMeta: { fontSize: 12, color: "text.secondary", mt: 0.2 },
} as const;

export const recentAttemptScoreSx = (pct: number) => ({
  fontFamily: '"Space Mono", monospace',
  fontSize: 14,
  fontWeight: 700,
  color: pct >= 70 ? "success.main" : pct < 40 ? "error.main" : "text.primary",
});

export const runnerOptionCardSx = (selected: boolean) => ({
  p: "15px 17px",
  borderRadius: "13px",
  borderWidth: "1.5px",
  borderColor: selected ? "primary.main" : "divider",
  backgroundColor: selected ? "primary.light" : "background.paper",
  cursor: "pointer",
});

export const runnerOptionBadgeSx = (selected: boolean) => ({
  width: 28,
  height: 28,
  borderRadius: 1.1,
  display: "grid",
  placeItems: "center",
  border: "1px solid",
  borderColor: selected ? "primary.main" : "divider",
  color: selected ? "primary.main" : "text.primary",
  fontSize: 12,
  fontWeight: 700,
});

export const runnerTimerValueSx = (remainingSeconds: number) => ({
  mt: 0.8,
  fontFamily: '"Space Mono", monospace',
  fontSize: 32,
  fontWeight: 700,
  color: remainingSeconds <= 300 ? "error.main" : "text.primary",
});

export const runnerPaletteItemSx = (
  isCurrent: boolean,
  isFlagged: boolean,
  isAnswered: boolean,
) => ({
  height: 30,
  borderRadius: 1.1,
  display: "grid",
  placeItems: "center",
  cursor: "pointer",
  fontSize: 12,
  fontWeight: 700,
  border: isCurrent ? "2px solid #1b1e26" : "1px solid #d7dde8",
  backgroundColor: isAnswered ? "primary.main" : isFlagged ? "secondary.light" : "#ffffff",
  color: isAnswered ? "#ffffff" : isFlagged ? "secondary.main" : "text.secondary",
});

export const resultDonutSx = (degrees: number) => ({
  ...mockExamsStyles.resultDonut,
  background: `conic-gradient(#ffffff 0deg ${degrees}deg, rgba(255,255,255,0.2) ${degrees}deg 360deg)`,
});

export const resultBreakdownSegmentSx = (widthPercent: number, color: string) => ({
  width: `${widthPercent}%`,
  bgcolor: color,
});

export const resultSubjectFillSx = (accuracy: number) => ({
  width: `${accuracy}%`,
  height: "100%",
  bgcolor: accuracy >= 80 ? "success.main" : accuracy < 60 ? "error.main" : "primary.main",
});

export const resultReviewStatusSx = (isCorrect: boolean, isSkipped: boolean) => ({
  fontSize: 12,
  color: isCorrect ? "success.main" : isSkipped ? "text.secondary" : "error.main",
  textAlign: "right",
});
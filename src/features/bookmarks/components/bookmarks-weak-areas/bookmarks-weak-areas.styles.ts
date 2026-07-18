import type { WeakAreaStatus } from "../../../../api/stats/stats.types";

export const bookmarksWeakAreasStyles = {
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
    maxWidth: 860,
    mx: "auto",
  },
  tabsCard: {
    borderRadius: "16px",
    borderColor: "divider",
    p: 0.8,
  },
  tabs: {
    "& .MuiTabs-indicator": { display: "none" },
    "& .MuiTab-root": {
      textTransform: "none",
      borderRadius: 999,
      minHeight: 36,
      px: 1.4,
      fontWeight: 600,
    },
    "& .Mui-selected": {
      bgcolor: "primary.light",
      color: "primary.main",
    },
  },
  sectionWrap: {
    mt: 1.5,
  },
  countLabel: {
    color: "text.secondary",
    fontSize: 13,
    mb: 1.1,
  },
  infoAlert: { borderRadius: 2 },
  bookmarksGrid: { display: "grid", gap: 1.1 },
  weakAreasGrid: { mt: 1.5, display: "grid", gap: 1.1 },
  insightCard: {
    p: 1.4,
    borderRadius: "16px",
    borderLeft: "3px solid",
    borderLeftColor: "secondary.main",
    bgcolor: "background.default",
  },
  insightKicker: {
    fontFamily: '"Space Mono", monospace',
    letterSpacing: ".1em",
    textTransform: "uppercase",
    color: "secondary.main",
    fontSize: 11,
    fontWeight: 700,
  },
  insightText: { mt: 0.7, fontSize: 13, lineHeight: 1.65 },
  weakAreaCard: { p: 1.2, borderRadius: 2 },
  weakAreaHeader: { display: "flex", justifyContent: "space-between", gap: 1, mb: 0.8 },
  weakAreaTitle: { fontWeight: 600 },
  weakAreaSolved: { color: "text.secondary", fontSize: 12, mt: 0.2 },
  accuracyBar: { height: 8, borderRadius: 99, backgroundColor: "background.default" },
  accuracyLabel: { mt: 0.6, fontSize: 12, color: "text.secondary" },
  actionsRow: { display: "flex", gap: 0.8, mt: 0.9, flexWrap: "wrap" },
  loadingCard: { p: 1.4, borderRadius: 2, borderColor: "divider" },
  loadingText: { color: "text.secondary", fontSize: 13 },
  cardHeader: { display: "flex", justifyContent: "space-between", gap: 1, mb: 0.7 },
  subjectChip: {
    borderRadius: 3,
    bgcolor: "primary.light",
    color: "primary.main",
    fontSize: 11,
    fontFamily: '"Space Mono", monospace',
  },
  questionTitle: { fontWeight: 600, mb: 0.8 },
  answer: { fontSize: 13, color: "success.main", mb: 0.8 },
  explanationCard: {
    p: 1,
    borderRadius: 1.7,
    borderLeft: "3px solid",
    borderLeftColor: "secondary.main",
    bgcolor: "background.default",
  },
  explanationKicker: {
    fontFamily: '"Space Mono", monospace',
    letterSpacing: ".1em",
    textTransform: "uppercase",
    color: "secondary.main",
    fontSize: 11,
    fontWeight: 700,
    mb: 0.5,
  },
  explanationText: { fontSize: 13, lineHeight: 1.65 },
} as const;

export const WEAK_AREA_STATUS_LABELS: Record<WeakAreaStatus, string> = {
  NEEDS_WORK: "Needs work",
  IMPROVING: "Improving",
  STRONG: "Strong",
};

export function weakAreaStatusChipSx(status: WeakAreaStatus) {
  const color =
    status === "NEEDS_WORK" ? "error.main" : status === "IMPROVING" ? "warning.main" : "success.main";

  return {
    color: "primary.contrastText",
    bgcolor: color,
    fontWeight: 600,
  };
}
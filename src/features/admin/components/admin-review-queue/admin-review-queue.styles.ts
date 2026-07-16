import type { AdminDraft } from "../../admin.types";

export const adminReviewQueueStyles = {
  wrap: { maxWidth: 820, mx: "auto", display: "grid", gap: 2 },
  intro: { color: "text.secondary", fontSize: 13.5, mb: 0.3 },
  list: { display: "grid", gap: 1 },
  draftCard: {
    p: "20px 22px",
    borderRadius: "16px",
    borderColor: "divider",
    boxShadow: "0 1px 2px rgba(24,24,32,.05)",
  },
  topRow: { display: "flex", alignItems: "center", gap: 1, flexWrap: "wrap", mb: "12px" },
  chip: {
    fontSize: 11,
    fontWeight: 700,
    letterSpacing: ".06em",
    textTransform: "uppercase",
    px: "9px",
    py: "3px",
    borderRadius: "6px",
    fontFamily: '"Space Mono", monospace',
  },
  bodyLabel: {
    fontSize: 11,
    color: "text.disabled",
    fontFamily: '"Space Mono", monospace',
    fontWeight: 700,
    textTransform: "uppercase",
  },
  question: { fontFamily: '"Source Serif 4", serif', fontSize: 17, fontWeight: 600, lineHeight: 1.4, mb: "14px" },
  optionsCol: { display: "flex", flexDirection: "column", gap: "8px" },
  optionRow: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    p: "11px 14px",
    borderRadius: "10px",
    fontSize: 14,
    border: "1px solid",
  },
  optionLetter: {
    width: 24,
    height: 24,
    flex: "none",
    borderRadius: "7px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: 700,
    fontSize: 12,
  },
  explanation: {
    mt: "14px",
    fontSize: 13,
    color: "text.secondary",
    lineHeight: 1.55,
    borderLeft: "3px solid",
    borderLeftColor: "secondary.main",
    pl: "12px",
  },
  actions: { mt: "16px", display: "flex", gap: "10px", flexWrap: "wrap" },
};

export const difficultyToneSx = (difficulty: AdminDraft["difficulty"]) => ({
  color: difficulty === "Easy" ? "success.main" : difficulty === "Hard" ? "error.main" : "secondary.main",
});

export const optionToneSx = (isCorrect: boolean) => ({
  borderColor: isCorrect ? "success.main" : "divider",
  backgroundColor: isCorrect ? "success.light" : "background.default",
});

export const optionLetterToneSx = (isCorrect: boolean) => ({
  bgcolor: isCorrect ? "success.main" : "background.paper",
  color: isCorrect ? "#fff" : "text.secondary",
});

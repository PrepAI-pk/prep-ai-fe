import type { SxProps } from "@mui/material/styles";

const QuizProgressTrack: SxProps = {
  height: 6,
  borderRadius: 99,
  bgcolor: "background.default",
  overflow: "hidden",
  mb: 0.5,
};

const QuizProgressFill: SxProps = {
  height: "100%",
  bgcolor: "primary.main",
  transition: "width .3s ease",
};

const QuizCard: SxProps = {
  p: "28px 30px",
  borderRadius: "20px",
  borderColor: "divider",
  boxShadow: "0 4px 20px -8px rgba(24,24,32,.14)",
};

const QuizMetaRow: SxProps = {
  display: "flex",
  alignItems: "center",
  gap: 1.2,
  mb: 2,
};

const QuizSubjectChip: SxProps = {
  borderRadius: "8px",
  fontFamily: '"Space Mono", monospace',
  fontSize: 11,
  bgcolor: "primary.light",
  color: "primary.main",
};

const QuizDifficultyChip: SxProps = {
  borderRadius: "8px",
  fontFamily: '"Space Mono", monospace',
  fontSize: 11,
  bgcolor: "secondary.light",
  color: "secondary.main",
};

const Spacer: SxProps = {
  flex: 1,
};

const QuizCounter: SxProps = {
  fontSize: 12.5,
  color: "text.disabled",
  fontFamily: '"Space Mono", monospace',
};

const QuizTitle: SxProps = {
  fontFamily: '"Source Serif 4", serif',
  fontSize: 22,
  fontWeight: 600,
  lineHeight: 1.4,
  letterSpacing: "-.01em",
};

const OptionsGrid: SxProps = {
  display: "grid",
  gap: 1,
  mt: 2.75,
};

const OptionRow: SxProps = {
  display: "flex",
  alignItems: "center",
  gap: 1.75,
};

const OptionText: SxProps = {
  flex: 1,
};

const RightMarkCorrect: SxProps = {
  fontSize: 12,
  fontWeight: 700,
  color: "success.main",
  fontFamily: '"Space Mono", monospace',
};

const RightMarkWrong: SxProps = {
  fontSize: 12,
  fontWeight: 700,
  color: "error.main",
  fontFamily: '"Space Mono", monospace',
};

const RightMarkHidden: SxProps = {
  display: "none",
};

const OptionLetter: SxProps = {
  width: 28,
  height: 28,
  borderRadius: "50%",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  fontWeight: 700,
  fontSize: 13,
  flexShrink: 0,
};

const RevealBanner: SxProps = {
  mt: 1.5,
  p: 1.25,
  borderRadius: "11px",
  fontWeight: 700,
  fontSize: 13,
};

const AiExplanationCard: SxProps = {
  mt: 1.5,
  p: "16px 18px",
  borderRadius: "12px",
  borderLeft: "3px solid",
  borderLeftColor: "secondary.main",
  bgcolor: "background.default",
};

const AiExplanationKicker: SxProps = {
  fontFamily: '"Space Mono", monospace',
  letterSpacing: ".12em",
  textTransform: "uppercase",
  fontWeight: 700,
  fontSize: 11,
  color: "secondary.main",
  mb: 0.9,
};

const AiExplanationText: SxProps = {
  fontSize: 14.5,
  lineHeight: 1.6,
  color: "text.primary",
};

const XpChip: SxProps = {
  bgcolor: "primary.light",
  color: "primary.main",
  fontWeight: 700,
};

const NextRow: SxProps = {
  mt: 2.2,
  display: "flex",
  justifyContent: "flex-end",
  alignItems: "center",
  gap: 1.25,
};

const NextButton: SxProps = {
  px: 3,
  py: 1.2,
  borderRadius: "12px",
};

export const styles = {
  QuizProgressTrack,
  QuizProgressFill,
  QuizCard,
  QuizMetaRow,
  QuizSubjectChip,
  QuizDifficultyChip,
  Spacer,
  QuizCounter,
  QuizTitle,
  OptionsGrid,
  OptionRow,
  OptionText,
  RightMarkCorrect,
  RightMarkWrong,
  RightMarkHidden,
  OptionLetter,
  RevealBanner,
  AiExplanationCard,
  AiExplanationKicker,
  AiExplanationText,
  XpChip,
  NextRow,
  NextButton,
};

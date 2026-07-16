import type { SxProps } from "@mui/material";

const DoneCard: SxProps = {
  p: "36px 34px",
  borderRadius: "22px",
  borderColor: "divider",
  textAlign: "center",
  boxShadow: "0 4px 20px -8px rgba(24,24,32,.14)",
};

const Trophy: SxProps = {
  width: 78,
  height: 78,
  borderRadius: "50%",
  backgroundColor: "secondary.light",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  mx: "auto",
  mb: 2.25,
  fontSize: 36,
};

const DoneTitle: SxProps = {
  fontSize: 28,
  letterSpacing: "-.02em",
};

const DoneSub: SxProps = {
  mt: 1,
  color: "text.secondary",
  lineHeight: 1.55,
  maxWidth: 400,
  mx: "auto",
};

const DoneStatsRow: SxProps = {
  display: "flex",
  gap: 1.75,
  justifyContent: "center",
  mt: 3,
  flexWrap: "wrap",
};

const DoneStatPrimary: SxProps = {
  borderRadius: "16px",
  p: "18px 26px",
  backgroundColor: "primary.main",
  color: "primary.contrastText",
};

const DoneStatSecondary: SxProps = {
  borderRadius: "16px",
  p: "18px 26px",
  backgroundColor: "secondary.light",
};

const DoneStatNeutral: SxProps = {
  borderRadius: "16px",
  p: "18px 26px",
  backgroundColor: "background.default",
  border: "1px solid",
  borderColor: "divider",
};

const DoneStatValuePrimary: SxProps = {
  fontFamily: '"Source Serif 4", serif',
  fontSize: 30,
  fontWeight: 700,
  lineHeight: 1,
};

const DoneStatValueSecondary: SxProps = {
  fontFamily: '"Source Serif 4", serif',
  fontSize: 30,
  fontWeight: 700,
  lineHeight: 1,
  color: "secondary.main",
};

const DoneStatLabelPrimary: SxProps = {
  mt: 0.4,
  fontSize: 12,
  opacity: 0.85,
};

const DoneStatLabel: SxProps = {
  mt: 0.4,
  fontSize: 12,
  color: "text.secondary",
};

const DoneActions: SxProps = {
  mt: 3.25,
  display: "flex",
  gap: 1.5,
  justifyContent: "center",
  flexWrap: "wrap",
};

const DoneActionOutline: SxProps = {
  py: 1.4,
  px: 2.75,
  borderRadius: "12px",
};

const DoneActionFilled: SxProps = {
  py: 1.4,
  px: 3,
  borderRadius: "12px",
};

export const styles = {
  DoneCard,
  Trophy,
  DoneTitle,
  DoneSub,
  DoneStatsRow,
  DoneStatPrimary,
  DoneStatSecondary,
  DoneStatNeutral,
  DoneStatValuePrimary,
  DoneStatValueSecondary,
  DoneStatLabelPrimary,
  DoneStatLabel,
  DoneActions,
  DoneActionOutline,
  DoneActionFilled,
};

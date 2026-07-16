import type { SxProps } from "@mui/material";

const HeroCard: SxProps = {
  p: "28px 30px",
  borderRadius: "22px",
  color: "primary.contrastText",
  backgroundColor: "primary.main",
  position: "relative",
  overflow: "hidden",
};

const HeroOrb: SxProps = {
  position: "absolute",
  right: -30,
  top: -30,
  width: 150,
  height: 150,
  borderRadius: "50%",
  backgroundColor: "rgba(255,255,255,.06)",
};

const HeroTopRow: SxProps = {
  display: "flex",
  alignItems: "center",
  gap: 1.2,
  position: "relative",
};

const HeroDate: SxProps = {
  fontSize: 12,
  letterSpacing: ".14em",
  textTransform: "uppercase",
  opacity: 0.8,
  fontFamily: '"Space Mono", monospace',
};

const DoneTodayBadge: SxProps = {
  fontSize: 11,
  fontWeight: 700,
  px: 1.2,
  py: 0.4,
  borderRadius: "20px",
  background: "rgba(255,255,255,.18)",
  fontFamily: '"Space Mono", monospace',
  letterSpacing: ".04em",
};

const HeroTitle: SxProps = {
  fontSize: 30,
  mt: 1,
  position: "relative",
  letterSpacing: "-.02em",
};

const HeroSubtitle: SxProps = {
  mt: 0.75,
  opacity: 0.88,
  lineHeight: 1.5,
  maxWidth: 440,
  position: "relative",
  fontSize: 14.5,
};

const HeroButton: SxProps = {
  mt: 2.5,
  bgcolor: "background.paper",
  color: "primary.main",
  fontWeight: 700,
  px: 3.25,
  py: 1.6,
  borderRadius: "13px",
  position: "relative",
  "&:hover": { transform: "translateY(-1px)" },
};

const StatsGrid: SxProps = {
  display: "grid",
  gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
  gap: 1,
};

const StatCard: SxProps = {
  p: 2,
  borderRadius: "14px",
  borderColor: "divider",
  textAlign: "center",
};

const StatLabel: SxProps = {
  fontSize: 12,
  color: "text.secondary",
};

const WeekCard: SxProps = {
  p: "20px 22px",
  borderRadius: "16px",
  borderColor: "divider",
};

const WeekTitle: SxProps = {
  fontFamily: '"Source Serif 4", serif',
  fontSize: 16,
  fontWeight: 600,
  mb: 2,
};

const WeekRow: SxProps = {
  display: "flex",
  gap: 0.75,
};

const WeekDayCol: SxProps = {
  flex: 1,
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  gap: 0.75,
};

const LevelCard: SxProps = {
  p: "20px 22px",
  borderRadius: "16px",
  borderColor: "divider",
};

const LevelHead: SxProps = {
  display: "flex",
  alignItems: "center",
  gap: 2,
  mb: 2,
};

const LevelBadge: SxProps = {
  width: 52,
  height: 52,
  flexShrink: 0,
  borderRadius: "14px",
  bgcolor: "primary.main",
  color: "primary.contrastText",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  lineHeight: 1,
};

const LevelKicker: SxProps = {
  fontSize: 9,
  letterSpacing: ".08em",
  opacity: 0.8,
  fontFamily: '"Space Mono", monospace',
};

const LevelNumber: SxProps = {
  fontFamily: '"Source Serif 4", serif',
  fontSize: 20,
  fontWeight: 700,
};

const Grow: SxProps = {
  flex: 1,
  minWidth: 0,
};

const LevelMetaRow: SxProps = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "baseline",
  mb: 0.75,
};

const LevelMetaTitle: SxProps = {
  fontFamily: '"Source Serif 4", serif',
  fontSize: 16,
  fontWeight: 600,
};

const LevelMetaSub: SxProps = {
  fontSize: 12,
  color: "text.disabled",
  fontFamily: '"Space Mono", monospace',
};

const LevelTrack: SxProps = {
  height: 8,
  borderRadius: 99,
  bgcolor: "background.default",
  overflow: "hidden",
};

const LevelTrackFill: SxProps = {
  height: "100%",
  bgcolor: "primary.main",
};

const LevelFoot: SxProps = {
  fontSize: 11.5,
  color: "text.disabled",
  mt: 0.6,
};

const BadgesGrid: SxProps = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fill, minmax(150px, 1fr))",
  gap: 1.5,
};

const BadgeCard: SxProps = {
  p: "18px 16px",
  borderRadius: "16px",
  borderColor: "divider",
  bgcolor: "background.paper",
  textAlign: "center",
  boxShadow: "0 1px 2px rgba(24,24,32,.05)",
};

const BadgeIcon: SxProps = {
  width: 58,
  height: 58,
  borderRadius: "50%",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  mx: "auto",
  mb: 1.5,
  fontSize: 26,
};

const BadgeProgressFill: SxProps = {
  height: "100%",
};

const BadgeName: SxProps = {
  fontFamily: '"Source Serif 4", serif',
  fontSize: 14.5,
  fontWeight: 600,
  lineHeight: 1.3,
};

const BadgeDesc: SxProps = {
  fontSize: 11.5,
  color: "text.disabled",
  mt: 0.5,
  lineHeight: 1.4,
  minHeight: 32,
};

const BadgeEarned: SxProps = {
  fontSize: 10,
  fontWeight: 700,
  color: "success.main",
  mt: 1.25,
  letterSpacing: ".1em",
  textTransform: "uppercase",
  fontFamily: '"Space Mono", monospace',
};

const BadgeProgressWrap: SxProps = {
  mt: 1.25,
};

const BadgeProgressTrack: SxProps = {
  height: 5,
  borderRadius: 99,
  bgcolor: "background.default",
  overflow: "hidden",
};

const BadgeProgressLabel: SxProps = {
  mt: 0.5,
  fontSize: 10.5,
  color: "text.disabled",
  fontFamily: '"Space Mono", monospace',
};

export const styles = {
  HeroCard,
  HeroOrb,
  HeroTopRow,
  HeroDate,
  DoneTodayBadge,
  HeroTitle,
  HeroSubtitle,
  HeroButton,
  StatsGrid,
  StatCard,
  StatLabel,
  WeekCard,
  WeekTitle,
  WeekRow,
  WeekDayCol,
  LevelCard,
  LevelHead,
  LevelBadge,
  LevelKicker,
  LevelNumber,
  Grow,
  LevelMetaRow,
  LevelMetaTitle,
  LevelMetaSub,
  LevelTrack,
  LevelTrackFill,
  LevelFoot,
  BadgesGrid,
  BadgeCard,
  BadgeIcon,
  BadgeProgressFill,
  BadgeName,
  BadgeDesc,
  BadgeEarned,
  BadgeProgressWrap,
  BadgeProgressTrack,
  BadgeProgressLabel,
};

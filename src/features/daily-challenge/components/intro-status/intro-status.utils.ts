import { styles as IntroStatusStyles } from "./intro-status.styles";

export const statValueSx = (label: string) => ({
  fontSize: 26,
  color: label === "Day streak" ? "secondary.main" : "text.primary",
});

export const badgeProgressFillSx = (width: number, color: string) => ({
  ...IntroStatusStyles.BadgeProgressFill,
  width: `${width}%`,
  bgcolor: color,
});

export const weekDayLabelSx = (isToday: boolean) => ({
  fontSize: 11,
  fontFamily: '"Space Mono", monospace',
  color: isToday ? "secondary.main" : "text.disabled",
  fontWeight: isToday ? 700 : 400,
});

export const levelTrackFillSx = (percent: number) => ({
  ...IntroStatusStyles.LevelTrackFill,
  width: `${percent}%`,
});

export const badgeCardSx = (earned: boolean) => ({
  ...IntroStatusStyles.BadgeCard,
  opacity: earned ? 1 : 0.72,
});

export const badgeIconSx = (earned: boolean, bg: string, fg: string) => ({
  ...IntroStatusStyles.BadgeIcon,
  bgcolor: earned ? bg : "background.default",
  color: earned ? fg : "text.disabled",
  boxShadow: earned ? `0 0 0 4px ${bg}` : "none",
});

export const weekDayCircleSx = (isDone: boolean, isToday: boolean) => ({
  width: 36,
  height: 36,
  borderRadius: "50%",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  fontSize: 15,
  fontWeight: 700,
  bgcolor: isDone
    ? "secondary.main"
    : isToday
      ? "secondary.light"
      : "background.default",
  color: isDone ? "#fff" : isToday ? "secondary.main" : "text.disabled",
  border: isToday && !isDone ? "1.5px solid" : "1.5px solid transparent",
  borderColor: "secondary.main",
});

import { Box, Button, Paper, Typography } from "@mui/material";
import { styles as IntroStatusStyles } from "./intro-status.styles";
import {
  badgeCardSx,
  badgeIconSx,
  badgeProgressFillSx,
  levelTrackFillSx,
  statValueSx,
  weekDayCircleSx,
  weekDayLabelSx,
} from "./intro-status.utils";
import type { IntroStatusProps } from "./intro-status.types";
import {
  BADGE_DEFS,
  BADGE_TOTAL_XP,
} from "../../daily-challenge.constants";

const IntroStatusComponent = (props: IntroStatusProps) => {
  const {
    dateLabel,
    isDoneToday,
    challengeQuestions,
    potentialXp,
    dc,
    weekDays,
    level,
    levelName,
    levelProgressPct,
    xpToNextLevel,
    earnedBadgeCount,
    badges,
    startChallenge,
  } = props;

  return (
    <>
      {/* Hero card */}
      <Paper sx={IntroStatusStyles.HeroCard}>
        <Box sx={IntroStatusStyles.HeroOrb} />
        <Box sx={IntroStatusStyles.HeroTopRow}>
          <Typography sx={IntroStatusStyles.HeroDate}>{dateLabel}</Typography>
          {isDoneToday && (
            <Box sx={IntroStatusStyles.DoneTodayBadge}>✓ DONE TODAY</Box>
          )}
        </Box>

        <Typography variant="h2" sx={IntroStatusStyles.HeroTitle}>
          Today's Challenge
        </Typography>
        <Typography sx={IntroStatusStyles.HeroSubtitle}>
          {challengeQuestions.length} mixed questions across your exam subjects.
          Finish to earn up to <strong>{potentialXp} XP</strong> and protect
          your streak.
        </Typography>
        <Button
          variant="contained"
          sx={IntroStatusStyles.HeroButton}
          onClick={startChallenge}
        >
          {isDoneToday ? "Retake today's challenge →" : "Start challenge →"}
        </Button>
      </Paper>

      {/* Stat boxes */}
      <Box sx={IntroStatusStyles.StatsGrid}>
        {[
          { label: "Day streak", value: `${dc.streak}🔥` },
          { label: "Best streak", value: String(dc.bestStreak) },
          { label: "Total XP", value: dc.totalXp.toLocaleString() },
        ].map((stat) => (
          <Paper
            key={stat.label}
            variant="outlined"
            sx={IntroStatusStyles.StatCard}
          >
            <Typography variant="h3" sx={statValueSx(stat.label)}>
              {stat.value}
            </Typography>
            <Typography sx={IntroStatusStyles.StatLabel}>
              {stat.label}
            </Typography>
          </Paper>
        ))}
      </Box>

      {/* This week strip */}
      <Paper variant="outlined" sx={IntroStatusStyles.WeekCard}>
        <Typography sx={IntroStatusStyles.WeekTitle}>This week</Typography>
        <Box sx={IntroStatusStyles.WeekRow}>
          {weekDays.map(({ dateKey, label, isToday, isDone, isLocked }) => (
            <Box key={dateKey} sx={IntroStatusStyles.WeekDayCol}>
              <Box sx={weekDayCircleSx(isDone, isToday)}>
                {isDone ? "✓" : isLocked ? "·" : ""}
              </Box>
              <Typography sx={weekDayLabelSx(isToday)}>{label}</Typography>
            </Box>
          ))}
        </Box>
      </Paper>

      {/* Level + Badges */}
      <Paper variant="outlined" sx={IntroStatusStyles.LevelCard}>
        <Box sx={IntroStatusStyles.LevelHead}>
          <Box sx={IntroStatusStyles.LevelBadge}>
            <Typography sx={IntroStatusStyles.LevelKicker}>LVL</Typography>
            <Typography sx={IntroStatusStyles.LevelNumber}>{level}</Typography>
          </Box>
          <Box sx={IntroStatusStyles.Grow}>
            <Box sx={IntroStatusStyles.LevelMetaRow}>
              <Typography sx={IntroStatusStyles.LevelMetaTitle}>
                {levelName} · {BADGE_TOTAL_XP.toLocaleString()} XP
              </Typography>
              <Typography sx={IntroStatusStyles.LevelMetaSub}>
                {earnedBadgeCount}/{BADGE_DEFS.length} badges
              </Typography>
            </Box>
            <Box sx={IntroStatusStyles.LevelTrack}>
              <Box sx={levelTrackFillSx(levelProgressPct)} />
            </Box>
            <Typography sx={IntroStatusStyles.LevelFoot}>
              {xpToNextLevel} XP to level {level} → next
            </Typography>
          </Box>
        </Box>

        <Box sx={IntroStatusStyles.BadgesGrid}>
          {badges.map((badge) => (
            <Paper
              key={badge.id}
              variant="outlined"
              sx={badgeCardSx(badge.earned)}
            >
              {(() => {
                const toneMap = {
                  a: { bg: "secondary.light", fg: "secondary.main" },
                  p: { bg: "primary.light", fg: "primary.main" },
                  g: { bg: "success.light", fg: "success.main" },
                } as const;
                const tone = toneMap[badge.tone];
                const progress =
                  !badge.earned && badge.goal
                    ? Math.round(((badge.cur ?? 0) / badge.goal) * 100)
                    : null;
                return (
                  <>
                    <Box sx={badgeIconSx(badge.earned, tone.bg, tone.fg)}>
                      {badge.sym}
                    </Box>
                    <Typography sx={IntroStatusStyles.BadgeName}>
                      {badge.name}
                    </Typography>
                    <Typography sx={IntroStatusStyles.BadgeDesc}>
                      {badge.desc}
                    </Typography>
                    {badge.earned && (
                      <Typography sx={IntroStatusStyles.BadgeEarned}>
                        ✓ Earned
                      </Typography>
                    )}
                    {!badge.earned && progress !== null && (
                      <Box sx={IntroStatusStyles.BadgeProgressWrap}>
                        <Box sx={IntroStatusStyles.BadgeProgressTrack}>
                          <Box sx={badgeProgressFillSx(progress, tone.fg)} />
                        </Box>
                        <Typography sx={IntroStatusStyles.BadgeProgressLabel}>
                          {(badge.cur ?? 0).toLocaleString()} /{" "}
                          {(badge.goal ?? 0).toLocaleString()}
                        </Typography>
                      </Box>
                    )}
                  </>
                );
              })()}
            </Paper>
          ))}
        </Box>
      </Paper>
    </>
  );
};

export default IntroStatusComponent;

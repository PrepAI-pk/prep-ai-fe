import { Box } from "@mui/material";
import type { AppScreen } from "../../app/screens";
import { PracticeTopbar } from "../practice";
import {
  ChallengeState,
  challengeQuestions,
} from "./daily-challenge.constants";
import { useDailyChallengeSession } from "./hooks/use-daily-challenge-session.hook";
import { dailyChallengeStyles } from "./daily-challenge.styles";
import BadgeUnlockOverlay from "./components/badge-unlock-overlay/badge-unlock-overlay.component";
import DoneStatusComponent from "./components/done-status/done-status.component";
import PlayStatusComponent from "./components/play-status/play-status.component";
import IntroStatusComponent from "./components/intro-status/intro-status.component";

type DailyChallengePageProps = {
  onNavigateScreen?: (screen: AppScreen) => void;
};

// ─── Component ────────────────────────────────────────────────────────────────

export function DailyChallengeScreen(props: DailyChallengePageProps = {}) {
  const { onNavigateScreen } = props;
  const {
    state,
    questionIndex,
    selectedOption,
    revealed,
    score,
    earnedXp,
    unlockOverlayOpen,
    unlockedBadge,
    current,
    progress,
    resultTitle,
    resultSub,
    dc,
    dateLabel,
    isDoneToday,
    weekDays,
    level,
    levelName,
    levelProgressPct,
    xpToNextLevel,
    earnedBadgeCount,
    badges,
    potentialXp,
    startChallenge,
    handleSelect,
    handleNext,
    setUnlockOverlayOpen,
  } = useDailyChallengeSession();

  return (
    <>
      <Box sx={dailyChallengeStyles.shell}>
        <PracticeTopbar
          currentScreen="dailyChallenge"
          title="Daily Challenge"
          subtitle="Quick challenge for streak, XP, and badge progression"
          searchPlaceholder="Search Challenges"
          onOpenGlobalSearch={() => onNavigateScreen?.("globalSearch")}
          onOpenSettings={() => onNavigateScreen?.("settingsProfile")}
          onNavigateScreen={onNavigateScreen}
        />

        <Box sx={dailyChallengeStyles.scrollBody}>
          <Box sx={dailyChallengeStyles.contentWrap}>
            {/* ── INTRO ─────────────────────────────────────────────────── */}
            {state === ChallengeState.Intro && (
              <IntroStatusComponent
                dateLabel={dateLabel}
                isDoneToday={isDoneToday}
                challengeQuestions={challengeQuestions}
                potentialXp={potentialXp}
                dc={dc}
                weekDays={weekDays}
                level={level}
                levelName={levelName}
                levelProgressPct={levelProgressPct}
                xpToNextLevel={xpToNextLevel}
                earnedBadgeCount={earnedBadgeCount}
                badges={badges}
                startChallenge={startChallenge}
              />
            )}

            {/* ── PLAY ──────────────────────────────────────────────────── */}
            {state === ChallengeState.Play && (
              <PlayStatusComponent
                progress={progress}
                current={current}
                questionIndex={questionIndex}
                challengeQuestions={challengeQuestions}
                selectedOption={selectedOption}
                revealed={revealed}
                handleSelect={handleSelect}
                handleNext={handleNext}
              />
            )}

            {/* ── DONE ──────────────────────────────────────────────────── */}
            {state === ChallengeState.Done && (
              <DoneStatusComponent
                resultTitle={resultTitle}
                resultSub={resultSub}
                earnedXp={earnedXp}
                dc={dc}
                score={score}
                challengeQuestions={challengeQuestions}
                onNavigateScreen={onNavigateScreen}
              />
            )}
          </Box>
        </Box>
      </Box>

      {/* ── Badge unlock overlay ─────────────────────────────────────── */}
      <BadgeUnlockOverlay
        unlockOverlayOpen={unlockOverlayOpen}
        setUnlockOverlayOpen={setUnlockOverlayOpen}
        unlockedBadge={unlockedBadge}
        earnedXp={earnedXp}
      />
    </>
  );
}

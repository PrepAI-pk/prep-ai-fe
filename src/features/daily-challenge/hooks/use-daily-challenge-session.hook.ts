import { useMemo, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../../store/hooks";
import { completeDailyChallenge } from "../../../store/slices/daily-challenge-slice";
import {
  ChallengeState,
  challengeQuestions,
  type UnlockedBadge,
  XP_CORRECT,
  XP_WRONG,
  BADGE_DEFS,
  BADGE_TOTAL_XP,
  LEVEL_NAMES,
  XP_PER_LEVEL,
} from "../daily-challenge.constants";

import {
  formatDateLabel,
  getTodayKey,
  getWeekDays,
} from "./../daily-challenge.utils";
import type { WeekDayStatus } from "../daily-challenge.types";

export function useDailyChallengeSession() {
  const dispatch = useAppDispatch();
  const dc = useAppSelector((s) => s.dailyChallenge);

  const [state, setState] = useState<ChallengeState>(ChallengeState.Intro);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [revealed, setRevealed] = useState(false);
  const [score, setScore] = useState(0);
  const [earnedXp, setEarnedXp] = useState(0);
  const [unlockOverlayOpen, setUnlockOverlayOpen] = useState(false);
  const [unlockedBadge, setUnlockedBadge] = useState<UnlockedBadge | null>(
    null,
  );

  const current = challengeQuestions[questionIndex];
  const progress = Math.round(
    ((questionIndex + 1) / challengeQuestions.length) * 100,
  );

  // ── Derived from store ──
  const todayKey = getTodayKey();
  const isDoneToday = dc.lastCompletedDateKey === todayKey;

  const level = Math.floor(BADGE_TOTAL_XP / XP_PER_LEVEL) + 1;
  const levelName = LEVEL_NAMES[Math.min(level - 1, LEVEL_NAMES.length - 1)];
  const xpInLevel = BADGE_TOTAL_XP - (level - 1) * XP_PER_LEVEL;
  const levelProgressPct = (xpInLevel / XP_PER_LEVEL) * 100;
  const xpToNextLevel = XP_PER_LEVEL - xpInLevel;

  const badges = useMemo(() => BADGE_DEFS, []);
  const earnedBadgeCount = badges.filter((b) => b.earned).length;

  const weekDays = useMemo<WeekDayStatus[]>(
    () => getWeekDays(dc.weekHistory),
    [dc.weekHistory],
  );
  const dateLabel = useMemo(() => formatDateLabel(), []);
  const potentialXp = challengeQuestions.length * XP_CORRECT;

  function startChallenge(): void {
    setState(ChallengeState.Play);
    setQuestionIndex(0);
    setSelectedOption(null);
    setRevealed(false);
    setScore(0);
    setEarnedXp(0);
  }

  function handleSelect(index: number): void {
    if (revealed) return;
    setSelectedOption(index);
    setRevealed(true);
    if (index === current.correctIndex) {
      setScore((prev) => prev + 1);
      setEarnedXp((prev) => prev + XP_CORRECT);
    } else {
      setEarnedXp((prev) => prev + XP_WRONG);
    }
  }

  function handleNext(): void {
    if (questionIndex < challengeQuestions.length - 1) {
      setQuestionIndex((prev) => prev + 1);
      setSelectedOption(null);
      setRevealed(false);
      return;
    }

    const isPerfect = score === challengeQuestions.length;
    dispatch(completeDailyChallenge({ xpEarned: earnedXp, isPerfect }));

    const badge: UnlockedBadge = isPerfect
      ? { name: "Sharp Shooter", sym: "◎", xp: earnedXp }
      : { name: "Streak Keeper", sym: "♦", xp: earnedXp };

    setUnlockedBadge(badge);
    setState(ChallengeState.Done);
    setUnlockOverlayOpen(true);
  }

  const resultTitle =
    score === challengeQuestions.length ? "Flawless!" : "Challenge complete!";
  const resultSub =
    score === challengeQuestions.length
      ? `Perfect score — ${challengeQuestions.length}/${challengeQuestions.length} correct. You earned ${earnedXp} XP and extended your streak!`
      : `You scored ${score}/${challengeQuestions.length} and earned ${earnedXp} XP. Keep it up — tomorrow's challenge awaits!`;

  return {
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
    weekDays,
    isDoneToday,
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
  };
}

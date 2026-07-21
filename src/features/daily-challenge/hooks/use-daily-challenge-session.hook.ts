import { useMemo, useState } from "react";
import { useGetBadgesQuery } from "../../../api/badges/badges.endpoints";
import type { BadgeItem } from "../../../api/badges/badges.types";
import {
  useAnswerDailyChallengeMutation,
  useCompleteDailyChallengeMutation,
  useGetDailyChallengeQuery,
  useStartDailyChallengeMutation,
} from "../../../api/daily-challenge/daily-challenge.endpoints";
import { ChallengeState, type UnlockedBadge } from "../daily-challenge.constants";
import { formatDateLabel, mapWeek } from "../daily-challenge.utils";
import type { IBadge } from "../components/intro-status/intro-status.types";
import type { IQuestion } from "../components/play-status/play-status.types";

// The daily-challenge XP formula (correct*10 + 20 completion + 15 streak) is
// server-authoritative (packages/contracts `dailyChallengeXp`) — this mirrors
// only the "up to" figure shown on the intro card before the real total is
// known, not a value ever used for grading.
const MAX_XP_PER_QUESTION = 10;
const COMPLETION_AND_STREAK_BONUS = 35;

function mapBadges(items: BadgeItem[]): IBadge[] {
  return items.map((b) => ({
    id: b.code,
    name: b.name,
    desc: b.earned ? "" : b.description,
    sym: b.symbol,
    tone: b.tone.toLowerCase() as "a" | "p" | "g",
    earned: b.earned,
    ...(b.earned ? {} : { cur: b.cur, goal: b.goal }),
  }));
}

export function useDailyChallengeSession() {
  const { data: challenge } = useGetDailyChallengeQuery();
  const { data: badgesData } = useGetBadgesQuery();
  const [startDailyChallengeMutation] = useStartDailyChallengeMutation();
  const [answerDailyChallengeMutation] = useAnswerDailyChallengeMutation();
  const [completeDailyChallengeMutation] = useCompleteDailyChallengeMutation();

  const [state, setState] = useState<ChallengeState>(ChallengeState.Intro);
  const [questions, setQuestions] = useState<IQuestion[]>([]);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [questionIndex, setQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [revealed, setRevealed] = useState(false);
  const [score, setScore] = useState(0);
  const [earnedXp, setEarnedXp] = useState(0);
  const [resultStreak, setResultStreak] = useState(0);
  const [unlockOverlayOpen, setUnlockOverlayOpen] = useState(false);
  const [unlockedBadge, setUnlockedBadge] = useState<UnlockedBadge | null>(null);

  const current = questions[questionIndex];
  const progress = questions.length ? Math.round(((questionIndex + 1) / questions.length) * 100) : 0;

  const isDoneToday = challenge?.completed ?? false;
  const dateLabel = useMemo(() => formatDateLabel(challenge?.date), [challenge?.date]);
  const weekDays = useMemo(() => mapWeek(challenge?.week ?? []), [challenge?.week]);

  const dc = {
    streak: challenge?.stats.streak ?? 0,
    bestStreak: challenge?.stats.best ?? 0,
    totalXp: challenge?.stats.totalXp ?? 0,
  };
  const level = challenge?.level.current ?? 1;
  const levelName = challenge?.level.name ?? "Novice";
  const levelProgressPct = challenge ? (challenge.level.xpInLevel / challenge.level.xpPerLevel) * 100 : 0;
  const xpToNextLevel = challenge ? challenge.level.xpPerLevel - challenge.level.xpInLevel : 0;

  const badges = useMemo(() => mapBadges(badgesData?.items ?? []), [badgesData]);
  const earnedBadgeCount = badges.filter((b) => b.earned).length;
  const questionCount = challenge?.questionCount ?? 5;
  const potentialXp = questionCount * MAX_XP_PER_QUESTION + COMPLETION_AND_STREAK_BONUS;

  async function startChallenge(): Promise<void> {
    const res = await startDailyChallengeMutation().unwrap();
    setQuestions(
      res.questions.map((q) => ({
        id: q.id,
        question: q.questionText,
        options: q.options,
        subject: q.subject.name,
        difficulty: q.difficulty,
        correctIndex: null,
        explanation: null,
      })),
    );
    setAnswers({});
    setQuestionIndex(0);
    setSelectedOption(null);
    setRevealed(false);
    setScore(0);
    setEarnedXp(0);
    setState(ChallengeState.Play);
  }

  async function handleSelect(index: number): Promise<void> {
    if (revealed || !current) {
      return;
    }
    setSelectedOption(index);
    setAnswers((prev) => ({ ...prev, [current.id]: index }));

    const res = await answerDailyChallengeMutation({ questionId: current.id, selectedIndex: index }).unwrap();
    setQuestions((prev) =>
      prev.map((q, i) => (i === questionIndex ? { ...q, correctIndex: res.correctIndex, explanation: res.explanation } : q)),
    );
    if (res.isCorrect) {
      setScore((prev) => prev + 1);
    }
    setRevealed(true);
  }

  async function handleNext(): Promise<void> {
    if (questionIndex < questions.length - 1) {
      setQuestionIndex((prev) => prev + 1);
      setSelectedOption(null);
      setRevealed(false);
      return;
    }

    const result = await completeDailyChallengeMutation({
      answers: questions.map((q) => ({ questionId: q.id, selectedIndex: answers[q.id] })),
    }).unwrap();

    setScore(result.correct);
    setEarnedXp(result.xp.earned);
    setResultStreak(result.streak.current);
    setState(ChallengeState.Done);

    const firstUnlocked = result.unlockedBadges[0];
    if (firstUnlocked) {
      setUnlockedBadge({
        name: firstUnlocked.name,
        sym: firstUnlocked.symbol,
        xp: result.xp.earned,
        description: firstUnlocked.description,
      });
      setUnlockOverlayOpen(true);
    }
  }

  const totalQuestions = questions.length || questionCount;
  const resultTitle = score === totalQuestions ? "Flawless!" : "Challenge complete!";
  const resultSub =
    score === totalQuestions
      ? `Perfect score — ${totalQuestions}/${totalQuestions} correct. You earned ${earnedXp} XP and extended your streak!`
      : `You scored ${score}/${totalQuestions} and earned ${earnedXp} XP. Keep it up — tomorrow's challenge awaits!`;

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
    totalQuestions,
    progress,
    resultTitle,
    resultSub,
    dc: { ...dc, streak: state === ChallengeState.Done ? resultStreak : dc.streak },
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
    questionCount,
    startChallenge,
    handleSelect,
    handleNext,
    setUnlockOverlayOpen,
  };
}

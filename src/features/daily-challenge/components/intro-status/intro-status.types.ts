import type { ChallengeQuestion } from "../../daily-challenge.constants";

export interface IWeekDayStatus {
  dateKey: string;
  label: string;
  isToday: boolean;
  isDone: boolean;
  isLocked: boolean;
}

export interface IBadge {
  id: string;
  name: string;
  desc: string;
  sym: string;
  tone: "a" | "p" | "g";
  earned: boolean;
  cur?: number;
  goal?: number;
}

export interface IDc {
  streak: number;
  bestStreak: number;
  totalXp: number;
}

export interface IntroStatusProps {
  dateLabel: string;
  isDoneToday: boolean;
  challengeQuestions: ChallengeQuestion[];
  potentialXp: number;
  dc: IDc;
  weekDays: IWeekDayStatus[];
  level: number;
  levelName: string;
  levelProgressPct: number;
  xpToNextLevel: number;
  earnedBadgeCount: number;
  badges: IBadge[];
  startChallenge: () => void;
}

export type DailyChallengeWeekDay = {
  d: "Mon" | "Tue" | "Wed" | "Thu" | "Fri" | "Sat" | "Sun";
  today?: boolean;
  done?: boolean;
  locked?: boolean;
};

export type DailyChallengeResponse = {
  date: string;
  completed: boolean;
  questionCount: number;
  stats: { streak: number; best: number; totalXp: number };
  week: DailyChallengeWeekDay[];
  level: { current: number; name: string; xpInLevel: number; xpPerLevel: number };
};

export type DailyChallengeStartQuestion = {
  id: string;
  subject: { name: string };
  difficulty: string;
  questionText: string;
  options: string[];
};

export type DailyChallengeStartResponse = {
  questions: DailyChallengeStartQuestion[];
};

export type DailyChallengeAnswerRequest = { questionId: string; selectedIndex: number };

export type DailyChallengeAnswerResponse = {
  isCorrect: boolean;
  correctIndex: number;
  explanation: string | null;
  xpEarned: number;
};

export type DailyChallengeCompleteRequest = { answers: DailyChallengeAnswerRequest[] };

export type DailyChallengeUnlockedBadge = {
  code: string;
  name: string;
  description: string;
  symbol: string;
  tone: "P" | "A" | "G";
};

export type DailyChallengeCompleteResponse = {
  correct: number;
  total: number;
  xp: { base: number; completionBonus: number; streakBonus: number; earned: number };
  streak: { current: number; isNewBest: boolean };
  unlockedBadges: DailyChallengeUnlockedBadge[];
};

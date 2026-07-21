export const ChallengeState = {
  Intro: "intro",
  Play: "play",
  Done: "done",
} as const;

export type ChallengeState = (typeof ChallengeState)[keyof typeof ChallengeState];

export type UnlockedBadge = { name: string; sym: string; xp: number; description?: string };

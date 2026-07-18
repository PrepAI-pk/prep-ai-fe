import type { LbPeriod, LbScope, LeaderboardPodiumEntry } from "../../api/leaderboard/leaderboard.types";

export const LeaderboardScope = {
  National: "National",
  Provincial: "Provincial",
  City: "City",
} as const;

export type LeaderboardScope =
  (typeof LeaderboardScope)[keyof typeof LeaderboardScope];

export const LeaderboardPeriod = {
  Weekly: "Weekly",
  Monthly: "Monthly",
  AllTime: "All-time",
} as const;

export type LeaderboardPeriod =
  (typeof LeaderboardPeriod)[keyof typeof LeaderboardPeriod];

export const LEADERBOARD_SCOPE_OPTIONS: LeaderboardScope[] = [
  LeaderboardScope.National,
  LeaderboardScope.Provincial,
  LeaderboardScope.City,
];

export const LEADERBOARD_PERIOD_OPTIONS: LeaderboardPeriod[] = [
  LeaderboardPeriod.Weekly,
  LeaderboardPeriod.Monthly,
  LeaderboardPeriod.AllTime,
];

export const SCOPE_TO_API: Record<LeaderboardScope, LbScope> = {
  [LeaderboardScope.National]: "NATIONAL",
  [LeaderboardScope.Provincial]: "PROVINCIAL",
  [LeaderboardScope.City]: "CITY",
};

export const PERIOD_TO_API: Record<LeaderboardPeriod, LbPeriod> = {
  [LeaderboardPeriod.Weekly]: "WEEKLY",
  [LeaderboardPeriod.Monthly]: "MONTHLY",
  [LeaderboardPeriod.AllTime]: "ALL_TIME",
};

export function podiumOrder(podium: LeaderboardPodiumEntry[]): LeaderboardPodiumEntry[] {
  const first = podium.find((row) => row.rank === 1);
  const second = podium.find((row) => row.rank === 2);
  const third = podium.find((row) => row.rank === 3);
  return [second, first, third].filter((item): item is LeaderboardPodiumEntry => Boolean(item));
}

export function medalColor(rank: number): string {
  if (rank === 1) return "#f0c36a";
  if (rank === 2) return "#b8bec9";
  return "#cb9a73";
}

export function podiumHeight(rank: number): number {
  if (rank === 1) return 130;
  if (rank === 2) return 110;
  return 96;
}

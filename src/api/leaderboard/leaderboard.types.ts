export type LbScope = "NATIONAL" | "PROVINCIAL" | "CITY";
export type LbPeriod = "WEEKLY" | "MONTHLY" | "ALL_TIME";

export type LeaderboardPodiumEntry = { rank: number; name: string; city: string | null; pts: number; acc: number };

export type LeaderboardItem = {
  rank: number;
  name: string;
  city: string | null;
  pts: number;
  acc: number;
  tests: number;
  streak: number;
  delta: number;
  you: boolean;
};

export type LeaderboardYou = { rank: number; pts: number; acc: number; streak: number; delta: number };

export type LeaderboardResponse = {
  scope: LbScope;
  period: LbPeriod;
  computedAt: string | null;
  podium: LeaderboardPodiumEntry[];
  you: LeaderboardYou | null;
  items: LeaderboardItem[];
  total: number;
  page: number;
  pageSize: number;
};

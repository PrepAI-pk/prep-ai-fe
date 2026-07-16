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

export type LeaderRow = {
  rank: number;
  name: string;
  city: string;
  streak: number;
  points: number;
  accuracy: number;
  trend: "up" | "down";
  isCurrentUser?: boolean;
};

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

export const LEADERBOARD_ROWS: LeaderRow[] = [
  { rank: 1, name: "Areeba Khan", city: "Lahore", streak: 27, points: 2440, accuracy: 91, trend: "up" },
  { rank: 2, name: "Hamza Qureshi", city: "Islamabad", streak: 21, points: 2350, accuracy: 89, trend: "up" },
  { rank: 3, name: "Sana Malik", city: "Karachi", streak: 18, points: 2275, accuracy: 88, trend: "up" },
  { rank: 4, name: "Ayesha Khan", city: "Peshawar", streak: 13, points: 2140, accuracy: 84, trend: "up", isCurrentUser: true },
  { rank: 5, name: "Bilal Javed", city: "Rawalpindi", streak: 11, points: 2088, accuracy: 82, trend: "down" },
  { rank: 6, name: "Noor Fatima", city: "Multan", streak: 9, points: 2012, accuracy: 80, trend: "up" },
  { rank: 7, name: "Ali Raza", city: "Quetta", streak: 8, points: 1940, accuracy: 78, trend: "down" },
];

export function podiumOrder(rows: LeaderRow[]): LeaderRow[] {
  const topThree = rows.filter((row) => row.rank <= 3);
  const first = topThree.find((row) => row.rank === 1);
  const second = topThree.find((row) => row.rank === 2);
  const third = topThree.find((row) => row.rank === 3);
  return [second, first, third].filter((item): item is LeaderRow => !!item);
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

export type BadgeTone = "P" | "A" | "G";

export type BadgeItem =
  | { code: string; name: string; symbol: string; tone: BadgeTone; earned: true }
  | {
      code: string;
      name: string;
      description: string;
      symbol: string;
      tone: BadgeTone;
      earned: false;
      cur?: number;
      goal?: number;
    };

export type BadgesResponse = {
  level: { current: number; name: string; totalXp: number; xpInLevel: number; xpPerLevel: number };
  items: BadgeItem[];
};

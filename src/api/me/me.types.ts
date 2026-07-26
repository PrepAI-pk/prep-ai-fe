export type BackendTheme = "LIGHT" | "DARK";
export type BackendAccent = "INDIGO" | "EMERALD" | "PLUM";
export type BackendDifficulty = "ADAPTIVE" | "EASY" | "MEDIUM" | "HARD";
export type BackendLanguage = "ENGLISH" | "URDU";
export type BackendDigestFreq = "DAILY" | "WEEKLY" | "OFF";

export type MeResponse = {
  id: string;
  email: string;
  emailVerifiedAt: string | null;
  fullName: string;
  avatarInitials: string | null;
  role: string;
  phone: string | null;
  gender: string | null;
  city: string | null;
  province: string | null;
  onboardedAt: string | null;
  streak: { current: number; best: number; week: boolean[] };
  xp: { total: number; level: number; levelName: string; xpInLevel: number; xpPerLevel: number };
  studyHours: number;
  plan: { tier: string; status: string; currentPeriodEnd: string | null } | null;
  entitlements: unknown;
  preferences: {
    theme: BackendTheme;
    accent: BackendAccent;
    defaultDifficulty: BackendDifficulty;
    contentLanguage: BackendLanguage;
  };
};

export type MePatchPayload = {
  fullName?: string;
  avatarInitials?: string;
  city?: string;
  province?: string;
};

export type PreferencesResponse = {
  theme: BackendTheme;
  accent: BackendAccent;
  defaultDifficulty: BackendDifficulty;
  contentLanguage: BackendLanguage;
  offlineEnabled: boolean;
};

export type PreferencesPayload = Partial<PreferencesResponse>;

// The 5 real notification categories (DATABASE.md §0 — the frontend used to
// show 6 invented ones: mockResults/streak/badges/newContent/plan/payments).
export type NotifCategoryKey = "reminder" | "streak" | "content" | "leaderboard" | "results";
export type NotifChannelKey = "push" | "email" | "sms";

export type NotificationPreferencesResponse = {
  channels: Record<NotifChannelKey, boolean>;
  reminder: { enabled: boolean; time: string };
  quiet: { enabled: boolean; from: string; to: string };
  categories: Record<NotifCategoryKey, boolean>;
  digestFreq: BackendDigestFreq;
};

export type NotificationPreferencesPayload = {
  channels?: Partial<Record<NotifChannelKey, boolean>>;
  reminder?: { enabled?: boolean; time?: string };
  quiet?: { enabled?: boolean; from?: string; to?: string };
  categories?: Partial<Record<NotifCategoryKey, boolean>>;
  digestFreq?: BackendDigestFreq;
};

import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

export type DailyChallengeState = {
  lastCompletedDateKey: string | null;
  streak: number;
  bestStreak: number;
  totalXp: number;
  completionCount: number;
  perfectCount: number;
  weekHistory: Record<string, boolean>;
};

const initialState: DailyChallengeState = {
  lastCompletedDateKey: null,
  streak: 0,
  bestStreak: 0,
  totalXp: 0,
  completionCount: 0,
  perfectCount: 0,
  weekHistory: {},
};

function getTodayKey(): string {
  return new Date().toISOString().slice(0, 10);
}

function getYesterdayKey(): string {
  const d = new Date();
  d.setDate(d.getDate() - 1);
  return d.toISOString().slice(0, 10);
}

const dailyChallengeSlice = createSlice({
  name: "dailyChallenge",
  initialState,
  reducers: {
    completeDailyChallenge(
      state,
      action: PayloadAction<{ xpEarned: number; isPerfect: boolean }>
    ) {
      const todayKey = getTodayKey();
      const isRetake = state.lastCompletedDateKey === todayKey;

      if (!isRetake) {
        const yesterdayKey = getYesterdayKey();
        const newStreak =
          state.lastCompletedDateKey === yesterdayKey ? state.streak + 1 : 1;
        state.streak = newStreak;
        state.bestStreak = Math.max(state.bestStreak, newStreak);
        state.completionCount += 1;
        state.lastCompletedDateKey = todayKey;
        state.weekHistory = { ...state.weekHistory, [todayKey]: true };
      }

      state.totalXp += action.payload.xpEarned;
      if (action.payload.isPerfect) {
        state.perfectCount += 1;
      }
    },
  },
});

export const { completeDailyChallenge } = dailyChallengeSlice.actions;
export const dailyChallengeReducer = dailyChallengeSlice.reducer;

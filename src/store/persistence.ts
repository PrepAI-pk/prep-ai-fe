import { ALL_ROLES, type Role } from "../auth/permissions";
import type { DailyChallengeState } from "./slices/daily-challenge-slice";
import type { PracticeUiState } from "./slices/practice-Ui-slice";
import type { SessionState } from "./slices/session-slice";

const STORAGE_KEY = "prepai_frontend_store";

export type PersistedState = {
  practiceUi: PracticeUiState;
  dailyChallenge: DailyChallengeState;
  session: SessionState;
};

function isBookmarkRecord(value: unknown): value is Record<number, boolean> {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    return false;
  }

  return Object.values(value).every((bookmarkValue) => typeof bookmarkValue === "boolean");
}

function sanitizePersistedState(value: unknown): PersistedState | undefined {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    return undefined;
  }

  const candidate = value as {
    practiceUi?: unknown;
    dailyChallenge?: unknown;
    session?: unknown;
  };
  const practiceUi = candidate.practiceUi;

  if (!practiceUi || typeof practiceUi !== "object" || Array.isArray(practiceUi)) {
    return undefined;
  }

  const ui = practiceUi as {
    selectedSubject?: unknown;
    currentIndex?: unknown;
    bookmarks?: unknown;
  };

  const selectedSubject =
    typeof ui.selectedSubject === "string" && ui.selectedSubject.length > 0
      ? ui.selectedSubject
      : "All";

  const currentIndex =
    typeof ui.currentIndex === "number" && Number.isInteger(ui.currentIndex) && ui.currentIndex >= 0
      ? ui.currentIndex
      : 0;

  const bookmarks = isBookmarkRecord(ui.bookmarks) ? ui.bookmarks : {};

  // ---- dailyChallenge ----
  const rawDc = candidate.dailyChallenge;
  const dc = rawDc && typeof rawDc === "object" && !Array.isArray(rawDc)
    ? (rawDc as Record<string, unknown>)
    : {};

  const dateKeyPattern = /^\d{4}-\d{2}-\d{2}$/;

  const lastCompletedDateKey =
    typeof dc.lastCompletedDateKey === "string" &&
    dateKeyPattern.test(dc.lastCompletedDateKey)
      ? dc.lastCompletedDateKey
      : null;

  const safeNonNegInt = (v: unknown): number =>
    typeof v === "number" && Number.isInteger(v) && v >= 0 ? v : 0;

  const rawWh = dc.weekHistory;
  const weekHistory: Record<string, boolean> =
    rawWh && typeof rawWh === "object" && !Array.isArray(rawWh)
      ? Object.fromEntries(
          Object.entries(rawWh as Record<string, unknown>)
            .filter(
              ([k, v]) => dateKeyPattern.test(k) && typeof v === "boolean"
            )
            .map(([k, v]) => [k, v as boolean])
        )
      : {};

  // ---- session ----
  const rawSession = candidate.session;
  const sessionCandidate =
    rawSession && typeof rawSession === "object" && !Array.isArray(rawSession)
      ? (rawSession as { session?: unknown }).session
      : undefined;
  const sessionShape =
    sessionCandidate &&
    typeof sessionCandidate === "object" &&
    !Array.isArray(sessionCandidate)
      ? (sessionCandidate as { user?: unknown; roles?: unknown })
      : undefined;

  const rawRoles = sessionShape?.roles;
  const roles: Role[] =
    Array.isArray(rawRoles) &&
    rawRoles.length > 0 &&
    rawRoles.every((role): role is Role => ALL_ROLES.includes(role as Role))
      ? (rawRoles as Role[])
      : ["student"];

  const rawUser = sessionShape?.user;
  const userShape =
    rawUser && typeof rawUser === "object" && !Array.isArray(rawUser)
      ? (rawUser as { id?: unknown; name?: unknown; email?: unknown })
      : undefined;

  const user = {
    id: typeof userShape?.id === "string" ? userShape.id : "demo-user",
    name: typeof userShape?.name === "string" ? userShape.name : "Aisha Khan",
    email:
      typeof userShape?.email === "string"
        ? userShape.email
        : "aisha.khan@example.com",
  };

  return {
    practiceUi: {
      selectedSubject,
      currentIndex,
      bookmarks,
    },
    dailyChallenge: {
      lastCompletedDateKey,
      streak: safeNonNegInt(dc.streak),
      bestStreak: safeNonNegInt(dc.bestStreak),
      totalXp: safeNonNegInt(dc.totalXp),
      completionCount: safeNonNegInt(dc.completionCount),
      perfectCount: safeNonNegInt(dc.perfectCount),
      weekHistory,
    },
    session: {
      session: {
        user,
        roles,
      },
    },
  };
}

export function loadState(): PersistedState | undefined {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);

    if (!raw) {
      return undefined;
    }

    return sanitizePersistedState(JSON.parse(raw));
  } catch {
    return undefined;
  }
}

export function saveState(state: PersistedState): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // Ignore localStorage write failures.
  }
}

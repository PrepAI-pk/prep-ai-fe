import type { PracticeUiState } from "./slices/practice-Ui-slice";

const STORAGE_KEY = "prepai_frontend_store";

export type PersistedState = {
  practiceUi: PracticeUiState;
};

function sanitizePersistedState(value: unknown): PersistedState | undefined {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    return undefined;
  }

  const candidate = value as { practiceUi?: unknown };
  const practiceUi = candidate.practiceUi;

  if (!practiceUi || typeof practiceUi !== "object" || Array.isArray(practiceUi)) {
    return undefined;
  }

  const ui = practiceUi as { selectedSubject?: unknown };

  const selectedSubject =
    typeof ui.selectedSubject === "string" && ui.selectedSubject.length > 0
      ? ui.selectedSubject
      : "All";

  return {
    practiceUi: {
      selectedSubject,
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

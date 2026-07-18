// Theme/accent only — a paint-cache fast path so the app doesn't flash the
// default theme before GET /me/preferences resolves. The backend is the
// source of truth (see DynamicThemeApp); this is just what's known instantly
// on next load. defaultDifficulty/contentLanguage and all notification
// preferences are fully backend-owned now (api/me/me.endpoints.ts,
// api/onboarding) — no localStorage involved for those.
export type AccentChoice = "indigo" | "emerald" | "plum";
export type UiPrefs = {
  theme: "light" | "dark";
  accent: AccentChoice;
};

const UI_PREFS_KEY = "prepai_ui_prefs";

const defaultUiPrefs: UiPrefs = {
  theme: "light",
  accent: "indigo",
};

export function getDefaultUiPrefs(): UiPrefs {
  return defaultUiPrefs;
}

export function readUiPrefs(): UiPrefs {
  try {
    const raw = localStorage.getItem(UI_PREFS_KEY);
    if (!raw) {
      return defaultUiPrefs;
    }

    const parsed = JSON.parse(raw) as Partial<UiPrefs>;

    const theme = parsed.theme === "dark" ? "dark" : "light";
    const accent =
      parsed.accent === "emerald" || parsed.accent === "plum" || parsed.accent === "indigo"
        ? parsed.accent
        : "indigo";

    return { theme, accent };
  } catch {
    return defaultUiPrefs;
  }
}

export function writeUiPrefs(value: UiPrefs): void {
  try {
    localStorage.setItem(UI_PREFS_KEY, JSON.stringify(value));
  } catch {
    // Ignore localStorage write failures.
  }
}

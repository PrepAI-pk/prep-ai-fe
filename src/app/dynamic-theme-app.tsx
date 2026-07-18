import { CssBaseline, ThemeProvider } from "@mui/material";
import { useEffect, useMemo, type ReactNode } from "react";
import { useGetPreferencesQuery } from "../api/me/me.endpoints";
import { useAppSelector } from "../store/hooks";
import { selectAuthStatus } from "../store/slices/auth-slice";
import { buildPrepaiTheme } from "../theme/prepai-theme.ts";
import { readUiPrefs, writeUiPrefs, type UiPrefs } from "./settings-persistence.ts";

type DynamicThemeAppProps = {
  children: ReactNode;
};

function fromBackendPreferences(theme: string, accent: string): UiPrefs {
  return {
    theme: theme === "DARK" ? "dark" : "light",
    accent: accent === "EMERALD" || accent === "PLUM" ? accent.toLowerCase() as UiPrefs["accent"] : "indigo",
  };
}

export function DynamicThemeApp({ children }: DynamicThemeAppProps) {
  const status = useAppSelector(selectAuthStatus);
  // Skipped until logged in — the route itself is protected, and pre-login
  // screens (auth gate) just use whatever the paint-cache last knew.
  const { data } = useGetPreferencesQuery(undefined, { skip: status !== "authenticated" });

  const prefs = useMemo<UiPrefs>(() => {
    if (data) {
      return fromBackendPreferences(data.theme, data.accent);
    }
    return readUiPrefs();
  }, [data]);

  useEffect(() => {
    if (data) {
      writeUiPrefs(fromBackendPreferences(data.theme, data.accent));
    }
  }, [data]);

  const theme = useMemo(() => buildPrepaiTheme(prefs), [prefs]);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {children}
    </ThemeProvider>
  );
}

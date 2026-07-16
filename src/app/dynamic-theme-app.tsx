import { CssBaseline, ThemeProvider } from "@mui/material";
import { useEffect, useMemo, useState, type ReactNode } from "react";
import { readUiPrefs, type UiPrefs } from "./settings-persistence.ts";
import { buildPrepaiTheme } from "../theme/prepai-theme.ts";

type DynamicThemeAppProps = {
  children: ReactNode;
};

export function DynamicThemeApp({ children }: DynamicThemeAppProps) {
  const [prefs, setPrefs] = useState<UiPrefs>(() => readUiPrefs());

  useEffect(() => {
    function syncPrefs(): void {
      setPrefs(readUiPrefs());
    }

    window.addEventListener("storage", syncPrefs);
    window.addEventListener("prepai-ui-prefs-updated", syncPrefs as EventListener);

    return () => {
      window.removeEventListener("storage", syncPrefs);
      window.removeEventListener("prepai-ui-prefs-updated", syncPrefs as EventListener);
    };
  }, []);

  const theme = useMemo(() => buildPrepaiTheme(prefs), [prefs]);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {children}
    </ThemeProvider>
  );
}
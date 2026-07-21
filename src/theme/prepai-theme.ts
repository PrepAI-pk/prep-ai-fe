import { createTheme } from "@mui/material/styles";
import type { UiPrefs } from "../app/settings-persistence";

const accentMap = {
  indigo: {
    lightPrimary: "#33508c",
    darkPrimary: "#8aa4e0",
    lightSoft: "#eef2f9",
    darkSoft: "#1d2740",
  },
  emerald: {
    lightPrimary: "#2f7d5b",
    darkPrimary: "#5fb98d",
    lightSoft: "#e9f3ec",
    darkSoft: "#132a20",
  },
  plum: {
    lightPrimary: "#7d4a86",
    darkPrimary: "#b98ac4",
    lightSoft: "#f3ecf5",
    darkSoft: "#271a2b",
  },
} as const;

export function buildPrepaiTheme(prefs: UiPrefs) {
  const accent = accentMap[prefs.accent];
  const isDark = prefs.theme === "dark";

  return createTheme({
    palette: {
      mode: prefs.theme,
      primary: {
        main: isDark ? accent.darkPrimary : accent.lightPrimary,
        light: isDark ? accent.darkSoft : accent.lightSoft,
        contrastText: isDark ? "#0d1015" : "#ffffff",
      },
      secondary: {
        main: "#c2703d",
        light: isDark ? "#2a2018" : "#f6ece3",
      },
      background: {
        default: isDark ? "#0d1015" : "#f5f2ec",
        paper: isDark ? "#161b23" : "#ffffff",
      },
      text: {
        primary: isDark ? "#e9e7e2" : "#1b1e26",
        secondary: isDark ? "#9aa1ad" : "#5f6675",
        disabled: isDark ? "#6b7280" : "#8b909c",
      },
      success: {
        main: isDark ? "#4fae83" : "#2f7d5b",
        light: isDark ? "#16281f" : "#e9f3ec",
      },
      error: {
        main: isDark ? "#dd6b66" : "#c0453f",
        light: isDark ? "#2a1a1a" : "#f8eae9",
      },
      divider: isDark ? "#272d38" : "#e8e3d9",
    },
    shape: {
      borderRadius: 14,
    },
    typography: {
      fontFamily: '"Plus Jakarta Sans", system-ui, sans-serif',
      h1: {
        fontFamily: '"Source Serif 4", serif',
        fontWeight: 700,
        letterSpacing: "-0.02em",
      },
      h2: {
        fontFamily: '"Source Serif 4", serif',
        fontWeight: 700,
        letterSpacing: "-0.02em",
      },
      h3: {
        fontFamily: '"Source Serif 4", serif',
        fontWeight: 600,
        letterSpacing: "-0.01em",
      },
      button: {
        textTransform: "none",
        fontWeight: 600,
      },
      caption: {
        fontFamily: '"Space Mono", monospace',
        letterSpacing: "0.08em",
      },
    },
    components: {
      MuiPaper: {
        styleOverrides: {
          root: {
            backgroundImage: "none",
          },
        },
      },
      MuiCssBaseline: {
        styleOverrides: {
          "::-webkit-scrollbar": {
            width: 11,
            height: 11,
          },
          "::-webkit-scrollbar-thumb": {
            background: "rgba(120,120,130,.30)",
            borderRadius: 20,
            border: "3px solid transparent",
            backgroundClip: "content-box",
          },
          "::-webkit-scrollbar-thumb:hover": {
            background: "rgba(120,120,130,.5)",
            backgroundClip: "content-box",
          },
        },
      },
      MuiChip: {
        styleOverrides: {
          root: {
            borderRadius: 20,
            border: "1px solid",
            borderColor: isDark ? "#3b4658" : "#e8e3d9",
            backgroundColor: isDark ? "#202938" : "#ffffff",
            color: isDark ? "#e9e7e2" : "#1b1e26",
            fontWeight: 500,
          },
          sizeSmall: {
            height: 28,
            fontSize: 12,
          },
          label: {
            paddingLeft: 12,
            paddingRight: 12,
          },
          colorPrimary: {
            backgroundColor: isDark ? "rgba(138, 164, 224, 0.18)" : "#eef2f9",
            borderColor: isDark ? "#8aa4e0" : accent.lightPrimary,
            color: isDark ? "#c3d4ff" : accent.lightPrimary,
          },
          colorSecondary: {
            backgroundColor: isDark ? "rgba(194, 112, 61, 0.18)" : "#f6ece3",
            borderColor: isDark ? "#d29164" : "#c2703d",
            color: isDark ? "#ffd1b1" : "#c2703d",
          },
        },
      },
    },
  });
}

export const prepaiTheme = buildPrepaiTheme({
  theme: "light",
  accent: "indigo",
});

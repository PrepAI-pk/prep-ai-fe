import type { PracticeAnswerResponse } from "../../api/practice/practice.types";
import type { OptionVisualStyle } from "./practice.types";

const defaultOptionStyle: OptionVisualStyle = {
  borderColor: "divider",
  backgroundColor: "background.paper",
  opacity: 1,
  letter: {
    backgroundColor: "transparent",
    color: "text.primary",
  },
};

export function getDifficultyColor(difficulty: string): string {
  const normalized = difficulty.toLowerCase();

  if (normalized === "easy") {
    return "#2f7d5b";
  }

  if (normalized === "hard") {
    return "#c0453f";
  }

  return "#c2703d";
}

export function getOptionVisualStyle(
  index: number,
  checkResult: PracticeAnswerResponse | undefined,
  selectedIndex: number | null,
): OptionVisualStyle {
  if (!checkResult) {
    return defaultOptionStyle;
  }

  const { correctIndex } = checkResult;

  if (index === correctIndex) {
    return {
      borderColor: "success.main",
      backgroundColor: "#e9f3ec",
      opacity: 1,
      letter: {
        borderColor: "success.main",
        backgroundColor: "success.main",
        color: "#ffffff",
      },
    };
  }

  if (index === selectedIndex && selectedIndex !== correctIndex) {
    return {
      borderColor: "error.main",
      backgroundColor: "#f8eae9",
      opacity: 1,
      letter: {
        borderColor: "error.main",
        backgroundColor: "error.main",
        color: "#ffffff",
      },
    };
  }

  return {
    borderColor: "divider",
    backgroundColor: "background.paper",
    opacity: 0.55,
    letter: {
      backgroundColor: "transparent",
      color: "text.primary",
    },
  };
}

export function getOptionMark(
  index: number,
  checkResult: PracticeAnswerResponse | undefined,
  selectedIndex: number | null,
): string {
  if (!checkResult) {
    return "";
  }

  const { correctIndex } = checkResult;

  if (index === correctIndex) {
    return "Correct";
  }

  if (index === selectedIndex && selectedIndex !== correctIndex) {
    return "Your answer";
  }

  return "";
}

// Daily-limit usage as a progress bar — Free tier's 20/day cap doubles as the
// practice session's sense of "how far along am I today" (Pro/Elite are
// unlimited, so the bar reads full).
export function getUsageProgressValue(answeredToday: number, dailyLimit: number | null): number {
  if (dailyLimit === null || dailyLimit <= 0) {
    return 100;
  }

  return Math.min(100, (answeredToday / dailyLimit) * 100);
}

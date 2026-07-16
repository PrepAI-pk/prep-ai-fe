import type {
  CheckPracticeAnswerResponse,
  PracticeQuestion,
} from "../../api/practice/practice.types";
import type { BookmarkMap, OptionVisualStyle } from "./practice.types";

const defaultOptionStyle: OptionVisualStyle = {
  borderColor: "divider",
  backgroundColor: "background.paper",
  opacity: 1,
  letter: {
    backgroundColor: "transparent",
    color: "text.primary",
  },
};

export function deriveSubjects(questions: PracticeQuestion[]): string[] {
  const uniqueSubjects = Array.from(new Set(questions.map((q) => q.subject))).sort();
  return ["All", ...uniqueSubjects];
}

export function filterQuestionsBySubject(
  questions: PracticeQuestion[],
  selectedSubject: string,
): PracticeQuestion[] {
  if (selectedSubject === "All") {
    return questions;
  }

  return questions.filter((question) => question.subject === selectedSubject);
}

export function getProgressValue(currentIndex: number, total: number): number {
  if (total <= 0) {
    return 0;
  }

  return ((currentIndex + 1) / total) * 100;
}

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
  checkResult: CheckPracticeAnswerResponse | undefined,
): OptionVisualStyle {
  if (!checkResult) {
    return defaultOptionStyle;
  }

  const correctIndex = checkResult.correctIndex;
  const selectedIndex = checkResult.selectedIndex;

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
  checkResult: CheckPracticeAnswerResponse | undefined,
): string {
  if (!checkResult) {
    return "";
  }

  const correctIndex = checkResult.correctIndex;
  const selectedIndex = checkResult.selectedIndex;

  if (index === correctIndex) {
    return "Correct";
  }

  if (index === selectedIndex && selectedIndex !== correctIndex) {
    return "Your answer";
  }

  return "";
}

export function toggleBookmarkState(
  questionId: number,
  bookmarks: BookmarkMap,
): BookmarkMap {
  return {
    ...bookmarks,
    [questionId]: !bookmarks[questionId],
  };
}

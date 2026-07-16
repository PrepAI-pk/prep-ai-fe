import { styles as PlayStatusStyles } from "./play-status.styles";

export const quizProgressFillSx = (width: number) => ({
  ...PlayStatusStyles.QuizProgressFill,
  width: `${width}%`,
});

export const optionLetterSx = (isCorrect: boolean, isWrongChoice: boolean) => ({
  ...PlayStatusStyles.OptionLetter,
  bgcolor: isCorrect
    ? "success.main"
    : isWrongChoice
      ? "error.main"
      : "background.default",
  color: isCorrect || isWrongChoice ? "#fff" : "text.secondary",
});

export const revealBannerSx = (isCorrect: boolean) => ({
  ...PlayStatusStyles.RevealBanner,
  bgcolor: isCorrect ? "success.light" : "error.light",
  color: isCorrect ? "success.main" : "error.main",
});

export const optionCardSx = (
  revealed: boolean,
  isCorrect: boolean,
  isWrongChoice: boolean,
  isSelected: boolean,
) => ({
  p: "15px 17px",
  borderRadius: "13px",
  cursor: revealed ? "default" : "pointer",
  borderWidth: "1.5px",
  borderColor: isCorrect
    ? "success.main"
    : isWrongChoice
      ? "error.main"
      : isSelected
        ? "primary.main"
        : "divider",
  bgcolor: isCorrect
    ? "#e9f3ec"
    : isWrongChoice
      ? "#f8eae9"
      : "background.paper",
  opacity: revealed && !isCorrect && !isWrongChoice && !isSelected ? 0.55 : 1,
  transition: "border-color .15s, background-color .15s",
  "&:hover": revealed ? {} : { borderColor: "primary.main" },
});

export const getRightMarkText = (
  isCorrect: boolean,
  isWrongChoice: boolean,
  xpCorrect: number,
) => {
  if (isCorrect) {
    return `+${xpCorrect} XP`;
  }

  if (isWrongChoice) {
    return "Your answer";
  }

  return "";
};

export const getRightMarkSx = (isCorrect: boolean, isWrongChoice: boolean) => {
  if (isCorrect) {
    return PlayStatusStyles.RightMarkCorrect;
  }

  if (isWrongChoice) {
    return PlayStatusStyles.RightMarkWrong;
  }

  return PlayStatusStyles.RightMarkHidden;
};

export const getRevealBannerText = (isAnswerCorrect: boolean) => {
  if (isAnswerCorrect) {
    return "Correct!";
  }

  return "Not quite — review the explanation below";
};

export const getNextButtonLabel = (isNextButton: boolean) => {
  if (isNextButton) {
    return "Next →";
  }

  return "Finish";
};

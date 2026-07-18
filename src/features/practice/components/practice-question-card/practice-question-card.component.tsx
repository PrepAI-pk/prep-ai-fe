import { motion } from "framer-motion";
import BookmarkBorderRounded from "@mui/icons-material/BookmarkBorderRounded";
import BookmarkRounded from "@mui/icons-material/BookmarkRounded";
import { Alert, Box, Button, Chip, IconButton, Paper, Typography } from "@mui/material";
import type {
  PracticeAnswerResponse,
  PracticeNextQuestion,
} from "../../../../api/practice/practice.types";
import {
  getDifficultyColor,
  getOptionMark,
  getOptionVisualStyle,
} from "../../practice-ui.utils";

type PracticeQuestionCardProps = {
  question: PracticeNextQuestion;
  questionCounter: string;
  interactionState: "idle" | "checking" | "revealed";
  selectedOptionIndex: number | null;
  isLocked: boolean;
  checkResult: PracticeAnswerResponse | undefined;
  isBookmarked: boolean;
  onToggleBookmark: () => void;
  onSelectOption: (optionIndex: number) => void;
  onAskFollowUp: () => void;
  onSkipQuestion: () => void;
  onNextQuestion: () => void;
};

export function PracticeQuestionCard(props: PracticeQuestionCardProps) {
  const {
    question,
    questionCounter,
    interactionState,
    selectedOptionIndex,
    isLocked,
    checkResult,
    isBookmarked,
    onToggleBookmark,
    onSelectOption,
    onAskFollowUp,
    onSkipQuestion,
    onNextQuestion,
  } = props;

  return (
    <Paper
      component={motion.div}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      sx={{
        borderRadius: "20px",
        border: "1px solid",
        borderColor: "divider",
        p: { xs: 2.5, md: "28px 30px" },
        boxShadow: "0 4px 20px -8px rgba(24,24,32,.14)",
      }}
    >
      <Box sx={{ mb: 2, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <Chip
            label={question.subject.name}
            size="small"
            sx={{
              borderRadius: 2,
              bgcolor: "#eef2f9",
              color: "primary.main",
              fontFamily: '"Space Mono", monospace',
              fontSize: 11,
            }}
          />
          <Typography
            sx={{
              color: getDifficultyColor(question.difficulty),
              fontSize: 12.5,
              fontWeight: 700,
            }}
          >
            {question.difficulty}
          </Typography>
        </Box>
        <Box sx={{ display: "flex", alignItems: "center", gap: 0.4 }}>
          <Typography
            sx={{
              color: "text.secondary",
              fontFamily: '"Space Mono", monospace',
              fontSize: 12,
            }}
          >
            {questionCounter}
          </Typography>
          <IconButton
            size="small"
            onClick={onToggleBookmark}
            sx={{ color: isBookmarked ? "secondary.main" : "text.secondary" }}
          >
            {isBookmarked ? (
              <BookmarkRounded fontSize="small" />
            ) : (
              <BookmarkBorderRounded fontSize="small" />
            )}
          </IconButton>
        </Box>
      </Box>

      <Typography variant="h3" sx={{ fontSize: { xs: 22, md: 22 }, mb: 2.5 }}>
        {question.questionText}
      </Typography>

      <Box sx={{ display: "grid", gap: 1.4 }}>
        {question.options.map((option, index) => {
          const visualStyle = getOptionVisualStyle(index, checkResult, selectedOptionIndex);
          const isCheckingSelection =
            interactionState === "checking" && selectedOptionIndex === index;
          const checkingStyles = isCheckingSelection
            ? {
                borderColor: "primary.main",
                backgroundColor: "#eef2f9",
              }
            : null;

          return (
            <Paper
              key={`${question.id}-${index}`}
              variant="outlined"
              role="button"
              tabIndex={isLocked ? -1 : 0}
              aria-disabled={isLocked}
              aria-label={`Option ${String.fromCharCode(65 + index)}: ${option}`}
              onClick={() => onSelectOption(index)}
              onKeyDown={(event) => {
                if (isLocked) {
                  return;
                }

                if (event.key === "Enter" || event.key === " ") {
                  event.preventDefault();
                  onSelectOption(index);
                }
              }}
              sx={{
                p: "15px 17px",
                borderRadius: "13px",
                borderWidth: "1.5px",
                borderColor: checkingStyles?.borderColor ?? visualStyle.borderColor,
                backgroundColor:
                  checkingStyles?.backgroundColor ?? visualStyle.backgroundColor,
                opacity: visualStyle.opacity,
                cursor: isLocked ? "default" : "pointer",
                transition: "all .2s ease",
                outline: "none",
                "&:hover": isLocked
                  ? undefined
                  : {
                      borderColor: "primary.main",
                      transform: "translateY(-1px)",
                    },
                "&:focus-visible": {
                  boxShadow: "0 0 0 2px #ffffff, 0 0 0 4px #33508c",
                },
              }}
            >
              <Box sx={{ display: "flex", gap: 1.4, alignItems: "center" }}>
                <Box
                  sx={{
                    width: 28,
                    height: 28,
                    borderRadius: "9px",
                    border: "1px solid",
                    borderColor: visualStyle.letter.borderColor ?? "divider",
                    backgroundColor: visualStyle.letter.backgroundColor,
                    color: visualStyle.letter.color,
                    display: "grid",
                    placeItems: "center",
                    fontSize: 12,
                    fontWeight: 700,
                  }}
                >
                  {String.fromCharCode(65 + index)}
                </Box>
                <Typography sx={{ flex: 1, lineHeight: 1.5 }}>{option}</Typography>
                <Typography sx={{ color: "text.secondary", fontSize: 12, fontWeight: 600 }}>
                  {isCheckingSelection
                    ? "Checking..."
                    : getOptionMark(index, checkResult, selectedOptionIndex)}
                </Typography>
              </Box>
            </Paper>
          );
        })}
      </Box>

      {checkResult && (
        <Alert severity={checkResult.isCorrect ? "success" : "error"} sx={{ mt: 2.4, borderRadius: 2 }}>
          {checkResult.isCorrect
            ? "Correct answer"
            : "Incorrect answer. Review the explanation below."}
        </Alert>
      )}

      {checkResult && (
        <Paper
          variant="outlined"
          sx={{
            mt: 1.8,
            borderRadius: 2,
            borderLeft: "3px solid",
            borderLeftColor: "secondary.main",
            bgcolor: "background.default",
            p: 2.2,
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 0.9 }}>
            <Box
              sx={{
                width: 13,
                height: 13,
                borderRadius: "3px",
                backgroundColor: "secondary.main",
                transform: "rotate(45deg)",
              }}
            />
            <Typography variant="caption" sx={{ color: "secondary.main", letterSpacing: ".12em" }}>
              AI EXPLANATION
            </Typography>
          </Box>
          <Typography sx={{ mt: 1.1, lineHeight: 1.75 }}>{checkResult.explanation}</Typography>
          <Typography sx={{ mt: 1.2, color: "text.secondary", fontSize: 12 }}>
            Sourced from PrepAI knowledge base
          </Typography>
          <Button
            size="small"
            variant="text"
            sx={{ mt: 1.1, px: 0, fontWeight: 600, color: "secondary.main" }}
            onClick={onAskFollowUp}
          >
            Ask a follow-up →
          </Button>
        </Paper>
      )}

      <Box sx={{ mt: 2.4, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <Button
          variant="text"
          size="large"
          sx={{ borderRadius: 2.5, px: 1.2, py: 1.1, fontWeight: 600 }}
          onClick={onSkipQuestion}
          disabled={interactionState === "checking"}
        >
          Skip →
        </Button>
        <Typography sx={{ color: "text.secondary", fontSize: 13, fontWeight: 500 }}>
          Difficulty: {question.difficulty}
        </Typography>
        <Box>
          <Button
            variant="contained"
            size="large"
            sx={{ borderRadius: 2.5, px: 3.2, py: 1.1 }}
            onClick={onNextQuestion}
            disabled={interactionState !== "revealed"}
          >
            Next question →
          </Button>
        </Box>
      </Box>
    </Paper>
  );
}

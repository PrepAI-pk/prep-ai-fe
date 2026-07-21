import { Box, Button, Chip, Paper, Typography } from "@mui/material";

import { styles as PlayStatusStyles } from "./play-status.styles";
import {
  getNextButtonLabel,
  getRevealBannerText,
  getRightMarkSx,
  getRightMarkText,
  optionCardSx,
  optionLetterSx,
  quizProgressFillSx,
  revealBannerSx,
} from "./play-status.utils";
import type { PlayStatusProps } from "./play-status.types";

// Mirrors the backend's XP_BASE_PER_CORRECT (packages/contracts) — the
// per-question amount /daily-challenge/answer awards for a correct pick.
const XP_CORRECT = 10;

const PlayStatusComponent = ({
  progress,
  current,
  questionIndex,
  totalQuestions,
  selectedOption,
  revealed,
  handleSelect,
  handleNext,
}: PlayStatusProps) => {
  const isNextButton = questionIndex < totalQuestions - 1;
  const quizCounter = `Q ${questionIndex + 1}/${totalQuestions}`;
  const isAnswerCorrect = selectedOption === current.correctIndex;
  return (
    <>
      <Box sx={PlayStatusStyles.QuizProgressTrack}>
        <Box sx={quizProgressFillSx(progress)} />
      </Box>

      <Paper variant="outlined" sx={PlayStatusStyles.QuizCard}>
        <Box sx={PlayStatusStyles.QuizMetaRow}>
          <Chip
            size="small"
            label={current.subject}
            sx={PlayStatusStyles.QuizSubjectChip}
          />
          <Chip
            size="small"
            label={current.difficulty}
            sx={PlayStatusStyles.QuizDifficultyChip}
          />
          <Box sx={PlayStatusStyles.Spacer} />
          <Typography sx={PlayStatusStyles.QuizCounter}>
            {quizCounter}
          </Typography>
        </Box>

        <Typography variant="h3" sx={PlayStatusStyles.QuizTitle}>
          {current.question}
        </Typography>

        <Box sx={PlayStatusStyles.OptionsGrid}>
          {current.options.map((option, index) => {
            const isSelected = selectedOption === index;
            const isCorrect = revealed && index === current.correctIndex;
            const isWrongChoice =
              revealed && isSelected && index !== current.correctIndex;

            const rightMark = getRightMarkText(
              isCorrect,
              isWrongChoice,
              XP_CORRECT,
            );
            const rightMarkSx = getRightMarkSx(isCorrect, isWrongChoice);

            return (
              <Paper
                key={`${current.id}-${index}`}
                variant="outlined"
                onClick={() => handleSelect(index)}
                sx={optionCardSx(
                  revealed,
                  isCorrect,
                  isWrongChoice,
                  isSelected,
                )}
              >
                <Box sx={PlayStatusStyles.OptionRow}>
                  <Box sx={optionLetterSx(isCorrect, isWrongChoice)}>
                    {String.fromCharCode(65 + index)}
                  </Box>
                  <Typography sx={PlayStatusStyles.OptionText}>
                    {option}
                  </Typography>
                  <Typography sx={rightMarkSx}>{rightMark}</Typography>
                </Box>
              </Paper>
            );
          })}
        </Box>

        {revealed && (
          <>
            <Box sx={revealBannerSx(isAnswerCorrect)}>
              {getRevealBannerText(isAnswerCorrect)}
            </Box>

            <Paper variant="outlined" sx={PlayStatusStyles.AiExplanationCard}>
              <Typography sx={PlayStatusStyles.AiExplanationKicker}>
                AI Explanation
              </Typography>
              <Typography sx={PlayStatusStyles.AiExplanationText}>
                {current.explanation}
              </Typography>
            </Paper>

            <Box sx={PlayStatusStyles.NextRow}>
              <Button
                variant="contained"
                onClick={handleNext}
                sx={PlayStatusStyles.NextButton}
              >
                {getNextButtonLabel(isNextButton)}
              </Button>
            </Box>
          </>
        )}
      </Paper>
    </>
  );
};

export default PlayStatusComponent;

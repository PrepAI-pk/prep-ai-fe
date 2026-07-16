import { Paper, Box, Typography, Button } from "@mui/material";
import { styles as DoneStatusStyles } from "./done-status.styles";
import type { DoneStatusProps } from "./dont-status.types";

const DoneStatusComponent = ({
  resultTitle,
  resultSub,
  earnedXp,
  dc,
  score,
  challengeQuestions,
  onNavigateScreen,
}: DoneStatusProps) => {
  return (
    <Paper variant="outlined" sx={DoneStatusStyles.DoneCard}>
      <Box sx={DoneStatusStyles.Trophy}>🏆</Box>
      <Typography variant="h2" sx={DoneStatusStyles.DoneTitle}>
        {resultTitle}
      </Typography>
      <Typography sx={DoneStatusStyles.DoneSub}>{resultSub}</Typography>

      <Box sx={DoneStatusStyles.DoneStatsRow}>
        <Box sx={DoneStatusStyles.DoneStatPrimary}>
          <Typography sx={DoneStatusStyles.DoneStatValuePrimary}>
            +{earnedXp}
          </Typography>
          <Typography sx={DoneStatusStyles.DoneStatLabelPrimary}>
            XP earned
          </Typography>
        </Box>
        <Box sx={DoneStatusStyles.DoneStatSecondary}>
          <Typography sx={DoneStatusStyles.DoneStatValueSecondary}>
            {dc.streak}
          </Typography>
          <Typography sx={DoneStatusStyles.DoneStatLabel}>
            Day streak 🔥
          </Typography>
        </Box>
        <Box sx={DoneStatusStyles.DoneStatNeutral}>
          <Typography sx={DoneStatusStyles.DoneStatValuePrimary}>
            {score}/{challengeQuestions.length}
          </Typography>
          <Typography sx={DoneStatusStyles.DoneStatLabel}>Correct</Typography>
        </Box>
      </Box>

      <Box sx={DoneStatusStyles.DoneActions}>
        <Button
          variant="outlined"
          onClick={() => onNavigateScreen?.("leaderboard")}
          sx={DoneStatusStyles.DoneActionOutline}
        >
          View leaderboard
        </Button>
        <Button
          variant="contained"
          onClick={() => onNavigateScreen?.("dashboard")}
          sx={DoneStatusStyles.DoneActionFilled}
        >
          Back to dashboard
        </Button>
      </Box>
    </Paper>
  );
};

export default DoneStatusComponent;

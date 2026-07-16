import { Box, Button, Chip, Paper, Typography } from "@mui/material";
import { useEffect } from "react";

import type { BadgeUnlockOverlayProps } from "./badge-unlock-overlay.types";
import { styles as BadgeUnlockOverlayStyles, globalKeyframes } from "./badge-unlock-overlay.styles";

const BadgeUnlockOverlay = ({
  unlockOverlayOpen,
  unlockedBadge,
  earnedXp,
  setUnlockOverlayOpen,
}: BadgeUnlockOverlayProps) => {
  useEffect(() => {
    if (typeof document !== "undefined") {
      const style = document.createElement("style");
      style.textContent = globalKeyframes;
      document.head.appendChild(style);
      
      return () => {
        document.head.removeChild(style);
      };
    }
  }, []);

  if (!unlockOverlayOpen) {
    return null;
  }

  return (
    <Box
      onClick={() => setUnlockOverlayOpen(false)}
      sx={BadgeUnlockOverlayStyles.OverlayBackdrop}
    >
      <Paper
        onClick={(e) => e.stopPropagation()}
        sx={BadgeUnlockOverlayStyles.OverlayCard}
      >
        <Typography sx={BadgeUnlockOverlayStyles.OverlayHeader}>
          Badge Unlocked
        </Typography>

        <Box sx={BadgeUnlockOverlayStyles.IconContainer}>
          <Box sx={BadgeUnlockOverlayStyles.IconRayStyle} />
          <Box sx={BadgeUnlockOverlayStyles.IconGlowCircle} />
          <Box sx={BadgeUnlockOverlayStyles.OverlayIcon}>
            {unlockedBadge?.sym ?? "🏅"}
          </Box>
        </Box>

        <Typography sx={BadgeUnlockOverlayStyles.OverlayTitle}>
          {unlockedBadge?.name ?? "Badge unlocked"}
        </Typography>

        {unlockedBadge?.description && (
          <Typography sx={BadgeUnlockOverlayStyles.OverlayDescription}>
            {unlockedBadge.description}
          </Typography>
        )}

        <Chip
          label={`+${unlockedBadge?.xp ?? earnedXp} XP`}
          sx={BadgeUnlockOverlayStyles.XpChip}
        />

        <Button
          fullWidth
          sx={BadgeUnlockOverlayStyles.OverlayButton}
          variant="contained"
          onClick={() => setUnlockOverlayOpen(false)}
        >
          Claim reward
        </Button>
      </Paper>
    </Box>
  );
};

export default BadgeUnlockOverlay;

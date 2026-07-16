import { Box, Paper, Typography } from "@mui/material";
import { useScreenNavigate } from "../../routes/useScreenNavigation";
import { useDailyReminderToast } from "./useDailyReminderToast";

export function DailyReminderToast() {
  const { showToast, dismiss } = useDailyReminderToast();
  const screenNavigate = useScreenNavigate();

  if (!showToast) {
    return null;
  }

  return (
    <Paper
      elevation={0}
      sx={{
        position: "fixed",
        right: 24,
        bottom: 24,
        width: { xs: "calc(100vw - 40px)", sm: 340 },
        maxWidth: "calc(100vw - 40px)",
        borderRadius: "16px",
        p: "18px 20px",
        zIndex: 55,
        border: "1px solid",
        borderColor: "divider",
        boxShadow: "0 20px 50px -16px rgba(0,0,0,.4)",
      }}
    >
      <Box sx={{ display: "flex", alignItems: "flex-start", gap: "13px" }}>
        <Box
          sx={{
            width: 40,
            height: 40,
            flex: "none",
            borderRadius: "11px",
            bgcolor: "secondary.light",
            color: "secondary.main",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 20,
          }}
        >
          🔥
        </Box>
        <Box sx={{ flex: 1, minWidth: 0 }}>
          <Typography
            sx={{
              fontFamily: '"Source Serif 4", serif',
              fontSize: 15.5,
              fontWeight: 700,
              lineHeight: 1.3,
            }}
          >
            Keep your streak alive
          </Typography>
          <Typography
            sx={{
              color: "text.secondary",
              fontSize: 13,
              mt: "3px",
              lineHeight: 1.45,
            }}
          >
            Your daily challenge is ready. It only takes 5 minutes.
          </Typography>
        </Box>
        <Box
          title="Dismiss"
          onClick={dismiss}
          sx={{
            fontSize: 16,
            color: "text.disabled",
            cursor: "pointer",
            lineHeight: 1,
            flex: "none",
            "&:hover": { color: "text.primary" },
          }}
        >
          ✕
        </Box>
      </Box>

      <Box sx={{ mt: "14px", display: "flex", gap: "10px" }}>
        <Box
          onClick={() => screenNavigate("dailyChallenge")}
          sx={{
            flex: 1,
            textAlign: "center",
            py: "10px",
            borderRadius: "11px",
            bgcolor: "primary.main",
            color: "primary.contrastText",
            fontWeight: 600,
            fontSize: 13.5,
            cursor: "pointer",
            "&:hover": { opacity: 0.92 },
          }}
        >
          Start challenge
        </Box>
        <Box
          onClick={dismiss}
          sx={{
            px: "16px",
            py: "10px",
            borderRadius: "11px",
            border: "1px solid",
            borderColor: "divider",
            fontWeight: 600,
            fontSize: 13.5,
            cursor: "pointer",
            color: "text.secondary",
            "&:hover": { borderColor: "primary.main" },
          }}
        >
          Later
        </Box>
      </Box>
    </Paper>
  );
}

import { Box, Button, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { DEFAULT_PATH } from "../route-paths";

export function ForbiddenPage() {
  const navigate = useNavigate();

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 1.5,
        textAlign: "center",
        px: 3,
      }}
    >
      <Typography variant="h2" sx={{ fontSize: 28 }}>
        403 — Access denied
      </Typography>
      <Typography sx={{ color: "text.secondary", maxWidth: 420 }}>
        Your account doesn't have permission to view this page. Switch to an
        account with the right role, or head back to your dashboard.
      </Typography>
      <Button variant="contained" onClick={() => navigate(DEFAULT_PATH)} sx={{ mt: 1.5 }}>
        Back to dashboard
      </Button>
    </Box>
  );
}

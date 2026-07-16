import Google from "@mui/icons-material/Google";
import { Box, Button, TextField, Typography } from "@mui/material";
import { useState } from "react";
import type { AuthenticatedUser, AuthMode } from "../../auth.types";

type AuthGateProps = {
  onAuthenticated: (user: AuthenticatedUser) => void;
};

export function AuthGate(props: AuthGateProps) {
  const { onAuthenticated } = props;

  const [authMode, setAuthMode] = useState<AuthMode>("signup");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  function handleSubmit(): void {
    onAuthenticated({
      name: name.trim() || email.split("@")[0] || "Aspirant",
      email,
    });
  }

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: { xs: "column", md: "row" },
        background: "#f5f2ec",
      }}
    >
      <Box
        sx={{
          width: { xs: "100%", md: "40%" },
          maxWidth: { md: 460 },
          px: { xs: 3, md: 5.2 },
          py: { xs: 3.4, md: 5.2 },
          color: "#ffffff",
          background: "#33508c",
          position: "relative",
          overflow: "hidden",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <Box
          sx={{
            position: "absolute",
            right: -60,
            bottom: -60,
            width: 240,
            height: 240,
            borderRadius: "50%",
            background: "rgba(255,255,255,.06)",
          }}
        />
        <Box
          sx={{
            position: "absolute",
            right: 40,
            top: 90,
            width: 120,
            height: 120,
            borderRadius: "50%",
            background: "rgba(255,255,255,.05)",
          }}
        />

        <Box sx={{ position: "relative", display: "flex", alignItems: "center", gap: 1.4 }}>
          <Box
            sx={{
              width: 42,
              height: 42,
              borderRadius: "12px",
              bgcolor: "#fff",
              color: "#33508c",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontFamily: '"Source Serif 4", serif',
              fontWeight: 700,
              fontSize: 23,
            }}
          >
            P
          </Box>
          <Typography sx={{ fontFamily: '"Source Serif 4", serif', fontSize: 24, fontWeight: 700 }}>
            PrepAI
          </Typography>
        </Box>

        <Box
          sx={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            position: "relative",
            mt: { xs: 4, md: 0 },
          }}
        >
          <Typography
            sx={{
              fontFamily: '"Source Serif 4", serif',
              fontSize: { xs: 29, md: 33 },
              fontWeight: 700,
              letterSpacing: "-.02em",
              lineHeight: 1.2,
            }}
          >
            Crack your competitive exam with an AI tutor in your corner.
          </Typography>

          <Box sx={{ display: "grid", gap: 1.7, mt: 3.5 }}>
            {[
              "40,000+ MCQs across 9 exams with AI explanations",
              "Full mock exams with rank estimation",
              "A study plan that adapts to your weak areas",
            ].map((item) => (
              <Box key={item} sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                <Box
                  sx={{
                    width: 28,
                    height: 28,
                    borderRadius: "8px",
                    bgcolor: "rgba(255,255,255,.16)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 14,
                    fontWeight: 700,
                    flex: "none",
                  }}
                >
                  v
                </Box>
                <Typography sx={{ fontSize: 14.5, opacity: 0.93 }}>{item}</Typography>
              </Box>
            ))}
          </Box>
        </Box>

        <Typography sx={{ fontSize: 12.5, opacity: 0.75, position: "relative", mt: 2 }}>
          Trusted by 40,000+ aspirants preparing for FIA, CSS, PMS, PPSC and more.
        </Typography>
      </Box>

      <Box sx={{ flex: 1, minWidth: 0, overflow: "auto" }}>
        <Box
          sx={{
            maxWidth: 460,
            width: "100%",
            mx: "auto",
            px: { xs: 2.6, md: 4.5 },
            py: { xs: 3.2, md: 5 },
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            minHeight: "100%",
          }}
        >
          <Typography
            sx={{
              fontFamily: '"Source Serif 4", serif',
              fontSize: 27,
              fontWeight: 700,
              letterSpacing: "-.02em",
              lineHeight: 1.2,
            }}
          >
            {authMode === "signup" ? "Create your account" : "Welcome back"}
          </Typography>
          <Typography sx={{ fontSize: 14, color: "#5f6675", mt: 0.6 }}>
            {authMode === "signup"
              ? "Start free with no card required."
              : "Log in to continue where you left off."}
          </Typography>

          <Box sx={{ mt: 3, display: "grid", gap: 1.4 }}>
            <Button
              variant="outlined"
              startIcon={<Google />}
              sx={{
                justifyContent: "flex-start",
                borderRadius: "12px",
                borderWidth: "1.5px",
                borderColor: "#e8e3d9",
                color: "#1b1e26",
                textTransform: "none",
                fontWeight: 600,
                py: 1.2,
                px: 1.8,
              }}
            >
              Continue with Google
            </Button>

            <Box sx={{ display: "flex", alignItems: "center", gap: 1, color: "#8b909c", fontSize: 12 }}>
              <Box sx={{ flex: 1, height: "1px", bgcolor: "#e8e3d9" }} />
              or
              <Box sx={{ flex: 1, height: "1px", bgcolor: "#e8e3d9" }} />
            </Box>

            {authMode === "signup" && (
              <TextField
                placeholder="Full name"
                value={name}
                onChange={(event) => setName(event.target.value)}
                sx={{ "& .MuiOutlinedInput-root": { borderRadius: "12px", background: "#fff" } }}
              />
            )}

            <TextField
              placeholder="Email address"
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              sx={{ "& .MuiOutlinedInput-root": { borderRadius: "12px", background: "#fff" } }}
            />
            <TextField
              placeholder="Password"
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              sx={{ "& .MuiOutlinedInput-root": { borderRadius: "12px", background: "#fff" } }}
            />

            <Button
              variant="text"
              onClick={() => setAuthMode((prev) => (prev === "signup" ? "login" : "signup"))}
              sx={{
                justifyContent: "flex-start",
                width: "fit-content",
                p: 0,
                textTransform: "none",
                fontWeight: 700,
                color: "#33508c",
              }}
            >
              {authMode === "signup" ? "Already have an account? Log in" : "Need an account? Sign up"}
            </Button>
          </Box>

          <Button
            variant="contained"
            onClick={handleSubmit}
            sx={{
              mt: 2.6,
              borderRadius: "12px",
              textTransform: "none",
              bgcolor: "#33508c",
              color: "#fff",
              py: 1.2,
              fontWeight: 700,
              boxShadow: "none",
              "&:hover": { bgcolor: "#2a4478", boxShadow: "none" },
            }}
          >
            {authMode === "signup" ? "Create account" : "Log in"}
          </Button>
        </Box>
      </Box>
    </Box>
  );
}

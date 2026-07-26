import Google from "@mui/icons-material/Google";
import {
  Alert,
  Box,
  Button,
  GlobalStyles,
  MenuItem,
  TextField,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
} from "@mui/material";
import { useState } from "react";
import PhoneInput from "react-phone-number-input";
import "react-phone-number-input/style.css";
import type { AuthSuccessResponse, Gender, OtpChannel } from "../../../../api/auth/auth.types";
import {
  useGoogleAuthMutation,
  useLoginMutation,
  useRegisterMutation,
  useResendVerificationMutation,
  useVerifyEmailMutation,
} from "../../../../api/auth/auth.endpoints";
import { toApiErrorMessage } from "../../../../api/error";
import { useAppDispatch } from "../../../../store/hooks";
import { authSucceeded } from "../../../../store/slices/auth-slice";
import type { AuthMode } from "../../auth.types";

const GENDER_OPTIONS: { value: Gender; label: string }[] = [
  { value: "MALE", label: "Male" },
  { value: "FEMALE", label: "Female" },
  { value: "OTHER", label: "Other" },
  { value: "PREFER_NOT_TO_SAY", label: "Prefer not to say" },
];

const OTP_CHANNEL_OPTIONS: { value: OtpChannel; label: string }[] = [
  { value: "EMAIL", label: "Email" },
  { value: "SMS", label: "Text" },
  { value: "BOTH", label: "Both" },
];

const textFieldSx = { "& .MuiOutlinedInput-root": { borderRadius: "12px", background: "#fff" } };

// react-phone-number-input renders its own markup (no MUI styling hook), so
// this restyles it to match the surrounding TextFields instead of leaving
// the library's default look.
const phoneInputGlobalStyles = (
  <GlobalStyles
    styles={{
      ".PhoneInput": {
        display: "flex",
        alignItems: "center",
        gap: 8,
        border: "1px solid rgba(0,0,0,0.23)",
        borderRadius: "12px",
        background: "#fff",
        padding: "0 12px",
        height: "56px",
      },
      ".PhoneInput:focus-within": {
        border: "2px solid #33508c",
        padding: "0 11px",
      },
      ".PhoneInputCountry": { marginRight: 4 },
      ".PhoneInputInput": {
        border: "none",
        outline: "none",
        flex: 1,
        height: "100%",
        fontSize: "1rem",
        fontFamily: "inherit",
        background: "transparent",
      },
    }}
  />
);

export function AuthGate() {
  const [authMode, setAuthMode] = useState<AuthMode>("signup");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [city, setCity] = useState("");
  const [gender, setGender] = useState<Gender | "">("");
  const [otpChannel, setOtpChannel] = useState<OtpChannel>("EMAIL");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Set once registration succeeds but the account isn't verified yet — its
  // presence switches the panel to the OTP-entry screen. The tokens are
  // already valid (the backend logs the user in at registration), but we
  // hold off dispatching authSucceeded until the code is confirmed so the
  // app router doesn't navigate away from this screen.
  const [pendingAuth, setPendingAuth] = useState<AuthSuccessResponse | null>(null);
  const [otpCode, setOtpCode] = useState("");
  const [resendNotice, setResendNotice] = useState<string | null>(null);
  // Only ever set from a response's `devOtp` field, which the backend only
  // populates outside production (no email/SMS provider may be configured
  // there) — this is what lets you finish the flow without either.
  const [devOtpHint, setDevOtpHint] = useState<string | null>(null);

  const dispatch = useAppDispatch();
  const [register, { isLoading: isRegistering }] = useRegisterMutation();
  const [login, { isLoading: isLoggingIn }] = useLoginMutation();
  const [googleAuth, { isLoading: isGoogleLoading }] = useGoogleAuthMutation();
  const [verifyEmail, { isLoading: isVerifying }] = useVerifyEmailMutation();
  const [resendVerification, { isLoading: isResending }] = useResendVerificationMutation();

  const isSubmitting = isRegistering || isLoggingIn;

  async function handleSubmit(): Promise<void> {
    setErrorMessage(null);
    try {
      if (authMode === "signup") {
        const result = await register({
          fullName: name.trim() || email.split("@")[0] || "Aspirant",
          email,
          password,
          phone: phone.trim(),
          city: city.trim(),
          gender: gender || undefined,
          otpChannel,
        }).unwrap();

        if (result.user.emailVerifiedAt) {
          dispatch(authSucceeded(result));
        } else {
          setPendingAuth(result);
          setDevOtpHint(result.devOtp ?? null);
          setOtpCode(result.devOtp ?? "");
        }
        return;
      }

      const result = await login({ email, password }).unwrap();
      dispatch(authSucceeded(result));
    } catch (error) {
      setErrorMessage(toApiErrorMessage(error, "Something went wrong. Please try again."));
    }
  }

  async function handleGoogle(): Promise<void> {
    setErrorMessage(null);
    try {
      // No real Google credential flow wired up yet — this always reaches
      // the backend's "not configured" stub, which is the point: an honest
      // message instead of a dead button.
      await googleAuth({ idToken: "frontend-placeholder" }).unwrap();
    } catch (error) {
      setErrorMessage(toApiErrorMessage(error, "Google sign-in isn't available yet."));
    }
  }

  async function handleVerifyOtp(): Promise<void> {
    if (!pendingAuth) {
      return;
    }
    setErrorMessage(null);
    try {
      await verifyEmail({ email, code: otpCode }).unwrap();
      dispatch(
        authSucceeded({
          ...pendingAuth,
          user: { ...pendingAuth.user, emailVerifiedAt: new Date().toISOString() },
        }),
      );
    } catch (error) {
      setErrorMessage(toApiErrorMessage(error, "That code didn't work. Please try again."));
    }
  }

  async function handleResendOtp(): Promise<void> {
    setErrorMessage(null);
    setResendNotice(null);
    try {
      const result = await resendVerification({ email, channel: otpChannel }).unwrap();
      setResendNotice("A new code is on its way.");
      setDevOtpHint(result.devOtp ?? null);
      if (result.devOtp) {
        setOtpCode(result.devOtp);
      }
    } catch (error) {
      setErrorMessage(toApiErrorMessage(error, "Couldn't resend the code. Please try again."));
    }
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
      {phoneInputGlobalStyles}
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
            {pendingAuth ? "Verify your email" : authMode === "signup" ? "Create your account" : "Welcome back"}
          </Typography>
          <Typography sx={{ fontSize: 14, color: "#5f6675", mt: 0.6 }}>
            {pendingAuth
              ? `Enter the 6-digit code we sent to ${email}.`
              : authMode === "signup"
                ? "Start free with no card required."
                : "Log in to continue where you left off."}
          </Typography>

          {errorMessage && (
            <Alert severity="error" sx={{ mt: 2, borderRadius: "10px" }} onClose={() => setErrorMessage(null)}>
              {errorMessage}
            </Alert>
          )}
          {resendNotice && !errorMessage && (
            <Alert severity="success" sx={{ mt: 2, borderRadius: "10px" }} onClose={() => setResendNotice(null)}>
              {resendNotice}
            </Alert>
          )}

          {pendingAuth ? (
            <Box sx={{ mt: 3, display: "grid", gap: 1.4 }}>
              {devOtpHint && (
                <Alert severity="info" sx={{ borderRadius: "10px" }}>
                  No email/SMS provider is configured on this server yet — your dev-only code is{" "}
                  <strong>{devOtpHint}</strong> (pre-filled below).
                </Alert>
              )}

              <TextField
                placeholder="6-digit code"
                value={otpCode}
                onChange={(event) => setOtpCode(event.target.value.replace(/\D/g, "").slice(0, 6))}
                disabled={isVerifying}
                sx={textFieldSx}
              />

              <Button
                variant="contained"
                onClick={handleVerifyOtp}
                disabled={isVerifying || otpCode.length !== 6}
                sx={{
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
                {isVerifying ? "Verifying…" : "Verify email"}
              </Button>

              <Button
                variant="text"
                onClick={handleResendOtp}
                disabled={isResending}
                sx={{
                  justifyContent: "flex-start",
                  width: "fit-content",
                  p: 0,
                  textTransform: "none",
                  fontWeight: 700,
                  color: "#33508c",
                }}
              >
                {isResending ? "Resending…" : "Resend code"}
              </Button>
            </Box>
          ) : (
            <>
              <Box sx={{ mt: 3, display: "grid", gap: 1.4 }}>
                <Button
                  variant="outlined"
                  startIcon={<Google />}
                  onClick={handleGoogle}
                  disabled={isGoogleLoading}
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
                    disabled={isSubmitting}
                    sx={textFieldSx}
                  />
                )}

                <TextField
                  placeholder="Email address"
                  type="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  disabled={isSubmitting}
                  sx={textFieldSx}
                />
                <TextField
                  placeholder="Password"
                  type="password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  disabled={isSubmitting}
                  sx={textFieldSx}
                />

                {authMode === "signup" && (
                  <>
                    <PhoneInput
                      international
                      defaultCountry="PK"
                      placeholder="Phone number"
                      value={phone}
                      onChange={(value) => setPhone(value ?? "")}
                      disabled={isSubmitting}
                    />
                    <TextField
                      placeholder="City"
                      value={city}
                      onChange={(event) => setCity(event.target.value)}
                      disabled={isSubmitting}
                      sx={textFieldSx}
                    />
                    <TextField
                      select
                      label="Gender (optional)"
                      value={gender}
                      onChange={(event) => setGender(event.target.value as Gender | "")}
                      disabled={isSubmitting}
                      sx={textFieldSx}
                    >
                      <MenuItem value="">Prefer not to answer</MenuItem>
                      {GENDER_OPTIONS.map((option) => (
                        <MenuItem key={option.value} value={option.value}>
                          {option.label}
                        </MenuItem>
                      ))}
                    </TextField>

                    <Box>
                      <Typography sx={{ fontSize: 12.5, color: "#5f6675", mb: 0.6 }}>
                        Send the verification code via
                      </Typography>
                      <ToggleButtonGroup
                        exclusive
                        value={otpChannel}
                        onChange={(_event, value: OtpChannel | null) => value && setOtpChannel(value)}
                        disabled={isSubmitting}
                        sx={{
                          "& .MuiToggleButton-root": {
                            textTransform: "none",
                            borderRadius: "10px !important",
                            border: "1.5px solid #e8e3d9 !important",
                            px: 1.8,
                            py: 0.6,
                            fontWeight: 600,
                            color: "#5f6675",
                            "&.Mui-selected": { bgcolor: "#33508c", color: "#fff" },
                          },
                        }}
                      >
                        {OTP_CHANNEL_OPTIONS.map((option) => (
                          <ToggleButton key={option.value} value={option.value}>
                            {option.label}
                          </ToggleButton>
                        ))}
                      </ToggleButtonGroup>
                    </Box>
                  </>
                )}

                <Button
                  variant="text"
                  onClick={() => {
                    setErrorMessage(null);
                    setAuthMode((prev) => (prev === "signup" ? "login" : "signup"));
                  }}
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
                disabled={
                  isSubmitting ||
                  !email ||
                  !password ||
                  (authMode === "signup" && (!phone || !city))
                }
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
                {isSubmitting
                  ? "Please wait…"
                  : authMode === "signup"
                    ? "Create account"
                    : "Log in"}
              </Button>
            </>
          )}
        </Box>
      </Box>
    </Box>
  );
}

import { Alert, Box, Button, Paper, Switch, Typography } from "@mui/material";
import { useMemo, useState } from "react";
import {
  useCompleteOnboardingMutation,
  usePatchOnboardingMutation,
  useSkipOnboardingMutation,
} from "../../../../api/onboarding/onboarding.endpoints";
import { toApiErrorMessage } from "../../../../api/error";
import { useAppDispatch } from "../../../../store/hooks";
import { onboardingMarkedComplete } from "../../../../store/slices/auth-slice";
import {
  CURRENT_LEVEL_LABELS,
  CURRENT_LEVEL_OPTIONS,
  DAILY_HOURS_OPTIONS,
  EXAM_GOAL_OPTIONS,
  ONBOARDING_STEPS,
  STUDY_TIMELINE_OPTIONS,
} from "../../onboarding.constants";
import type { CurrentLevel, DailyHours, StudyTimeline } from "../../onboarding.types";

export function OnboardingPage() {
  const [step, setStep] = useState(0);
  const [goal, setGoal] = useState("CSS");
  const [timeline, setTimeline] = useState<StudyTimeline>("3 months");
  const [dailyHours, setDailyHours] = useState<DailyHours>("2h");
  const [level, setLevel] = useState<CurrentLevel>("SOME_PREPARATION");
  const [diagnostic, setDiagnostic] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const dispatch = useAppDispatch();
  const [patchOnboarding, { isLoading: isPatching }] = usePatchOnboardingMutation();
  const [completeOnboarding, { isLoading: isCompleting }] = useCompleteOnboardingMutation();
  const [skipOnboarding, { isLoading: isSkipping }] = useSkipOnboardingMutation();

  const isBusy = isPatching || isCompleting || isSkipping;

  const examTags: Record<(typeof EXAM_GOAL_OPTIONS)[number], string> = {
    CSS: "Most popular",
    PMS: "Provincial",
    FPSC: "Federal",
    NTS: "General",
    Custom: "Flexible",
  };

  const summary = useMemo(
    () => ({ goal, timeline, dailyHours, level, diagnostic }),
    [dailyHours, diagnostic, goal, level, timeline],
  );

  async function handleContinue(): Promise<void> {
    setErrorMessage(null);
    try {
      if (step === 1) {
        await patchOnboarding({ timeline, dailyHours }).unwrap();
      } else if (step === 2) {
        await patchOnboarding({ level, diagnosticOptIn: diagnostic }).unwrap();
      }

      if (step === ONBOARDING_STEPS.length - 1) {
        await completeOnboarding().unwrap();
        dispatch(onboardingMarkedComplete());
        return;
      }

      setStep((previous) => Math.min(previous + 1, ONBOARDING_STEPS.length - 1));
    } catch (error) {
      setErrorMessage(toApiErrorMessage(error, "Couldn't save that — please try again."));
    }
  }

  async function handleSkip(): Promise<void> {
    setErrorMessage(null);
    try {
      await skipOnboarding().unwrap();
      dispatch(onboardingMarkedComplete());
    } catch (error) {
      setErrorMessage(toApiErrorMessage(error, "Couldn't skip onboarding — please try again."));
    }
  }

  function handleBack(): void {
    setStep((previous) => Math.max(previous - 1, 0));
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
            maxWidth: 560,
            width: "100%",
            mx: "auto",
            px: { xs: 2.6, md: 4.5 },
            py: { xs: 3.2, md: 5 },
            display: "flex",
            flexDirection: "column",
            minHeight: "100%",
          }}
        >
          <Box sx={{ display: "flex", alignItems: "flex-start", mb: 3.8 }}>
            {ONBOARDING_STEPS.map((label, index) => {
              const isActive = index === step;
              const isDone = index < step;
              return (
                <Box key={label} sx={{ display: "flex", alignItems: "center", flex: 1 }}>
                  <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 0.8 }}>
                    <Box
                      sx={{
                        width: 26,
                        height: 26,
                        borderRadius: "50%",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontWeight: 700,
                        fontSize: 12,
                        border: "1.5px solid",
                        borderColor: isDone || isActive ? "#33508c" : "#d7d1c8",
                        background: isDone || isActive ? "#33508c" : "#f5f2ec",
                        color: isDone || isActive ? "#fff" : "#8b909c",
                      }}
                    >
                      {index + 1}
                    </Box>
                    <Typography
                      sx={{
                        fontSize: 11,
                        color: isDone || isActive ? "#33508c" : "#8b909c",
                        fontWeight: 700,
                        textTransform: "uppercase",
                        letterSpacing: ".08em",
                        fontFamily: '"Space Mono", monospace',
                      }}
                    >
                      {label}
                    </Typography>
                  </Box>
                  {index < ONBOARDING_STEPS.length - 1 && (
                    <Box
                      sx={{
                        flex: 1,
                        height: "1px",
                        bgcolor: index < step ? "#33508c" : "#e8e3d9",
                        mx: 1,
                        mt: -2.2,
                      }}
                    />
                  )}
                </Box>
              );
            })}
          </Box>

          <Box sx={{ flex: 1 }}>
            <Typography
              sx={{
                fontFamily: '"Source Serif 4", serif',
                fontSize: 27,
                fontWeight: 700,
                letterSpacing: "-.02em",
                lineHeight: 1.2,
              }}
            >
              {step === 0 && "What are you preparing for?"}
              {step === 1 && "Set your pace"}
              {step === 2 && "Where are you starting from?"}
              {step === 3 && "You are all set"}
            </Typography>
            <Typography sx={{ fontSize: 14, color: "#5f6675", mt: 0.6 }}>
              {step === 0 && "We will tailor your questions, mocks, and study plan to this exam."}
              {step === 1 && "This shapes how much your daily plan asks of you."}
              {step === 2 && "Be honest so PrepAI can calibrate your starting difficulty."}
              {step === 3 && "You can change these choices at any time in settings."}
            </Typography>

            {errorMessage && (
              <Alert severity="error" sx={{ mt: 2, borderRadius: "10px" }} onClose={() => setErrorMessage(null)}>
                {errorMessage}
              </Alert>
            )}

            {step === 0 && (
              <Box
                sx={{
                  display: "grid",
                  gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" },
                  gap: 1.4,
                  mt: 2.7,
                }}
              >
                {EXAM_GOAL_OPTIONS.map((item) => {
                  const selected = goal === item;
                  return (
                    <Paper
                      key={item}
                      onClick={() => setGoal(item)}
                      variant="outlined"
                      sx={{
                        borderRadius: "14px",
                        px: 1.7,
                        py: 1.5,
                        cursor: "pointer",
                        border: "1.5px solid",
                        borderColor: selected ? "#33508c" : "#e8e3d9",
                        bgcolor: selected ? "#eef2f9" : "#fff",
                        transition: "all .2s ease",
                      }}
                    >
                      <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 1 }}>
                        <Typography
                          sx={{
                            fontSize: 10,
                            letterSpacing: ".08em",
                            textTransform: "uppercase",
                            fontFamily: '"Space Mono", monospace',
                            color: selected ? "#33508c" : "#8b909c",
                          }}
                        >
                          {examTags[item]}
                        </Typography>
                        <Box
                          sx={{
                            width: 8,
                            height: 8,
                            borderRadius: "50%",
                            bgcolor: selected ? "#33508c" : "#d2ccc3",
                          }}
                        />
                      </Box>
                      <Typography
                        sx={{
                          mt: 0.8,
                          fontFamily: '"Source Serif 4", serif',
                          fontSize: 20,
                          fontWeight: 700,
                          color: "#1b1e26",
                        }}
                      >
                        {item}
                      </Typography>
                    </Paper>
                  );
                })}
              </Box>
            )}

            {step === 1 && (
              <Box sx={{ mt: 2.9 }}>
                <Typography
                  sx={{
                    fontSize: 12,
                    letterSpacing: ".1em",
                    textTransform: "uppercase",
                    color: "#8b909c",
                    fontWeight: 700,
                    fontFamily: '"Space Mono", monospace',
                    mb: 1.2,
                  }}
                >
                  When is your exam?
                </Typography>
                <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
                  {STUDY_TIMELINE_OPTIONS.map((item) => (
                    <Button
                      key={item}
                      variant="outlined"
                      onClick={() => setTimeline(item)}
                      sx={{
                        borderRadius: "999px",
                        border: "1.5px solid",
                        borderColor: timeline === item ? "#33508c" : "#e8e3d9",
                        bgcolor: timeline === item ? "#eef2f9" : "#fff",
                        color: timeline === item ? "#33508c" : "#5f6675",
                        textTransform: "none",
                        fontWeight: 600,
                        px: 1.8,
                      }}
                    >
                      {item}
                    </Button>
                  ))}
                </Box>

                <Typography
                  sx={{
                    fontSize: 12,
                    letterSpacing: ".1em",
                    textTransform: "uppercase",
                    color: "#8b909c",
                    fontWeight: 700,
                    fontFamily: '"Space Mono", monospace',
                    mb: 1.2,
                    mt: 2.8,
                  }}
                >
                  Daily study time
                </Typography>
                <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
                  {DAILY_HOURS_OPTIONS.map((item) => (
                    <Button
                      key={item}
                      variant="outlined"
                      onClick={() => setDailyHours(item)}
                      sx={{
                        borderRadius: "999px",
                        border: "1.5px solid",
                        borderColor: dailyHours === item ? "#33508c" : "#e8e3d9",
                        bgcolor: dailyHours === item ? "#33508c" : "#fff",
                        color: dailyHours === item ? "#fff" : "#5f6675",
                        textTransform: "none",
                        fontWeight: 600,
                        px: 1.8,
                      }}
                    >
                      {item}/day
                    </Button>
                  ))}
                </Box>
              </Box>
            )}

            {step === 2 && (
              <Box sx={{ mt: 2.7, display: "grid", gap: 1.2 }}>
                {CURRENT_LEVEL_OPTIONS.map((item) => (
                  <Paper
                    key={item}
                    onClick={() => setLevel(item)}
                    variant="outlined"
                    sx={{
                      p: 1.35,
                      borderRadius: "13px",
                      cursor: "pointer",
                      border: "1.5px solid",
                      borderColor: level === item ? "#33508c" : "#e8e3d9",
                      bgcolor: level === item ? "#eef2f9" : "#fff",
                    }}
                  >
                    <Typography sx={{ fontSize: 14.5, fontWeight: 600 }}>
                      {CURRENT_LEVEL_LABELS[item]}
                    </Typography>
                  </Paper>
                ))}

                <Paper
                  variant="outlined"
                  sx={{
                    mt: 1,
                    p: 1.6,
                    borderRadius: "14px",
                    borderColor: "#e8e3d9",
                    bgcolor: "#fbf9f5",
                  }}
                >
                  <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 1.4 }}>
                    <Box>
                      <Typography sx={{ fontWeight: 600, fontSize: 14.5 }}>Take a 5-minute diagnostic</Typography>
                      <Typography sx={{ fontSize: 13, color: "#5f6675", mt: 0.2 }}>
                        A short test so PrepAI can identify weak areas from day one.
                      </Typography>
                    </Box>
                    <Switch checked={diagnostic} onChange={(event) => setDiagnostic(event.target.checked)} />
                  </Box>
                </Paper>
              </Box>
            )}

            {step === 3 && (
              <Box sx={{ mt: 2.7 }}>
                <Box
                  sx={{
                    width: 62,
                    height: 62,
                    borderRadius: "50%",
                    bgcolor: "#e9f3ec",
                    color: "#2f7d5b",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontWeight: 700,
                    fontSize: 26,
                  }}
                >
                  OK
                </Box>

                <Paper
                  variant="outlined"
                  sx={{
                    mt: 2,
                    borderRadius: "16px",
                    overflow: "hidden",
                    borderColor: "#e8e3d9",
                  }}
                >
                  {[
                    { label: "Exam", value: summary.goal },
                    { label: "Timeline", value: summary.timeline },
                    { label: "Daily study", value: `${summary.dailyHours}/day` },
                    { label: "Current level", value: CURRENT_LEVEL_LABELS[summary.level] },
                    { label: "Diagnostic", value: summary.diagnostic ? "Enabled" : "Skipped" },
                  ].map((item, index) => (
                    <Box
                      key={item.label}
                      sx={{
                        px: 2.2,
                        py: 1.5,
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        borderTop: index === 0 ? "none" : "1px solid #e8e3d9",
                        gap: 2,
                      }}
                    >
                      <Typography sx={{ fontSize: 13, color: "#5f6675" }}>{item.label}</Typography>
                      <Typography sx={{ fontSize: 14, fontWeight: 600, textAlign: "right" }}>{item.value}</Typography>
                    </Box>
                  ))}
                </Paper>
              </Box>
            )}
          </Box>

          <Box sx={{ display: "flex", alignItems: "center", gap: 1.3, mt: 3.5 }}>
            <Button
              variant="outlined"
              onClick={handleBack}
              disabled={step === 0 || isBusy}
              sx={{
                borderRadius: "12px",
                borderWidth: "1.5px",
                borderColor: "#e8e3d9",
                color: "#1b1e26",
                textTransform: "none",
                px: 2.3,
                py: 1.15,
                visibility: step === 0 ? "hidden" : "visible",
              }}
            >
              Back
            </Button>

            <Button
              variant="contained"
              onClick={handleContinue}
              disabled={isBusy}
              sx={{
                flex: 1,
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
              {isBusy
                ? "Please wait…"
                : step === ONBOARDING_STEPS.length - 1
                  ? "Enter PrepAI"
                  : "Continue"}
            </Button>
          </Box>

          <Button
            variant="text"
            onClick={handleSkip}
            disabled={isBusy}
            sx={{
              mt: 1.5,
              alignSelf: "center",
              textTransform: "none",
              color: "#8b909c",
              fontSize: 13,
              fontWeight: 500,
            }}
          >
            Skip for now
          </Button>
        </Box>
      </Box>
    </Box>
  );
}

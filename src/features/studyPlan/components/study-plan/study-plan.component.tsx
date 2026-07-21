import { useMemo, useState } from "react";
import {
  Alert,
  Box,
  Button,
  Chip,
  CircularProgress,
  Paper,
  Typography,
} from "@mui/material";
import type { AppScreen } from "../../../../app/screens";
import { useGetExamsQuery } from "../../../../api/mock-exams/mock-exams.endpoints";
import {
  useGenerateStudyPlanMutation,
  useGetStudyPlanQuery,
  usePatchStudyPlanMutation,
  usePatchStudyPlanTaskMutation,
} from "../../../../api/study-plan/study-plan.endpoints";
import type { StudyPlanTask } from "../../../../api/study-plan/study-plan.types";
import { isPlanRequiredError, toApiErrorMessage } from "../../../../api/error";
import { PracticeTopbar } from "../../../practice";

type StudyPlanPageProps = {
  onNavigateScreen?: (screen: AppScreen) => void;
};

const DAILY_HOURS_OPTIONS = ["1h", "2h", "3h", "4h+"] as const;

const TARGET_REF_TO_SCREEN: Record<string, AppScreen> = {
  practice: "practice",
  notes: "notesRevision",
  exams: "mockExams",
  library: "mcqLibrary",
  dashboard: "dashboard",
};

const TASK_TYPE_COLOR: Record<StudyPlanTask["type"], string> = {
  PRACTICE: "primary.main",
  FLASHCARDS: "secondary.main",
  REVISION: "secondary.main",
  MOCK: "error.main",
  NOTES: "secondary.main",
  REVIEW: "success.main",
};

const PRIORITY_META: Record<StudyPlanTask["priority"], { fg: string; bg: string; label: string }> = {
  HIGH: { fg: "error.main", bg: "error.light", label: "High" },
  MED: { fg: "secondary.main", bg: "secondary.light", label: "Medium" },
  LOW: { fg: "success.main", bg: "success.light", label: "Low" },
};

function StudyPlanPaywall({ onNavigateScreen }: StudyPlanPageProps) {
  return (
    <Paper
      variant="outlined"
      sx={{ maxWidth: 520, mx: "auto", mt: 6, p: "28px 26px", borderRadius: "20px", textAlign: "center" }}
    >
      <Typography sx={{ fontFamily: '"Space Mono", monospace', fontSize: 11, letterSpacing: ".12em", textTransform: "uppercase", color: "secondary.main", fontWeight: 700 }}>
        Pro feature
      </Typography>
      <Typography variant="h3" sx={{ fontSize: 22, mt: 1 }}>
        The AI Study Plan is part of PrepAI Pro
      </Typography>
      <Typography sx={{ mt: 1, color: "text.secondary", fontSize: 14, lineHeight: 1.6 }}>
        Upgrade to get a weekly schedule generated from your real weak areas, with practice, revision and mock-exam tasks laid out for you.
      </Typography>
      <Button
        variant="contained"
        sx={{ mt: 2.5, borderRadius: "11px", py: 1.2, px: 3 }}
        onClick={() => onNavigateScreen?.("subscriptionPaywall")}
      >
        Compare plans
      </Button>
    </Paper>
  );
}

export function StudyPlanPage(props: StudyPlanPageProps = {}) {
  const { onNavigateScreen } = props;

  const planQuery = useGetStudyPlanQuery();
  const examsQuery = useGetExamsQuery();
  const [generatePlan, { isLoading: isRegenerating }] = useGenerateStudyPlanMutation();
  const [patchPreferences] = usePatchStudyPlanMutation();
  const [patchTask] = usePatchStudyPlanTaskMutation();

  const plan = planQuery.data;
  const planRequired = isPlanRequiredError(planQuery.error);
  const exams = examsQuery.data ?? [];

  const todayIndex = useMemo(() => {
    const index = plan?.week.findIndex((day) => day.today) ?? -1;
    return index >= 0 ? index : 0;
  }, [plan]);
  const [selectedDayIndex, setSelectedDayIndex] = useState<number | null>(null);
  const activeDayIndex = selectedDayIndex ?? todayIndex;

  const selectedDay = plan?.week[activeDayIndex];
  const selectedTasks = useMemo(
    () => (plan && selectedDay ? plan.tasks.filter((task) => task.date === selectedDay.date) : []),
    [plan, selectedDay],
  );

  const weekTotal = plan?.week.reduce((sum, day) => sum + day.total, 0) ?? 0;
  const weekDone = plan?.week.reduce((sum, day) => sum + day.done, 0) ?? 0;
  const weekPct = weekTotal > 0 ? Math.round((weekDone / weekTotal) * 100) : 0;

  const dayTotalMins = selectedTasks.reduce((sum, task) => sum + task.minutes, 0);
  const dayDoneMins = selectedTasks.filter((task) => task.done).reduce((sum, task) => sum + task.minutes, 0);
  const dayPct = dayTotalMins > 0 ? Math.round((dayDoneMins / dayTotalMins) * 100) : 0;

  function toggleTaskDone(task: StudyPlanTask): void {
    void patchTask({ id: task.id, done: !task.done });
  }

  function handleStartTask(task: StudyPlanTask): void {
    const screen = task.targetRef ? TARGET_REF_TO_SCREEN[task.targetRef] : undefined;
    onNavigateScreen?.(screen ?? "practice");
  }

  return (
    <Box sx={{ flex: 1, minWidth: 0, display: "flex", flexDirection: "column", height: "100vh", overflow: "hidden" }}>
        <PracticeTopbar
          currentScreen="studyPlan"
          title="Study Plan"
          subtitle="Goal-driven schedule built from your weakest subjects"
          searchPlaceholder="Search Plan"
          onOpenGlobalSearch={() => onNavigateScreen?.("globalSearch")}
          onOpenSettings={() => onNavigateScreen?.("settingsProfile")}
          onNavigateScreen={onNavigateScreen}
        />

        <Box sx={{ flex: 1, overflow: "auto", px: { xs: 2, md: 3.75 }, pt: { xs: 2.5, md: 3.75 }, pb: { xs: 5, md: 7.5 } }}>
          {planRequired && <StudyPlanPaywall onNavigateScreen={onNavigateScreen} />}

          {!planRequired && planQuery.isError && (
            <Alert severity="error" sx={{ maxWidth: 640, mx: "auto", borderRadius: 2 }}>
              Could not load your study plan. {toApiErrorMessage(planQuery.error, "Please try again.")}
            </Alert>
          )}

          {!planRequired && planQuery.isLoading && (
            <Box sx={{ display: "flex", justifyContent: "center", py: 8 }}>
              <CircularProgress size={28} />
            </Box>
          )}

          {!planRequired && plan && selectedDay && (
          <Box sx={{ maxWidth: 940, mx: "auto" }}>
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: "1.1fr .9fr",
                gap: "16px",
                mb: "16px",
                "@media (max-width: 980px)": {
                  gridTemplateColumns: "1fr",
                },
              }}
            >
              <Paper
                variant="outlined"
                sx={{
                  backgroundColor: "background.paper",
                  borderColor: "divider",
                  borderLeft: "3px solid",
                  borderLeftColor: "secondary.main",
                  borderRadius: "0 16px 16px 0",
                  p: "20px 22px",
                  boxShadow: "0 1px 2px rgba(24,24,32,.05)",
                }}
              >
                <Box sx={{ display: "flex", alignItems: "center", gap: "8px", mb: "9px" }}>
                  <Box sx={{ width: 14, height: 14, borderRadius: "3px", transform: "rotate(45deg)", backgroundColor: "secondary.main" }} />
                  <Typography sx={{ fontSize: 11, letterSpacing: ".12em", textTransform: "uppercase", fontWeight: 700, color: "secondary.main", fontFamily: '"Space Mono", monospace' }}>
                    AI Study Plan
                  </Typography>
                </Box>

                <Typography sx={{ fontSize: 14.5, lineHeight: 1.6, color: "text.primary" }}>
                  {plan.rationale}
                </Typography>

                <Box sx={{ display: "flex", gap: "8px", flexWrap: "wrap", mt: "14px" }}>
                  {exams.map((exam) => (
                    <Chip
                      key={exam.id}
                      label={exam.name}
                      onClick={() => void patchPreferences({ goalExamId: exam.id })}
                      sx={{
                        borderRadius: "999px",
                        border: "1px solid",
                        borderColor: plan.goal?.examId === exam.id ? "primary.main" : "divider",
                        backgroundColor: plan.goal?.examId === exam.id ? "primary.light" : "background.paper",
                        color: plan.goal?.examId === exam.id ? "primary.main" : "text.secondary",
                        fontSize: 12.5,
                        height: 30,
                      }}
                    />
                  ))}
                </Box>

                <Box sx={{ display: "flex", gap: "8px", flexWrap: "wrap", mt: "8px" }}>
                  {DAILY_HOURS_OPTIONS.map((hours) => (
                    <Chip
                      key={hours}
                      label={`${hours}/day`}
                      onClick={() => void patchPreferences({ dailyHours: hours })}
                      sx={{
                        borderRadius: "999px",
                        border: "1px solid",
                        borderColor: plan.dailyHours === hours ? "primary.main" : "divider",
                        backgroundColor: plan.dailyHours === hours ? "primary.light" : "background.paper",
                        color: plan.dailyHours === hours ? "primary.main" : "text.secondary",
                        fontSize: 12.5,
                        height: 30,
                      }}
                    />
                  ))}
                </Box>
              </Paper>

              <Paper
                variant="outlined"
                sx={{
                  backgroundColor: "background.paper",
                  borderColor: "divider",
                  borderRadius: "16px",
                  p: "20px 22px",
                  boxShadow: "0 1px 2px rgba(24,24,32,.05)",
                }}
              >
                <Typography sx={{ fontFamily: '"Source Serif 4", serif', fontSize: 16, fontWeight: 600, mb: "14px" }}>
                  Focus subjects
                </Typography>

                {plan.focusSubjects.length === 0 ? (
                  <Typography sx={{ fontSize: 13, color: "text.secondary", lineHeight: 1.6 }}>
                    Answer a few practice questions to see your weakest subjects here.
                  </Typography>
                ) : (
                  <Box sx={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                    {plan.focusSubjects.map((subject) => {
                      const col = subject.acc < 60 ? "error.main" : "secondary.main";
                      return (
                        <Box key={subject.name}>
                          <Box sx={{ display: "flex", justifyContent: "space-between", fontSize: 13, mb: "5px" }}>
                            <Typography sx={{ fontSize: 13, fontWeight: 500 }}>{subject.name}</Typography>
                            <Typography sx={{ fontFamily: '"Space Mono", monospace', fontSize: 12, fontWeight: 700, color: col }}>{subject.acc}%</Typography>
                          </Box>
                          <Box sx={{ height: 7, borderRadius: "20px", backgroundColor: "background.default", overflow: "hidden" }}>
                            <Box sx={{ height: "100%", width: `${subject.acc}%`, borderRadius: "20px", backgroundColor: col }} />
                          </Box>
                        </Box>
                      );
                    })}
                  </Box>
                )}
              </Paper>
            </Box>
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: "10px" }}>
              <Typography sx={{ fontSize: 13, color: "text.secondary" }}>
                Week progress · <Box component="strong" sx={{ color: "text.primary" }}>{weekDone}/{weekTotal}</Box> tasks · {weekPct}%
              </Typography>
              <Typography
                onClick={() => (isRegenerating ? undefined : void generatePlan())}
                sx={{ fontSize: 13, fontWeight: 600, color: "primary.main", cursor: isRegenerating ? "default" : "pointer", opacity: isRegenerating ? 0.6 : 1, "&:hover": { opacity: isRegenerating ? 0.6 : 0.8 } }}
              >
                {isRegenerating ? "Regenerating…" : "↻ Regenerate plan"}
              </Typography>
            </Box>

            <Box sx={{ display: "flex", gap: "8px", mb: "20px", "@media (max-width: 980px)": { overflowX: "auto", pb: 0.5 } }}>
              {plan.week.map((day, index) => {
                const isSel = index === activeDayIndex;
                const complete = day.total > 0 && day.done === day.total;

                return (
                  <Box
                    key={day.date}
                    onClick={() => setSelectedDayIndex(index)}
                    sx={{
                      flex: 1,
                      minWidth: { xs: 68, md: 0 },
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      gap: "6px",
                      py: "12px",
                      px: "6px",
                      borderRadius: "14px",
                      cursor: "pointer",
                      border: "1.5px solid",
                      borderColor: isSel ? "primary.main" : "divider",
                      backgroundColor: isSel ? "primary.light" : "background.paper",
                    }}
                  >
                    <Typography
                      sx={{
                        fontSize: 9,
                        letterSpacing: ".1em",
                        textTransform: "uppercase",
                        color: "secondary.main",
                        fontWeight: 700,
                        fontFamily: '"Space Mono", monospace',
                        display: day.today ? "block" : "none",
                        lineHeight: 1,
                      }}
                    >
                      Today
                    </Typography>
                    <Typography sx={{ fontSize: 12, fontWeight: 700, color: isSel ? "primary.main" : "text.secondary" }}>{day.d}</Typography>
                    <Box
                      sx={{
                        width: 26,
                        height: 26,
                        borderRadius: "50%",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: 11,
                        fontWeight: 700,
                        fontFamily: '"Space Mono", monospace',
                        backgroundColor: complete ? "success.main" : "background.default",
                        color: complete ? "#fff" : "text.disabled",
                      }}
                    >
                      {complete ? "✓" : `${day.done}/${day.total}`}
                    </Box>
                  </Box>
                );
              })}
            </Box>

            <Box sx={{ display: "grid", gridTemplateColumns: "1fr 220px", gap: "20px", "@media (max-width: 980px)": { gridTemplateColumns: "1fr" } }}>
              <Box>
                <Typography sx={{ fontFamily: '"Source Serif 4", serif', fontSize: 18, fontWeight: 600, mb: "12px" }}>
                  {selectedDay.today ? "Today's" : `${selectedDay.d}'s`} tasks
                </Typography>

                <Box sx={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                  {selectedTasks.map((task) => {
                    return (
                      <Box
                        key={task.id}
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          gap: "16px",
                          backgroundColor: "background.paper",
                          border: "1px solid",
                          borderColor: "divider",
                          borderLeft: "3px solid",
                          borderLeftColor: TASK_TYPE_COLOR[task.type],
                          borderRadius: "14px",
                          p: "16px 18px",
                          boxShadow: "0 1px 2px rgba(24,24,32,.05)",
                          opacity: task.done ? 0.6 : 1,
                        }}
                      >
                        <Box
                          onClick={() => toggleTaskDone(task)}
                          sx={{
                            width: 26,
                            height: 26,
                            flex: "none",
                            borderRadius: "8px",
                            border: "2px solid",
                            borderColor: task.done ? "success.main" : "divider",
                            backgroundColor: task.done ? "success.main" : "transparent",
                            color: "#fff",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            fontSize: 14,
                            cursor: "pointer",
                          }}
                        >
                          {task.done ? "✓" : ""}
                        </Box>

                        <Box sx={{ flex: 1, minWidth: 0 }}>
                          <Box sx={{ display: "flex", alignItems: "center", gap: "10px", mb: "3px" }}>
                            <Typography sx={{ fontSize: 10, letterSpacing: ".08em", textTransform: "uppercase", fontWeight: 700, fontFamily: '"Space Mono", monospace', color: TASK_TYPE_COLOR[task.type] }}>
                              {task.type}
                            </Typography>
                            <Typography sx={{ fontSize: 11, color: "text.disabled" }}>· {task.subjectLabel}</Typography>
                          </Box>
                          <Typography sx={{ fontFamily: '"Source Serif 4", serif', fontSize: 15.5, fontWeight: 600, lineHeight: 1.3, textDecoration: task.done ? "line-through" : "none" }}>
                            {task.title}
                          </Typography>
                        </Box>

                        <Typography sx={{ fontSize: 12, color: "text.disabled", fontFamily: '"Space Mono", monospace', whiteSpace: "nowrap" }}>
                          {task.minutes} min
                        </Typography>

                        <Box
                          sx={{
                            fontSize: 11,
                            fontWeight: 700,
                            px: "9px",
                            py: "3px",
                            borderRadius: "6px",
                            backgroundColor: PRIORITY_META[task.priority].bg,
                            color: PRIORITY_META[task.priority].fg,
                            fontFamily: '"Space Mono", monospace',
                            textTransform: "uppercase",
                            whiteSpace: "nowrap",
                          }}
                        >
                          {PRIORITY_META[task.priority].label}
                        </Box>

                        <Box
                          onClick={() => handleStartTask(task)}
                          sx={{
                            p: "8px 16px",
                            borderRadius: "10px",
                            backgroundColor: "primary.main",
                            color: "primary.contrastText",
                            fontWeight: 600,
                            fontSize: 13,
                            cursor: "pointer",
                            whiteSpace: "nowrap",
                            "&:hover": { opacity: 0.92 },
                          }}
                        >
                          Start
                        </Box>
                      </Box>
                    );
                  })}
                </Box>
              </Box>

              <Paper
                variant="outlined"
                sx={{
                  borderRadius: "16px",
                  borderColor: "divider",
                  p: "22px 20px",
                  textAlign: "center",
                  boxShadow: "0 1px 2px rgba(24,24,32,.05)",
                  height: "fit-content",
                }}
              >
                <Typography sx={{ fontSize: 12, letterSpacing: ".1em", textTransform: "uppercase", color: "text.disabled", fontFamily: '"Space Mono", monospace', mb: "14px" }}>
                  {selectedDay.today ? "Today's focus" : `${selectedDay.d}'s focus`}
                </Typography>
                <Box
                  sx={{
                    width: 132,
                    height: 132,
                    borderRadius: "50%",
                    background: `conic-gradient(#33508c 0deg ${Math.round((dayPct / 100) * 360)}deg, #e3e8f1 ${Math.round((dayPct / 100) * 360)}deg 360deg)`,
                    mx: "auto",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Box sx={{ width: 92, height: 92, borderRadius: "50%", backgroundColor: "background.paper", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
                    <Typography sx={{ fontFamily: '"Source Serif 4", serif', fontSize: 26, fontWeight: 700, lineHeight: 1 }}>
                      {dayPct}%
                    </Typography>
                    <Typography sx={{ fontSize: 10, color: "text.disabled", fontFamily: '"Space Mono", monospace' }}>done</Typography>
                  </Box>
                </Box>
                <Typography sx={{ fontSize: 13, color: "text.secondary", mt: "16px", fontFamily: '"Space Mono", monospace' }}>
                  {dayDoneMins} / {dayTotalMins} min
                </Typography>
              </Paper>
              </Box>
          </Box>
          )}
        </Box>
      </Box>
  );
}

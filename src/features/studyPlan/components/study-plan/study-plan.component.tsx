import { useMemo, useState } from "react";
import {
  Box,
  Chip,
  Paper,
  Typography,
} from "@mui/material";
import type { AppScreen } from "../../../../app/screens";
import { useGetSubjectsQuery } from "../../../../api/subjects/subjects.endpoints";
import { PracticeTopbar } from "../../../practice";

type StudyPlanPageProps = {
  onNavigateScreen?: (screen: AppScreen) => void;
};

type WeakSubject = {
  subject: string;
  accuracy: number;
  solved: number;
};

type TaskItem = {
  id: string;
  title: string;
  subject: string;
  type: "Practice" | "Revision" | "Mock" | "Review";
  priority: "High" | "Medium" | "Low";
  minutes: number;
  targetScreen: AppScreen;
};

type PlanDay = {
  d: "Mon" | "Tue" | "Wed" | "Thu" | "Fri" | "Sat" | "Sun";
  today?: boolean;
  tasks: TaskItem[];
};

function scoreFromSubject(subject: string): number {
  let hash = 0;
  for (let i = 0; i < subject.length; i += 1) {
    hash = (hash * 31 + subject.charCodeAt(i)) % 997;
  }
  return hash;
}

function deriveWeakSubjects(subjects: string[]): WeakSubject[] {
  return subjects
    .map((subject) => {
      const seed = scoreFromSubject(subject);
      const accuracy = 42 + (seed % 43);
      const solved = 24 + (seed % 90);
      return { subject, accuracy, solved };
    })
    .sort((a, b) => a.accuracy - b.accuracy)
    .slice(0, 3);
}

function createWeekPlan(weakSubjects: WeakSubject[], dailyHours: number): PlanDay[] {
  const s1 = weakSubjects[0]?.subject ?? "Pakistan Affairs";
  const s2 = weakSubjects[1]?.subject ?? "Current Affairs";
  const s3 = weakSubjects[2]?.subject ?? "General Knowledge";
  const block = Math.max(1, dailyHours) * 15;

  return [
    {
      d: "Mon",
      tasks: [
        { id: "m1", type: "Practice", subject: s1, title: `Timed MCQ drill: ${s1}`, minutes: block + 15, priority: "High", targetScreen: "practice" },
        { id: "m2", type: "Revision", subject: s2, title: `Concept recap: ${s2}`, minutes: block, priority: "Medium", targetScreen: "notesRevision" },
      ],
    },
    {
      d: "Tue",
      tasks: [
        { id: "t1", type: "Practice", subject: s3, title: `Accuracy set: ${s3}`, minutes: block + 10, priority: "High", targetScreen: "practice" },
        { id: "t2", type: "Revision", subject: s1, title: `Short revision: ${s1}`, minutes: block, priority: "Medium", targetScreen: "notesRevision" },
      ],
    },
    {
      d: "Wed",
      tasks: [
        { id: "w1", type: "Practice", subject: s2, title: `Past-paper practice: ${s2}`, minutes: block + 15, priority: "High", targetScreen: "practice" },
        { id: "w2", type: "Revision", subject: s3, title: `Recall notes: ${s3}`, minutes: block, priority: "Medium", targetScreen: "notesRevision" },
      ],
    },
    {
      d: "Thu",
      tasks: [
        { id: "th1", type: "Practice", subject: s1, title: `Speed round: ${s1}`, minutes: block + 10, priority: "High", targetScreen: "practice" },
        { id: "th2", type: "Revision", subject: s2, title: `Revise mistakes: ${s2}`, minutes: block, priority: "Medium", targetScreen: "notesRevision" },
      ],
    },
    {
      d: "Fri",
      tasks: [
        { id: "f1", type: "Practice", subject: s3, title: `Mixed drill: ${s3}`, minutes: block + 15, priority: "High", targetScreen: "practice" },
        { id: "f2", type: "Revision", subject: s1, title: `Quick recap: ${s1}`, minutes: block, priority: "Medium", targetScreen: "notesRevision" },
      ],
    },
    {
      d: "Sat",
      today: true,
      tasks: [
        { id: "s1", type: "Mock", subject: "Full Syllabus", title: "Full mock exam (timed)", minutes: block + 30, priority: "High", targetScreen: "mockExams" },
        { id: "s2", type: "Review", subject: "Weekly", title: "Check progress and re-plan", minutes: block, priority: "Low", targetScreen: "dashboard" },
      ],
    },
    {
      d: "Sun",
      tasks: [
        { id: "su1", type: "Revision", subject: s1, title: `Light recall: ${s1}`, minutes: block, priority: "Low", targetScreen: "notesRevision" },
        { id: "su2", type: "Review", subject: "Weekly", title: "Set priorities for next week", minutes: block, priority: "Low", targetScreen: "dashboard" },
      ],
    },
  ];
}

export function StudyPlanPage(props: StudyPlanPageProps = {}) {
  const { onNavigateScreen } = props;
  const subjectsQuery = useGetSubjectsQuery();

  const [goal, setGoal] = useState("CSS Screening");
  const [dailyHours, setDailyHours] = useState(2);
  const [doneMap, setDoneMap] = useState<Record<string, boolean>>({});

  const subjects = useMemo(() => {
    const values = (subjectsQuery.data ?? []).map((subject) => subject.name);
    return values.length > 0 ? values : ["Pakistan Affairs", "Current Affairs", "General Knowledge"];
  }, [subjectsQuery.data]);

  const weakSubjects = useMemo(() => deriveWeakSubjects(subjects), [subjects]);
  const weekPlan = useMemo(() => createWeekPlan(weakSubjects, dailyHours), [dailyHours, weakSubjects]);
  const [selectedDayIndex, setSelectedDayIndex] = useState(5);

  const selectedDay = weekPlan[selectedDayIndex] ?? weekPlan[0];
  const selectedTasks = selectedDay?.tasks ?? [];
  const weekDays = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

  const weekProgress = weekPlan.map((day) => {
    const done = day.tasks.filter((task) => doneMap[task.id]).length;
    return { d: day.d, total: day.tasks.length, done, today: !!day.today };
  });

  const weekTotal = weekProgress.reduce((sum, day) => sum + day.total, 0);
  const weekDone = weekProgress.reduce((sum, day) => sum + day.done, 0);
  const weekPct = weekTotal > 0 ? Math.round((weekDone / weekTotal) * 100) : 0;

  const dayTotalMins = selectedTasks.reduce((sum, task) => sum + task.minutes, 0);
  const dayDoneMins = selectedTasks.filter((task) => doneMap[task.id]).reduce((sum, task) => sum + task.minutes, 0);
  const dayPct = dayTotalMins > 0 ? Math.round((dayDoneMins / dayTotalMins) * 100) : 0;

  function toggleTaskDone(taskId: string): void {
    setDoneMap((previous) => ({
      ...previous,
      [taskId]: !previous[taskId],
    }));
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
                  Your plan front-loads {weakSubjects[0]?.subject ?? "Pakistan Affairs"}, {weakSubjects[1]?.subject ?? "English"} and {weakSubjects[2]?.subject ?? "General Knowledge"} into high-priority practice slots earlier in the week, with a full mock on Saturday and lighter recall on Sunday.
                </Typography>

                <Box sx={{ display: "flex", gap: "8px", flexWrap: "wrap", mt: "14px" }}>
                  {["FIA Assistant Director", "CSS Screening", "PPSC Assistant"].map((item) => (
                    <Chip
                      key={item}
                      label={item}
                      onClick={() => setGoal(item)}
                      sx={{
                        borderRadius: "999px",
                        border: "1px solid",
                        borderColor: goal === item ? "primary.main" : "divider",
                        backgroundColor: goal === item ? "primary.light" : "background.paper",
                        color: goal === item ? "primary.main" : "text.secondary",
                        fontSize: 12.5,
                        height: 30,
                      }}
                    />
                  ))}
                </Box>

                <Box sx={{ display: "flex", gap: "8px", flexWrap: "wrap", mt: "8px" }}>
                  {[1, 2, 3].map((hours) => (
                    <Chip
                      key={hours}
                      label={`${hours}h/day`}
                      onClick={() => setDailyHours(hours)}
                      sx={{
                        borderRadius: "999px",
                        border: "1px solid",
                        borderColor: dailyHours === hours ? "primary.main" : "divider",
                        backgroundColor: dailyHours === hours ? "primary.light" : "background.paper",
                        color: dailyHours === hours ? "primary.main" : "text.secondary",
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

                <Box sx={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                  {weakSubjects.map((subject) => {
                    const col = subject.accuracy < 60 ? "error.main" : "secondary.main";
                    return (
                      <Box key={subject.subject}>
                        <Box sx={{ display: "flex", justifyContent: "space-between", fontSize: 13, mb: "5px" }}>
                          <Typography sx={{ fontSize: 13, fontWeight: 500 }}>{subject.subject}</Typography>
                          <Typography sx={{ fontFamily: '"Space Mono", monospace', fontSize: 12, fontWeight: 700, color: col }}>{subject.accuracy}%</Typography>
                        </Box>
                        <Box sx={{ height: 7, borderRadius: "20px", backgroundColor: "background.default", overflow: "hidden" }}>
                          <Box sx={{ height: "100%", width: `${subject.accuracy}%`, borderRadius: "20px", backgroundColor: col }} />
                        </Box>
                      </Box>
                    );
                  })}
                </Box>
              </Paper>
            </Box>
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: "10px" }}>
              <Typography sx={{ fontSize: 13, color: "text.secondary" }}>
                Week progress · <Box component="strong" sx={{ color: "text.primary" }}>{weekDone}/{weekTotal}</Box> tasks · {weekPct}%
              </Typography>
              <Typography onClick={() => setSelectedDayIndex((i) => (i + 1) % 7)} sx={{ fontSize: 13, fontWeight: 600, color: "primary.main", cursor: "pointer", "&:hover": { opacity: 0.8 } }}>
                ↻ Regenerate plan
              </Typography>
            </Box>

            <Box sx={{ display: "flex", gap: "8px", mb: "20px", "@media (max-width: 980px)": { overflowX: "auto", pb: 0.5 } }}>
              {weekProgress.map((day, index) => {
                const isSel = index === selectedDayIndex;
                const complete = day.done === day.total;

                return (
                  <Box
                    key={day.d}
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
                  {weekDays[selectedDayIndex]}'s tasks
                </Typography>

                <Box sx={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                  {selectedTasks.map((task) => {
                    const done = !!doneMap[task.id];
                    const typeColor: Record<TaskItem["type"], string> = {
                      Practice: "primary.main",
                      Revision: "secondary.main",
                      Mock: "error.main",
                      Review: "success.main",
                    };
                    const prioMeta: Record<TaskItem["priority"], { fg: string; bg: string; label: string }> = {
                      High: { fg: "error.main", bg: "error.light", label: "High" },
                      Medium: { fg: "secondary.main", bg: "secondary.light", label: "Medium" },
                      Low: { fg: "success.main", bg: "success.light", label: "Low" },
                    };

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
                          borderLeftColor: typeColor[task.type],
                          borderRadius: "14px",
                          p: "16px 18px",
                          boxShadow: "0 1px 2px rgba(24,24,32,.05)",
                          opacity: done ? 0.6 : 1,
                        }}
                      >
                        <Box
                          onClick={() => toggleTaskDone(task.id)}
                          sx={{
                            width: 26,
                            height: 26,
                            flex: "none",
                            borderRadius: "8px",
                            border: "2px solid",
                            borderColor: done ? "success.main" : "divider",
                            backgroundColor: done ? "success.main" : "transparent",
                            color: "#fff",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            fontSize: 14,
                            cursor: "pointer",
                          }}
                        >
                          {done ? "✓" : ""}
                        </Box>

                        <Box sx={{ flex: 1, minWidth: 0 }}>
                          <Box sx={{ display: "flex", alignItems: "center", gap: "10px", mb: "3px" }}>
                            <Typography sx={{ fontSize: 10, letterSpacing: ".08em", textTransform: "uppercase", fontWeight: 700, fontFamily: '"Space Mono", monospace', color: typeColor[task.type] }}>
                              {task.type}
                            </Typography>
                            <Typography sx={{ fontSize: 11, color: "text.disabled" }}>· {task.subject}</Typography>
                          </Box>
                          <Typography sx={{ fontFamily: '"Source Serif 4", serif', fontSize: 15.5, fontWeight: 600, lineHeight: 1.3, textDecoration: done ? "line-through" : "none" }}>
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
                            backgroundColor: prioMeta[task.priority].bg,
                            color: prioMeta[task.priority].fg,
                            fontFamily: '"Space Mono", monospace',
                            textTransform: "uppercase",
                            whiteSpace: "nowrap",
                          }}
                        >
                          {prioMeta[task.priority].label}
                        </Box>

                        <Box
                          onClick={() => onNavigateScreen?.(task.targetScreen)}
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
                  Today's focus
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
          </Box>
        </Box>
  );
}

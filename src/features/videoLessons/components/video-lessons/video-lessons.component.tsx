import { useEffect, useMemo, useState } from "react";
import { Box, Paper, Typography } from "@mui/material";
import { PracticeTopbar } from "../../../practice";
import type {
  VideoLessonsPageProps,
  LessonState,
} from "../../video-lessons.types";
import {
  VIDEO_LESSONS,
  defaultLessonStates,
  highlightText,
  readPersistedState,
  writePersistedState,
} from "../../video-lessons.utils";

export function VideoLessonsPage(props: VideoLessonsPageProps = {}) {
  const { onNavigateScreen } = props;

  const persisted = useMemo(() => readPersistedState(), []);
  const [currentLessonId, setCurrentLessonId] = useState<string>(
    persisted?.cur ?? VIDEO_LESSONS[0].id,
  );
  const [lessonStates, setLessonStates] = useState<Record<string, LessonState>>(
    persisted?.states ?? defaultLessonStates(),
  );
  const [search, setSearch] = useState("");

  const currentLesson = useMemo(
    () =>
      VIDEO_LESSONS.find((lesson) => lesson.id === currentLessonId) ??
      VIDEO_LESSONS[0],
    [currentLessonId],
  );

  const filteredTranscript = useMemo(() => {
    const q = search.trim().toLowerCase();
    return currentLesson.transcript
      .map((item, index) => ({ item, index }))
      .filter(({ item }) => !q || item.text.toLowerCase().includes(q));
  }, [currentLesson.transcript, search]);

  const currentProgress = lessonStates[currentLesson.id]?.prog ?? 0;
  const watchedCount = useMemo(
    () =>
      VIDEO_LESSONS.filter(
        (lesson) => (lessonStates[lesson.id]?.state ?? "next") === "watched",
      ).length,
    [lessonStates],
  );
  const overallProgress = useMemo(
    () =>
      Math.round(
        ((watchedCount + currentProgress / 100) / VIDEO_LESSONS.length) * 100,
      ),
    [currentProgress, watchedCount],
  );
  const activeTranscriptIndex = useMemo(() => {
    if (currentLesson.transcript.length === 0) {
      return -1;
    }
    return Math.floor(
      (currentProgress / 100) * (currentLesson.transcript.length - 1),
    );
  }, [currentLesson.transcript.length, currentProgress]);

  useEffect(() => {
    writePersistedState({
      cur: currentLessonId,
      states: lessonStates,
    });
  }, [currentLessonId, lessonStates]);

  function setPlayingLesson(lessonId: string): void {
    setCurrentLessonId(lessonId);
    setLessonStates((previous) => {
      const nextState = { ...previous };

      for (const lesson of VIDEO_LESSONS) {
        const existing = nextState[lesson.id] ?? {
          state: "next" as const,
          prog: 0,
        };

        if (lesson.id === lessonId) {
          nextState[lesson.id] = {
            state: "playing",
            prog: Math.max(existing.prog, 5),
          };
        } else if (existing.state !== "locked") {
          nextState[lesson.id] = {
            ...existing,
            state: existing.prog >= 100 ? "watched" : "next",
          };
        }
      }

      return nextState;
    });
  }

  function markProgress(amount: number): void {
    setLessonStates((previous) => {
      const current = previous[currentLesson.id] ?? {
        state: "playing" as const,
        prog: 0,
      };
      const nextProgress = Math.min(100, current.prog + amount);

      return {
        ...previous,
        [currentLesson.id]: {
          state: nextProgress >= 100 ? "watched" : "playing",
          prog: nextProgress,
        },
      };
    });
  }

  function downloadTranscript(): void {
    const content = currentLesson.transcript
      .map((item) => `${item.time} ${item.text}`)
      .join("\n");

    const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${currentLesson.id}-transcript.txt`;
    link.click();
    URL.revokeObjectURL(url);
  }

  return (
    <Box
      sx={{
          flex: 1,
          minWidth: 0,
          display: "flex",
          flexDirection: "column",
          height: "100vh",
          overflow: "hidden",
        }}
      >
        <PracticeTopbar
          currentScreen="videoLessons"
          title="Video Lessons"
          subtitle="Player, transcript search, and curriculum progression"
          searchPlaceholder="Search Lessons"
          onOpenGlobalSearch={() => onNavigateScreen?.("globalSearch")}
          onOpenSettings={() => onNavigateScreen?.("settingsProfile")}
          onNavigateScreen={onNavigateScreen}
        />

        <Box
          sx={{
            flex: 1,
            overflow: "auto",
            px: { xs: 2, md: 3.75 },
            pt: { xs: 2.5, md: 3.75 },
            pb: { xs: 5, md: 7.5 },
          }}
        >
          <Box sx={{ maxWidth: 1060, mx: "auto" }}>
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: { xs: "1fr", lg: "1fr 340px" },
                gap: "20px",
              }}
            >
              <Box>
                <Box
                  onClick={() => markProgress(12)}
                  sx={{
                    position: "relative",
                    width: "100%",
                    aspectRatio: "16/9",
                    borderRadius: "18px",
                    overflow: "hidden",
                    cursor: "pointer",
                    background:
                      currentLesson.subject === "Pakistan Affairs"
                        ? "linear-gradient(135deg, #33508c, #5878b8)"
                        : currentLesson.subject === "Current Affairs"
                          ? "linear-gradient(135deg, #2f7d5b, #4fae83)"
                          : "linear-gradient(135deg, #7d4a86, #a06bab)",
                  }}
                >
                  <Box
                    sx={{
                      position: "absolute",
                      inset: 0,
                      background:
                        "radial-gradient(circle at 30% 30%, rgba(255,255,255,.14), transparent 60%)",
                    }}
                  />
                  <Box
                    sx={{
                      width: 74,
                      height: 74,
                      borderRadius: "50%",
                      backgroundColor: "rgba(255,255,255,.92)",
                      color: "#1b1e26",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: 26,
                      position: "relative",
                      zIndex: 2,
                      mx: "auto",
                      mt: "calc(28.125% - 37px)",
                    }}
                  >
                    {(lessonStates[currentLesson.id]?.state ?? "next") ===
                    "playing"
                      ? "❙❙"
                      : "▶"}
                  </Box>
                  <Box
                    sx={{
                      position: "absolute",
                      left: 0,
                      right: 0,
                      bottom: 0,
                      px: "18px",
                      py: "16px",
                      background:
                        "linear-gradient(0deg, rgba(0,0,0,.5), transparent)",
                    }}
                  >
                    <Box
                      sx={{
                        height: 5,
                        borderRadius: "20px",
                        backgroundColor: "rgba(255,255,255,.3)",
                        overflow: "hidden",
                      }}
                    >
                      <Box
                        sx={{
                          height: "100%",
                          width: `${currentProgress}%`,
                          borderRadius: "20px",
                          backgroundColor: "secondary.main",
                        }}
                      />
                    </Box>
                  </Box>
                </Box>

                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: "10px",
                    mt: "18px",
                  }}
                >
                  <Box
                    sx={{
                      fontSize: 11,
                      fontWeight: 700,
                      letterSpacing: ".06em",
                      textTransform: "uppercase",
                      px: "9px",
                      py: "3px",
                      borderRadius: "6px",
                      backgroundColor: "primary.light",
                      color: "primary.main",
                      fontFamily: '"Space Mono", monospace',
                      display: "inline-block",
                    }}
                  >
                    {currentLesson.subject}
                  </Box>
                  <Typography
                    sx={{
                      fontSize: 12.5,
                      color: "text.disabled",
                      fontFamily: '"Space Mono", monospace',
                    }}
                  >
                    {currentLesson.duration}
                  </Typography>
                </Box>

                <Typography
                  sx={{
                    fontFamily: '"Source Serif 4", serif',
                    fontSize: 24,
                    fontWeight: 700,
                    letterSpacing: "-.01em",
                    mt: "8px",
                    lineHeight: 1.25,
                  }}
                >
                  {currentLesson.title}
                </Typography>

                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: "10px",
                    mt: "12px",
                    flexWrap: "wrap",
                  }}
                >
                  <Box
                    sx={{
                      width: 36,
                      height: 36,
                      borderRadius: "50%",
                      backgroundColor: "background.default",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: 14,
                    }}
                  >
                    🎓
                  </Box>
                  <Box>
                    <Typography sx={{ fontSize: 13.5, fontWeight: 600 }}>
                      {currentLesson.tutor}
                    </Typography>
                    <Typography sx={{ fontSize: 12, color: "text.disabled" }}>
                      PrepAI faculty
                    </Typography>
                  </Box>
                  <Box sx={{ flex: 1 }} />
                  <Box sx={{ display: "flex", gap: "8px" }}>
                    <Box
                      sx={{
                        px: "16px",
                        py: "9px",
                        borderRadius: "10px",
                        border: "1px solid",
                        borderColor: "divider",
                        fontWeight: 600,
                        fontSize: 13,
                        cursor: "pointer",
                        color: "text.primary",
                        "&:hover": { borderColor: "primary.main" },
                      }}
                    >
                      ☆ Save
                    </Box>
                    <Box
                      onClick={() => onNavigateScreen?.("practice")}
                      sx={{
                        px: "16px",
                        py: "9px",
                        borderRadius: "10px",
                        backgroundColor: "primary.main",
                        color: "primary.contrastText",
                        fontWeight: 600,
                        fontSize: 13,
                        cursor: "pointer",
                        "&:hover": { opacity: 0.92 },
                      }}
                    >
                      Practice this topic
                    </Box>
                  </Box>
                </Box>

                <Paper
                  variant="outlined"
                  sx={{
                    borderRadius: "16px",
                    p: "18px 18px 12px",
                    mt: "20px",
                    borderColor: "divider",
                    boxShadow: "0 1px 2px rgba(24,24,32,.05)",
                  }}
                >
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: "12px",
                      px: "4px",
                      pb: "12px",
                      flexWrap: "wrap",
                    }}
                  >
                    <Typography
                      sx={{
                        fontFamily: '"Source Serif 4", serif',
                        fontSize: 16,
                        fontWeight: 600,
                      }}
                    >
                      Transcript
                    </Typography>

                    <Box
                      sx={{
                        flex: 1,
                        minWidth: 140,
                        display: "flex",
                        alignItems: "center",
                        gap: "8px",
                        height: 36,
                        px: "12px",
                        borderRadius: "10px",
                        backgroundColor: "background.default",
                        border: "1px solid",
                        borderColor: "divider",
                      }}
                    >
                      <Box
                        sx={{
                          width: 12,
                          height: 12,
                          borderRadius: "50%",
                          border: "1.6px solid",
                          borderColor: "text.disabled",
                          position: "relative",
                          flex: "none",
                        }}
                      >
                        <Box
                          sx={{
                            position: "absolute",
                            width: 5,
                            height: 1.6,
                            backgroundColor: "text.disabled",
                            bottom: -2,
                            right: -3,
                            transform: "rotate(45deg)",
                            borderRadius: "2px",
                          }}
                        />
                      </Box>
                      <Box
                        component="input"
                        value={search}
                        onChange={(event) => setSearch(event.target.value)}
                        placeholder="Search transcript..."
                        sx={{
                          flex: 1,
                          border: "none",
                          outline: "none",
                          background: "transparent",
                          fontFamily: '"Plus Jakarta Sans", sans-serif',
                          fontSize: 13,
                          color: "text.primary",
                        }}
                      />
                    </Box>

                    <Box
                      onClick={downloadTranscript}
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: "6px",
                        height: 36,
                        px: "14px",
                        borderRadius: "10px",
                        border: "1px solid",
                        borderColor: "divider",
                        fontWeight: 600,
                        fontSize: 13,
                        cursor: "pointer",
                        color: "text.primary",
                        whiteSpace: "nowrap",
                        "&:hover": { borderColor: "primary.main" },
                      }}
                    >
                      ↓ Download
                    </Box>
                  </Box>

                  {filteredTranscript.length === 0 && (
                    <Typography
                      sx={{
                        textAlign: "center",
                        px: "20px",
                        py: "28px",
                        fontSize: 13.5,
                        color: "text.disabled",
                      }}
                    >
                      No transcript lines match that search.
                    </Typography>
                  )}

                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      gap: "1px",
                      maxHeight: 300,
                      overflow: "auto",
                    }}
                  >
                    {filteredTranscript.map(({ item, index }) => {
                      const active =
                        index === activeTranscriptIndex &&
                        currentProgress > 0 &&
                        search.trim() === "";
                      return (
                        <Box
                          key={`${item.time}-${item.text}`}
                          onClick={() => markProgress(3)}
                          sx={{
                            display: "flex",
                            gap: "14px",
                            py: "11px",
                            px: "14px",
                            borderRadius: "11px",
                            cursor: "pointer",
                            backgroundColor: active
                              ? "primary.light"
                              : "transparent",
                            "&:hover": {
                              backgroundColor: "background.default",
                            },
                          }}
                        >
                          <Box
                            sx={{
                              fontFamily: '"Space Mono", monospace',
                              fontSize: 12,
                              fontWeight: 700,
                              flex: "none",
                              width: 46,
                              color: active ? "primary.main" : "text.disabled",
                            }}
                          >
                            {item.time}
                          </Box>
                          <Typography
                            sx={{
                              fontSize: 14,
                              lineHeight: 1.55,
                              color: active ? "text.primary" : "text.secondary",
                              fontWeight: active ? 500 : 400,
                            }}
                          >
                            {highlightText(item.text, search).map(
                              (part, partIndex) =>
                                part.marked ? (
                                  <Box
                                    key={`${part.value}-${partIndex}`}
                                    component="mark"
                                    sx={{
                                      backgroundColor: "secondary.light",
                                      color: "secondary.main",
                                      fontWeight: 700,
                                      borderRadius: "3px",
                                      px: "2px",
                                      py: 0,
                                    }}
                                  >
                                    {part.value}
                                  </Box>
                                ) : (
                                  <Box
                                    key={`${part.value}-${partIndex}`}
                                    component="span"
                                  >
                                    {part.value}
                                  </Box>
                                ),
                            )}
                          </Typography>
                        </Box>
                      );
                    })}
                  </Box>
                </Paper>
              </Box>

              <Paper
                variant="outlined"
                sx={{
                  borderRadius: "16px",
                  p: "16px",
                  borderColor: "divider",
                  boxShadow: "0 1px 2px rgba(24,24,32,.05)",
                  height: "fit-content",
                  alignSelf: "start",
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "baseline",
                    px: "4px",
                    pb: "12px",
                  }}
                >
                  <Typography
                    sx={{
                      fontFamily: '"Source Serif 4", serif',
                      fontSize: 16,
                      fontWeight: 600,
                    }}
                  >
                    Course curriculum
                  </Typography>
                  <Typography
                    sx={{
                      fontSize: 12,
                      color: "text.disabled",
                      fontFamily: '"Space Mono", monospace',
                    }}
                  >
                    {watchedCount}/{VIDEO_LESSONS.length}
                  </Typography>
                </Box>

                <Box
                  sx={{
                    height: 6,
                    borderRadius: "20px",
                    backgroundColor: "background.default",
                    overflow: "hidden",
                    mx: "4px",
                    mb: "12px",
                  }}
                >
                  <Box
                    sx={{
                      height: "100%",
                      width: `${overallProgress}%`,
                      backgroundColor: "primary.main",
                      borderRadius: "20px",
                    }}
                  />
                </Box>

                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "2px",
                    maxHeight: 440,
                    overflow: "auto",
                  }}
                >
                  {VIDEO_LESSONS.map((lesson, index) => {
                    const status = lessonStates[lesson.id] ?? {
                      state: "next" as const,
                      prog: 0,
                    };
                    const active = lesson.id === currentLessonId;
                    const locked = status.state === "locked";
                    const watched = status.state === "watched";
                    const badge = watched
                      ? "✓"
                      : locked
                        ? "🔒"
                        : String(index + 1);
                    return (
                      <Box
                        key={lesson.id}
                        onClick={() => {
                          if (!locked) {
                            setPlayingLesson(lesson.id);
                          }
                        }}
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          gap: "13px",
                          py: "13px",
                          px: "14px",
                          borderRadius: "12px",
                          cursor: locked ? "not-allowed" : "pointer",
                          backgroundColor: active
                            ? "primary.light"
                            : "transparent",
                          opacity: locked ? 0.55 : 1,
                          "&:hover": {
                            backgroundColor: active
                              ? "primary.light"
                              : "background.default",
                          },
                        }}
                      >
                        <Box
                          sx={{
                            width: 30,
                            height: 30,
                            flex: "none",
                            borderRadius: "9px",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            fontSize: 12,
                            fontWeight: 700,
                            fontFamily: '"Space Mono", monospace',
                            backgroundColor: watched
                              ? "success.light"
                              : active
                                ? "primary.main"
                                : "background.default",
                            color: watched
                              ? "success.main"
                              : active
                                ? "#fff"
                                : "text.disabled",
                          }}
                        >
                          {badge}
                        </Box>
                        <Box sx={{ flex: 1, minWidth: 0 }}>
                          <Typography
                            sx={{
                              fontSize: 13.5,
                              fontWeight: active ? 700 : 600,
                              lineHeight: 1.3,
                              color: active ? "primary.main" : "text.primary",
                            }}
                          >
                            {lesson.title}
                          </Typography>
                          <Typography
                            sx={{
                              fontSize: 11.5,
                              color: "text.disabled",
                              fontFamily: '"Space Mono", monospace',
                              mt: "2px",
                            }}
                          >
                            {lesson.subject} · {lesson.duration}
                          </Typography>
                        </Box>
                      </Box>
                    );
                  })}
                </Box>
              </Paper>
            </Box>
          </Box>
        </Box>
      </Box>
  );
}

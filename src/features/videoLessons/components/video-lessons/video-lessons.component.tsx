import { useMemo, useState } from "react";
import { Alert, Box, CircularProgress, Paper, Typography } from "@mui/material";
import {
  useDownloadTranscriptMutation,
  useGetCourseQuery,
  useGetLessonQuery,
  useGetTranscriptQuery,
  useUpdateLessonProgressMutation,
} from "../../../../api/video-lessons/video-lessons.endpoints";
import { toApiErrorMessage } from "../../../../api/error";
import { PracticeTopbar } from "../../../practice";
import type { VideoLessonsPageProps } from "../../video-lessons.types";
import { COURSE_ID, highlightText } from "../../video-lessons.utils";

export function VideoLessonsPage(props: VideoLessonsPageProps = {}) {
  const { onNavigateScreen } = props;

  const courseQuery = useGetCourseQuery(COURSE_ID);
  const course = courseQuery.data;

  const [currentLessonId, setCurrentLessonId] = useState<string | undefined>(undefined);
  const [search, setSearch] = useState("");
  const [updateLessonProgress] = useUpdateLessonProgressMutation();
  const [downloadTranscriptTrigger, downloadState] = useDownloadTranscriptMutation();

  // No lesson explicitly selected yet -> derive one from the course response
  // (its own `currentLessonId`, else the first unlocked lesson) instead of
  // syncing into state via an effect.
  const activeLessonId =
    currentLessonId ??
    course?.currentLessonId ??
    course?.lessons.find((lesson) => lesson.state !== "LOCKED")?.id ??
    course?.lessons[0]?.id;

  const lessonQuery = useGetLessonQuery(activeLessonId ?? "", { skip: !activeLessonId });
  const currentLesson = lessonQuery.data;

  const transcriptQuery = useGetTranscriptQuery({ lessonId: activeLessonId ?? "" }, { skip: !activeLessonId });
  const segments = useMemo(() => transcriptQuery.data?.segments ?? [], [transcriptQuery.data]);

  const filteredTranscript = useMemo(() => {
    const q = search.trim().toLowerCase();
    return segments
      .map((item, index) => ({ item, index }))
      .filter(({ item }) => !q || item.text.toLowerCase().includes(q));
  }, [segments, search]);

  const currentProgress = currentLesson?.progressPct ?? 0;
  const watchedCount = course?.lessons.filter((lesson) => lesson.state === "WATCHED").length ?? 0;
  const overallProgress = course?.overallProgressPct ?? 0;

  const activeTranscriptIndex = useMemo(() => {
    if (segments.length === 0) {
      return -1;
    }
    return Math.floor((currentProgress / 100) * (segments.length - 1));
  }, [segments.length, currentProgress]);

  function markProgress(amount: number): void {
    if (!activeLessonId || !currentLesson) {
      return;
    }
    const nextProgress = Math.min(100, currentProgress + amount);
    updateLessonProgress({
      lessonId: activeLessonId,
      progressPct: nextProgress,
      lastPositionSec: Math.round((nextProgress / 100) * currentLesson.durationSec),
    });
  }

  function setPlayingLesson(lessonId: string): void {
    const target = course?.lessons.find((lesson) => lesson.id === lessonId);
    if (!target || target.state === "LOCKED") {
      return;
    }
    setCurrentLessonId(lessonId);
    const existingProgress = target.state === "WATCHED" ? 100 : target.state === "PLAYING" ? (target.prog ?? 0) : 0;
    const resumeProgress = Math.max(existingProgress, 5);
    updateLessonProgress({
      lessonId,
      progressPct: resumeProgress,
      lastPositionSec: Math.round((resumeProgress / 100) * target.durationSec),
    });
  }

  async function downloadTranscript(): Promise<void> {
    if (!activeLessonId || !currentLesson) {
      return;
    }
    const content = await downloadTranscriptTrigger(activeLessonId).unwrap();
    const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${currentLesson.title.replace(/[^a-z0-9]+/gi, "-").toLowerCase()}-transcript.txt`;
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
            {courseQuery.isError && (
              <Alert severity="error" sx={{ borderRadius: 2 }}>
                Could not load video lessons. {toApiErrorMessage(courseQuery.error, "Please try again.")}
              </Alert>
            )}

            {(courseQuery.isLoading || (!currentLesson && !lessonQuery.isError)) && !courseQuery.isError && (
              <Box sx={{ display: "flex", justifyContent: "center", py: 8 }}>
                <CircularProgress size={28} />
              </Box>
            )}

            {lessonQuery.isError && (
              <Alert severity="error" sx={{ borderRadius: 2, mb: 2 }}>
                {toApiErrorMessage(lessonQuery.error, "Could not load this lesson.")}
              </Alert>
            )}

            {course && currentLesson && (
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
                      currentLesson.subject.name === "Pakistan Affairs"
                        ? "linear-gradient(135deg, #33508c, #5878b8)"
                        : currentLesson.subject.name === "Current Affairs"
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
                    {currentLesson.state === "PLAYING" ? "❙❙" : "▶"}
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
                    {currentLesson.subject.name}
                  </Box>
                  <Typography
                    sx={{
                      fontSize: 12.5,
                      color: "text.disabled",
                      fontFamily: '"Space Mono", monospace',
                    }}
                  >
                    {currentLesson.mins}
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
                      {currentLesson.tutorName}
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
                      onClick={() => void downloadTranscript()}
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
                        cursor: downloadState.isLoading ? "wait" : "pointer",
                        color: "text.primary",
                        whiteSpace: "nowrap",
                        opacity: downloadState.isLoading ? 0.6 : 1,
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
                      {segments.length === 0 ? "No transcript available for this lesson." : "No transcript lines match that search."}
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
                          key={item.id}
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
                            {item.t}
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
                    {watchedCount}/{course.lessons.length}
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
                  {course.lessons.map((lesson) => {
                    const active = lesson.id === activeLessonId;
                    const locked = lesson.state === "LOCKED";
                    const watched = lesson.state === "WATCHED";
                    const badge = watched
                      ? "✓"
                      : locked
                        ? "🔒"
                        : String(lesson.order);
                    return (
                      <Box
                        key={lesson.id}
                        onClick={() => setPlayingLesson(lesson.id)}
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
                            {lesson.subject.name} · {lesson.mins}
                          </Typography>
                        </Box>
                      </Box>
                    );
                  })}
                </Box>
              </Paper>
            </Box>
            )}
          </Box>
        </Box>
      </Box>
  );
}

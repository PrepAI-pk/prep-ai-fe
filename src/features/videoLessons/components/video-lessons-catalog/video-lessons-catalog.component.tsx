import { Alert, Box, CircularProgress, Paper, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import type { AppScreen } from "../../../../app/screens";
import { toApiErrorMessage } from "../../../../api/error";
import { useListCoursesQuery } from "../../../../api/video-lessons/video-lessons.endpoints";
import type { CourseSummary } from "../../../../api/video-lessons/video-lessons.types";
import { PracticeTopbar } from "../../../practice";
import { SCREEN_TO_PATH } from "../../../../routes/route-paths";

type VideoLessonsCatalogPageProps = {
  onNavigateScreen?: (screen: AppScreen) => void;
};

function formatDuration(totalSeconds: number): string {
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.round((totalSeconds % 3600) / 60);
  if (hours === 0) {
    return `${minutes} min`;
  }
  return `${hours}h ${minutes}m`;
}

export function VideoLessonsCatalogPage(props: VideoLessonsCatalogPageProps = {}) {
  const { onNavigateScreen } = props;
  const navigate = useNavigate();
  const coursesQuery = useListCoursesQuery();
  const courses = coursesQuery.data?.items ?? [];

  function openCourse(course: CourseSummary): void {
    navigate(`${SCREEN_TO_PATH.videoLessons}/${course.id}`);
  }

  return (
    <Box sx={{ flex: 1, minWidth: 0, display: "flex", flexDirection: "column", height: "100vh", overflow: "hidden" }}>
      <PracticeTopbar
        currentScreen="videoLessons"
        title="Video Lessons"
        subtitle="Pick a course to continue"
        searchPlaceholder="Search Courses"
        onOpenGlobalSearch={() => onNavigateScreen?.("globalSearch")}
        onOpenSettings={() => onNavigateScreen?.("settingsProfile")}
        onNavigateScreen={onNavigateScreen}
      />

      <Box sx={{ flex: 1, overflow: "auto", px: { xs: 2, md: 3.75 }, pt: { xs: 2.5, md: 3.75 }, pb: { xs: 5, md: 7.5 } }}>
        {coursesQuery.isError && (
          <Alert severity="error" sx={{ maxWidth: 640, mx: "auto", borderRadius: 2 }}>
            Could not load courses. {toApiErrorMessage(coursesQuery.error, "Please try again.")}
          </Alert>
        )}

        {coursesQuery.isLoading && (
          <Box sx={{ display: "flex", justifyContent: "center", py: 6 }}>
            <CircularProgress size={26} />
          </Box>
        )}

        {!coursesQuery.isLoading && !coursesQuery.isError && courses.length === 0 && (
          <Typography sx={{ fontSize: 13.5, color: "text.secondary" }}>No courses are available yet.</Typography>
        )}

        <Box
          sx={{
            maxWidth: 1080,
            mx: "auto",
            display: "grid",
            gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr", md: "1fr 1fr 1fr" },
            gap: 2,
          }}
        >
          {courses.map((course) => (
            <Paper
              key={course.id}
              variant="outlined"
              onClick={() => openCourse(course)}
              sx={{
                p: "20px 22px",
                borderRadius: "16px",
                borderColor: "divider",
                cursor: "pointer",
                transition: "border-color .15s ease, box-shadow .15s ease",
                "&:hover": { borderColor: "primary.main", boxShadow: "0 2px 10px rgba(24,24,32,.08)" },
              }}
            >
              <Typography sx={{ fontFamily: '"Source Serif 4", serif', fontSize: 18, fontWeight: 600, mb: 0.6 }}>
                {course.title}
              </Typography>
              <Typography sx={{ fontSize: 13, color: "text.secondary", mb: 1.2 }}>
                {course.lessonCount} lesson{course.lessonCount === 1 ? "" : "s"} · {formatDuration(course.totalDurationSec)}
              </Typography>
              {course.subjects.length > 0 && (
                <Typography sx={{ fontSize: 12, color: "text.disabled" }}>{course.subjects.join(" · ")}</Typography>
              )}
            </Paper>
          ))}
        </Box>
      </Box>
    </Box>
  );
}

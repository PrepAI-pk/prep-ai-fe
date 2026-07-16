import { Box, Typography } from "@mui/material";
import type { AppScreen } from "../../../../app/screens";
import { RequirePermission } from "../../../../auth";

type PracticeSidebarProps = {
  activeScreen?: AppScreen;
  onNavigate?: (screen: AppScreen) => void;
  mode?: "student" | "admin";
};

export function PracticeSidebar(props: PracticeSidebarProps) {
  const { activeScreen = "practice", onNavigate, mode = "student" } = props;
  const streakWeek = [true, true, true, true, false, false, true];

  const studentNavItems = [
    {
      label: "Dashboard",
      active: activeScreen === "dashboard",
      screen: "dashboard" as const,
    },
    {
      label: "Study Plan",
      active: activeScreen === "studyPlan",
      screen: "studyPlan" as const,
    },
    {
      label: "MCQ Library",
      active: activeScreen === "mcqLibrary",
      screen: "mcqLibrary" as const,
    },
    {
      label: "MCQ Practice",
      active: activeScreen === "practice",
      screen: "practice" as const,
    },
    {
      label: "Mock Exams",
      active: activeScreen === "mockExams" || activeScreen === "mockExamRunner",
      screen: "mockExams" as const,
    },
    {
      label: "AI Tutor",
      active: activeScreen === "aiTutor",
      screen: "aiTutor" as const,
    },
    {
      label: "Notes & Revision",
      active: activeScreen === "notesRevision",
      screen: "notesRevision" as const,
    },
    {
      label: "Video Lessons",
      active: activeScreen === "videoLessons",
      screen: "videoLessons" as const,
    },
    {
      label: "Bookmarks & Weak Areas",
      active: activeScreen === "bookmarksWeakAreas",
      screen: "bookmarksWeakAreas" as const,
    },
    {
      label: "Offline Mode",
      active: activeScreen === "offlineMode",
      screen: "offlineMode" as const,
    },
    {
      label: "Daily Challenge",
      active: activeScreen === "dailyChallenge",
      screen: "dailyChallenge" as const,
    },
    {
      label: "Leaderboard",
      active: activeScreen === "leaderboard",
      screen: "leaderboard" as const,
    },
  ];

  const adminNavItems = [
    {
      label: "Overview",
      active: activeScreen === "adminOverview",
      screen: "adminOverview" as const,
    },
    {
      label: "Document Processing",
      active: activeScreen === "adminProcessing",
      screen: "adminProcessing" as const,
    },
    {
      label: "Review Queue",
      active: activeScreen === "adminReviewQueue",
      screen: "adminReviewQueue" as const,
    },
    {
      label: "Content Manager",
      active: activeScreen === "adminContentManager",
      screen: "adminContentManager" as const,
    },
    {
      label: "AI Agent Logs",
      active: activeScreen === "adminAgentLogs",
      screen: "adminAgentLogs" as const,
    },
  ];

  const navItems = mode === "admin" ? adminNavItems : studentNavItems;

  return (
    <Box
      sx={{
        width: 250,
        borderRight: "1px solid",
        borderColor: "divider",
        bgcolor: "background.paper",
        px: 2,
        pt: "22px",
        pb: 2,
        display: { xs: "none", md: "flex" },
        flexDirection: "column",
        height: "100vh",
        position: "sticky",
        top: 0,
        overflowY: "auto",
        overflowX: "hidden",
      }}
    >
      <Box sx={{ display: "flex", alignItems: "center", gap: 1.2, px: 1, pb: 2.5 }}>
        <Box
          sx={{
            width: 36,
            height: 36,
            borderRadius: "11px",
            backgroundColor: "primary.main",
            color: "white",
            fontFamily: '"Source Serif 4", serif',
            fontWeight: 700,
            fontSize: 20,
            display: "grid",
            placeItems: "center",
          }}
        >
          P
        </Box>
        <Box>
          <Typography variant="h3" sx={{ fontSize: 23, mb: -0.25 }}>
            PrepAI
          </Typography>
          <Typography
            sx={{
              fontFamily: '"Space Mono", monospace',
              fontSize: 10,
              letterSpacing: ".14em",
              textTransform: "uppercase",
              color: "text.secondary",
            }}
          >
            Exam Prep
          </Typography>
        </Box>
      </Box>
      <Typography
        sx={{
          mb: 0.5,
          px: 1.25,
          fontFamily: '"Space Mono", monospace',
          fontSize: 10,
          letterSpacing: ".14em",
          textTransform: "uppercase",
          color: "text.secondary",
          fontWeight: 600,
        }}
      >
        {mode === "admin" ? "Admin" : "Learn"}
      </Typography>
      <Box sx={{ mt: 0.6, display: "grid", gap: 0.5 }}>
        {navItems.map((item) => (
          <Box
            key={item.label}
            onClick={() => {
              if (item.screen && onNavigate) {
                onNavigate(item.screen);
              }
            }}
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1,
              px: 1.5,
              py: 1.1,
              borderRadius: "11px",
              cursor: "pointer",
              backgroundColor: item.active ? "primary.light" : "transparent",
              color: item.active ? "primary.main" : "text.secondary",
              fontWeight: item.active ? 600 : 500,
              fontSize: 14,
              border: "1px solid transparent",
              transition: "background-color .2s ease, color .2s ease",
              "&:hover": {
                backgroundColor: item.active ? "primary.light" : "background.default",
              },
            }}
          >
            <Box
              sx={{
                width: 8,
                height: 8,
                borderRadius: "2px",
                border: "1.5px solid",
                borderColor: item.active ? "primary.main" : "text.disabled",
                backgroundColor: item.active ? "primary.main" : "transparent",
                flex: "none",
              }}
            />
            {item.label}
          </Box>
        ))}
      </Box>

      <Box sx={{ flex: 1, minHeight: 14 }} />

      {mode === "student" && (
        <Box
          sx={{
            mt: 1,
            p: 1.6,
            borderRadius: "14px",
            border: "1px solid",
            borderColor: "divider",
            backgroundColor: "secondary.light",
          }}
        >
          <Typography
            sx={{
              fontFamily: '"Space Mono", monospace',
              fontSize: 11,
              letterSpacing: ".1em",
              textTransform: "uppercase",
              color: "secondary.main",
              fontWeight: 700,
            }}
          >
            Streak
          </Typography>
          <Box sx={{ display: "flex", alignItems: "baseline", gap: 0.8, mt: 0.2 }}>
            <Typography variant="h3" sx={{ fontSize: 26 }}>
              12
            </Typography>
            <Typography sx={{ fontSize: 13, color: "text.secondary" }}>days</Typography>
          </Box>
          <Box sx={{ mt: 1, display: "flex", gap: 0.6 }}>
            {streakWeek.map((isActive, index) => (
              <Box
                key={index}
                sx={{
                  width: 8,
                  height: 8,
                  borderRadius: "50%",
                  backgroundColor: isActive ? "secondary.main" : "rgba(194, 112, 61, 0.25)",
                }}
              />
            ))}
          </Box>
        </Box>
      )}

      {mode === "admin" ? (
        <Box onClick={() => onNavigate?.("dashboard")} sx={switchPortalLinkSx}>
          <Box sx={switchPortalDotSx} />
          Exit to student app
        </Box>
      ) : (
        <RequirePermission permission="admin:overview:view">
          <Box onClick={() => onNavigate?.("adminOverview")} sx={switchPortalLinkSx}>
            <Box sx={switchPortalDotSx} />
            Admin Portal
          </Box>
        </RequirePermission>
      )}
    </Box>
  );
}

const switchPortalLinkSx = {
  mt: 1,
  display: "flex",
  alignItems: "center",
  gap: 1,
  px: 1.5,
  py: 1.1,
  borderRadius: "10px",
  cursor: "pointer",
  color: "text.secondary",
  fontSize: 13,
  fontWeight: 600,
  "&:hover": {
    backgroundColor: "background.default",
  },
} as const;

const switchPortalDotSx = {
  width: 8,
  height: 8,
  borderRadius: "2px",
  border: "1.5px solid",
  borderColor: "secondary.main",
  backgroundColor: "secondary.main",
  flex: "none",
} as const;

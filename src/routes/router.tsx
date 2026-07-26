import { Navigate, createBrowserRouter } from "react-router-dom";
import { PermissionRoute } from "../auth";
import { AdminLayout } from "./layouts/AdminLayout";
import { RootLayout } from "./layouts/RootLayout";
import { StudentLayout } from "./layouts/StudentLayout";
import { AdminOverviewRoute } from "./pages/AdminOverviewRoute";
import { AdminProcessingRoute } from "./pages/AdminProcessingRoute";
import { AdminReviewQueueRoute } from "./pages/AdminReviewQueueRoute";
import { AuthRoute } from "./pages/AuthRoute";
import { ForbiddenPage } from "./pages/ForbiddenPage";
import { MockExamResultRoute } from "./pages/MockExamResultRoute";
import { MockExamRunnerRoute } from "./pages/MockExamRunnerRoute";
import { MockExamsRoute } from "./pages/MockExamsRoute";
import { OnboardingRoute } from "./pages/OnboardingRoute";
import { SettingsProfileRoute } from "./pages/SettingsProfileRoute";
import { VideoLessonsPlayerRoute } from "./pages/VideoLessonsPlayerRoute";
import {
  AdminAgentLogsRoute,
  AdminContentManagerRoute,
  AiTutorRoute,
  BookmarksWeakAreasRoute,
  DailyChallengeRoute,
  DashboardRoute,
  GlobalSearchRoute,
  LeaderboardRoute,
  McqLibraryRoute,
  NotesRevisionRoute,
  NotificationSettingsRoute,
  OfflineModeRoute,
  PracticeRoute,
  StudyPlanRoute,
  SubscriptionPaywallRoute,
  VideoLessonsRoute,
} from "./pages/SimpleScreenRoutes";
import { DEFAULT_PATH } from "./route-paths";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    children: [
      { index: true, element: <Navigate to={DEFAULT_PATH} replace /> },
      {
        element: <StudentLayout />,
        children: [
          { path: "dashboard", element: <DashboardRoute /> },
          { path: "practice", element: <PracticeRoute /> },
          { path: "study-plan", element: <StudyPlanRoute /> },
          { path: "mock-exams", element: <MockExamsRoute /> },
          { path: "mock-exams/runner", element: <MockExamRunnerRoute /> },
          { path: "mock-exams/result", element: <MockExamResultRoute /> },
          { path: "ai-tutor", element: <AiTutorRoute /> },
          { path: "notes", element: <NotesRevisionRoute /> },
          { path: "mcq-library", element: <McqLibraryRoute /> },
          { path: "daily-challenge", element: <DailyChallengeRoute /> },
          { path: "leaderboard", element: <LeaderboardRoute /> },
          { path: "video-lessons", element: <VideoLessonsRoute /> },
          { path: "video-lessons/:courseId", element: <VideoLessonsPlayerRoute /> },
          { path: "bookmarks", element: <BookmarksWeakAreasRoute /> },
          { path: "offline", element: <OfflineModeRoute /> },
          { path: "search", element: <GlobalSearchRoute /> },
          { path: "settings", element: <SettingsProfileRoute /> },
          { path: "subscription", element: <SubscriptionPaywallRoute /> },
          {
            path: "notification-settings",
            element: <NotificationSettingsRoute />,
          },
        ],
      },
      {
        // Baseline permission to enter the admin area at all.
        element: <PermissionRoute permission="admin:overview:view" />,
        children: [
          {
            element: <AdminLayout />,
            children: [
              { path: "admin", element: <AdminOverviewRoute /> },
              {
                path: "admin/processing",
                element: <PermissionRoute permission="admin:processing:manage" />,
                children: [{ index: true, element: <AdminProcessingRoute /> }],
              },
              {
                path: "admin/review-queue",
                element: <PermissionRoute permission="admin:review:manage" />,
                children: [{ index: true, element: <AdminReviewQueueRoute /> }],
              },
              {
                path: "admin/content-manager",
                element: <PermissionRoute permission="admin:content:manage" />,
                children: [
                  { index: true, element: <AdminContentManagerRoute /> },
                ],
              },
              {
                path: "admin/agent-logs",
                element: <PermissionRoute permission="admin:agentLogs:view" />,
                children: [{ index: true, element: <AdminAgentLogsRoute /> }],
              },
            ],
          },
        ],
      },
    ],
  },
  { path: "/auth", element: <AuthRoute /> },
  { path: "/onboarding", element: <OnboardingRoute /> },
  { path: "/403", element: <ForbiddenPage /> },
  { path: "*", element: <Navigate to={DEFAULT_PATH} replace /> },
]);

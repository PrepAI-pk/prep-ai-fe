import type { AppScreen } from "../app/screens";
import type { Permission } from "../auth/permissions";

export const AUTH_PATH = "/auth";
export const ONBOARDING_PATH = "/onboarding";
export const FORBIDDEN_PATH = "/403";
export const DEFAULT_PATH = "/dashboard";

export const SCREEN_TO_PATH: Record<AppScreen, string> = {
  dashboard: "/dashboard",
  practice: "/practice",
  studyPlan: "/study-plan",
  mockExams: "/mock-exams",
  mockExamRunner: "/mock-exams/runner",
  mockExamResult: "/mock-exams/result",
  aiTutor: "/ai-tutor",
  notesRevision: "/notes",
  mcqLibrary: "/mcq-library",
  dailyChallenge: "/daily-challenge",
  leaderboard: "/leaderboard",
  videoLessons: "/video-lessons",
  bookmarksWeakAreas: "/bookmarks",
  offlineMode: "/offline",
  globalSearch: "/search",
  settingsProfile: "/settings",
  subscriptionPaywall: "/subscription",
  notificationSettings: "/notification-settings",
  adminOverview: "/admin",
  adminProcessing: "/admin/processing",
  adminReviewQueue: "/admin/review-queue",
  adminContentManager: "/admin/content-manager",
  adminAgentLogs: "/admin/agent-logs",
};

export const PATH_TO_SCREEN: Record<string, AppScreen> = Object.fromEntries(
  Object.entries(SCREEN_TO_PATH).map(([screen, path]) => [path, screen as AppScreen]),
);

export const ADMIN_SCREEN_PERMISSION: Record<
  "adminOverview" | "adminProcessing" | "adminReviewQueue" | "adminContentManager" | "adminAgentLogs",
  Permission
> = {
  adminOverview: "admin:overview:view",
  adminProcessing: "admin:processing:manage",
  adminReviewQueue: "admin:review:manage",
  adminContentManager: "admin:content:manage",
  adminAgentLogs: "admin:agentLogs:view",
};

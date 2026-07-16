import {
  AdminAgentLogsPage,
  AdminContentManagerPage,
  AiTutorPage,
  BookmarksWeakAreasPage,
  DailyChallengePage,
  DashboardPage,
  GlobalSearchPage,
  LeaderboardPage,
  McqLibraryPage,
  NotesRevisionPage,
  NotificationSettingsPage,
  OfflineModePage,
  PracticePage,
  StudyPlanPage,
  SubscriptionPaywallPage,
  VideoLessonsPage,
} from "../../pages";
import { useScreenNavigate } from "../useScreenNavigation";

// Every page below only needs the router-backed navigate callback — no other
// route-specific data — so each gets a one-line route component.

export function DashboardRoute() {
  return <DashboardPage onNavigateScreen={useScreenNavigate()} />;
}

export function PracticeRoute() {
  return <PracticePage onNavigateScreen={useScreenNavigate()} />;
}

export function StudyPlanRoute() {
  return <StudyPlanPage onNavigateScreen={useScreenNavigate()} />;
}

export function AiTutorRoute() {
  return <AiTutorPage onNavigateScreen={useScreenNavigate()} />;
}

export function NotesRevisionRoute() {
  return <NotesRevisionPage onNavigateScreen={useScreenNavigate()} />;
}

export function McqLibraryRoute() {
  return <McqLibraryPage onNavigateScreen={useScreenNavigate()} />;
}

export function DailyChallengeRoute() {
  return <DailyChallengePage onNavigateScreen={useScreenNavigate()} />;
}

export function LeaderboardRoute() {
  return <LeaderboardPage onNavigateScreen={useScreenNavigate()} />;
}

export function VideoLessonsRoute() {
  return <VideoLessonsPage onNavigateScreen={useScreenNavigate()} />;
}

export function BookmarksWeakAreasRoute() {
  return <BookmarksWeakAreasPage onNavigateScreen={useScreenNavigate()} />;
}

export function OfflineModeRoute() {
  return <OfflineModePage onNavigateScreen={useScreenNavigate()} />;
}

export function GlobalSearchRoute() {
  return <GlobalSearchPage onNavigateScreen={useScreenNavigate()} />;
}

export function SubscriptionPaywallRoute() {
  return <SubscriptionPaywallPage onNavigateScreen={useScreenNavigate()} />;
}

export function NotificationSettingsRoute() {
  return <NotificationSettingsPage onNavigateScreen={useScreenNavigate()} />;
}

export function AdminContentManagerRoute() {
  return <AdminContentManagerPage onNavigateScreen={useScreenNavigate()} />;
}

export function AdminAgentLogsRoute() {
  return <AdminAgentLogsPage onNavigateScreen={useScreenNavigate()} />;
}

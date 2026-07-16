import { Navigate, Outlet, useLocation } from "react-router-dom";
import { hasSession } from "../../app/auth-persistence";
import { readOnboarded } from "../../app/onboarding-persistence";
import { DailyReminderToast } from "../../features/dailyReminder";
import { AUTH_PATH, ONBOARDING_PATH } from "../route-paths";

export function RootLayout() {
  // Reading location forces a re-check of auth/onboarding status on every
  // navigation (e.g. right after login, onboarding completes, or logout).
  useLocation();

  if (!hasSession()) {
    return <Navigate to={AUTH_PATH} replace />;
  }

  if (!readOnboarded()) {
    return <Navigate to={ONBOARDING_PATH} replace />;
  }

  return (
    <>
      <Outlet />
      <DailyReminderToast />
    </>
  );
}

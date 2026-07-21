import { useEffect } from "react";
import { Box, CircularProgress } from "@mui/material";
import { Navigate, Outlet, useLocation, useNavigate } from "react-router-dom";
import { DailyReminderToast } from "../../features/dailyReminder";
import { setGlobalNavigate } from "../../app/navigate";
import { useAppSelector } from "../../store/hooks";
import { selectAuthStatus, selectIsAuthReady, selectIsOnboarded } from "../../store/slices/auth-slice";
import { AUTH_PATH, ONBOARDING_PATH } from "../route-paths";

export function RootLayout() {
  // Reading location forces a re-check of auth/onboarding status on every
  // navigation (e.g. right after login, onboarding completes, or logout).
  useLocation();
  const navigate = useNavigate();

  // Lets non-React code (baseApi's 403 handling) redirect without importing
  // the router tree — see app/navigate.ts.
  useEffect(() => {
    setGlobalNavigate((path) => navigate(path));
  }, [navigate]);

  const isReady = useAppSelector(selectIsAuthReady);
  const status = useAppSelector(selectAuthStatus);
  const isOnboarded = useAppSelector(selectIsOnboarded);

  if (!isReady) {
    return (
      <Box sx={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <CircularProgress size={28} />
      </Box>
    );
  }

  if (status === "unauthenticated") {
    return <Navigate to={AUTH_PATH} replace />;
  }

  if (!isOnboarded) {
    return <Navigate to={ONBOARDING_PATH} replace />;
  }

  return (
    <>
      <Outlet />
      <DailyReminderToast />
    </>
  );
}

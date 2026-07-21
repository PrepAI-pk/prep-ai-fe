import { Box, CircularProgress } from "@mui/material";
import { Navigate } from "react-router-dom";
import { OnboardingPage } from "../../pages";
import { useAppSelector } from "../../store/hooks";
import { selectAuthStatus, selectIsAuthReady, selectIsOnboarded } from "../../store/slices/auth-slice";
import { AUTH_PATH, DEFAULT_PATH } from "../route-paths";

export function OnboardingRoute() {
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

  if (isOnboarded) {
    return <Navigate to={DEFAULT_PATH} replace />;
  }

  return <OnboardingPage />;
}

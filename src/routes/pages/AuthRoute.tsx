import { Box, CircularProgress } from "@mui/material";
import { Navigate } from "react-router-dom";
import { AuthPage } from "../../pages";
import { useAppSelector } from "../../store/hooks";
import { selectAuthStatus, selectIsAuthReady, selectIsOnboarded } from "../../store/slices/auth-slice";
import { DEFAULT_PATH, ONBOARDING_PATH } from "../route-paths";

export function AuthRoute() {
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

  if (status === "authenticated") {
    return <Navigate to={isOnboarded ? DEFAULT_PATH : ONBOARDING_PATH} replace />;
  }

  return <AuthPage />;
}

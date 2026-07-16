import { Navigate, useNavigate } from "react-router-dom";
import type { AuthenticatedUser } from "../../features/auth";
import { hasSession, persistSession } from "../../app/auth-persistence";
import { readOnboarded } from "../../app/onboarding-persistence";
import { AuthPage } from "../../pages";
import { DEFAULT_PATH, ONBOARDING_PATH } from "../route-paths";

export function AuthRoute() {
  const navigate = useNavigate();

  if (hasSession()) {
    return <Navigate to={readOnboarded() ? DEFAULT_PATH : ONBOARDING_PATH} replace />;
  }

  function handleAuthenticated(user: AuthenticatedUser): void {
    persistSession(user);
    navigate(ONBOARDING_PATH);
  }

  return <AuthPage onAuthenticated={handleAuthenticated} />;
}

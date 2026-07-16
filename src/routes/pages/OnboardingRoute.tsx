import { Navigate, useNavigate } from "react-router-dom";
import { hasSession } from "../../app/auth-persistence";
import { readOnboarded, persistOnboarded } from "../../app/onboarding-persistence";
import { OnboardingPage } from "../../pages";
import { AUTH_PATH, DEFAULT_PATH } from "../route-paths";

export function OnboardingRoute() {
  const navigate = useNavigate();

  if (!hasSession()) {
    return <Navigate to={AUTH_PATH} replace />;
  }

  if (readOnboarded()) {
    return <Navigate to={DEFAULT_PATH} replace />;
  }

  function handleComplete(): void {
    persistOnboarded();
    navigate(DEFAULT_PATH);
  }

  return <OnboardingPage onComplete={handleComplete} />;
}

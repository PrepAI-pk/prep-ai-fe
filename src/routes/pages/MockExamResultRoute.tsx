import { Navigate, useLocation, useNavigate } from "react-router-dom";
import type { MockExamRunResult } from "../../features/mockExams";
import { MockExamResultPage } from "../../pages";
import { SCREEN_TO_PATH } from "../route-paths";
import { useScreenNavigate } from "../useScreenNavigation";

export function MockExamResultRoute() {
  const navigate = useNavigate();
  const screenNavigate = useScreenNavigate();
  const location = useLocation();
  const result = (location.state as { result?: MockExamRunResult } | null)
    ?.result;

  if (!result) {
    return <Navigate to={SCREEN_TO_PATH.mockExams} replace />;
  }

  const exam = result.exam;

  function handleBackToExams(): void {
    navigate(SCREEN_TO_PATH.mockExams);
  }

  function handleRetake(): void {
    navigate(SCREEN_TO_PATH.mockExamRunner, { state: { exam } });
  }

  return (
    <MockExamResultPage
      result={result}
      onNavigateScreen={screenNavigate}
      onBackToExams={handleBackToExams}
      onRetake={handleRetake}
    />
  );
}

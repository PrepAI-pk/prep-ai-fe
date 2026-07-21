import { Navigate, useLocation, useNavigate } from "react-router-dom";
import { MockExamRunnerPage } from "../../pages";
import { SCREEN_TO_PATH } from "../route-paths";
import { useScreenNavigate } from "../useScreenNavigation";

export function MockExamRunnerRoute() {
  const navigate = useNavigate();
  const screenNavigate = useScreenNavigate();
  const location = useLocation();
  const attemptId = (location.state as { attemptId?: string } | null)?.attemptId;

  // location.state is empty after a hard refresh — there's nowhere to resume
  // *which* attempt from a bare URL, so send the learner back to pick again.
  if (!attemptId) {
    return <Navigate to={SCREEN_TO_PATH.mockExams} replace />;
  }

  function handleSubmitted(submittedAttemptId: string): void {
    navigate(SCREEN_TO_PATH.mockExamResult, { state: { attemptId: submittedAttemptId } });
  }

  return (
    <MockExamRunnerPage
      attemptId={attemptId}
      onNavigateScreen={screenNavigate}
      onSubmitted={handleSubmitted}
    />
  );
}

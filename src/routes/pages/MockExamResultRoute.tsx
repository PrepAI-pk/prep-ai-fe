import { Navigate, useLocation, useNavigate } from "react-router-dom";
import { useStartAttemptMutation } from "../../api/mock-exams/mock-exams.endpoints";
import { MockExamResultPage } from "../../pages";
import { SCREEN_TO_PATH } from "../route-paths";
import { useScreenNavigate } from "../useScreenNavigation";

export function MockExamResultRoute() {
  const navigate = useNavigate();
  const screenNavigate = useScreenNavigate();
  const location = useLocation();
  const attemptId = (location.state as { attemptId?: string } | null)?.attemptId;
  const [startAttempt] = useStartAttemptMutation();

  if (!attemptId) {
    return <Navigate to={SCREEN_TO_PATH.mockExams} replace />;
  }

  function handleBackToExams(): void {
    navigate(SCREEN_TO_PATH.mockExams);
  }

  async function handleRetake(examId: string): Promise<void> {
    try {
      const start = await startAttempt(examId).unwrap();
      navigate(SCREEN_TO_PATH.mockExamRunner, { state: { attemptId: start.attemptId } });
    } catch {
      // e.g. Free tier's monthly mock limit — send them to the list, which
      // surfaces the real error message if they try starting again there.
      navigate(SCREEN_TO_PATH.mockExams);
    }
  }

  return (
    <MockExamResultPage
      attemptId={attemptId}
      onNavigateScreen={screenNavigate}
      onBackToExams={handleBackToExams}
      onRetake={(examId) => void handleRetake(examId)}
    />
  );
}

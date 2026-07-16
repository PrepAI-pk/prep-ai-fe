import { Navigate, useLocation, useNavigate } from "react-router-dom";
import type { MockExam, MockExamRunResult } from "../../features/mockExams";
import { MockExamRunnerPage } from "../../pages";
import { SCREEN_TO_PATH } from "../route-paths";
import { useScreenNavigate } from "../useScreenNavigation";

export function MockExamRunnerRoute() {
  const navigate = useNavigate();
  const screenNavigate = useScreenNavigate();
  const location = useLocation();
  const exam = (location.state as { exam?: MockExam } | null)?.exam;

  // location.state is empty after a hard refresh (there's no get-by-id
  // endpoint to re-fetch the exam from the URL), so send the learner back
  // to pick one again instead of rendering a runner with no exam.
  if (!exam) {
    return <Navigate to={SCREEN_TO_PATH.mockExams} replace />;
  }

  function handleSubmitRun(result: MockExamRunResult): void {
    navigate(SCREEN_TO_PATH.mockExamResult, { state: { result } });
  }

  return (
    <MockExamRunnerPage
      exam={exam}
      onNavigateScreen={screenNavigate}
      onSubmitRun={handleSubmitRun}
    />
  );
}

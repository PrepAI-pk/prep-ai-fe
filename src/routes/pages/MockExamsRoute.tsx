import { useNavigate } from "react-router-dom";
import type { StartAttemptResponse } from "../../features/mockExams";
import { MockExamsPage } from "../../pages";
import { SCREEN_TO_PATH } from "../route-paths";
import { useScreenNavigate } from "../useScreenNavigation";

export function MockExamsRoute() {
  const navigate = useNavigate();
  const screenNavigate = useScreenNavigate();

  function handleStarted(start: StartAttemptResponse): void {
    navigate(SCREEN_TO_PATH.mockExamRunner, { state: { attemptId: start.attemptId } });
  }

  return (
    <MockExamsPage
      onNavigateScreen={screenNavigate}
      onStarted={handleStarted}
    />
  );
}

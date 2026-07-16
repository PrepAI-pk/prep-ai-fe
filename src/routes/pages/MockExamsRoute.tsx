import { useNavigate } from "react-router-dom";
import type { MockExam } from "../../features/mockExams";
import { MockExamsPage } from "../../pages";
import { SCREEN_TO_PATH } from "../route-paths";
import { useScreenNavigate } from "../useScreenNavigation";

export function MockExamsRoute() {
  const navigate = useNavigate();
  const screenNavigate = useScreenNavigate();

  function handleStartExam(exam: MockExam): void {
    navigate(SCREEN_TO_PATH.mockExamRunner, { state: { exam } });
  }

  return (
    <MockExamsPage
      onNavigateScreen={screenNavigate}
      onStartExam={handleStartExam}
    />
  );
}

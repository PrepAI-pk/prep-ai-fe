import { Navigate, useParams } from "react-router-dom";
import { VideoLessonsPage } from "../../pages";
import { SCREEN_TO_PATH } from "../route-paths";
import { useScreenNavigate } from "../useScreenNavigation";

export function VideoLessonsPlayerRoute() {
  const { courseId } = useParams<{ courseId: string }>();
  const onNavigateScreen = useScreenNavigate();

  if (!courseId) {
    return <Navigate to={SCREEN_TO_PATH.videoLessons} replace />;
  }

  return <VideoLessonsPage courseId={courseId} onNavigateScreen={onNavigateScreen} />;
}

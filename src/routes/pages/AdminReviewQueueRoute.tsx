import { AdminReviewQueuePage } from "../../pages";
import { useScreenNavigate } from "../useScreenNavigation";

export function AdminReviewQueueRoute() {
  return <AdminReviewQueuePage onNavigateScreen={useScreenNavigate()} />;
}

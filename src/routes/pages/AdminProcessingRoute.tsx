import { AdminProcessingPage } from "../../pages";
import { useScreenNavigate } from "../useScreenNavigation";

export function AdminProcessingRoute() {
  return <AdminProcessingPage onNavigateScreen={useScreenNavigate()} />;
}

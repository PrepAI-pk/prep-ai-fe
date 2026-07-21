import { AdminOverviewPage } from "../../pages";
import { useScreenNavigate } from "../useScreenNavigation";

export function AdminOverviewRoute() {
  return <AdminOverviewPage onNavigateScreen={useScreenNavigate()} />;
}

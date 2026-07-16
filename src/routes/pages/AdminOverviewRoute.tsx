import { AdminOverviewPage } from "../../pages";
import { useAppSelector } from "../../store/hooks";
import { selectAdminDrafts } from "../../store/slices/admin-content-slice";
import { useScreenNavigate } from "../useScreenNavigation";

export function AdminOverviewRoute() {
  const drafts = useAppSelector(selectAdminDrafts);

  return (
    <AdminOverviewPage drafts={drafts} onNavigateScreen={useScreenNavigate()} />
  );
}

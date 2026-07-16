import type { AdminDraftStatus } from "../../features/admin";
import { AdminReviewQueuePage } from "../../pages";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import {
  resolveAdminDraft,
  selectAdminDrafts,
} from "../../store/slices/admin-content-slice";
import { useScreenNavigate } from "../useScreenNavigation";

export function AdminReviewQueueRoute() {
  const dispatch = useAppDispatch();
  const drafts = useAppSelector(selectAdminDrafts);

  function handleResolveDraft(draftId: string, status: AdminDraftStatus): void {
    dispatch(resolveAdminDraft({ draftId, status }));
  }

  return (
    <AdminReviewQueuePage
      drafts={drafts}
      onResolveDraft={handleResolveDraft}
      onNavigateScreen={useScreenNavigate()}
    />
  );
}

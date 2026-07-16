import type { AdminDocument, AdminDraft } from "../../features/admin";
import { AdminProcessingPage } from "../../pages";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import {
  pushAdminDocument,
  pushAdminDraft,
  selectAdminDocuments,
} from "../../store/slices/admin-content-slice";
import { useScreenNavigate } from "../useScreenNavigation";

export function AdminProcessingRoute() {
  const dispatch = useAppDispatch();
  const documents = useAppSelector(selectAdminDocuments);

  function handlePushDocument(document: AdminDocument): void {
    dispatch(pushAdminDocument(document));
  }

  function handlePushDraft(draft: AdminDraft): void {
    dispatch(pushAdminDraft(draft));
  }

  return (
    <AdminProcessingPage
      documents={documents}
      onPushDocument={handlePushDocument}
      onPushDraft={handlePushDraft}
      onNavigateScreen={useScreenNavigate()}
    />
  );
}

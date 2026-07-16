import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import {
  INITIAL_ADMIN_DOCUMENTS,
  INITIAL_ADMIN_DRAFTS,
} from "../../app/app.constants";
import type {
  AdminDocument,
  AdminDraft,
  AdminDraftStatus,
} from "../../features/admin";
import type { RootState } from "../store";

export type AdminContentState = {
  documents: AdminDocument[];
  drafts: AdminDraft[];
};

const initialState: AdminContentState = {
  documents: INITIAL_ADMIN_DOCUMENTS,
  drafts: INITIAL_ADMIN_DRAFTS,
};

const adminContentSlice = createSlice({
  name: "adminContent",
  initialState,
  reducers: {
    pushAdminDocument(state, action: PayloadAction<AdminDocument>) {
      state.documents.unshift(action.payload);
    },
    pushAdminDraft(state, action: PayloadAction<AdminDraft>) {
      state.drafts.unshift(action.payload);
    },
    resolveAdminDraft(
      state,
      action: PayloadAction<{ draftId: string; status: AdminDraftStatus }>,
    ) {
      const draft = state.drafts.find(
        (candidate) => candidate.id === action.payload.draftId,
      );

      if (draft) {
        draft.status = action.payload.status;
      }
    },
  },
});

export const { pushAdminDocument, pushAdminDraft, resolveAdminDraft } =
  adminContentSlice.actions;

export const adminContentReducer = adminContentSlice.reducer;

export const selectAdminDocuments = (state: RootState): AdminDocument[] =>
  state.adminContent.documents;

export const selectAdminDrafts = (state: RootState): AdminDraft[] =>
  state.adminContent.drafts;

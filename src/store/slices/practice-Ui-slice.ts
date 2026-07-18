import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

export type PracticeUiState = {
  selectedSubject: string;
};

const initialState: PracticeUiState = {
  selectedSubject: "All",
};

const practiceUiSlice = createSlice({
  name: "practiceUi",
  initialState,
  reducers: {
    setSelectedSubject(state, action: PayloadAction<string>) {
      state.selectedSubject = action.payload;
    },
  },
});

export const { setSelectedSubject } = practiceUiSlice.actions;

export const practiceUiReducer = practiceUiSlice.reducer;

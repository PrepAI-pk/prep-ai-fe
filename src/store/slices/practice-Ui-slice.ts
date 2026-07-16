import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

export type PracticeUiState = {
  selectedSubject: string;
  currentIndex: number;
  bookmarks: Record<number, boolean>;
};

const initialState: PracticeUiState = {
  selectedSubject: "All",
  currentIndex: 0,
  bookmarks: {},
};

const practiceUiSlice = createSlice({
  name: "practiceUi",
  initialState,
  reducers: {
    setSelectedSubject(state, action: PayloadAction<string>) {
      state.selectedSubject = action.payload;
      state.currentIndex = 0;
    },
    setCurrentIndex(state, action: PayloadAction<number>) {
      state.currentIndex = action.payload;
    },
    toggleBookmark(state, action: PayloadAction<number>) {
      const questionId = action.payload;
      state.bookmarks[questionId] = !state.bookmarks[questionId];
    },
  },
});

export const { setSelectedSubject, setCurrentIndex, toggleBookmark } =
  practiceUiSlice.actions;

export const practiceUiReducer = practiceUiSlice.reducer;

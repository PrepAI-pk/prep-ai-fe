import { useAppDispatch, useAppSelector } from "../../../store/hooks";
import {
  setCurrentIndex,
  setSelectedSubject,
  toggleBookmark,
} from "../../../store/slices/practice-Ui-slice";

export function usePracticeUi() {
  const dispatch = useAppDispatch();

  const selectedSubject = useAppSelector(
    (state) => state.practiceUi.selectedSubject,
  );
  const currentIndex = useAppSelector((state) => state.practiceUi.currentIndex);
  const bookmarks = useAppSelector((state) => state.practiceUi.bookmarks);

  return {
    selectedSubject,
    currentIndex,
    bookmarks,
    setSelectedSubject: (subject: string) => dispatch(setSelectedSubject(subject)),
    setCurrentIndex: (index: number) => dispatch(setCurrentIndex(index)),
    toggleBookmark: (questionId: number) => dispatch(toggleBookmark(questionId)),
  };
}

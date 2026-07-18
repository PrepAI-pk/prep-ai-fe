import { useAppDispatch, useAppSelector } from "../../../store/hooks";
import { setSelectedSubject } from "../../../store/slices/practice-Ui-slice";

export function usePracticeUi() {
  const dispatch = useAppDispatch();

  const selectedSubject = useAppSelector((state) => state.practiceUi.selectedSubject);

  return {
    selectedSubject,
    setSelectedSubject: (subject: string) => dispatch(setSelectedSubject(subject)),
  };
}

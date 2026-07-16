import { useGetPracticeQuestionsQuery } from "../../../api/practice/practice.endpoints";

export function usePracticeQuestions() {
  return useGetPracticeQuestionsQuery(50);
}

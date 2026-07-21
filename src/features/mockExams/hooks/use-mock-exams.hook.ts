import { useGetExamsQuery } from "../../../api/mock-exams/mock-exams.endpoints";

export function useMockExams() {
  return useGetExamsQuery();
}

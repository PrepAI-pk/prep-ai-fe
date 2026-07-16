import { useGetMockExamsQuery } from "../../../api/mock-exams/mock-exams.endpoints";

export function useMockExams() {
  return useGetMockExamsQuery(20);
}

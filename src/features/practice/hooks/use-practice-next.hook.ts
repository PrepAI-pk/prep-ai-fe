import { useGetPracticeNextQuery } from "../../../api/practice/practice.endpoints";
import type { PracticeNextParams } from "../../../api/practice/practice.types";

export function usePracticeNext(params: PracticeNextParams) {
  return useGetPracticeNextQuery(params);
}

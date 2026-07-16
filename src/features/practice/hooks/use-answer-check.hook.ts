import { useCheckPracticeAnswerMutation } from "../../../api/practice/practice.endpoints";

export function useAnswerCheck() {
  const [trigger, mutationState] = useCheckPracticeAnswerMutation();

  return {
    mutate: trigger,
    reset: mutationState.reset,
    data: mutationState.data,
    error: mutationState.error,
    isPending: mutationState.isLoading,
    isError: mutationState.isError,
    isSuccess: mutationState.isSuccess,
  };
}

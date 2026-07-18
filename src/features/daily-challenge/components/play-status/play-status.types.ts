export interface IQuestion {
  id: string;
  question: string;
  options: string[];
  correctIndex: number | null;
  explanation: string | null;
  subject: string;
  difficulty: string;
}

export interface PlayStatusProps {
  progress: number;
  current: IQuestion;
  questionIndex: number;
  totalQuestions: number;
  selectedOption: number | null;
  revealed: boolean;
  handleSelect: (index: number) => void;
  handleNext: () => void;
}

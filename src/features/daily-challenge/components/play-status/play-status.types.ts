export interface IQuestion {
  id: number;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  subject: string;
  difficulty: string;
}

export interface PlayStatusProps {
  progress: number;
  current: IQuestion;
  questionIndex: number;
  challengeQuestions: IQuestion[];
  selectedOption: number | null;
  revealed: boolean;
  handleSelect: (index: number) => void;
  handleNext: () => void;
}

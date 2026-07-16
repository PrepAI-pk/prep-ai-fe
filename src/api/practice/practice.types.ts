export type PracticeQuestion = {
  id: number;
  subject: string;
  difficulty: string;
  questionText: string;
  options: string[];
  explanation: string;
  createdAt: string;
  updatedAt: string;
};

export type PracticeQuestionDetail = PracticeQuestion & {
  correctIndex?: number;
};

export type CheckPracticeAnswerResponse = {
  questionId: number;
  selectedIndex: number;
  isCorrect: boolean;
  explanation: string;
  correctIndex?: number;
};

export type CheckPracticeAnswerPayload = {
  questionId: number;
  selectedIndex: number;
};
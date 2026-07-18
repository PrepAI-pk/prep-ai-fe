import type { AppScreen } from "../../../../app/screens";

export interface DoneStatusProps {
  resultTitle: string;
  resultSub: string;
  earnedXp: number;
  dc: { streak: number };
  score: number;
  totalQuestions: number;
  onNavigateScreen?: (screen: AppScreen) => void;
}

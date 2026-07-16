import type { AppScreen } from "../../../../app/screens";
import type { ChallengeQuestion } from "../../daily-challenge.constants";

export interface DoneStatusProps {
  resultTitle: string;
  resultSub: string;
  earnedXp: number;
  dc: { streak: number };
  score: number;
  challengeQuestions: ChallengeQuestion[];
  onNavigateScreen?: (screen: AppScreen) => void;
}

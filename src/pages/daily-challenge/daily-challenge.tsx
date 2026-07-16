import type { AppScreen } from "../../app/screens";
import { DailyChallengeScreen } from "../../features/daily-challenge";

type DailyChallengePageProps = {
  onNavigateScreen?: (screen: AppScreen) => void;
};

export function DailyChallengePage(props: DailyChallengePageProps = {}) {
  return <DailyChallengeScreen {...props} />;
}

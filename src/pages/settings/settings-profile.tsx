import type { AppScreen } from "../../app/screens";
import { SettingsProfileScreen } from "../../features/settings";

type SettingsProfilePageProps = {
  onNavigateScreen?: (screen: AppScreen) => void;
  onLogout?: () => void;
};

export function SettingsProfilePage(props: SettingsProfilePageProps = {}) {
  return <SettingsProfileScreen {...props} />;
}

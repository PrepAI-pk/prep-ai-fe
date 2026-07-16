import type { AppScreen } from "../../app/screens";
import { NotificationSettingsScreen } from "../../features/notifications";

type NotificationSettingsPageProps = {
  onNavigateScreen?: (screen: AppScreen) => void;
};

export function NotificationSettingsPage(props: NotificationSettingsPageProps = {}) {
  return <NotificationSettingsScreen {...props} />;
}

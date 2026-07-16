import { useNavigate } from "react-router-dom";
import { clearSession } from "../../app/auth-persistence";
import { SettingsProfilePage } from "../../pages";
import { AUTH_PATH } from "../route-paths";
import { useScreenNavigate } from "../useScreenNavigation";

export function SettingsProfileRoute() {
  const navigate = useNavigate();
  const screenNavigate = useScreenNavigate();

  function handleLogout(): void {
    clearSession();
    navigate(AUTH_PATH);
  }

  return (
    <SettingsProfilePage
      onNavigateScreen={screenNavigate}
      onLogout={handleLogout}
    />
  );
}

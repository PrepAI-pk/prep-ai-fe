import { useNavigate } from "react-router-dom";
import { useLogoutMutation } from "../../api/auth/auth.endpoints";
import { SettingsProfilePage } from "../../pages";
import { useAppDispatch } from "../../store/hooks";
import { authEnded } from "../../store/slices/auth-slice";
import { AUTH_PATH } from "../route-paths";
import { useScreenNavigate } from "../useScreenNavigation";

export function SettingsProfileRoute() {
  const navigate = useNavigate();
  const screenNavigate = useScreenNavigate();
  const dispatch = useAppDispatch();
  const [logout] = useLogoutMutation();

  async function handleLogout(): Promise<void> {
    try {
      await logout().unwrap();
    } catch {
      // Best-effort — even if revoking the server-side session fails (e.g.
      // already expired), still clear the local session below.
    }
    dispatch(authEnded());
    navigate(AUTH_PATH);
  }

  return (
    <SettingsProfilePage
      onNavigateScreen={screenNavigate}
      onLogout={handleLogout}
    />
  );
}

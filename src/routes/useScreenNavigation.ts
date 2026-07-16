import { useCallback } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import type { AppScreen } from "../app/screens";
import { PATH_TO_SCREEN, SCREEN_TO_PATH } from "./route-paths";

/**
 * Bridges the existing AppScreen-typed page/sidebar/topbar props to real
 * browser navigation, so none of the ~24 leaf page components need to change
 * their onNavigateScreen/activeScreen prop signatures.
 */
export function useScreenNavigate(): (screen: AppScreen) => void {
  const navigate = useNavigate();

  return useCallback(
    (screen: AppScreen) => {
      navigate(SCREEN_TO_PATH[screen]);
    },
    [navigate],
  );
}

export function useActiveScreen(fallback: AppScreen = "dashboard"): AppScreen {
  const location = useLocation();
  return PATH_TO_SCREEN[location.pathname] ?? fallback;
}

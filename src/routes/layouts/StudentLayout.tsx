import { Box } from "@mui/material";
import { Outlet } from "react-router-dom";
import { PracticeSidebar } from "../../features/practice";
import { useActiveScreen, useScreenNavigate } from "../useScreenNavigation";
import { layoutShellStyles } from "./layout-shell.styles";

export function StudentLayout() {
  const activeScreen = useActiveScreen("dashboard");
  const screenNavigate = useScreenNavigate();

  return (
    <Box sx={layoutShellStyles.root}>
      <PracticeSidebar
        mode="student"
        activeScreen={activeScreen}
        onNavigate={screenNavigate}
      />
      <Outlet />
    </Box>
  );
}

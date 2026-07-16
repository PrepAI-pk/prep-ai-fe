import type { AgentRunStatus } from "./admin.constants";

export const adminSharedStyles = {
  root: {
    minHeight: "100vh",
    backgroundColor: "background.default",
    display: "flex",
  },
  shell: {
    flex: 1,
    minWidth: 0,
    display: "flex",
    flexDirection: "column",
    height: "100vh",
    overflow: "hidden",
  },
  scrollBody: {
    flex: 1,
    overflow: "auto",
    px: { xs: 2, md: 3.75 },
    pt: { xs: 2.5, md: 3.75 },
    pb: { xs: 5, md: 7.5 },
  },
};

export const statusToneStyles = (status: AgentRunStatus) => {
  if (status === "success") {
    return { dot: "success.main", bg: "success.light", fg: "success.main" };
  }
  if (status === "running") {
    return { dot: "primary.main", bg: "primary.light", fg: "primary.main" };
  }
  if (status === "warning") {
    return { dot: "secondary.main", bg: "secondary.light", fg: "secondary.main" };
  }
  return { dot: "text.disabled", bg: "background.default", fg: "text.secondary" };
};

export const offlineModeStyles = {
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
  wrap: { maxWidth: 820, mx: "auto", display: "grid", gap: 1.25 },
  toggleCard: {
    p: 1.5,
    borderRadius: "16px",
    borderColor: "divider",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 1,
  },
  statusRow: { display: "flex", alignItems: "center", gap: 0.8 },
  storageCard: { p: 1.5, borderRadius: "16px", borderColor: "divider" },
  storageHead: { display: "flex", justifyContent: "space-between", gap: 1, mb: 0.7 },
  packsGrid: { display: "grid", gap: 0.9 },
  packCard: { p: 1.3, borderRadius: "16px" },
  packHead: { display: "flex", justifyContent: "space-between", gap: 1 },
};

export const enabledChipSx = (enabled: boolean) => ({
  bgcolor: enabled ? "success.light" : "error.light",
  color: enabled ? "success.main" : "error.main",
});

export const downloadStatusChipSx = {
  bgcolor: "primary.light",
  color: "primary.main",
};

export const storageBarSx = {
  height: 8,
  borderRadius: 99,
  backgroundColor: "background.default",
};

export const downloadProgressSx = {
  mt: 0.9,
  height: 7,
  borderRadius: 99,
  backgroundColor: "background.default",
};

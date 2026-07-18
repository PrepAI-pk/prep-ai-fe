export const leaderboardStyles = {
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
  wrap: { maxWidth: 940, mx: "auto", display: "grid", gap: 1.8 },
  filterRow: { display: "flex", justifyContent: "space-between", gap: 1, flexWrap: "wrap" },
  chipGroup: { display: "flex", gap: 0.7, flexWrap: "wrap" },
  podiumCard: { p: 2.2, borderRadius: "16px", borderColor: "divider" },
  podiumGrid: { display: "grid", gridTemplateColumns: "repeat(3, minmax(0,1fr))", gap: 0.8, alignItems: "end" },
  rankBadge: { width: 34, height: 34, borderRadius: "50%", display: "grid", placeItems: "center", fontWeight: 700 },
  yourRankCard: {
    p: 2.2,
    borderRadius: "16px",
    color: "#ffffff",
    background: "linear-gradient(135deg, #33508c 0%, #4768ab 100%)",
  },
  metricRow: { mt: 0.8, display: "grid", gridTemplateColumns: { xs: "1fr", md: "repeat(4,minmax(0,1fr))" }, gap: 1 },
};

export const scopeChipSx = (active: boolean) => ({
  borderRadius: "20px",
  border: "1px solid",
  borderColor: active ? "primary.main" : "divider",
  backgroundColor: active ? "primary.main" : "background.paper",
  color: active ? "#ffffff" : "text.secondary",
  fontWeight: active ? 600 : 500,
});

export const periodChipSx = (active: boolean) => ({
  borderRadius: "20px",
  border: "1px solid",
  borderColor: active ? "primary.main" : "divider",
  backgroundColor: active ? "primary.light" : "background.paper",
  color: active ? "primary.main" : "text.secondary",
  fontWeight: active ? 600 : 500,
});

export const podiumPillarSx = (height: number) => ({
  mt: 0.8,
  height,
  borderRadius: "12px 12px 4px 4px",
  bgcolor: "background.paper",
  border: "1px solid",
  borderColor: "divider",
  display: "grid",
  placeItems: "center",
});

export const trendSx = (trend: "up" | "down" | "flat") => ({
  color: trend === "up" ? "success.main" : trend === "down" ? "error.main" : "text.disabled",
  fontWeight: 700,
});

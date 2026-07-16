export const adminOverviewStyles = {
  wrap: { maxWidth: 1160, mx: "auto", display: "grid", gap: 2 },
  statGrid: { display: "grid", gridTemplateColumns: { xs: "1fr", sm: "repeat(auto-fit,minmax(200px,1fr))" }, gap: 2, mb: 0.75 },
  statCard: { p: "18px 19px", borderRadius: "16px", boxShadow: "0 1px 2px rgba(24,24,32,.05)" },
  statLabel: { color: "text.secondary", fontSize: 12.5, fontWeight: 500 },
  statValue: { fontFamily: '"Source Serif 4", serif', fontSize: 30, fontWeight: 700, letterSpacing: "-.02em", mt: "5px" },
  splitGrid: { display: "grid", gridTemplateColumns: { xs: "1fr", lg: "1.1fr .9fr" }, gap: 2, mb: 0.2 },
  card: { p: "22px", borderRadius: "16px" },
  title: { fontFamily: '"Source Serif 4", serif', fontSize: 17, fontWeight: 600 },
  row: { display: "flex", alignItems: "center", gap: "12px", py: "11px", borderTop: "1px solid", borderTopColor: "divider" },
  statusBadge: {
    fontSize: 11,
    fontWeight: 700,
    px: "9px",
    py: "3px",
    borderRadius: "6px",
    fontFamily: '"Space Mono", monospace',
    textTransform: "uppercase",
    letterSpacing: ".04em",
    whiteSpace: "nowrap",
  },
};

export const deltaSx = (tone: string) => ({
  fontSize: 12.5,
  mt: "6px",
  fontWeight: 600,
  color: tone === "accent" ? "secondary.main" : "success.main",
});

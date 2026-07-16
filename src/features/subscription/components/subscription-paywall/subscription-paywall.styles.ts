export const subscriptionPaywallStyles = {
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
  wrap: { maxWidth: 1040, mx: "auto", display: "grid", gap: 1.75 },
  hero: { textAlign: "center", maxWidth: 560, mx: "auto", mb: 1 },
  billingToggleWrap: { display: "flex", justifyContent: "center", mb: 0.5 },
  billingToggle: {
    display: "flex",
    gap: 0.5,
    p: 0.5,
    borderRadius: "24px",
    backgroundColor: "background.default",
    border: "1px solid",
    borderColor: "divider",
  },
  annualBadge: {
    fontSize: 11,
    fontWeight: 700,
    px: 0.95,
    py: 0.2,
    borderRadius: "20px",
    backgroundColor: "success.light",
    color: "success.main",
    fontFamily: '"Space Mono", monospace',
  },
  plansGrid: { display: "grid", gridTemplateColumns: { xs: "1fr", md: "repeat(3, minmax(0,1fr))" }, gap: 1.2 },
  highlightedPill: {
    position: "absolute",
    top: -11,
    left: "50%",
    transform: "translateX(-50%)",
    fontSize: 11,
    fontWeight: 700,
    px: 1.75,
    py: 0.5,
    borderRadius: "20px",
    backgroundColor: "secondary.main",
    color: "#fff",
    fontFamily: '"Space Mono", monospace',
    textTransform: "uppercase",
    letterSpacing: ".06em",
    whiteSpace: "nowrap",
  },
  priceRow: { display: "flex", alignItems: "baseline", gap: 0.8, mt: 2.2 },
  featuresGrid: { mt: 2.75, mb: 3, display: "grid", gap: 1.4 },
  featureRow: { display: "flex", alignItems: "flex-start", gap: 1.25 },
  comparisonCard: { borderRadius: "18px", borderColor: "divider", p: "8px 8px 12px", overflow: "hidden" },
  comparisonGrid: { display: "grid", gap: 0.5 },
  comparisonHeader: {
    display: "grid",
    gridTemplateColumns: "1.6fr 1fr 1fr 1fr",
    gap: 1,
    px: 2.25,
    py: 1.75,
    fontSize: 11,
    fontWeight: 700,
    letterSpacing: ".06em",
    textTransform: "uppercase",
    color: "text.disabled",
    fontFamily: '"Space Mono", monospace',
  },
  guarantee: {
    textAlign: "center",
    mt: 0.5,
    fontSize: 13,
    color: "text.disabled",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 1,
  },
  guaranteeDot: {
    width: 16,
    height: 16,
    borderRadius: "50%",
    backgroundColor: "success.light",
    color: "success.main",
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: 10,
  },
};

export const billingOptionSx = (active: boolean, withInlineRow = false) => ({
  px: 2.1,
  py: 1,
  borderRadius: "20px",
  fontSize: 13.5,
  fontWeight: 600,
  cursor: "pointer",
  ...(withInlineRow ? { display: "flex", alignItems: "center", gap: 0.8 } : {}),
  backgroundColor: active ? "primary.main" : "transparent",
  color: active ? "primary.contrastText" : "text.secondary",
});

export const planCardSx = (highlighted: boolean) => ({
  p: "26px 24px",
  borderRadius: "20px",
  position: "relative",
  borderColor: highlighted ? "primary.main" : "divider",
  backgroundColor: highlighted ? "primary.main" : "background.paper",
  color: highlighted ? "primary.contrastText" : "text.primary",
  boxShadow: highlighted ? "0 4px 20px -8px rgba(24,24,32,.14)" : "0 1px 2px rgba(24,24,32,.05)",
  transform: highlighted ? "translateY(-6px)" : "none",
});

export const planSubtitleSx = (highlighted: boolean) => ({
  fontSize: 13,
  mt: 0.45,
  ...(highlighted ? { opacity: 0.85 } : { color: "text.secondary" }),
});

export const priceSuffixSx = (highlighted: boolean) => ({
  fontSize: 13,
  ...(highlighted ? { opacity: 0.8 } : { color: "text.secondary" }),
});

export const billingHintSx = (highlighted: boolean) => ({
  fontSize: 12,
  mt: 0.5,
  fontFamily: '"Space Mono", monospace',
  ...(highlighted ? { opacity: 0.75 } : { color: "text.disabled" }),
});

export const featureCheckSx = (highlighted: boolean) => ({
  width: 18,
  height: 18,
  borderRadius: "50%",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  fontSize: 11,
  backgroundColor: highlighted ? "rgba(255,255,255,.2)" : "success.light",
  color: highlighted ? "#fff" : "success.main",
  flex: "none",
  mt: 0.15,
});

export const featureTextSx = (highlighted: boolean) => ({
  fontSize: 13.5,
  lineHeight: 1.4,
  ...(highlighted ? {} : { color: "text.primary" }),
});

export const ctaButtonSx = (planName: "Free" | "Pro" | "Elite", highlighted: boolean) => ({
  mt: "auto",
  py: planName === "Free" ? 1.45 : 1.6,
  borderRadius: "12px",
  fontWeight: planName === "Free" ? 600 : 700,
  fontSize: planName === "Free" ? 14 : 14.5,
  ...(planName === "Free"
    ? { color: "text.secondary", borderColor: "divider" }
    : highlighted
      ? { bgcolor: "background.paper", color: "primary.main", "&:hover": { bgcolor: "background.paper" } }
      : {}),
});

export const comparisonRowSx = {
  display: "grid",
  gridTemplateColumns: "1.6fr 1fr 1fr 1fr",
  gap: 1,
  px: 2.25,
  py: 1.6,
  borderTop: "1px solid",
  borderColor: "divider",
  alignItems: "center",
  fontSize: 13.5,
};

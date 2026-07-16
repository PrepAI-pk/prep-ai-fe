import type { RowBadgeKind } from "../../admin.constants";

export const adminContentManagerStyles = {
  wrap: { maxWidth: 900, mx: "auto", display: "grid", gap: 1.1 },
  tabsRow: { display: "flex", gap: "8px", flexWrap: "wrap", mb: "2px" },
  tabPill: {
    px: "15px",
    py: "8px",
    borderRadius: "20px",
    cursor: "pointer",
    fontSize: 13,
    border: "1px solid",
  },
  tableHeader: { display: "grid", gridTemplateColumns: "2fr 1fr 1fr auto", gap: "12px", px: "20px", py: "13px", bgcolor: "background.default" },
  heading: {
    fontSize: 11,
    fontWeight: 700,
    letterSpacing: ".06em",
    textTransform: "uppercase",
    color: "text.disabled",
    fontFamily: '"Space Mono", monospace',
  },
  row: {
    display: "grid",
    gridTemplateColumns: "2fr 1fr 1fr auto",
    gap: "12px",
    alignItems: "center",
    px: "20px",
    py: "13px",
    borderTop: "1px solid",
    borderTopColor: "divider",
  },
  statusBadge: {
    fontSize: 11,
    fontWeight: 700,
    px: "9px",
    py: "3px",
    borderRadius: "6px",
    width: "fit-content",
    fontFamily: '"Space Mono", monospace',
    textTransform: "uppercase",
    letterSpacing: ".04em",
    whiteSpace: "nowrap",
  },
};

export const tabPillStateSx = (active: boolean) => ({
  fontWeight: active ? 600 : 500,
  color: active ? "primary.contrastText" : "text.secondary",
  backgroundColor: active ? "primary.main" : "background.paper",
  borderColor: active ? "primary.main" : "divider",
});

export const rowBadgeToneSx = (kind: RowBadgeKind) => ({
  backgroundColor:
    kind === "good"
      ? "success.light"
      : kind === "accent"
        ? "secondary.light"
        : kind === "info"
          ? "primary.light"
          : "background.default",
  color:
    kind === "good"
      ? "success.main"
      : kind === "accent"
        ? "secondary.main"
        : kind === "info"
          ? "primary.main"
          : "text.secondary",
});

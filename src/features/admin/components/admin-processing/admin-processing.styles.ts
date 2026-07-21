export const adminProcessingStyles = {
  wrap: { maxWidth: 1000, mx: "auto", display: "grid", gap: 1.2 },
  uploadCard: {
    border: "2px dashed",
    borderColor: "divider",
    borderRadius: "18px",
    p: "34px",
    textAlign: "center",
    bgcolor: "background.default",
  },
  uploadIcon: {
    width: 48,
    height: 48,
    borderRadius: "14px",
    bgcolor: "primary.light",
    color: "primary.main",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    mx: "auto",
    mb: "14px",
    fontSize: 22,
  },
  title: { fontFamily: '"Source Serif 4", serif', fontSize: 18, fontWeight: 600 },
  fileCard: { p: "24px", borderRadius: "18px", mt: "2px" },
  fileStatus: {
    fontSize: 11.5,
    fontWeight: 700,
    px: "10px",
    py: "4px",
    borderRadius: "20px",
    textTransform: "uppercase",
    fontFamily: '"Space Mono", monospace',
  },
  stageChip: {
    display: "inline-flex",
    alignItems: "center",
    gap: "8px",
    px: "10px",
    py: "7px",
    borderRadius: "10px",
    border: "1px solid",
    fontSize: 12,
    fontWeight: 600,
  },
  docsCard: { p: "20px 22px", borderRadius: "16px", mt: "2px" },
  docRow: { display: "flex", alignItems: "center", gap: "14px", py: "12px", borderTop: "1px solid", borderTopColor: "divider" },
  docType: {
    width: 36,
    height: 36,
    borderRadius: "9px",
    bgcolor: "background.default",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: 10,
    fontWeight: 700,
    fontFamily: '"Space Mono", monospace',
    color: "text.secondary",
  },
  docStatus: {
    fontSize: 11.5,
    fontWeight: 700,
    px: "10px",
    py: "4px",
    borderRadius: "20px",
    textTransform: "uppercase",
    fontFamily: '"Space Mono", monospace',
  },
};

export const processStatusToneSx = (running: boolean, done: boolean) => ({
  bgcolor: running ? "warning.light" : done ? "success.light" : "background.default",
  color: running ? "warning.main" : done ? "success.main" : "text.disabled",
});

export const stageChipToneSx = (stageDone: boolean, active: boolean) => ({
  borderColor: stageDone ? "success.main" : active ? "primary.main" : "divider",
  bgcolor: stageDone ? "success.light" : active ? "primary.light" : "background.paper",
  color: stageDone ? "success.main" : active ? "primary.main" : "text.secondary",
});

export const stageDotToneSx = (stageDone: boolean, active: boolean) => ({
  width: 8,
  height: 8,
  borderRadius: "50%",
  bgcolor: stageDone ? "success.main" : active ? "primary.main" : "text.disabled",
});

export const docStatusToneSx = (status: string) => ({
  bgcolor:
    status === "published"
      ? "success.light"
      : status === "review"
        ? "primary.light"
        : status === "processing"
          ? "warning.light"
          : status === "failed"
            ? "error.light"
            : "background.default",
  color:
    status === "published"
      ? "success.main"
      : status === "review"
        ? "primary.main"
        : status === "processing"
          ? "warning.main"
          : status === "failed"
            ? "error.main"
            : "text.disabled",
});

import { Box, Chip, Paper, Skeleton } from "@mui/material";

export function PracticeSkeleton() {
  return (
    <Paper
      sx={{
        borderRadius: "20px",
        border: "1px solid",
        borderColor: "divider",
        p: { xs: 2.5, md: "28px 30px" },
        boxShadow: "0 4px 20px -8px rgba(24,24,32,.14)",
      }}
    >
      <Box sx={{ mb: 2.5, display: "flex", gap: 1, flexWrap: "wrap" }}>
        <Chip label={<Skeleton variant="text" width={48} />} sx={{ borderRadius: 5 }} />
        <Chip label={<Skeleton variant="text" width={96} />} sx={{ borderRadius: 5 }} />
        <Chip label={<Skeleton variant="text" width={86} />} sx={{ borderRadius: 5 }} />
      </Box>

      <Skeleton variant="rounded" height={10} sx={{ borderRadius: 99, mb: 3.5 }} />

      <Box sx={{ mb: 2, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <Skeleton variant="rounded" width={150} height={30} />
        <Skeleton variant="text" width={54} />
      </Box>

      <Skeleton variant="text" height={44} sx={{ mb: 0.8 }} />
      <Skeleton variant="text" height={44} sx={{ mb: 2.2, width: "86%" }} />

      <Box sx={{ display: "grid", gap: 1.4 }}>
        {[0, 1, 2, 3].map((item) => (
          <Paper
            key={item}
            variant="outlined"
            sx={{
              p: 1.6,
              borderRadius: 2,
              borderColor: "divider",
            }}
          >
            <Box sx={{ display: "flex", gap: 1.4, alignItems: "center" }}>
              <Skeleton variant="rounded" width={28} height={28} />
              <Skeleton variant="text" width="75%" height={28} />
            </Box>
          </Paper>
        ))}
      </Box>

      <Box sx={{ mt: 2.4, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <Skeleton variant="text" width={120} />
        <Skeleton variant="rounded" width={150} height={42} />
      </Box>
    </Paper>
  );
}

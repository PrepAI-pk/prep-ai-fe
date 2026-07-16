import { useMemo, useState } from "react";
import {
  Box,
  Chip,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import type { AppScreen } from "../../../../app/screens";
import {
  LEADERBOARD_PERIOD_OPTIONS,
  LEADERBOARD_ROWS,
  LEADERBOARD_SCOPE_OPTIONS,
  LeaderboardPeriod,
  LeaderboardScope,
  medalColor,
  podiumHeight,
  podiumOrder,
} from "../../leaderboard.constants";
import {
  leaderboardStyles,
  periodChipSx,
  podiumPillarSx,
  scopeChipSx,
  trendSx,
} from "./leaderboard.styles";
import { PracticeTopbar } from "../../../practice";

type LeaderboardPageProps = {
  onNavigateScreen?: (screen: AppScreen) => void;
};

export function LeaderboardPage(props: LeaderboardPageProps = {}) {
  const { onNavigateScreen } = props;
  const [scope, setScope] = useState<LeaderboardScope>(LeaderboardScope.National);
  const [period, setPeriod] = useState<LeaderboardPeriod>(LeaderboardPeriod.Weekly);

  const rows = useMemo(() => LEADERBOARD_ROWS, []);
  const podium = useMemo(() => podiumOrder(rows), [rows]);
  const currentUser = useMemo(
    () => rows.find((row) => row.isCurrentUser) ?? rows[0],
    [rows],
  );

  return (
    <Box sx={leaderboardStyles.shell}>
        <PracticeTopbar
          currentScreen="leaderboard"
          title="Leaderboard"
          subtitle="Rankings by scope and period"
          searchPlaceholder="Search Leaderboard"
          onOpenGlobalSearch={() => onNavigateScreen?.("globalSearch")}
          onOpenSettings={() => onNavigateScreen?.("settingsProfile")}
          onNavigateScreen={onNavigateScreen}
        />

        <Box sx={leaderboardStyles.scrollBody}>
          <Box sx={leaderboardStyles.wrap}>
          <Box sx={leaderboardStyles.filterRow}>
            <Box sx={leaderboardStyles.chipGroup}>
              {LEADERBOARD_SCOPE_OPTIONS.map((option) => (
                <Chip
                  key={option}
                  label={option}
                  onClick={() => setScope(option)}
                  sx={scopeChipSx(scope === option)}
                />
              ))}
            </Box>
            <Box sx={leaderboardStyles.chipGroup}>
              {LEADERBOARD_PERIOD_OPTIONS.map((option) => (
                <Chip
                  key={option}
                  label={option}
                  onClick={() => setPeriod(option)}
                  sx={periodChipSx(period === option)}
                />
              ))}
            </Box>
          </Box>

          <Paper variant="outlined" sx={leaderboardStyles.podiumCard}>
            <Typography sx={{ fontWeight: 700, mb: 1.2 }}>Top performers</Typography>
            <Box sx={leaderboardStyles.podiumGrid}>
              {podium.map((entry) => {
                const height = podiumHeight(entry.rank);
                const medal = medalColor(entry.rank);

                return (
                  <Box key={entry.rank} sx={{ textAlign: "center" }}>
                    <Typography sx={{ fontSize: 12, color: "text.secondary", mb: 0.4 }}>{entry.city}</Typography>
                    <Typography variant="h3" sx={{ fontSize: 18 }}>{entry.name}</Typography>
                    <Box sx={podiumPillarSx(height)}>
                      <Box sx={{ ...leaderboardStyles.rankBadge, bgcolor: medal }}>
                        {entry.rank}
                      </Box>
                      <Typography sx={{ fontSize: 12, color: "text.secondary" }}>{entry.points} pts</Typography>
                    </Box>
                  </Box>
                );
              })}
            </Box>
          </Paper>

          <Paper sx={leaderboardStyles.yourRankCard}>
            <Typography
              sx={{
                fontFamily: '"Space Mono", monospace',
                letterSpacing: ".12em",
                textTransform: "uppercase",
                fontSize: 11,
                opacity: 0.9,
              }}
            >
              Your rank
            </Typography>
            <Box sx={leaderboardStyles.metricRow}>
              <Metric label="Rank" value={`#${currentUser.rank}`} />
              <Metric label="Points" value={`${currentUser.points}`} />
              <Metric label="Accuracy" value={`${currentUser.accuracy}%`} />
              <Metric label="Streak" value={`${currentUser.streak}d`} />
            </Box>
          </Paper>

          <Paper variant="outlined" sx={{ borderRadius: "16px", borderColor: "divider", overflow: "hidden" }}>
            <Table size="small">
              <TableHead sx={{ bgcolor: "background.default" }}>
                <TableRow>
                  <TableCell>Rank</TableCell>
                  <TableCell>Candidate</TableCell>
                  <TableCell>Points</TableCell>
                  <TableCell>Accuracy</TableCell>
                  <TableCell>Trend</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {rows.map((row) => (
                  <TableRow
                    key={row.rank}
                    sx={{ bgcolor: row.isCurrentUser ? "primary.light" : "transparent" }}
                  >
                    <TableCell>#{row.rank}</TableCell>
                    <TableCell>
                      <Typography sx={{ fontSize: 13, fontWeight: 600 }}>{row.name}</Typography>
                      <Typography sx={{ fontSize: 12, color: "text.secondary" }}>
                        {row.city} · {row.streak}d streak
                      </Typography>
                    </TableCell>
                    <TableCell>{row.points}</TableCell>
                    <TableCell>{row.accuracy}%</TableCell>
                    <TableCell sx={trendSx(row.trend)}>
                      {row.trend === "up" ? "▲" : "▼"}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Paper>
          </Box>
        </Box>
      </Box>
  );
}

function Metric(props: { label: string; value: string }) {
  const { label, value } = props;
  return (
    <Box>
      <Typography sx={{ fontSize: 11, opacity: 0.88 }}>{label}</Typography>
      <Typography variant="h3" sx={{ fontSize: 24, mt: 0.25 }}>
        {value}
      </Typography>
    </Box>
  );
}

import { useEffect, useMemo, useState } from "react";
import {
  Alert,
  Box,
  Button,
  Chip,
  LinearProgress,
  Paper,
  Switch,
  Typography,
} from "@mui/material";
import type { AppScreen } from "../../../../app/screens";
import { PracticeTopbar } from "../../../practice";
import {
  OFFLINE_PACKS,
  OFFLINE_QUOTA_MB,
  readPackState,
  type PersistedPackState,
  writePackState,
} from "../../offline.constants";
import {
  downloadProgressSx,
  downloadStatusChipSx,
  enabledChipSx,
  offlineModeStyles,
  storageBarSx,
} from "./offline-mode.styles";

type OfflineModePageProps = {
  onNavigateScreen?: (screen: AppScreen) => void;
};

export function OfflineModePage(props: OfflineModePageProps = {}) {
  const { onNavigateScreen } = props;

  const [offlineEnabled, setOfflineEnabled] = useState(true);
  const [packState, setPackState] = useState<PersistedPackState>(() => readPackState());

  useEffect(() => {
    writePackState(packState);
  }, [packState]);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setPackState((previous) => {
        let changed = false;
        const next: PersistedPackState = { ...previous };

        for (const pack of OFFLINE_PACKS) {
          const current = next[pack.id] ?? { state: "available" as const, prog: 0 };
          if (current.state !== "downloading") {
            continue;
          }

          changed = true;
          const increment = 7 + Math.floor(Math.random() * 11);
          const nextProg = Math.min(100, current.prog + increment);

          next[pack.id] =
            nextProg >= 100
              ? { state: "downloaded", prog: 100 }
              : { state: "downloading", prog: nextProg };
        }

        return changed ? next : previous;
      });
    }, 460);

    return () => {
      window.clearInterval(timer);
    };
  }, []);

  const downloadedPacks = useMemo(
    () => OFFLINE_PACKS.filter((pack) => (packState[pack.id]?.state ?? "available") === "downloaded"),
    [packState],
  );

  const usedMb = useMemo(
    () => downloadedPacks.reduce((sum, pack) => sum + pack.sizeMb, 0),
    [downloadedPacks],
  );

  const usageProgress = useMemo(() => Math.min(100, Math.round((usedMb / OFFLINE_QUOTA_MB) * 100)), [usedMb]);

  function startDownload(packId: string): void {
    setPackState((previous) => ({
      ...previous,
      [packId]: { state: "downloading", prog: 2 },
    }));
  }

  function removeDownload(packId: string): void {
    setPackState((previous) => ({
      ...previous,
      [packId]: { state: "available", prog: 0 },
    }));
  }

  return (
    <Box sx={offlineModeStyles.shell}>
        <PracticeTopbar
          currentScreen="offlineMode"
          title="Offline Mode"
          subtitle="Manage downloadable packs for uninterrupted study"
          searchPlaceholder="Search Packs"
          onOpenGlobalSearch={() => onNavigateScreen?.("globalSearch")}
          onOpenSettings={() => onNavigateScreen?.("settingsProfile")}
          onNavigateScreen={onNavigateScreen}
        />

        <Box sx={offlineModeStyles.scrollBody}>
          <Box sx={offlineModeStyles.wrap}>
          <Paper
            variant="outlined"
            sx={offlineModeStyles.toggleCard}
          >
            <Box>
              <Typography sx={{ fontWeight: 700 }}>Offline access</Typography>
              <Typography sx={{ color: "text.secondary", fontSize: 13, mt: 0.3 }}>
                Keep content packs on-device for no-network sessions.
              </Typography>
            </Box>
            <Box sx={offlineModeStyles.statusRow}>
              <Chip
                size="small"
                label={offlineEnabled ? "Enabled" : "Disabled"}
                sx={enabledChipSx(offlineEnabled)}
              />
              <Switch checked={offlineEnabled} onChange={(event) => setOfflineEnabled(event.target.checked)} />
            </Box>
          </Paper>

          {!offlineEnabled && (
            <Alert severity="warning" sx={{ borderRadius: 2 }}>
              Offline mode is off. Turn it on to download or keep local content packs.
            </Alert>
          )}

          <Paper variant="outlined" sx={offlineModeStyles.storageCard}>
            <Box sx={offlineModeStyles.storageHead}>
              <Typography sx={{ fontWeight: 700 }}>Device storage</Typography>
              <Typography sx={{ color: "text.secondary", fontSize: 12 }}>
                {usedMb} MB / {OFFLINE_QUOTA_MB} MB · {downloadedPacks.length} packs
              </Typography>
            </Box>
            <LinearProgress
              variant="determinate"
              value={usageProgress}
              sx={storageBarSx}
            />
          </Paper>

          <Box sx={offlineModeStyles.packsGrid}>
            {OFFLINE_PACKS.map((pack) => {
              const status = packState[pack.id] ?? { state: "available" as const, prog: 0 };

              return (
                <Paper key={pack.id} variant="outlined" sx={offlineModeStyles.packCard}>
                  <Box sx={offlineModeStyles.packHead}>
                    <Box>
                      <Typography sx={{ fontWeight: 600 }}>{pack.subject}</Typography>
                      <Typography sx={{ fontSize: 12, color: "text.secondary", mt: 0.2 }}>
                        {pack.body} · {pack.lessons} lessons · {pack.sizeMb} MB
                      </Typography>
                    </Box>

                    {status.state === "downloaded" && (
                      <Button
                        size="small"
                        variant="outlined"
                        color="error"
                        disabled={!offlineEnabled}
                        onClick={() => removeDownload(pack.id)}
                      >
                        Remove
                      </Button>
                    )}

                    {status.state === "available" && (
                      <Button
                        size="small"
                        variant="contained"
                        disabled={!offlineEnabled}
                        onClick={() => startDownload(pack.id)}
                      >
                        Download
                      </Button>
                    )}

                    {status.state === "downloading" && (
                      <Chip size="small" label={`Downloading ${status.prog}%`} sx={downloadStatusChipSx} />
                    )}
                  </Box>

                  {status.state === "downloading" && (
                    <LinearProgress
                      variant="determinate"
                      value={status.prog}
                      sx={downloadProgressSx}
                    />
                  )}
                </Paper>
              );
            })}
          </Box>
          </Box>
        </Box>
      </Box>
  );
}

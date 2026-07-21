import {
  Alert,
  Box,
  Button,
  Chip,
  CircularProgress,
  LinearProgress,
  Paper,
  Switch,
  Typography,
} from "@mui/material";
import type { AppScreen } from "../../../../app/screens";
import { isPlanRequiredError, toApiErrorMessage } from "../../../../api/error";
import { useGetPreferencesQuery, useUpdatePreferencesMutation } from "../../../../api/me/me.endpoints";
import {
  useDownloadPackMutation,
  useGetPacksQuery,
  useRemovePackMutation,
} from "../../../../api/packs/packs.endpoints";
import { PracticeTopbar } from "../../../practice";
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

function OfflinePaywall({ onNavigateScreen }: OfflineModePageProps) {
  return (
    <Paper
      variant="outlined"
      sx={{ maxWidth: 520, mx: "auto", mt: 6, p: "28px 26px", borderRadius: "20px", textAlign: "center" }}
    >
      <Typography sx={{ fontFamily: '"Space Mono", monospace', fontSize: 11, letterSpacing: ".12em", textTransform: "uppercase", color: "secondary.main", fontWeight: 700 }}>
        Elite feature
      </Typography>
      <Typography variant="h3" sx={{ fontSize: 22, mt: 1 }}>
        Offline packs are part of PrepAI Elite
      </Typography>
      <Typography sx={{ mt: 1, color: "text.secondary", fontSize: 14, lineHeight: 1.6 }}>
        Download subject packs — MCQs, notes, and mocks — for uninterrupted study without a connection.
      </Typography>
      <Button
        variant="contained"
        sx={{ mt: 2.5, borderRadius: "11px", py: 1.2, px: 3 }}
        onClick={() => onNavigateScreen?.("subscriptionPaywall")}
      >
        Compare plans
      </Button>
    </Paper>
  );
}

export function OfflineModePage(props: OfflineModePageProps = {}) {
  const { onNavigateScreen } = props;

  const { data: preferences } = useGetPreferencesQuery();
  const [updatePreferences] = useUpdatePreferencesMutation();
  const packsQuery = useGetPacksQuery();
  const [downloadPack] = useDownloadPackMutation();
  const [removePack] = useRemovePackMutation();

  const offlineEnabled = preferences?.offlineEnabled ?? false;
  const packsRequired = isPlanRequiredError(packsQuery.error);
  const packs = packsQuery.data?.items ?? [];
  const storage = packsQuery.data?.storage;

  function toggleOfflineEnabled(): void {
    void updatePreferences({ offlineEnabled: !offlineEnabled });
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
              <Switch checked={offlineEnabled} onChange={toggleOfflineEnabled} />
            </Box>
          </Paper>

          {!offlineEnabled && (
            <Alert severity="warning" sx={{ borderRadius: 2 }}>
              Offline mode is off. Turn it on to download or keep local content packs.
            </Alert>
          )}

          {packsRequired && <OfflinePaywall onNavigateScreen={onNavigateScreen} />}

          {!packsRequired && packsQuery.isError && (
            <Alert severity="error" sx={{ borderRadius: 2 }}>
              Could not load offline packs. {toApiErrorMessage(packsQuery.error, "Please try again.")}
            </Alert>
          )}

          {!packsRequired && packsQuery.isLoading && (
            <Box sx={{ display: "flex", justifyContent: "center", py: 6 }}>
              <CircularProgress size={26} />
            </Box>
          )}

          {!packsRequired && storage && (
            <>
              <Paper variant="outlined" sx={offlineModeStyles.storageCard}>
                <Box sx={offlineModeStyles.storageHead}>
                  <Typography sx={{ fontWeight: 700 }}>Device storage</Typography>
                  <Typography sx={{ color: "text.secondary", fontSize: 12 }}>
                    {storage.usedMb} MB / {storage.quotaMb} MB · {storage.packCount} packs
                  </Typography>
                </Box>
                <LinearProgress
                  variant="determinate"
                  value={Math.min(100, Math.round((storage.usedMb / storage.quotaMb) * 100))}
                  sx={storageBarSx}
                />
              </Paper>

              <Box sx={offlineModeStyles.packsGrid}>
                {packs.map((pack) => (
                  <Paper key={pack.id} variant="outlined" sx={offlineModeStyles.packCard}>
                    <Box sx={offlineModeStyles.packHead}>
                      <Box>
                        <Typography sx={{ fontWeight: 600 }}>{pack.name}</Typography>
                        <Typography sx={{ fontSize: 12, color: "text.secondary", mt: 0.2 }}>
                          {pack.desc} · {pack.mb} MB
                        </Typography>
                      </Box>

                      {pack.state === "DONE" && (
                        <Button
                          size="small"
                          variant="outlined"
                          color="error"
                          disabled={!offlineEnabled}
                          onClick={() => void removePack(pack.id)}
                        >
                          Remove
                        </Button>
                      )}

                      {pack.state === "AVAILABLE" && (
                        <Button
                          size="small"
                          variant="contained"
                          disabled={!offlineEnabled}
                          onClick={() => void downloadPack(pack.id)}
                        >
                          Download
                        </Button>
                      )}

                      {pack.state === "DOWNLOADING" && (
                        <Chip size="small" label={`Downloading ${pack.prog ?? 0}%`} sx={downloadStatusChipSx} />
                      )}
                    </Box>

                    {pack.state === "DOWNLOADING" && (
                      <LinearProgress
                        variant="determinate"
                        value={pack.prog ?? 0}
                        sx={downloadProgressSx}
                      />
                    )}
                  </Paper>
                ))}
              </Box>
            </>
          )}
          </Box>
        </Box>
      </Box>
  );
}

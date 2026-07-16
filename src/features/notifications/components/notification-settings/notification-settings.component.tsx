import {
  Box,
  Paper,
  Typography,
} from "@mui/material";
import type { AppScreen } from "../../../../app/screens";
import { PracticeTopbar } from "../../../practice";
import {
  CATEGORY_ROWS,
  CHANNEL_ROWS,
  DIGEST_OPTIONS,
} from "../../notification-settings.constants";
import { useNotificationSettingsPrefs } from "../../hooks/use-notification-settings-prefs.hook";
import {
  digestChipSx,
  knobSx,
  notificationSettingsStyles,
  quietTimeInputSx,
  timeInputSx,
  toggleSx,
} from "./notification-settings.styles";

type NotificationSettingsPageProps = {
  onNavigateScreen?: (screen: AppScreen) => void;
};

export function NotificationSettingsScreen(props: NotificationSettingsPageProps = {}) {
  const { onNavigateScreen } = props;
  const {
    prefs,
    toggleChannel,
    toggleCategory,
    setReminder,
    toggleQuiet,
    setQuietFrom,
    setQuietTo,
    setDigest,
  } = useNotificationSettingsPrefs();

  return (
    <Box sx={notificationSettingsStyles.appShell}>
        <PracticeTopbar
          currentScreen="notificationSettings"
          title="Notification Settings"
          subtitle="Channels, timing, and category-level preference controls"
          searchPlaceholder="Search Notification Settings"
          onOpenGlobalSearch={() => onNavigateScreen?.("globalSearch")}
          onOpenSettings={() => onNavigateScreen?.("settingsProfile")}
          onNavigateScreen={onNavigateScreen}
        />

        <Box sx={notificationSettingsStyles.scrollBody}>
          <Box sx={notificationSettingsStyles.contentWrap}>
            <Paper variant="outlined" sx={notificationSettingsStyles.sectionCardSpaced}>
              <Typography sx={notificationSettingsStyles.sectionTitleTight}>Delivery channels</Typography>
              <Typography sx={notificationSettingsStyles.sectionSub}>Where should PrepAI reach you?</Typography>
              {CHANNEL_ROWS.map((row) => {
                const on = prefs.nsChannels[row.key];
                return (
                  <Box key={row.key} sx={notificationSettingsStyles.channelRow}>
                    <Box sx={notificationSettingsStyles.iconBadge}>
                      {row.icon}
                    </Box>
                    <Box sx={notificationSettingsStyles.grow}>
                      <Typography sx={notificationSettingsStyles.rowTitle}>{row.label}</Typography>
                      <Typography sx={notificationSettingsStyles.rowDesc}>{row.desc}</Typography>
                    </Box>
                    <Box
                      onClick={() => toggleChannel(row.key)}
                      sx={toggleSx(on)}
                    >
                      <Box sx={knobSx(on)} />
                    </Box>
                  </Box>
                );
              })}
            </Paper>

            <Paper variant="outlined" sx={notificationSettingsStyles.sectionCardSpaced}>
              <Typography sx={notificationSettingsStyles.sectionTitleWithGap}>Timing</Typography>

              <Box sx={notificationSettingsStyles.timingHeaderRow}>
                <Box sx={notificationSettingsStyles.grow}>
                  <Typography sx={notificationSettingsStyles.rowTitle}>Daily reminder</Typography>
                  <Typography sx={notificationSettingsStyles.rowDesc}>A nudge to keep your streak going</Typography>
                </Box>
                <Box
                  component="input"
                  type="time"
                  value={prefs.nsReminder}
                  onChange={(event: React.ChangeEvent<HTMLInputElement>) => setReminder(event.target.value)}
                  sx={timeInputSx}
                />
              </Box>

              <Box sx={notificationSettingsStyles.quietRow}>
                <Box sx={notificationSettingsStyles.grow}>
                  <Typography sx={notificationSettingsStyles.rowTitle}>Quiet hours</Typography>
                  <Typography sx={notificationSettingsStyles.rowDesc}>Silence notifications overnight</Typography>
                </Box>
                <Box onClick={toggleQuiet} sx={toggleSx(prefs.nsQuiet)}>
                  <Box sx={knobSx(prefs.nsQuiet)} />
                </Box>
              </Box>

              {prefs.nsQuiet && (
                <Box sx={notificationSettingsStyles.quietPanel}>
                  <Typography sx={notificationSettingsStyles.quietLabel}>From</Typography>
                  <Box
                    component="input"
                    type="time"
                    value={prefs.nsQuietFrom}
                    onChange={(event: React.ChangeEvent<HTMLInputElement>) => setQuietFrom(event.target.value)}
                    sx={quietTimeInputSx}
                  />
                  <Typography sx={notificationSettingsStyles.quietLabel}>to</Typography>
                  <Box
                    component="input"
                    type="time"
                    value={prefs.nsQuietTo}
                    onChange={(event: React.ChangeEvent<HTMLInputElement>) => setQuietTo(event.target.value)}
                    sx={quietTimeInputSx}
                  />
                </Box>
              )}
            </Paper>

            <Paper variant="outlined" sx={notificationSettingsStyles.sectionCard}>
              <Typography sx={notificationSettingsStyles.sectionTitleSoftGap}>What to notify me about</Typography>
              {CATEGORY_ROWS.map((row) => {
                const on = prefs.notif[row.key];
                return (
                  <Box key={row.key} sx={notificationSettingsStyles.row}>
                    <Typography sx={notificationSettingsStyles.categoryTitle}>{row.label}</Typography>
                    <Box
                      onClick={() => toggleCategory(row.key)}
                      sx={toggleSx(on)}
                    >
                      <Box sx={knobSx(on)} />
                    </Box>
                  </Box>
                );
              })}
              <Box sx={notificationSettingsStyles.digestWrap}>
                <Typography sx={notificationSettingsStyles.digestTitle}>Progress digest email</Typography>
                <Box sx={notificationSettingsStyles.digestRow}>
                  {DIGEST_OPTIONS.map((item) => (
                    <Box
                      key={item}
                      onClick={() => setDigest(item)}
                      sx={digestChipSx(prefs.nsDigest === item)}
                    >
                      {item}
                    </Box>
                  ))}
                </Box>
              </Box>
            </Paper>
          </Box>
        </Box>
      </Box>
  );
}

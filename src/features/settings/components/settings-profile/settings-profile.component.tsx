import {
  Box,
  Button,
  Chip,
  Paper,
  Switch,
  Typography,
} from "@mui/material";
import type { AppScreen } from "../../../../app/screens";
import { PracticeTopbar } from "../../../practice";
import { ALL_ROLES, type Role } from "../../../../auth";
import { useAppDispatch, useAppSelector } from "../../../../store/hooks";
import {
  selectRoles,
  setActiveRoles,
} from "../../../../store/slices/session-slice";
import {
  ACCENT_SWATCHES,
  CONTENT_LANGUAGES,
  DEFAULT_DIFFICULTIES,
  SETTINGS_NOTIFICATION_ROWS,
  SETTINGS_TABS,
  SettingsTab,
} from "../../settings.constants";
import {
  SETTINGS_BILLING_HISTORY_DATES,
  SETTINGS_PROFILE_SUMMARY,
  SETTINGS_SUBSCRIPTION,
} from "../../settings-profile.constants";
import { useSettingsPreferences } from "../../hooks/use-settings-preferences.hook";
import {
  settingsFieldInputSx,
  settingsAccentSwatchSx,
  settingsTabIndicatorSx,
  settingsTabItemSx,
  settingsPillSx,
  settingsProfileStyles,
} from "./settings-profile.styles";

type SettingsProfilePageProps = {
  onNavigateScreen?: (screen: AppScreen) => void;
  onLogout?: () => void;
};

export function SettingsProfileScreen(props: SettingsProfilePageProps = {}) {
  const { onNavigateScreen, onLogout } = props;

  const {
    tab,
    setTab,
    fullName,
    setFullName,
    email,
    setEmail,
    city,
    setCity,
    targetExam,
    setTargetExam,
    uiPrefs,
    setUiPrefs,
    notifPrefs,
    setNotifPrefs,
    updateAccent,
  } = useSettingsPreferences();

  const dispatch = useAppDispatch();
  const activeRoles = useAppSelector(selectRoles);

  function toggleRole(role: Role): void {
    if (role === "student") {
      dispatch(setActiveRoles(["student"]));
      return;
    }

    const nextRoles = activeRoles.includes(role)
      ? activeRoles.filter((candidate) => candidate !== role)
      : [...activeRoles.filter((candidate) => candidate !== "student"), role];

    dispatch(setActiveRoles(nextRoles));
  }

  return (
    <Box sx={settingsProfileStyles.shell}>
        <PracticeTopbar
          currentScreen="settingsProfile"
          title="Settings & Profile"
          subtitle="Manage account, preferences, notifications, and subscription"
          searchPlaceholder="Search Settings"
          onOpenGlobalSearch={() => onNavigateScreen?.("globalSearch")}
          onOpenSettings={() => onNavigateScreen?.("settingsProfile")}
          onNavigateScreen={onNavigateScreen}
        />

        <Box sx={settingsProfileStyles.scrollBody}>
          <Box sx={settingsProfileStyles.contentWrap}>
            <Paper variant="outlined" sx={settingsProfileStyles.profileSummaryCard}>
              <Box sx={settingsProfileStyles.profileAvatar}>
                {SETTINGS_PROFILE_SUMMARY.initials}
              </Box>
              <Box sx={settingsProfileStyles.profileTextWrap}>
                <Typography sx={settingsProfileStyles.profileName}>{SETTINGS_PROFILE_SUMMARY.displayName}</Typography>
                <Typography sx={settingsProfileStyles.profileMeta}>{email} · {city}</Typography>
              </Box>
              <Box sx={settingsProfileStyles.profilePlanChip}>
                {SETTINGS_PROFILE_SUMMARY.planLabel}
              </Box>
            </Paper>

            <Paper variant="outlined" sx={{ p: "16px 18px", borderRadius: "16px", mb: 2 }}>
              <Typography sx={{ fontWeight: 700, fontSize: 13 }}>
                Demo role (dev only)
              </Typography>
              <Typography sx={{ color: "text.secondary", fontSize: 12, mt: 0.3, mb: 1.2 }}>
                Stand-in for real login until backend auth exists. Toggle roles to see
                how the Admin Portal nav and routes react to permissions.
              </Typography>
              <Box sx={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                {ALL_ROLES.map((role) => (
                  <Chip
                    key={role}
                    label={role}
                    onClick={() => toggleRole(role)}
                    color={activeRoles.includes(role) ? "primary" : "default"}
                    variant={activeRoles.includes(role) ? "filled" : "outlined"}
                  />
                ))}
              </Box>
            </Paper>

            <Box sx={settingsProfileStyles.layoutGrid}>
              <Paper variant="outlined" sx={settingsProfileStyles.tabsCard}>
                {SETTINGS_TABS.map((item) => {
                  const active = tab === item.key;
                  return (
                    <Box
                      key={item.key}
                      onClick={() => setTab(item.key)}
                      sx={settingsTabItemSx(active)}
                    >
                      <Box sx={settingsTabIndicatorSx(active)} />
                      {item.label}
                    </Box>
                  );
                })}
              </Paper>

              <Box>
                {tab === SettingsTab.Profile && (
                  <Paper variant="outlined" sx={settingsProfileStyles.sectionCard}>
                    <Typography sx={settingsProfileStyles.sectionTitleWithGap}>Profile details</Typography>
                    <Box sx={settingsProfileStyles.profileGrid}>
                      <Box>
                        <Typography sx={settingsProfileStyles.fieldLabel}>Full name</Typography>
                        <Box component="input" value={fullName} onChange={(event: React.ChangeEvent<HTMLInputElement>) => setFullName(event.target.value)} sx={settingsFieldInputSx} />
                      </Box>
                      <Box>
                        <Typography sx={settingsProfileStyles.fieldLabel}>Email</Typography>
                        <Box component="input" value={email} onChange={(event: React.ChangeEvent<HTMLInputElement>) => setEmail(event.target.value)} sx={settingsFieldInputSx} />
                      </Box>
                      <Box>
                        <Typography sx={settingsProfileStyles.fieldLabel}>City</Typography>
                        <Box component="input" value={city} onChange={(event: React.ChangeEvent<HTMLInputElement>) => setCity(event.target.value)} sx={settingsFieldInputSx} />
                      </Box>
                      <Box>
                        <Typography sx={settingsProfileStyles.fieldLabel}>Target exam</Typography>
                        <Box component="input" value={targetExam} onChange={(event: React.ChangeEvent<HTMLInputElement>) => setTargetExam(event.target.value)} sx={settingsFieldInputSx} />
                      </Box>
                    </Box>
                    <Box sx={settingsProfileStyles.actionRow}>
                      <Button variant="contained" sx={settingsProfileStyles.actionButton}>Save changes</Button>
                      <Button variant="outlined" sx={settingsProfileStyles.actionButton}>Cancel</Button>
                    </Box>
                  </Paper>
                )}

                {tab === SettingsTab.Preferences && (
                  <Paper variant="outlined" sx={settingsProfileStyles.sectionCard}>
                    <Typography sx={settingsProfileStyles.sectionTitleWithGap}>Preferences</Typography>

                    <Box sx={settingsProfileStyles.preferenceRow}>
                      <Box sx={settingsProfileStyles.grow}>
                        <Typography sx={settingsProfileStyles.preferenceLabel}>Dark theme</Typography>
                        <Typography sx={settingsProfileStyles.preferenceSubLabel}>Easier on the eyes for night study</Typography>
                      </Box>
                      <Switch checked={uiPrefs.theme === "dark"} onChange={(event) => setUiPrefs((previous) => ({ ...previous, theme: event.target.checked ? "dark" : "light" }))} />
                    </Box>

                    <Box sx={settingsProfileStyles.preferenceBlock}>
                      <Typography sx={settingsProfileStyles.preferenceBlockTitle}>Accent colour</Typography>
                      <Box sx={settingsProfileStyles.chipRow}>
                        {ACCENT_SWATCHES.map((item) => {
                          const active = uiPrefs.accent === item.key;
                          return (
                            <Box
                              key={item.key}
                              onClick={() => updateAccent(item.key)}
                              sx={settingsAccentSwatchSx(active, item.color)}
                            >
                              <Box sx={{ ...settingsProfileStyles.accentDot, backgroundColor: item.color }} />
                              {item.name}
                            </Box>
                          );
                        })}
                      </Box>
                    </Box>

                    <Box sx={settingsProfileStyles.preferenceBlock}>
                      <Typography sx={settingsProfileStyles.preferenceBlockTitle}>Default difficulty</Typography>
                      <Box sx={settingsProfileStyles.chipRow}>
                        {DEFAULT_DIFFICULTIES.map((item) => (
                          <Box
                            key={item}
                            onClick={() => setUiPrefs((previous) => ({ ...previous, defaultDifficulty: item }))}
                            sx={settingsPillSx(uiPrefs.defaultDifficulty === item)}
                          >
                            {item}
                          </Box>
                        ))}
                      </Box>
                    </Box>

                    <Box sx={settingsProfileStyles.preferenceTailBlock}>
                      <Typography sx={settingsProfileStyles.preferenceBlockTitle}>Content language</Typography>
                      <Box sx={settingsProfileStyles.chipRow}>
                        {CONTENT_LANGUAGES.map((item) => (
                          <Box key={item} onClick={() => setUiPrefs((previous) => ({ ...previous, language: item }))} sx={settingsPillSx(uiPrefs.language === item)}>
                            {item}
                          </Box>
                        ))}
                      </Box>
                    </Box>
                  </Paper>
                )}

                {tab === SettingsTab.Notifications && (
                  <Paper variant="outlined" sx={settingsProfileStyles.sectionCard}>
                    <Typography sx={settingsProfileStyles.notificationTitle}>Notifications</Typography>
                    {SETTINGS_NOTIFICATION_ROWS.map((row) => (
                      <Box key={row.key} sx={settingsProfileStyles.notificationRow}>
                        <Box sx={settingsProfileStyles.grow}>
                          <Typography sx={settingsProfileStyles.preferenceLabel}>{row.label}</Typography>
                          <Typography sx={settingsProfileStyles.preferenceSubLabel}>{row.desc}</Typography>
                        </Box>
                        <Switch
                          checked={notifPrefs.notif[row.key]}
                          onChange={(event) =>
                            setNotifPrefs((previous) => ({
                              ...previous,
                              notif: {
                                ...previous.notif,
                                [row.key]: event.target.checked,
                              },
                            }))
                          }
                        />
                      </Box>
                    ))}
                  </Paper>
                )}

                {tab === SettingsTab.Subscription && (
                  <Box>
                    <Paper sx={settingsProfileStyles.subscriptionCard}>
                      <Box sx={settingsProfileStyles.subscriptionHeaderRow}>
                        <Box>
                          <Typography sx={settingsProfileStyles.subscriptionKicker}>Current plan</Typography>
                          <Typography sx={settingsProfileStyles.subscriptionPlanName}>{SETTINGS_SUBSCRIPTION.planName}</Typography>
                        </Box>
                        <Typography sx={settingsProfileStyles.subscriptionPrice}>
                          {SETTINGS_SUBSCRIPTION.price}
                          <Box component="span" sx={settingsProfileStyles.subscriptionPriceSuffix}>/mo</Box>
                        </Typography>
                      </Box>
                      <Typography sx={settingsProfileStyles.subscriptionRenew}>{SETTINGS_SUBSCRIPTION.renewText}</Typography>
                      <Box sx={settingsProfileStyles.subscriptionActions}>
                        <Button variant="contained" onClick={() => onNavigateScreen?.("subscriptionPaywall")} sx={settingsProfileStyles.comparePlansButton}>Compare plans</Button>
                        <Button variant="outlined" sx={settingsProfileStyles.cancelPlanButton}>Cancel plan</Button>
                      </Box>
                    </Paper>
                    <Paper variant="outlined" sx={settingsProfileStyles.billingCard}>
                      <Typography sx={settingsProfileStyles.billingTitle}>Billing history</Typography>
                      {SETTINGS_BILLING_HISTORY_DATES.map((date) => (
                        <Box key={date} sx={settingsProfileStyles.billingRow}>
                          <Typography sx={settingsProfileStyles.billingDate}>{date}</Typography>
                          <Typography sx={settingsProfileStyles.billingAmount}>Rs 1,200 · Paid</Typography>
                        </Box>
                      ))}
                    </Paper>
                  </Box>
                )}

                {tab === SettingsTab.Account && (
                  <Paper variant="outlined" sx={settingsProfileStyles.sectionCard}>
                    <Typography sx={settingsProfileStyles.notificationTitle}>Account & security</Typography>

                    <Box sx={settingsProfileStyles.accountRow}>
                      <Box sx={settingsProfileStyles.grow}>
                        <Typography sx={settingsProfileStyles.accountTitle}>Change password</Typography>
                        <Typography sx={settingsProfileStyles.accountSubTitle}>Last changed 3 months ago</Typography>
                      </Box>
                      <Button variant="outlined" sx={settingsProfileStyles.accountActionButton}>Update</Button>
                    </Box>

                    <Box sx={settingsProfileStyles.accountRow}>
                      <Box sx={settingsProfileStyles.grow}>
                        <Typography sx={settingsProfileStyles.accountTitle}>Export my data</Typography>
                        <Typography sx={settingsProfileStyles.accountSubTitle}>Download your progress and history</Typography>
                      </Box>
                      <Button variant="outlined" sx={settingsProfileStyles.accountActionButton}>Export</Button>
                    </Box>

                    <Box sx={settingsProfileStyles.accountRow}>
                      <Box sx={settingsProfileStyles.grow}>
                        <Typography sx={settingsProfileStyles.accountTitle}>Log out</Typography>
                        <Typography sx={settingsProfileStyles.accountSubTitle}>Sign out of this device</Typography>
                      </Box>
                      <Button variant="contained" onClick={onLogout} sx={settingsProfileStyles.accountActionButton}>Log out</Button>
                    </Box>

                    <Box sx={settingsProfileStyles.accountRow}>
                      <Box sx={settingsProfileStyles.grow}>
                        <Typography sx={settingsProfileStyles.accountDangerTitle}>Delete account</Typography>
                        <Typography sx={settingsProfileStyles.accountSubTitle}>Permanently remove your account and data</Typography>
                      </Box>
                      <Button variant="outlined" color="error" sx={settingsProfileStyles.accountActionButton}>Delete</Button>
                    </Box>
                  </Paper>
                )}
              </Box>
            </Box>
          </Box>
        </Box>
      </Box>
  );
}

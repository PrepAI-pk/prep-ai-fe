import {
  Alert,
  Box,
  Button,
  Chip,
  Paper,
  Switch,
  TextField,
  Typography,
} from "@mui/material";
import { useState } from "react";
import { useChangePasswordMutation } from "../../../../api/auth/auth.endpoints";
import { useDeleteMeMutation, useExportMeMutation } from "../../../../api/me/me.endpoints";
import {
  useCancelSubscriptionMutation,
  useGetInvoicesQuery,
  useGetSubscriptionQuery,
} from "../../../../api/billing/billing.endpoints";
import { toApiErrorMessage } from "../../../../api/error";
import type { AppScreen } from "../../../../app/screens";
import { PracticeTopbar } from "../../../practice";
import { ALL_ROLES, type Role } from "../../../../auth";
import { useAppDispatch, useAppSelector } from "../../../../store/hooks";
import { authEnded } from "../../../../store/slices/auth-slice";
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
import { useSettingsPreferences } from "../../hooks/use-settings-preferences.hook";
import {
  settingsFieldInputSx,
  settingsAccentSwatchSx,
  settingsTabIndicatorSx,
  settingsTabItemSx,
  settingsPillSx,
  settingsProfileStyles,
} from "./settings-profile.styles";
import type { BackendAccent, BackendDifficulty, BackendLanguage } from "../../../../api/me/me.types";

type SettingsProfilePageProps = {
  onNavigateScreen?: (screen: AppScreen) => void;
  onLogout?: () => void;
};

function initialsFrom(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) {
    return "?";
  }
  return parts
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");
}

export function SettingsProfileScreen(props: SettingsProfilePageProps = {}) {
  const { onNavigateScreen, onLogout } = props;

  const {
    tab,
    setTab,
    me,
    fullName,
    setFullName,
    city,
    setCity,
    targetExam,
    setTargetExam,
    saveProfile,
    cancelProfileEdits,
    preferences,
    updateTheme,
    updateAccent,
    updateDifficulty,
    updateLanguage,
    notificationPreferences,
    toggleNotificationCategory,
  } = useSettingsPreferences();

  const dispatch = useAppDispatch();
  const activeRoles = useAppSelector(selectRoles);

  const [passwordFormOpen, setPasswordFormOpen] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [accountMessage, setAccountMessage] = useState<{ severity: "success" | "error"; text: string } | null>(null);

  const [changePassword, { isLoading: isChangingPassword }] = useChangePasswordMutation();
  const [exportMe, { isLoading: isExporting }] = useExportMeMutation();
  const [deleteMe, { isLoading: isDeleting }] = useDeleteMeMutation();

  const { data: subscription } = useGetSubscriptionQuery();
  const { data: invoices } = useGetInvoicesQuery();
  const [cancelSubscription, { isLoading: isCancelling }] = useCancelSubscriptionMutation();
  const [subscriptionMessage, setSubscriptionMessage] = useState<{ severity: "success" | "error"; text: string } | null>(null);

  async function handleCancelPlan(): Promise<void> {
    setSubscriptionMessage(null);
    try {
      await cancelSubscription().unwrap();
      setSubscriptionMessage({ severity: "success", text: "Your plan will not renew after the current period." });
    } catch (error) {
      setSubscriptionMessage({ severity: "error", text: toApiErrorMessage(error, "Couldn't cancel your plan.") });
    }
  }

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

  async function handleChangePassword(): Promise<void> {
    setAccountMessage(null);
    try {
      await changePassword({ currentPassword, newPassword }).unwrap();
      setAccountMessage({ severity: "success", text: "Password updated." });
      setPasswordFormOpen(false);
      setCurrentPassword("");
      setNewPassword("");
    } catch (error) {
      setAccountMessage({ severity: "error", text: toApiErrorMessage(error, "Couldn't change your password.") });
    }
  }

  async function handleExport(): Promise<void> {
    setAccountMessage(null);
    try {
      const data = await exportMe().unwrap();
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = "prepai-data-export.json";
      link.click();
      URL.revokeObjectURL(url);
    } catch (error) {
      setAccountMessage({ severity: "error", text: toApiErrorMessage(error, "Couldn't export your data.") });
    }
  }

  async function handleDeleteAccount(): Promise<void> {
    const confirmed = window.confirm(
      "This permanently deletes your account and all data. This can't be undone. Continue?",
    );
    if (!confirmed) {
      return;
    }

    setAccountMessage(null);
    try {
      await deleteMe().unwrap();
      dispatch(authEnded());
      onLogout?.();
    } catch (error) {
      setAccountMessage({ severity: "error", text: toApiErrorMessage(error, "Couldn't delete your account.") });
    }
  }

  const planLabel = me?.plan?.tier
    ? me.plan.tier.charAt(0) + me.plan.tier.slice(1).toLowerCase()
    : "Free";

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
                {me?.avatarInitials || (me?.fullName ? initialsFrom(me.fullName) : "…")}
              </Box>
              <Box sx={settingsProfileStyles.profileTextWrap}>
                <Typography sx={settingsProfileStyles.profileName}>{me?.fullName ?? "…"}</Typography>
                <Typography sx={settingsProfileStyles.profileMeta}>{me?.email} · {me?.city ?? "—"}</Typography>
              </Box>
              <Box sx={settingsProfileStyles.profilePlanChip}>
                {planLabel} plan
              </Box>
            </Paper>

            <Paper variant="outlined" sx={{ p: "16px 18px", borderRadius: "16px", mb: 2 }}>
              <Typography sx={{ fontWeight: 700, fontSize: 13 }}>
                Demo role (dev only)
              </Typography>
              <Typography sx={{ color: "text.secondary", fontSize: 12, mt: 0.3, mb: 1.2 }}>
                Stand-in for admin permission gating until the Admin module exists server-side.
                Toggle roles to see how the Admin Portal nav and routes react to permissions.
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
                        <Box component="input" value={me?.email ?? ""} disabled sx={settingsFieldInputSx} />
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
                      <Button variant="contained" onClick={saveProfile} sx={settingsProfileStyles.actionButton}>Save changes</Button>
                      <Button variant="outlined" onClick={cancelProfileEdits} sx={settingsProfileStyles.actionButton}>Cancel</Button>
                    </Box>
                  </Paper>
                )}

                {tab === SettingsTab.Preferences && preferences && (
                  <Paper variant="outlined" sx={settingsProfileStyles.sectionCard}>
                    <Typography sx={settingsProfileStyles.sectionTitleWithGap}>Preferences</Typography>

                    <Box sx={settingsProfileStyles.preferenceRow}>
                      <Box sx={settingsProfileStyles.grow}>
                        <Typography sx={settingsProfileStyles.preferenceLabel}>Dark theme</Typography>
                        <Typography sx={settingsProfileStyles.preferenceSubLabel}>Easier on the eyes for night study</Typography>
                      </Box>
                      <Switch
                        checked={preferences.theme === "DARK"}
                        onChange={(event) => updateTheme(event.target.checked ? "DARK" : "LIGHT")}
                      />
                    </Box>

                    <Box sx={settingsProfileStyles.preferenceBlock}>
                      <Typography sx={settingsProfileStyles.preferenceBlockTitle}>Accent colour</Typography>
                      <Box sx={settingsProfileStyles.chipRow}>
                        {ACCENT_SWATCHES.map((item) => {
                          const backendValue = item.key.toUpperCase() as BackendAccent;
                          const active = preferences.accent === backendValue;
                          return (
                            <Box
                              key={item.key}
                              onClick={() => updateAccent(backendValue)}
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
                        {DEFAULT_DIFFICULTIES.map((item) => {
                          const backendValue = item.toUpperCase() as BackendDifficulty;
                          return (
                            <Box
                              key={item}
                              onClick={() => updateDifficulty(backendValue)}
                              sx={settingsPillSx(preferences.defaultDifficulty === backendValue)}
                            >
                              {item}
                            </Box>
                          );
                        })}
                      </Box>
                    </Box>

                    <Box sx={settingsProfileStyles.preferenceTailBlock}>
                      <Typography sx={settingsProfileStyles.preferenceBlockTitle}>Content language</Typography>
                      <Box sx={settingsProfileStyles.chipRow}>
                        {CONTENT_LANGUAGES.map((item) => {
                          const backendValue = item.toUpperCase() as BackendLanguage;
                          return (
                            <Box
                              key={item}
                              onClick={() => updateLanguage(backendValue)}
                              sx={settingsPillSx(preferences.contentLanguage === backendValue)}
                            >
                              {item}
                            </Box>
                          );
                        })}
                      </Box>
                    </Box>
                  </Paper>
                )}

                {tab === SettingsTab.Notifications && notificationPreferences && (
                  <Paper variant="outlined" sx={settingsProfileStyles.sectionCard}>
                    <Typography sx={settingsProfileStyles.notificationTitle}>Notifications</Typography>
                    {SETTINGS_NOTIFICATION_ROWS.map((row) => (
                      <Box key={row.key} sx={settingsProfileStyles.notificationRow}>
                        <Box sx={settingsProfileStyles.grow}>
                          <Typography sx={settingsProfileStyles.preferenceLabel}>{row.label}</Typography>
                          <Typography sx={settingsProfileStyles.preferenceSubLabel}>{row.desc}</Typography>
                        </Box>
                        <Switch
                          checked={notificationPreferences.categories[row.key]}
                          onChange={() => toggleNotificationCategory(row.key)}
                        />
                      </Box>
                    ))}
                  </Paper>
                )}

                {tab === SettingsTab.Subscription && (
                  <Box>
                    {subscriptionMessage && (
                      <Alert severity={subscriptionMessage.severity} sx={{ mb: 2, borderRadius: "10px" }} onClose={() => setSubscriptionMessage(null)}>
                        {subscriptionMessage.text}
                      </Alert>
                    )}
                    <Paper sx={settingsProfileStyles.subscriptionCard}>
                      <Box sx={settingsProfileStyles.subscriptionHeaderRow}>
                        <Box>
                          <Typography sx={settingsProfileStyles.subscriptionKicker}>Current plan</Typography>
                          <Typography sx={settingsProfileStyles.subscriptionPlanName}>{subscription ? `PrepAI ${subscription.planName}` : "…"}</Typography>
                        </Box>
                        <Typography sx={settingsProfileStyles.subscriptionPrice}>
                          {subscription
                            ? (subscription.cycle === "ANNUAL" ? subscription.priceAnnual : subscription.priceMonthly) === 0
                              ? "Free"
                              : `Rs ${(subscription.cycle === "ANNUAL" ? subscription.priceAnnual : subscription.priceMonthly).toLocaleString()}`
                            : "…"}
                          <Box component="span" sx={settingsProfileStyles.subscriptionPriceSuffix}>/mo</Box>
                        </Typography>
                      </Box>
                      <Typography sx={settingsProfileStyles.subscriptionRenew}>
                        {subscription?.tier === "FREE"
                          ? "Free forever — upgrade any time for unlimited mocks, AI tutor and the full question bank."
                          : subscription?.currentPeriodEnd
                            ? `${subscription.cancelAtPeriodEnd ? "Cancels" : "Renews"} on ${new Date(subscription.currentPeriodEnd).toLocaleDateString(undefined, { day: "numeric", month: "long", year: "numeric" })}.`
                            : ""}
                      </Typography>
                      <Box sx={settingsProfileStyles.subscriptionActions}>
                        <Button variant="contained" onClick={() => onNavigateScreen?.("subscriptionPaywall")} sx={settingsProfileStyles.comparePlansButton}>Compare plans</Button>
                        {subscription && subscription.tier !== "FREE" && !subscription.cancelAtPeriodEnd && (
                          <Button
                            variant="outlined"
                            onClick={() => void handleCancelPlan()}
                            disabled={isCancelling}
                            sx={settingsProfileStyles.cancelPlanButton}
                          >
                            {isCancelling ? "Cancelling…" : "Cancel plan"}
                          </Button>
                        )}
                      </Box>
                    </Paper>
                    <Paper variant="outlined" sx={settingsProfileStyles.billingCard}>
                      <Typography sx={settingsProfileStyles.billingTitle}>Billing history</Typography>
                      {invoices?.items.length === 0 && (
                        <Typography sx={{ color: "text.secondary", fontSize: 13 }}>No invoices yet.</Typography>
                      )}
                      {invoices?.items.map((invoice) => (
                        <Box key={invoice.id} sx={settingsProfileStyles.billingRow}>
                          <Typography sx={settingsProfileStyles.billingDate}>
                            {new Date(invoice.issuedAt).toLocaleDateString(undefined, { day: "numeric", month: "long", year: "numeric" })}
                          </Typography>
                          <Typography sx={settingsProfileStyles.billingAmount}>
                            Rs {invoice.amount.toLocaleString()} · {invoice.status === "paid" ? "Paid" : invoice.status}
                          </Typography>
                        </Box>
                      ))}
                    </Paper>
                  </Box>
                )}

                {tab === SettingsTab.Account && (
                  <Paper variant="outlined" sx={settingsProfileStyles.sectionCard}>
                    <Typography sx={settingsProfileStyles.notificationTitle}>Account & security</Typography>

                    {accountMessage && (
                      <Alert severity={accountMessage.severity} sx={{ mb: 2, borderRadius: "10px" }} onClose={() => setAccountMessage(null)}>
                        {accountMessage.text}
                      </Alert>
                    )}

                    <Box sx={settingsProfileStyles.accountRow}>
                      <Box sx={settingsProfileStyles.grow}>
                        <Typography sx={settingsProfileStyles.accountTitle}>Change password</Typography>
                        <Typography sx={settingsProfileStyles.accountSubTitle}>
                          {passwordFormOpen ? "Enter your current and new password" : "Update your account password"}
                        </Typography>
                      </Box>
                      <Button
                        variant="outlined"
                        onClick={() => setPasswordFormOpen((previous) => !previous)}
                        sx={settingsProfileStyles.accountActionButton}
                      >
                        {passwordFormOpen ? "Cancel" : "Update"}
                      </Button>
                    </Box>

                    {passwordFormOpen && (
                      <Box sx={{ display: "grid", gap: 1.2, px: "2px", pb: 2 }}>
                        <TextField
                          type="password"
                          label="Current password"
                          size="small"
                          value={currentPassword}
                          onChange={(event) => setCurrentPassword(event.target.value)}
                        />
                        <TextField
                          type="password"
                          label="New password"
                          size="small"
                          value={newPassword}
                          onChange={(event) => setNewPassword(event.target.value)}
                        />
                        <Button
                          variant="contained"
                          onClick={handleChangePassword}
                          disabled={isChangingPassword || !currentPassword || newPassword.length < 8}
                          sx={{ justifySelf: "flex-start" }}
                        >
                          {isChangingPassword ? "Saving…" : "Save new password"}
                        </Button>
                      </Box>
                    )}

                    <Box sx={settingsProfileStyles.accountRow}>
                      <Box sx={settingsProfileStyles.grow}>
                        <Typography sx={settingsProfileStyles.accountTitle}>Export my data</Typography>
                        <Typography sx={settingsProfileStyles.accountSubTitle}>Download your progress and history</Typography>
                      </Box>
                      <Button variant="outlined" onClick={handleExport} disabled={isExporting} sx={settingsProfileStyles.accountActionButton}>
                        {isExporting ? "Exporting…" : "Export"}
                      </Button>
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
                      <Button variant="outlined" color="error" onClick={handleDeleteAccount} disabled={isDeleting} sx={settingsProfileStyles.accountActionButton}>
                        {isDeleting ? "Deleting…" : "Delete"}
                      </Button>
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

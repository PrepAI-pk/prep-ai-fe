import SearchRounded from "@mui/icons-material/SearchRounded";
import NotificationsRounded from "@mui/icons-material/NotificationsRounded";
import {
  Avatar,
  Badge,
  Box,
  IconButton,
  Popover,
  Typography,
} from "@mui/material";
import { useMemo, useState, type MouseEvent } from "react";
import {
  useGetNotificationsQuery,
  useMarkAllNotificationsReadMutation,
  useMarkNotificationReadMutation,
} from "../../../../api/notifications/notifications.endpoints";
import type { NotificationItem } from "../../../../api/notifications/notifications.types";
import {
  useGetNotificationPreferencesQuery,
  useGetPreferencesQuery,
  useUpdatePreferencesMutation,
} from "../../../../api/me/me.endpoints";
import type { BackendAccent, NotifCategoryKey } from "../../../../api/me/me.types";
import type { AppScreen } from "../../../../app/screens";
import { readUiPrefs } from "../../../../app/settings-persistence";

type PracticeTopbarProps = {
  title?: string;
  subtitle?: string;
  searchPlaceholder?: string;
  onOpenGlobalSearch?: () => void;
  onOpenSettings?: () => void;
  onNavigateScreen?: (screen: AppScreen) => void;
  onOpenNotificationSettings?: () => void;
  currentScreen?: AppScreen;
};

// Notification.category comes back UPPERCASE from the API; the preferences
// toggles (me.types.ts NotifCategoryKey) are lowercase — one shared map keeps
// the two vocabularies from silently drifting apart.
const CATEGORY_TO_PREF_KEY: Record<NotificationItem["category"], NotifCategoryKey> = {
  REMINDER: "reminder",
  STREAK: "streak",
  CONTENT: "content",
  LEADERBOARD: "leaderboard",
  RESULTS: "results",
};

// Notification.targetRef is a free-form "go" string set by whatever backend
// flow created the row (exam-attempts, daily-challenge, badges, …) — mapped
// onto a concrete screen here, with dashboard as the safe fallback for
// targetRefs that don't (yet) have a dedicated screen (e.g. "badges").
const TARGET_REF_TO_SCREEN: Record<string, AppScreen> = {
  mockExams: "mockExams",
  dailyChallenge: "dailyChallenge",
  dashboard: "dashboard",
  leaderboard: "leaderboard",
  studyPlan: "studyPlan",
  mcqLibrary: "mcqLibrary",
  settingsProfile: "settingsProfile",
};

function targetRefToScreen(targetRef: string | null): AppScreen {
  return (targetRef && TARGET_REF_TO_SCREEN[targetRef]) || "dashboard";
}

export function PracticeTopbar(props: PracticeTopbarProps) {
  const {
    title = "MCQ Practice",
    subtitle = "Live data from backend questions API",
    searchPlaceholder = "Search MCQs",
    onOpenGlobalSearch,
    onOpenSettings,
    onNavigateScreen,
    onOpenNotificationSettings,
    currentScreen = "practice",
  } = props;

  const inAdminMode =
    currentScreen === "adminOverview" ||
    currentScreen === "adminProcessing" ||
    currentScreen === "adminReviewQueue" ||
    currentScreen === "adminContentManager" ||
    currentScreen === "adminAgentLogs";

  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const { data: notifPrefs } = useGetNotificationPreferencesQuery();
  const { data: serverUiPrefs } = useGetPreferencesQuery();
  const [updatePreferences] = useUpdatePreferencesMutation();
  const { data: notificationsData } = useGetNotificationsQuery(
    { pageSize: 20 },
    { pollingInterval: 60_000 },
  );
  const [markNotificationRead] = useMarkNotificationReadMutation();
  const [markAllNotificationsRead] = useMarkAllNotificationsReadMutation();

  // Falls back to the paint-cache value until the query resolves (same
  // pattern as DynamicThemeApp).
  const uiPrefs = serverUiPrefs
    ? { theme: serverUiPrefs.theme === "DARK" ? ("dark" as const) : ("light" as const), accent: serverUiPrefs.accent.toLowerCase() as "indigo" | "emerald" | "plum" }
    : readUiPrefs();

  const visibleNotifications = useMemo(
    () => (notificationsData?.items ?? []).filter((item) => !notifPrefs || notifPrefs.categories[CATEGORY_TO_PREF_KEY[item.category]]),
    [notificationsData, notifPrefs],
  );
  // The bell badge counts every unread notification server-side, regardless
  // of the category filters applied to the dropdown list below — matches
  // API.md's `unreadCount` being the authoritative total.
  const unreadCount = notificationsData?.unreadCount ?? 0;

  function openNotifications(event: MouseEvent<HTMLElement>): void {
    setAnchorEl(event.currentTarget);
  }

  function closeNotifications(): void {
    setAnchorEl(null);
  }

  function markAllRead(): void {
    void markAllNotificationsRead();
  }

  function openNotificationSettings(): void {
    closeNotifications();
    if (onOpenNotificationSettings) {
      onOpenNotificationSettings();
      return;
    }

    onNavigateScreen?.("notificationSettings");
  }

  function clickNotification(notification: NotificationItem): void {
    if (notification.unread) {
      void markNotificationRead(notification.id);
    }

    closeNotifications();

    onNavigateScreen?.(targetRefToScreen(notification.targetRef));
  }

  function updateAccent(accent: "indigo" | "emerald" | "plum"): void {
    void updatePreferences({ accent: accent.toUpperCase() as BackendAccent });
  }

  function toggleTheme(): void {
    void updatePreferences({ theme: uiPrefs.theme === "light" ? "DARK" : "LIGHT" });
  }

  const themeLabel = uiPrefs.theme === "dark" ? "Dark" : "Light";
  const themeDotColor = uiPrefs.theme === "dark" ? "#8aa4e0" : "#c2703d";

  const toneMap = {
    p: { bg: "primary.light", fg: "primary.main" },
    a: { bg: "secondary.light", fg: "secondary.main" },
    g: { bg: "success.light", fg: "success.main" },
  } as const;

  return (
    <Box
      sx={{
        minHeight: 68,
        borderBottom: "1px solid",
        borderColor: "divider",
        bgcolor: "background.paper",
        px: { xs: 2, md: 3.75 },
        py: "11px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: 2,
      }}
    >
      <Box>
        <Typography variant="h2" sx={{ fontSize: 22 }}>
          {title}
        </Typography>
        <Typography sx={{ color: "text.secondary", fontSize: 12.5 }}>
          {subtitle}
        </Typography>
      </Box>
      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
        <Box
          onClick={onOpenGlobalSearch}
          sx={{
            height: 40,
            width: 230,
            display: { xs: "none", md: "flex" },
            alignItems: "center",
            gap: 0.8,
            px: 1.4,
            borderRadius: "11px",
            border: "1px solid",
            borderColor: "divider",
            backgroundColor: "background.default",
            color: "text.secondary",
            fontSize: 13,
            cursor: onOpenGlobalSearch ? "pointer" : "default",
            transition: "all .2s ease",
            "&:hover": {
              borderColor: onOpenGlobalSearch ? "primary.main" : "divider",
              backgroundColor: "background.default",
            },
          }}
        >
          <SearchRounded sx={{ fontSize: 17 }} />
          {searchPlaceholder}
        </Box>

        {!inAdminMode && (
          <Box
            sx={{
              height: 40,
              px: 1.4,
              borderRadius: "11px",
              display: { xs: "none", md: "flex" },
              alignItems: "center",
              gap: 0.8,
              bgcolor: "secondary.light",
              color: "secondary.main",
              fontFamily: '"Space Mono", monospace',
              fontSize: 13,
              fontWeight: 700,
            }}
          >
            <Box sx={{ width: 7, height: 7, borderRadius: "50%", bgcolor: "secondary.main" }} />
            12d
          </Box>
        )}

        <Box sx={{ display: { xs: "none", md: "flex" }, gap: 0.6 }}>
          {[
            { key: "indigo", color: "#33508c" },
            { key: "emerald", color: "#2f7d5b" },
            { key: "plum", color: "#7d4a86" },
          ].map((swatch) => (
            <Box
              key={swatch.key}
              onClick={() => updateAccent(swatch.key as "indigo" | "emerald" | "plum")}
              sx={{
                width: 18,
                height: 18,
                borderRadius: "50%",
                backgroundColor: swatch.color,
                cursor: "pointer",
                boxShadow:
                  uiPrefs.accent === swatch.key
                    ? uiPrefs.theme === "dark"
                      ? "0 0 0 2px #1b2330, 0 0 0 3px rgba(138,164,224,.92)"
                      : "0 0 0 2px #fff, 0 0 0 3px rgba(51,80,140,.95)"
                    : "none",
              }}
            />
          ))}
        </Box>

        <Box
          onClick={toggleTheme}
          sx={{
            height: 40,
            px: 1.4,
            borderRadius: "11px",
            border: "1px solid",
            borderColor: "divider",
            display: { xs: "none", md: "flex" },
            alignItems: "center",
            gap: 0.8,
            backgroundColor: "background.default",
            color: "text.secondary",
            fontSize: 13,
            fontWeight: 600,
            cursor: "pointer",
            "&:hover": {
              borderColor: "primary.main",
            },
          }}
        >
          <Box
            sx={{
              width: 10,
              height: 10,
              borderRadius: "50%",
              backgroundColor: themeDotColor,
            }}
          />
          {themeLabel}
        </Box>
        <IconButton
          onClick={openNotifications}
          sx={{
            width: 40,
            height: 40,
            border: "1px solid",
            borderColor: "divider",
            borderRadius: "11px",
            bgcolor: "background.default",
          }}
        >
          <Badge badgeContent={unreadCount} color="error" max={9}>
            <NotificationsRounded sx={{ fontSize: 20, color: "text.secondary" }} />
          </Badge>
        </IconButton>

        <Popover
          open={Boolean(anchorEl)}
          anchorEl={anchorEl}
          onClose={closeNotifications}
          anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
          transformOrigin={{ vertical: "top", horizontal: "right" }}
          slotProps={{
            paper: {
              sx: {
                width: 370,
                maxHeight: 520,
                mt: 1,
                borderRadius: "16px",
                border: "1px solid",
                borderColor: "divider",
                boxShadow: "0 20px 50px -16px rgba(0,0,0,.35)",
                overflow: "hidden",
                display: "flex",
                flexDirection: "column",
              },
            },
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", px: "18px", py: "16px", borderBottom: "1px solid", borderBottomColor: "divider" }}>
            <Typography sx={{ fontFamily: '"Source Serif 4", serif', fontSize: 16, fontWeight: 700 }}>Notifications</Typography>
            <Box sx={{ display: "flex", alignItems: "center", gap: "12px" }}>
              <Typography onClick={markAllRead} sx={{ fontSize: 12.5, fontWeight: 600, color: "primary.main", cursor: "pointer", "&:hover": { opacity: 0.8 } }}>
                Mark all read
              </Typography>
              <Box onClick={openNotificationSettings} sx={{ fontSize: 15, color: "text.disabled", cursor: "pointer", "&:hover": { color: "primary.main" } }} title="Notification settings">
                ⚙
              </Box>
            </Box>
          </Box>

          <Box sx={{ flex: 1, overflow: "auto", p: "8px" }}>
            {visibleNotifications.map((item) => (
              <Box
                key={item.id}
                onClick={() => clickNotification(item)}
                sx={{
                  display: "flex",
                  gap: "13px",
                  p: "14px 16px",
                  borderRadius: "12px",
                  cursor: "pointer",
                  backgroundColor: item.unread ? "primary.light" : "transparent",
                  "&:hover": { backgroundColor: "background.default" },
                }}
              >
                <Box
                  sx={{
                    width: 36,
                    height: 36,
                    flex: "none",
                    borderRadius: "10px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 16,
                    bgcolor: toneMap[item.tone].bg,
                    color: toneMap[item.tone].fg,
                  }}
                >
                  {item.icon ?? "•"}
                </Box>
                <Box sx={{ flex: 1, minWidth: 0 }}>
                  <Box sx={{ display: "flex", gap: "8px", alignItems: "flex-start" }}>
                    <Typography sx={{ flex: 1, fontWeight: item.unread ? 700 : 600, fontSize: 13.5, lineHeight: 1.3 }}>{item.title}</Typography>
                    {item.unread && <Box sx={{ width: 8, height: 8, borderRadius: "50%", backgroundColor: "primary.main", flex: "none", mt: "5px" }} />}
                  </Box>
                  <Typography sx={{ fontSize: 12.5, color: "text.secondary", lineHeight: 1.45, mt: "2px" }}>{item.body}</Typography>
                  <Typography sx={{ fontSize: 11, color: "text.disabled", fontFamily: '"Space Mono", monospace', mt: "5px" }}>{item.time}</Typography>
                </Box>
              </Box>
            ))}

            {visibleNotifications.length === 0 && (
              <Typography sx={{ color: "text.secondary", fontSize: 12.5, py: 1 }}>
                No notifications for current preference filters.
              </Typography>
            )}
          </Box>
        </Popover>

        <Avatar
          onClick={onOpenSettings}
          sx={{
            width: 40,
            height: 40,
            bgcolor: "primary.main",
            fontSize: 14,
            cursor: onOpenSettings ? "pointer" : "default",
            transition: "all .2s ease",
            "&:hover": {
              transform: onOpenSettings ? "translateY(-1px)" : "none",
              boxShadow: onOpenSettings ? "0 0 0 2px #dbe4f5" : "none",
            },
          }}
        >
          AK
        </Avatar>
      </Box>
    </Box>
  );
}

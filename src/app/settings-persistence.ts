export type AccentChoice = "indigo" | "emerald" | "plum";
export type UiPrefs = {
  theme: "light" | "dark";
  accent: AccentChoice;
  defaultDifficulty: "Easy" | "Medium" | "Hard";
  language: "English" | "Urdu";
};

export type NotificationPrefs = {
  notif: {
    mockResults: boolean;
    streak: boolean;
    badges: boolean;
    newContent: boolean;
    plan: boolean;
    payments: boolean;
  };
  nsChannels: {
    push: boolean;
    email: boolean;
    sms: boolean;
  };
  nsQuiet: boolean;
  nsQuietFrom: string;
  nsQuietTo: string;
  nsReminder: string;
  nsDigest: "Off" | "Daily" | "Weekly";
};

const UI_PREFS_KEY = "prepai_ui_prefs";
const NOTIF_KEY = "prepai_notif";

const defaultUiPrefs: UiPrefs = {
  theme: "light",
  accent: "indigo",
  defaultDifficulty: "Medium",
  language: "English",
};

const defaultNotifPrefs: NotificationPrefs = {
  notif: {
    mockResults: true,
    streak: true,
    badges: true,
    newContent: true,
    plan: true,
    payments: true,
  },
  nsChannels: {
    push: true,
    email: true,
    sms: false,
  },
  nsQuiet: false,
  nsQuietFrom: "22:00",
  nsQuietTo: "07:00",
  nsReminder: "20:00",
  nsDigest: "Weekly",
};

export function getDefaultUiPrefs(): UiPrefs {
  return defaultUiPrefs;
}

export function getDefaultNotifPrefs(): NotificationPrefs {
  return defaultNotifPrefs;
}

export function readUiPrefs(): UiPrefs {
  try {
    const raw = localStorage.getItem(UI_PREFS_KEY);
    if (!raw) {
      return defaultUiPrefs;
    }

    const parsed = JSON.parse(raw) as Partial<UiPrefs>;

    const theme = parsed.theme === "dark" ? "dark" : "light";
    const accent =
      parsed.accent === "emerald" || parsed.accent === "plum" || parsed.accent === "indigo"
        ? parsed.accent
        : "indigo";
    const defaultDifficulty =
      parsed.defaultDifficulty === "Easy" ||
      parsed.defaultDifficulty === "Medium" ||
      parsed.defaultDifficulty === "Hard"
        ? parsed.defaultDifficulty
        : "Medium";
    const language = parsed.language === "Urdu" ? "Urdu" : "English";

    return { theme, accent, defaultDifficulty, language };
  } catch {
    return defaultUiPrefs;
  }
}

export function writeUiPrefs(value: UiPrefs): void {
  try {
    localStorage.setItem(UI_PREFS_KEY, JSON.stringify(value));
    if (typeof window !== "undefined") {
      window.dispatchEvent(new CustomEvent("prepai-ui-prefs-updated"));
    }
  } catch {
    // Ignore localStorage write failures.
  }
}

export function readNotifPrefs(): NotificationPrefs {
  try {
    const raw = localStorage.getItem(NOTIF_KEY);
    if (!raw) {
      return defaultNotifPrefs;
    }

    const parsed = JSON.parse(raw) as Partial<NotificationPrefs>;

    return {
      notif: {
        mockResults:
          typeof parsed.notif?.mockResults === "boolean"
            ? parsed.notif.mockResults
            : defaultNotifPrefs.notif.mockResults,
        streak:
          typeof parsed.notif?.streak === "boolean"
            ? parsed.notif.streak
            : defaultNotifPrefs.notif.streak,
        badges:
          typeof parsed.notif?.badges === "boolean"
            ? parsed.notif.badges
            : defaultNotifPrefs.notif.badges,
        newContent:
          typeof parsed.notif?.newContent === "boolean"
            ? parsed.notif.newContent
            : defaultNotifPrefs.notif.newContent,
        plan:
          typeof parsed.notif?.plan === "boolean"
            ? parsed.notif.plan
            : defaultNotifPrefs.notif.plan,
        payments:
          typeof parsed.notif?.payments === "boolean"
            ? parsed.notif.payments
            : defaultNotifPrefs.notif.payments,
      },
      nsChannels: {
        push:
          typeof parsed.nsChannels?.push === "boolean"
            ? parsed.nsChannels.push
            : defaultNotifPrefs.nsChannels.push,
        email:
          typeof parsed.nsChannels?.email === "boolean"
            ? parsed.nsChannels.email
            : defaultNotifPrefs.nsChannels.email,
        sms:
          typeof parsed.nsChannels?.sms === "boolean"
            ? parsed.nsChannels.sms
            : defaultNotifPrefs.nsChannels.sms,
      },
      nsQuiet: typeof parsed.nsQuiet === "boolean" ? parsed.nsQuiet : defaultNotifPrefs.nsQuiet,
      nsQuietFrom:
        typeof parsed.nsQuietFrom === "string" ? parsed.nsQuietFrom : defaultNotifPrefs.nsQuietFrom,
      nsQuietTo:
        typeof parsed.nsQuietTo === "string" ? parsed.nsQuietTo : defaultNotifPrefs.nsQuietTo,
      nsReminder:
        typeof parsed.nsReminder === "string" ? parsed.nsReminder : defaultNotifPrefs.nsReminder,
      nsDigest:
        parsed.nsDigest === "Off" || parsed.nsDigest === "Daily" || parsed.nsDigest === "Weekly"
          ? parsed.nsDigest
          : parsed.nsDigest === "Monthly"
            ? "Weekly"
            : defaultNotifPrefs.nsDigest,
    };
  } catch {
    return defaultNotifPrefs;
  }
}

export function writeNotifPrefs(value: NotificationPrefs): void {
  try {
    localStorage.setItem(NOTIF_KEY, JSON.stringify(value));
  } catch {
    // Ignore localStorage write failures.
  }
}

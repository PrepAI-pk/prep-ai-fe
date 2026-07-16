import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { isDailyChallengeDoneToday } from "../../app/daily-challenge-persistence";
import { readNotifPrefs } from "../../app/settings-persistence";
import { SCREEN_TO_PATH } from "../../routes/route-paths";

export function useDailyReminderToast(): {
  showToast: boolean;
  dismiss: () => void;
} {
  const location = useLocation();
  const isAdminSection = location.pathname.startsWith("/admin");
  const [dismissed, setDismissed] = useState(false);
  const [readyForPath, setReadyForPath] = useState<string | null>(null);

  const reminderPrefs = readNotifPrefs();
  const reminderEnabled = reminderPrefs.nsReminder.trim().length > 0;
  const dailyDone = isDailyChallengeDoneToday();

  const eligible =
    !isAdminSection &&
    !dismissed &&
    location.pathname !== SCREEN_TO_PATH.dailyChallenge &&
    reminderEnabled &&
    !dailyDone;

  const showToast = eligible && readyForPath === location.pathname;

  useEffect(() => {
    if (!eligible || readyForPath === location.pathname) {
      return;
    }

    const timeoutId = window.setTimeout(() => {
      setReadyForPath(location.pathname);
    }, 2600);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [eligible, location.pathname, readyForPath]);

  return {
    showToast,
    dismiss: () => setDismissed(true),
  };
}

import { useEffect, useState } from "react";
import {
  readNotifPrefs,
  writeNotifPrefs,
  type NotificationPrefs,
} from "../../../app/settings-persistence";

export function useNotificationSettingsPrefs() {
  const [prefs, setPrefs] = useState<NotificationPrefs>(() => readNotifPrefs());

  useEffect(() => {
    writeNotifPrefs(prefs);
  }, [prefs]);

  const toggleChannel = (key: keyof NotificationPrefs["nsChannels"]) => {
    setPrefs((previous) => ({
      ...previous,
      nsChannels: {
        ...previous.nsChannels,
        [key]: !previous.nsChannels[key],
      },
    }));
  };

  const toggleCategory = (key: keyof NotificationPrefs["notif"]) => {
    setPrefs((previous) => ({
      ...previous,
      notif: {
        ...previous.notif,
        [key]: !previous.notif[key],
      },
    }));
  };

  const setReminder = (value: string) => {
    setPrefs((previous) => ({
      ...previous,
      nsReminder: value,
    }));
  };

  const toggleQuiet = () => {
    setPrefs((previous) => ({
      ...previous,
      nsQuiet: !previous.nsQuiet,
    }));
  };

  const setQuietFrom = (value: string) => {
    setPrefs((previous) => ({
      ...previous,
      nsQuietFrom: value,
    }));
  };

  const setQuietTo = (value: string) => {
    setPrefs((previous) => ({
      ...previous,
      nsQuietTo: value,
    }));
  };

  const setDigest = (value: NotificationPrefs["nsDigest"]) => {
    setPrefs((previous) => ({
      ...previous,
      nsDigest: value,
    }));
  };

  return {
    prefs,
    toggleChannel,
    toggleCategory,
    setReminder,
    toggleQuiet,
    setQuietFrom,
    setQuietTo,
    setDigest,
  };
}

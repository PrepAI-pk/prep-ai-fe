import { useEffect, useState } from "react";
import {
  readNotifPrefs,
  readUiPrefs,
  writeNotifPrefs,
  writeUiPrefs,
  type AccentChoice,
  type NotificationPrefs,
  type UiPrefs,
} from "../../../app/settings-persistence";
import { SettingsTab } from "../settings.constants";

export function useSettingsPreferences() {
  const [tab, setTab] = useState<SettingsTab>(SettingsTab.Profile);

  const [fullName, setFullName] = useState("Ayesha Khan");
  const [email, setEmail] = useState("ayesha.khan@example.com");
  const [city, setCity] = useState("Lahore");
  const [targetExam, setTargetExam] = useState("CSS");

  const [uiPrefs, setUiPrefs] = useState<UiPrefs>(() => readUiPrefs());
  const [notifPrefs, setNotifPrefs] = useState<NotificationPrefs>(() => readNotifPrefs());

  useEffect(() => {
    writeUiPrefs(uiPrefs);
  }, [uiPrefs]);

  useEffect(() => {
    writeNotifPrefs(notifPrefs);
  }, [notifPrefs]);

  function updateAccent(accent: AccentChoice): void {
    setUiPrefs((previous) => ({ ...previous, accent }));
  }

  return {
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
  };
}

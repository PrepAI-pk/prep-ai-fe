import { useState } from "react";
import {
  useGetMeQuery,
  useGetNotificationPreferencesQuery,
  useGetPreferencesQuery,
  useUpdateMeMutation,
  useUpdateNotificationPreferencesMutation,
  useUpdatePreferencesMutation,
} from "../../../api/me/me.endpoints";
import type {
  BackendAccent,
  BackendDifficulty,
  BackendLanguage,
  BackendTheme,
  NotifCategoryKey,
} from "../../../api/me/me.types";
import { SettingsTab } from "../settings.constants";

export function useSettingsPreferences() {
  const [tab, setTab] = useState<SettingsTab>(SettingsTab.Profile);

  const { data: me } = useGetMeQuery();
  const { data: preferences } = useGetPreferencesQuery();
  const { data: notificationPreferences } = useGetNotificationPreferencesQuery();

  const [updateMeMutation] = useUpdateMeMutation();
  const [updatePreferencesMutation] = useUpdatePreferencesMutation();
  const [updateNotificationPreferencesMutation] = useUpdateNotificationPreferencesMutation();

  const [fullName, setFullName] = useState("");
  const [city, setCity] = useState("");
  // "Target exam" has no backend field yet — sending it needs a real Exam id
  // (goalExamId), which needs Batch 2's /exams endpoint. Kept local-only for
  // now, same treatment as onboarding's Goal step.
  const [targetExam, setTargetExam] = useState("CSS");

  // Seed the editable fields from `me` once it loads, without an effect —
  // "adjusting state during render" per the React docs, since setState
  // inside a useEffect body triggers a disallowed cascading render here.
  const [syncedMeId, setSyncedMeId] = useState<string | undefined>(undefined);
  if (me && me.id !== syncedMeId) {
    setSyncedMeId(me.id);
    setFullName(me.fullName);
    setCity(me.city ?? "");
  }

  function saveProfile(): void {
    void updateMeMutation({ fullName, city });
  }

  function cancelProfileEdits(): void {
    if (me) {
      setFullName(me.fullName);
      setCity(me.city ?? "");
    }
  }

  function updateTheme(theme: BackendTheme): void {
    void updatePreferencesMutation({ theme });
  }

  function updateAccent(accent: BackendAccent): void {
    void updatePreferencesMutation({ accent });
  }

  function updateDifficulty(defaultDifficulty: BackendDifficulty): void {
    void updatePreferencesMutation({ defaultDifficulty });
  }

  function updateLanguage(contentLanguage: BackendLanguage): void {
    void updatePreferencesMutation({ contentLanguage });
  }

  function toggleNotificationCategory(key: NotifCategoryKey): void {
    if (!notificationPreferences) {
      return;
    }
    void updateNotificationPreferencesMutation({
      categories: { [key]: !notificationPreferences.categories[key] },
    });
  }

  return {
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
  };
}

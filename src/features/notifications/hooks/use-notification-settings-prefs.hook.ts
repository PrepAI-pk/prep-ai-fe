import {
  useGetNotificationPreferencesQuery,
  useUpdateNotificationPreferencesMutation,
} from "../../../api/me/me.endpoints";
import type {
  BackendDigestFreq,
  NotifCategoryKey,
  NotifChannelKey,
} from "../../../api/me/me.types";

export function useNotificationSettingsPrefs() {
  const { data: prefs } = useGetNotificationPreferencesQuery();
  const [updatePrefs] = useUpdateNotificationPreferencesMutation();

  const toggleChannel = (key: NotifChannelKey): void => {
    if (!prefs) {
      return;
    }
    void updatePrefs({ channels: { [key]: !prefs.channels[key] } });
  };

  const toggleCategory = (key: NotifCategoryKey): void => {
    if (!prefs) {
      return;
    }
    void updatePrefs({ categories: { [key]: !prefs.categories[key] } });
  };

  const setReminderTime = (time: string): void => {
    void updatePrefs({ reminder: { time, enabled: time.trim().length > 0 } });
  };

  const toggleQuiet = (): void => {
    if (!prefs) {
      return;
    }
    void updatePrefs({ quiet: { enabled: !prefs.quiet.enabled } });
  };

  const setQuietFrom = (from: string): void => {
    void updatePrefs({ quiet: { from } });
  };

  const setQuietTo = (to: string): void => {
    void updatePrefs({ quiet: { to } });
  };

  const setDigest = (digestFreq: BackendDigestFreq): void => {
    void updatePrefs({ digestFreq });
  };

  return {
    prefs,
    toggleChannel,
    toggleCategory,
    setReminderTime,
    toggleQuiet,
    setQuietFrom,
    setQuietTo,
    setDigest,
  };
}

// @flow
import chromep from 'chrome-promise';

export const STORAGE_KEY_SETTINGS = 'settings';

export const DEFAULT_SETTINGS: Settings = {
  // General
  // closeTabAfterSnooze: true,
  // showBadge: false,
  playSoundEffects: true,
  playNotificationSound: true,
  showNotifications: true,

  // Snooze times
  weekStartDay: 1, // Sunday(0) or Monday(1)
  weekEndDay: 6, // Friday (5) or Saturday(6)
  workdayStart: 8,
  workdayEnd: 19,
  laterTodayHoursDelta: 3,
  somedayMonthsDelta: 3,

  // general data
  version: 3,
  totalSnoozeCount: 0,
};

export async function getSettings(): Promise<Settings> {
  let { settings } = await chromep.storage.local.get(
    STORAGE_KEY_SETTINGS
  );

  // Add new settings keys, preserve user old preferences
  return Object.assign({}, DEFAULT_SETTINGS, settings);
}

export async function saveSettings(
  newSettings: $Shape<Settings>
): Promise<void> {
  const currentSettings = await getSettings();

  newSettings = Object.assign(currentSettings, newSettings);

  return chromep.storage.local.set({
    [STORAGE_KEY_SETTINGS]: newSettings,
  });
}

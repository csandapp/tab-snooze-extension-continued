// @flow
import chromep from 'chrome-promise';
import clone from 'clone';

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
};

export async function getSettings(): Promise<Settings> {
  let { settings } = await chromep.storage.local.get(
    STORAGE_KEY_SETTINGS
  );

  // Add new settings keys, preserve user old preferences
  const defaults = clone(DEFAULT_SETTINGS);
  settings = Object.assign(defaults, settings);

  return settings;
}

export function saveSettings(settings: Settings): Promise<void> {
  // using local instead of sync beacuse I fear that
  // user will make many changes in the options page that
  // will trigger many 'set' api calls on storage.local which
  // will reach the api quota limit.
  return chromep.storage.local.set({
    [STORAGE_KEY_SETTINGS]: settings,
  });
}

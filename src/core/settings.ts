import { BADGE_HIDDEN } from './badge';
// import { exposeFunctionForDebug } from './utils';
import type { Settings } from '../types';

export const STORAGE_KEY_SETTINGS = 'settings';

export const DEFAULT_SETTINGS: Settings = {
  // General
  badge: BADGE_HIDDEN,
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
  installDate: 0,
  weeklyUsage: {
    weekNumber: 0,
    usageCount: 0,
  },

  // Support reminders
  showSupportReminders: true,
  lastSupportReminderDate: 0,
};

export async function getSettings(): Promise<Settings> {
  let { settings } = await chrome.storage.local.get(
    STORAGE_KEY_SETTINGS
  );

  // Add new settings keys, preserve user old preferences
  return Object.assign({}, DEFAULT_SETTINGS, settings);
}

export async function saveSettings(
  newSettings: Partial<Settings>
): Promise<void> {
  const currentSettings = await getSettings();

  const mergedSettings = Object.assign(currentSettings, newSettings);

  return chrome.storage.local.set({
    [STORAGE_KEY_SETTINGS]: mergedSettings,
  });
}

async function resetSettings() {
  chrome.storage.local.remove(STORAGE_KEY_SETTINGS);
}

async function printSettings() {
  const settings = await getSettings();
  console.table(settings);
}

// exposeFunctionForDebug([
//   getSettings,
//   saveSettings,
//   printSettings,
//   resetSettings,
// ]);

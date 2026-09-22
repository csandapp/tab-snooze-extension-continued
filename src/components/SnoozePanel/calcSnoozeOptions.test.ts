import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import moment from 'moment';
import calcSnoozeOptions from './calcSnoozeOptions';
import type { Settings } from '@/types';

// Explicit settings — tests should not rely on DEFAULT_SETTINGS so that
// changes to defaults don't silently affect these assertions.
const TEST_SETTINGS: Settings = {
  weekEndDay: 6,      // Saturday
  weekStartDay: 1,    // Monday
  workdayStart: 8,
  workdayEnd: 19,
  laterTodayHoursDelta: 3,
  somedayMonthsDelta: 3,
  badge: 'hidden',
  playSoundEffects: true,
  playNotificationSound: true,
  showNotifications: true,
  version: 3,
  totalSnoozeCount: 0,
  installDate: 0,
  weeklyUsage: { weekNumber: 0, usageCount: 0 },
  showSupportReminders: true,
  lastSupportReminderDate: 0,
};

// Pinned reference week: Mon 2026-03-30 → Sun 2026-04-05
// This weekend (Saturday):      2026-04-04
// Next weekend (Saturday after): 2026-04-11
const THIS_SATURDAY = '2026-04-04';
const NEXT_SATURDAY = '2026-04-11';

function getWeekendOption() {
  const options = calcSnoozeOptions(TEST_SETTINGS);
  const opt = options.find(o => o.id === 'weekend');
  if (!opt?.when) throw new Error('weekend option not found');
  return opt;
}

describe('calcSnoozeOptions — weekend option', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it.each([
    ['Monday',    '2026-03-30T10:00:00'],
    ['Tuesday',   '2026-03-31T10:00:00'],
    ['Wednesday', '2026-04-01T10:00:00'],
    ['Thursday',  '2026-04-02T10:00:00'],
    ['Friday',    '2026-04-03T10:00:00'],
  ])('on %s shows "This Weekend" targeting %s', (_, dateTime) => {
    vi.setSystemTime(new Date(dateTime));
    const opt = getWeekendOption();
    expect(opt.title).toBe('This Weekend');
    expect(moment(opt.when).format('YYYY-MM-DD')).toBe(THIS_SATURDAY);
  });

  it.each([
    ['Saturday', '2026-04-04T10:00:00'],
    ['Sunday',   '2026-04-05T10:00:00'],
  ])('on %s shows "Next Weekend" targeting the following Saturday', (_, dateTime) => {
    vi.setSystemTime(new Date(dateTime));
    const opt = getWeekendOption();
    expect(opt.title).toBe('Next Weekend');
    expect(moment(opt.when).format('YYYY-MM-DD')).toBe(NEXT_SATURDAY);
  });
});

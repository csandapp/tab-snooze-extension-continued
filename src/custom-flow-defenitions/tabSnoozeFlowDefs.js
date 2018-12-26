declare type SnoozePeriod = {
  type: 'daily' | 'weekly' | 'monthly' | 'yearly',
  // Hour - 0 to 23 (all periods)
  hour: number,
  // day of the month (0 to 31) (monthly period)
  day: number,
  // list of weekdays index (weekly period)
  days: Array<number>,
  // date: [monthIndex, dayIndex]  (yearly period)
  date: [number, number],
};

declare type SnoozedTab = {
  // Document title of tab
  title: string,
  // URL of tab
  url: string,
  // the selected snooze button index (0 - 8)
  snoozeOptionIndex: number,
  // Favicon of tab
  favicon: string,
  // ???
  when: number,
  sleepStart: number,
  // ??
  period?: SnoozePeriod,
};

// As defined by the chrome API
declare type ChromeTab = {
  id: string,
  title: string,
  url: string,
  favIconUrl: string,
  windowId: string,
};

declare type KeyCombo = Array<string>;

declare type Settings = {
  // General
  closeTabAfterSnooze: boolean,
  playNotificationSound: boolean,
  showBadge: boolean,
  showNotifications: boolean,

  // Time preference
  laterTodayHoursDelta: number,
  somedayMonthsDelta: 3,
  weekEndDay: 6,
  weekStartDay: 1,
  workdayEnd: 19,
  workdayStart: 8,
};

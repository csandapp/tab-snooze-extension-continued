declare type SnoozePeriod =
  | {
      type: 'daily',
      hour: number, // Hour - 0 to 23 (all periods)
    }
  | {
      type: 'weekly',
      hour: number,
      days: Array<number>, // list of weekdays index (weekly period)
    }
  | {
      type: 'monthly',
      hour: number,
      day: number, // day of the month (0 to 31) (monthly period)
    }
  | {
      type: 'yearly',
      hour: number,
      date: [number, number], // date: [monthIndex, dayIndex]  (yearly period)
    };

declare type SnoozedTab = {
  // Document title of tab
  title: string,
  // URL of tab
  url: string,
  // the selected snooze button index (0 - 8)
  type: string,
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
  // showBadge: boolean,
  // closeTabAfterSnooze: boolean,
  playSoundEffects: boolean,
  playNotificationSound: boolean,
  showNotifications: boolean,

  // Time preference
  laterTodayHoursDelta: number,
  somedayMonthsDelta: 3,
  weekEndDay: 6,
  weekStartDay: 1,
  workdayEnd: 19,
  workdayStart: 8,
};

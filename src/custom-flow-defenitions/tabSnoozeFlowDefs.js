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

declare type SnoozeConfig = {|
  // Must have either wakeupTime or period
  wakeupTime?: number,
  period?: SnoozePeriod,
  type: string, // 'later_today' , ...
|};

declare type Settings = {|
  // General
  badge: 'hidden' | 'due_today' | 'total_snoozed',
  // closeTabAfterSnooze: boolean,
  playSoundEffects: boolean,
  playNotificationSound: boolean,
  showNotifications: boolean,

  // Time preference
  laterTodayHoursDelta: number,
  somedayMonthsDelta: number,
  weekEndDay: number,
  weekStartDay: number,
  workdayEnd: number,
  workdayStart: number,

  // General data
  version: number,
  totalSnoozeCount: number,
|};

export type SnoozePeriod =
  | { type: 'daily'; hour: number }
  | { type: 'weekly'; hour: number; days: number[] }
  | { type: 'monthly'; hour: number; day: number }
  | { type: 'yearly'; hour: number; date: [number, number] };

export interface SnoozedTab {
  title: string;
  url: string;
  type: string;
  favicon: string;
  when: number;
  sleepStart: number;
  period?: SnoozePeriod;
}

export interface SnoozeConfig {
  wakeupTime?: number;
  period?: SnoozePeriod;
  type: string;
  closeTab?: boolean;
}

export interface Settings {
  badge: 'hidden' | 'due_today' | 'total_snoozed';
  playSoundEffects: boolean;
  playNotificationSound: boolean;
  showNotifications: boolean;

  laterTodayHoursDelta: number;
  somedayMonthsDelta: number;
  weekEndDay: number;
  weekStartDay: number;
  workdayEnd: number;
  workdayStart: number;

  version: number;
  totalSnoozeCount: number;
  installDate: number;
  weeklyUsage: {
    weekNumber: number;
    usageCount: number;
  };

  showSupportReminders: boolean;
  lastSupportReminderDate: number;
}

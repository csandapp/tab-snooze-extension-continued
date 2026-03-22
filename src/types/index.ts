import 'styled-components';

declare module 'styled-components' {
  export interface DefaultTheme {
    dark: boolean;
    primary: string;
    black: string;
    gray: string;
    beta: string;
    border: string;
    lightBorder: string;
    fontFamily: string;
    snoozePanel: {
      bgColor: string;
      border: string;
      hoverColor: string;
      footerTextColor: string;
      buttonTextColor: string;
      countBadgeColor: string;
      whiteIcons: boolean;
    };
  }
}

export type SnoozePeriod =
  | { type: 'daily'; hour: number }
  | { type: 'weekly'; hour: number; days: number[] }
  | { type: 'monthly'; hour: number; day: number }
  | { type: 'yearly'; hour: number; date: [number, number] };

export type SnoozeType =
  | 'later'
  | 'evening'
  | 'tomorrow'
  | 'weekend'
  | 'next_week'
  | 'in_a_month'
  | 'someday'
  | 'repeated'
  | 'specific_date';

export interface SnoozedTab {
  title: string;
  url: string;
  type: SnoozeType;
  favicon: string;
  when: number;
  sleepStart: number;
  period?: SnoozePeriod;
}

export interface SnoozeConfig {
  wakeupTime?: number;
  period?: SnoozePeriod;
  type: SnoozeType;
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

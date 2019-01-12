// @flow

export type Feature = {
  id: string,
  name: string,
  description: string,
  icon: string,
};

export const PRO_FEATURES: Array<Feature> = [
  {
    id: 'cloud_sync',
    name: 'Cloud Sync & Backup',
    description:
      'Sync your sleeping tabs automatically to all your other devices.',
    icon: require('./images/cloud.svg'),
  },
  {
    id: 'location_snooze',
    name: 'Snooze to Home/Work',
    description:
      'Snooze tabs to wake up when you get on your home/work device.',
    icon: require('./images/location.svg'),
  },
  {
    id: 'window_snooze',
    name: 'Window Snooze',
    description:
      'Snooze an entire window or selected tabs for a later time.',
    icon: require('./images/window.svg'),
  },
  {
    id: 'periodic_snooze',
    name: 'Periodic Snooze',
    description:
      'Set a tab to wake up daily, weekly, monthly or on a yearly basis.',
    icon: require('./images/periodic.svg'),
  },
  {
    id: 'dark_mode',
    name: 'Dark Mode',
    description:
      "Show you're a pro with the elegant dark theme for Tab Snooze.",
    icon: require('./images/dark.svg'),
  },
  {
    id: 'smart_wakeup',
    name: 'Smart Wakeup',
    description:
      'Tab Snooze will ask before waking up too many tabs at once.',
    icon: require('./images/alarm.svg'),
  },
  {
    id: 'custom_snooze_options',
    name: 'Custom Snooze Times',
    description:
      'Add custom snooze options to the grid like "in 3 days", "in 2 weeks".',
    icon: require('./images/edit.svg'),
  },
  {
    id: 'reorder_snooze_grid',
    name: 'Reorder Snooze Grid',
    description:
      'Reorder the Snooze buttons grid to match your flow.',
    icon: require('./images/reorder.svg'),
  },
  {
    id: 'keyboard_shortcuts',
    name: 'Keyboard Shortcuts',
    description:
      'Set keyboard shortcuts for actions like Repeat Last Snooze.',
    icon: require('./images/keyboard.svg'),
  },
  {
    id: 'show_love',
    name: 'Show Some Love',
    description:
      'Support Tab Snooze continueous development by being a PRO user!',
    icon: require('./images/heart.svg'),
  },
];

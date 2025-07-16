// @flow

import { addTrackingIdToUrl } from './core/analytics';

// Base app file path
export const APP_BASE_PATH = '/index.html#';

// App routes
export const POPUP_PATH = '/popup';
export const OPTIONS_PATH = '/options';
export const SLEEPING_TABS_PATH = '/options/sleeping-tabs';
export const SETTINGS_PATH = '/options/settings';
export const TODO_PATH = '/todo';
export const FIRST_SNOOZE_PATH = '/first-snooze';
export const RATE_TS_PATH = '/rate-tab-snooze';
export const BETA_PATH = '/beta';
export const TUTORIAL_PATH = '/tutorial';

// A special route that is meant to execute the background.js
// script, and not any GUI rendering.
// **NOTE**: intentionally without a preceding '/'
export const BACKGROUND_PATH = 'background';

// External links
// export const CHROME_WEB_STORE_INSTALL_SHARE_LINK = 'https://chromewebstore.google.com/detail/tab-snooze-works-as-of-no/kgnigbfnfjgpfaiaafcbgdkpalapiinb';
export const CHROME_SETTINGS_SHORTCUTS = 'chrome://extensions/shortcuts';

// Miscellaneous Section on Settings Page
export const CHROME_WEB_STORE_REVIEW = 'https://chromewebstore.google.com/detail/tab-snooze-works-as-of-no/kgnigbfnfjgpfaiaafcbgdkpalapiinb/reviews';
export const ORIGINAL_DEVLOPER_DONATE_URL = 'https://www.paypal.com/cgi-bin/webscr?cmd=_donations&business=82HLJCDURLVME&currency_code=USD&source=url';
export const CURR_DEVELOPER_DONATE_URL = "https://ko-fi.com/csandapp"
export const GITHUB_REPO_URL = "https://github.com/csandapp/tab-snooze-extension-continued"
export const SUPPORT_EMAIL_URL = "mailto:csandapp@gmail.com"

// Links on Beta page
export const MESSENGER_PROFILE_URL = 'https://m.me/tabsnooze';
export const CHANGELOG_URL =
  'https://headwayapp.co/tab-snooze-changelog';
export const TAB_SNOOZE_FEATURE_VOTE_URL =
  'https://tab-snooze.nolt.io/';
export const BETA_INSTRUCTIONS_URL =
  'https://medium.com/@eyalw/tab-snooze-beta-b033d1e3e021';
export const TS_HOMEPAGE_URL =
  process.env.NODE_ENV === 'development'
    ? 'http://localhost:3000'
    : 'https://tabsnooze.com';
export const SERVER_CONFIG_URL = `${TS_HOMEPAGE_URL}/serverConfig.json`;

// URLS requires tracking id param:
const UPGRADE_URL = `${TS_HOMEPAGE_URL}/pro`;
const TRACK_UNINSTALL_URL = `${TS_HOMEPAGE_URL}/uninstalled`;

export const getTrackUninstallUrl = () =>
  addTrackingIdToUrl(TRACK_UNINSTALL_URL);
export const getUpgradeUrl = () => addTrackingIdToUrl(UPGRADE_URL);

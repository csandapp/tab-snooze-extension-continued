// Message action types for chrome.runtime.sendMessage communication.
// Used by popup/options → service worker, and SW → offscreen document.
export const MSG_SNOOZE_TAB = 'snoozeTab';
export const MSG_SNOOZE_TABS = 'snoozeTabs';
export const MSG_DELETE_SNOOZED_TABS = 'deleteSnoozedTabs';
export const MSG_PLAY_AUDIO = 'playAudio';

# Cleanup Mode — Design Spec

**Date:** 2026-04-16
**Status:** Approved

## Overview

Cleanup Mode is a triage feature accessed from the popup that lets users rapidly process a large number of open tabs. On entry it automatically closes duplicates and configured auto-close domains, then presents a scrollable list where each tab can be individually snoozed or closed. A 24-hour ephemeral triage history lets users recover accidentally closed URLs.

---

## 1. Entry Point & Mode Switching

A "Cleanup" toggle button is added to the `AppTopBar` in `SnoozePanel`, styled identically to the existing `SingleTabToggle`. It is hidden when `singleTabMode` is true (cleanup is meaningless for a single tab).

Clicking "Cleanup" sets a `cleanupMode: boolean` state in `SnoozePanel`. When true, the `SnoozeButtonsGrid` is replaced by `CleanupPanel`. The top bar remains visible. Clicking "Cleanup" again exits the mode and restores the normal grid.

**Which tabs are included:** Cleanup mode respects the existing targeting logic — it shows either the Ctrl+click highlighted selection (if >1 tab highlighted) or all tabs in the current window. It does not apply in single-tab mode.

**Auto-processing on entry:** Before the triage list renders, `CleanupPanel` runs auto-processing:
1. Close duplicate tabs (keep the tab with the highest `lastAccessed` timestamp; `chrome.tabs.query` returns this field in MV3)
2. Close tabs whose URL hostname matches any entry in `cleanupAutocloseDomains` from settings

Both operations call `chrome.tabs.remove` directly from the popup (no SW round-trip needed for closing) and log each closed tab to triage history.

---

## 2. Triage List UI

`CleanupPanel` renders a scrollable list inside the fixed 390×509px popup, below the `AppTopBar`. Each row is ~48px and contains:

- **Favicon** (24px) + **truncated title** (fills remaining width)
- **Snooze button** (right side) — opens a compact inline dropdown listing the standard snooze time options (Later Today, Tomorrow, Next Week, etc.) as a menu. Selecting an option snoozes the tab via the existing `MSG_SNOOZE_TABS` message path, closes the tab, and removes the row.
- **Close button** (X icon, right of snooze) — calls `chrome.tabs.remove` immediately, logs to triage history, removes the row.

**Grouping:** A group-by toggle in the `AppTopBar` (visible only in cleanup mode) switches between:
- **Flat** (default) — ungrouped, ordered by tab index
- **By domain** — sticky domain-name headers
- **By age** — sticky age bucket headers ("Opened today", "Opened this week", "Older")

Group headers include a "Close all" action that bulk-closes every tab in the group and logs each to triage history.

**Empty state:** When the list reaches zero tabs, a brief "All done" message is shown. After 1.5 seconds the panel auto-exits cleanup mode and restores the normal grid.

---

## 3. Triage History

Every tab closed during cleanup mode (via auto-processing or manual action) is logged. Each history entry contains:

```
{ url, title, favicon, closedAt: timestamp }
```

**Storage:** Entries are appended to `chrome.storage.local` under key `triageHistory` as an array. Writes go through the service worker via a new `MSG_LOG_TRIAGE` message type, using the existing `withStorageLock` mutex in `storage.js` for serialized writes. On every write, entries older than 24 hours are pruned before saving.

**New storage functions in `storage.js`:**
- `getTriageHistory(): Promise<Array<TriageEntry>>`
- `appendTriageEntries(entries: Array<TriageEntry>): Promise<void>` — prunes stale entries, appends new ones, saves

**UI:** A new "Triage History" section in `OptionsPage` lists entries with favicon, title, clickable URL, and relative time ("2 hours ago"). Read-only — clicking a URL opens it in a new tab. The section is hidden when history is empty.

---

## 4. Settings — Auto-Close Domains

A new "Cleanup Mode" section in `SettingsPage.jsx` contains a tag-input field for domain names (e.g., `mail.google.com`, `twitter.com`).

**Storage:** Stored in `chrome.storage.local` under key `cleanupAutocloseDomains` as `string[]`, accessed via `getSettings`/`saveSettings` like other preferences.

**Matching logic:** On cleanup entry, each tab's `URL.hostname` is compared against the list. Matches are closed before the triage list renders.

---

## 5. Data Flow Summary

| Action | Who does it | How |
|---|---|---|
| Close tab (manual or auto) | Popup (`CleanupPanel`) | `chrome.tabs.remove` directly |
| Log to triage history | Service worker | `MSG_LOG_TRIAGE` → `appendTriageEntries` |
| Snooze tab | Service worker | `MSG_SNOOZE_TABS` (existing path) |
| Read auto-close domains | Popup | `getSettings()` |
| Read/display triage history | Options page | `getTriageHistory()` + `chrome.storage.onChanged` listener |

---

## 6. New Files & Key Changes

| File | Change |
|---|---|
| `src/components/SnoozePanel/SnoozePanel.jsx` | Add `cleanupMode` state, "Cleanup" button in `AppTopBar`, conditional render of `CleanupPanel` |
| `src/components/SnoozePanel/CleanupPanel.jsx` | New component — auto-processing, triage list, grouping, row actions |
| `src/components/OptionsPage/SettingsPage.jsx` | Add "Cleanup Mode" section with domain tag-input |
| `src/components/OptionsPage/SleepingTabsPage.jsx` | Add "Triage History" section |
| `src/core/storage.js` | Add `triageHistory` key, `getTriageHistory`, `appendTriageEntries` |
| `src/core/messages.js` | Add `MSG_LOG_TRIAGE` constant |
| `src/core/backgroundMain.js` | Handle `MSG_LOG_TRIAGE` message |
| `src/core/settings.js` | Add `cleanupAutocloseDomains` to default settings shape |

# Cleanup Mode — Design Spec

**Date:** 2026-04-16
**Status:** Approved

## Overview

Cleanup Mode is a triage feature that lets users rapidly process a large number of open tabs. It lives at its own top-level route (`/cleanup`), peer to `/popup`, keeping `SnoozePanel` single-purpose. On entry it automatically closes duplicates and configured auto-close domains, then presents a scrollable list where each tab can be individually snoozed or closed. A 24-hour ephemeral triage history lets users recover accidentally closed URLs.

---

## 1. Architecture — Routing Over Mode-Switching

Cleanup is a **sibling route** to the snooze popup, not a mode inside `SnoozePanel`. The router gains a `/cleanup` route rendered by a new `CleanupPanel` component. The "Cleanup" button in `SnoozePanel`'s `AppTopBar` is a React Router `Link` to `/cleanup`. `CleanupPanel` has its own `AppTopBar` with a back arrow that navigates to `/popup`.

This keeps `SnoozePanel.jsx` focused solely on snoozing and gives `CleanupPanel` a clean file boundary with no shared boolean state.

**Changes to routing layer:**
- `src/paths.js` — add `CLEANUP_PATH = '/cleanup'`
- `src/Router.jsx` — add `<Route path={CLEANUP_PATH} element={<AsyncCleanupPanel />} />`
- `SnoozePanel` `AppTopBar` — "Cleanup" button becomes `<Link to={CLEANUP_PATH}>`, hidden when `singleTabMode` is true

**Which tabs are included:** `CleanupPanel` reads the current window's tabs on mount via `chrome.tabs.query`. It respects the existing targeting logic — if >1 tab was highlighted when cleanup was entered, those are used; otherwise all tabs in the window. Single-tab mode is irrelevant (the button is hidden in that state).

---

## 2. Auto-Processing on Entry

Before the triage list renders, `CleanupPanel` runs auto-processing in sequence:

1. **Deduplication** — query all target tabs, group by URL stripped of query string (`scheme + host + path` only; query params are ignored so `example.com/page?a=1` and `example.com/page?a=2` are the same duplicate key), keep the tab with the highest `lastAccessed` timestamp per group, close the rest via `chrome.tabs.remove`
2. **Domain auto-close** — close any tab whose `URL.hostname` matches an entry in `cleanupAutocloseDomains` from settings

Both operations call `chrome.tabs.remove` directly from the popup (no SW round-trip needed for closing). Every closed tab is logged to triage history before removal.

---

## 3. Triage List UI

`CleanupPanel` renders a scrollable list in the same 390×509px popup dimensions. Each row (~48px) contains:

- **Favicon** (24px) + **truncated title** (fills remaining width)
- **Snooze button** (right side) — compact inline dropdown listing standard snooze time options as a menu. Selecting one snoozes via `MSG_SNOOZE_TABS`, closes the tab, removes the row.
- **Close button** (X icon) — calls `chrome.tabs.remove` immediately, logs to triage history, removes the row.

**Grouping:** A group-by toggle in `CleanupPanel`'s `AppTopBar` switches between:
- **Flat** (default) — ungrouped, ordered by tab index
- **By domain** — sticky domain-name headers
- **By age** — sticky age buckets ("Opened today", "Opened this week", "Older")

Group headers include a "Close all" action that bulk-closes every tab in the group.

**Empty state:** When the list reaches zero tabs, show "All done" briefly, then navigate back to `/popup` after 1.5 seconds.

---

## 4. Triage History

Every tab closed in cleanup mode (auto-processing or manual) is logged:

```
{ url, title, favicon, closedAt: timestamp }
```

**Storage:** Appended to `chrome.storage.local` under key `triageHistory`. Writes go through the service worker via a new `MSG_LOG_TRIAGE` message, using the existing `withStorageLock` mutex in `storage.js`. On every write, entries older than 24 hours are pruned before saving.

**New functions in `storage.js`:**
- `getTriageHistory(): Promise<Array<TriageEntry>>`
- `appendTriageEntries(entries: Array<TriageEntry>): Promise<void>`

**UI:** A "Triage History" section in `OptionsPage` (below sleeping tabs) lists entries with favicon, title, clickable URL (opens in new tab), and relative time. Hidden when history is empty.

---

## 5. Settings — Auto-Close Domains

A "Cleanup Mode" section in `SettingsPage.jsx` contains a tag-input field for domain names (e.g. `mail.google.com`, `twitter.com`). Stored in `chrome.storage.local` under key `cleanupAutocloseDomains` as `string[]`, via `getSettings`/`saveSettings`.

---

## 6. Data Flow Summary

| Action | Who does it | How |
|---|---|---|
| Close tab (manual or auto) | `CleanupPanel` (popup) | `chrome.tabs.remove` directly |
| Log to triage history | Service worker | `MSG_LOG_TRIAGE` → `appendTriageEntries` |
| Snooze tab | Service worker | `MSG_SNOOZE_TABS` (existing path) |
| Read auto-close domains | `CleanupPanel` | `getSettings()` |
| Read/display triage history | Options page | `getTriageHistory()` + `chrome.storage.onChanged` |

---

## 7. New Files & Key Changes

| File | Change |
|---|---|
| `src/paths.js` | Add `CLEANUP_PATH = '/cleanup'` |
| `src/Router.jsx` | Add `/cleanup` route → `AsyncCleanupPanel` |
| `src/components/CleanupPanel/index.jsx` | New component — auto-processing, triage list, grouping, row actions, own `AppTopBar` |
| `src/components/SnoozePanel/SnoozePanel.jsx` | Add "Cleanup" `Link` button to `AppTopBar`; no mode state added |
| `src/components/OptionsPage/SettingsPage.jsx` | Add "Cleanup Mode" section with domain tag-input |
| `src/components/OptionsPage/SleepingTabsPage.jsx` | Add "Triage History" section |
| `src/core/storage.js` | Add `triageHistory` key, `getTriageHistory`, `appendTriageEntries` |
| `src/core/messages.js` | Add `MSG_LOG_TRIAGE` constant |
| `src/core/backgroundMain.js` | Handle `MSG_LOG_TRIAGE` message |
| `src/core/settings.js` | Add `cleanupAutocloseDomains` to default settings shape |

---

## 8. Future Work

The sleeping tabs list currently lives in `OptionsPage`. A future refactor should move it into the popup router as a `/sleeping-tabs` route, creating a unified tab-management hub within the popup. See `docs/superpowers/specs/future-popup-router-unification.md`.

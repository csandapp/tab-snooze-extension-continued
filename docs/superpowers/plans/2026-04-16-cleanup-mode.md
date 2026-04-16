# Cleanup Mode Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a `/cleanup` route to the extension popup where users triage open tabs (close or snooze each individually), with automatic deduplication, domain-based auto-close on entry, and a 24-hour ephemeral triage history recoverable from the Options page.

**Architecture:** `CleanupPanel` is a sibling hash-router route (`/cleanup`) to `SnoozePanel` (`/popup`) — not a mode inside `SnoozePanel`. The "Cleanup" button in `SnoozePanel`'s `AppTopBar` is a React Router `Link`. Tab closes happen directly from the popup via `chrome.tabs.remove`; triage history writes go through the service worker via `MSG_LOG_TRIAGE` (same single-writer pattern as snoozed tabs). Pure logic (dedup, grouping) lives in isolated files with full unit test coverage.

**Tech Stack:** React 18 + Flow + styled-components + MUI v5 + React Router v6 + Vitest + jsdom + Chrome MV3

---

## File Map

| File | Action | Responsibility |
|---|---|---|
| `src/core/messages.js` | Modify | Add `MSG_LOG_TRIAGE` constant |
| `src/core/settings.js` | Modify | Add `cleanupAutocloseDomains: []` to `DEFAULT_SETTINGS` |
| `src/custom-flow-defenitions/tabSnoozeFlowDefs.js` | Modify | Add `cleanupAutocloseDomains` to `Settings` exact type |
| `src/core/storage.js` | Modify | Add `getTriageHistory` / `appendTriageEntries` |
| `src/core/backgroundMain.js` | Modify | Handle `MSG_LOG_TRIAGE` message |
| `src/paths.js` | Modify | Add `CLEANUP_PATH = '/cleanup'` |
| `src/Router.jsx` | Modify | Add lazy `/cleanup` route |
| `src/components/CleanupPanel/autoProcess.js` | Create | Pure: dedup + domain auto-close logic |
| `src/components/CleanupPanel/groupTabs.js` | Create | Pure: flat / domain / age grouping |
| `src/components/CleanupPanel/SnoozeDropdown.jsx` | Create | Compact inline snooze menu (MUI Menu) |
| `src/components/CleanupPanel/index.jsx` | Create | Main triage UI component |
| `src/components/SnoozePanel/SnoozePanel.jsx` | Modify | Add `CleanupLink` to `AppTopBar`, hidden in single-tab mode |
| `src/components/OptionsPage/SleepingTabsPage.jsx` | Modify | Add Triage History section |
| `src/components/OptionsPage/DomainTagInput.jsx` | Create | Chip-based domain tag input |
| `src/components/OptionsPage/SettingsPage.jsx` | Modify | Add "Cleanup Mode" settings section |
| `src/__tests__/triageHistory.test.js` | Create | Tests for storage triage functions |
| `src/__tests__/cleanupAutoProcess.test.js` | Create | Tests for dedup + domain-close logic |
| `src/__tests__/cleanupGroupTabs.test.js` | Create | Tests for grouping logic |

---

### Task 1: Core data layer

**Files:**
- Modify: `src/core/messages.js`
- Modify: `src/core/settings.js`
- Modify: `src/custom-flow-defenitions/tabSnoozeFlowDefs.js`
- Modify: `src/core/storage.js`
- Modify: `src/core/backgroundMain.js`
- Create: `src/__tests__/triageHistory.test.js`

- [ ] **Step 1: Add MSG_LOG_TRIAGE to messages.js**

Replace the entire file content (add one line):

```js
// @flow

// Message action types for chrome.runtime.sendMessage communication.
// Used by popup/options → service worker, and SW → offscreen document.
export const MSG_SNOOZE_TAB = 'snoozeTab';
export const MSG_SNOOZE_TABS = 'snoozeTabs';
export const MSG_DELETE_SNOOZED_TABS = 'deleteSnoozedTabs';
export const MSG_PLAY_AUDIO = 'playAudio';
export const MSG_LOG_TRIAGE = 'logTriage';
```

- [ ] **Step 2: Add cleanupAutocloseDomains to settings.js**

In `src/core/settings.js`, add after the `singleTabMode` line in `DEFAULT_SETTINGS`:

```js
  // Cleanup mode
  cleanupAutocloseDomains: [],
```

- [ ] **Step 3: Add cleanupAutocloseDomains to the Settings Flow type**

In `src/custom-flow-defenitions/tabSnoozeFlowDefs.js`, add inside the `Settings` exact type, after `singleTabMode: boolean,`:

```js
  // Cleanup mode
  cleanupAutocloseDomains: Array<string>,
```

- [ ] **Step 4: Write failing tests for triage history storage**

Create `src/__tests__/triageHistory.test.js`:

```js
import { describe, it, expect, vi, beforeEach } from 'vitest';

vi.mock('../core/debugStorage', () => ({}));

import { getTriageHistory, appendTriageEntries } from '../core/storage';

describe('getTriageHistory', () => {
  beforeEach(() => vi.clearAllMocks());

  it('returns empty array when no history exists', async () => {
    chrome.storage.local.get.mockResolvedValue({});
    expect(await getTriageHistory()).toEqual([]);
  });

  it('returns stored entries', async () => {
    const entries = [{ url: 'https://a.com', title: 'A', favicon: '', closedAt: Date.now() }];
    chrome.storage.local.get.mockResolvedValue({ triageHistory: entries });
    expect(await getTriageHistory()).toEqual(entries);
  });
});

describe('appendTriageEntries', () => {
  beforeEach(() => vi.clearAllMocks());

  it('appends new entries to empty history', async () => {
    chrome.storage.local.get.mockResolvedValue({ triageHistory: [] });
    const entry = { url: 'https://a.com', title: 'A', favicon: '', closedAt: Date.now() };
    await appendTriageEntries([entry]);
    expect(chrome.storage.local.set).toHaveBeenCalledWith({
      triageHistory: [entry],
    });
  });

  it('prunes entries older than 24 hours before saving', async () => {
    const stale = { url: 'https://old.com', title: 'Old', favicon: '', closedAt: Date.now() - 25 * 60 * 60 * 1000 };
    const fresh = { url: 'https://fresh.com', title: 'Fresh', favicon: '', closedAt: Date.now() - 1000 };
    chrome.storage.local.get.mockResolvedValue({ triageHistory: [stale, fresh] });

    const newEntry = { url: 'https://new.com', title: 'New', favicon: '', closedAt: Date.now() };
    await appendTriageEntries([newEntry]);

    const [[saved]] = chrome.storage.local.set.mock.calls;
    expect(saved.triageHistory).not.toContainEqual(stale);
    expect(saved.triageHistory).toContainEqual(fresh);
    expect(saved.triageHistory).toContainEqual(newEntry);
  });

  it('appends multiple entries at once', async () => {
    chrome.storage.local.get.mockResolvedValue({ triageHistory: [] });
    const entries = [
      { url: 'https://a.com', title: 'A', favicon: '', closedAt: Date.now() },
      { url: 'https://b.com', title: 'B', favicon: '', closedAt: Date.now() },
    ];
    await appendTriageEntries(entries);
    const [[saved]] = chrome.storage.local.set.mock.calls;
    expect(saved.triageHistory).toHaveLength(2);
  });
});
```

- [ ] **Step 5: Run to confirm they fail**

```bash
npx vitest run src/__tests__/triageHistory.test.js
```

Expected: FAIL — `getTriageHistory` and `appendTriageEntries` not exported from storage.

- [ ] **Step 6: Implement triage history functions in storage.js**

Add after the `saveRecentlyWokenTabs` function in `src/core/storage.js`:

```js
export const STORAGE_KEY_TRIAGE_HISTORY = 'triageHistory';

const TWENTY_FOUR_HOURS_MS = 24 * 60 * 60 * 1000;

export async function getTriageHistory(): Promise<Array<Object>> {
  const { triageHistory } = await chrome.storage.local.get(STORAGE_KEY_TRIAGE_HISTORY);
  return triageHistory || [];
}

export function appendTriageEntries(entries: Array<Object>): Promise<void> {
  return withStorageLock(async () => {
    const existing = await getTriageHistory();
    const cutoff = Date.now() - TWENTY_FOUR_HOURS_MS;
    const fresh = existing.filter(e => e.closedAt > cutoff);
    await chrome.storage.local.set({
      [STORAGE_KEY_TRIAGE_HISTORY]: [...fresh, ...entries],
    });
  });
}
```

- [ ] **Step 7: Run to confirm they pass**

```bash
npx vitest run src/__tests__/triageHistory.test.js
```

Expected: PASS (4 tests).

- [ ] **Step 8: Handle MSG_LOG_TRIAGE in backgroundMain.js**

In `src/core/backgroundMain.js`, update the messages import:

```js
import { MSG_SNOOZE_TABS, MSG_DELETE_SNOOZED_TABS, MSG_LOG_TRIAGE } from './messages';
```

Update the storage import to include `appendTriageEntries`:

```js
import { saveRecentlyWokenTabs, appendTriageEntries } from './storage';
```

Add the handler inside `chrome.runtime.onMessage.addListener`, after the `MSG_DELETE_SNOOZED_TABS` block:

```js
    if (message.action === MSG_LOG_TRIAGE) {
      const { entries } = message;
      console.log(`📨 [SW] Received logTriage message for ${entries?.length} tab(s)`);
      appendTriageEntries(entries)
        .then(() => sendResponse({ success: true }))
        .catch(error => {
          console.error('appendTriageEntries message handler failed:', error);
          sendResponse({ success: false, error: error.message });
        });
      return true;
    }
```

- [ ] **Step 9: Run all tests**

```bash
npm test
```

Expected: All 62 existing tests pass + 4 new triage history tests = 66 total.

- [ ] **Step 10: Commit**

```bash
git add src/core/messages.js src/core/settings.js src/custom-flow-defenitions/tabSnoozeFlowDefs.js src/core/storage.js src/core/backgroundMain.js src/__tests__/triageHistory.test.js
git commit -m "feat: add MSG_LOG_TRIAGE, triage history storage, cleanupAutocloseDomains setting"
```

---

### Task 2: Auto-processing logic

**Files:**
- Create: `src/components/CleanupPanel/autoProcess.js`
- Create: `src/__tests__/cleanupAutoProcess.test.js`

- [ ] **Step 1: Write failing tests**

Create `src/__tests__/cleanupAutoProcess.test.js`:

```js
import { describe, it, expect } from 'vitest';
import { findDuplicates, filterAutoCloseDomains, runAutoProcess } from '../components/CleanupPanel/autoProcess';

describe('findDuplicates', () => {
  it('keeps all tabs when no duplicates exist', () => {
    const tabs = [
      { id: 1, url: 'https://a.com/page', lastAccessed: 1000 },
      { id: 2, url: 'https://b.com/page', lastAccessed: 2000 },
    ];
    const { keep, close } = findDuplicates(tabs);
    expect(keep).toHaveLength(2);
    expect(close).toHaveLength(0);
  });

  it('treats same URL with different query strings as duplicates', () => {
    const tabs = [
      { id: 1, url: 'https://a.com/page?q=1', lastAccessed: 1000 },
      { id: 2, url: 'https://a.com/page?q=2', lastAccessed: 2000 },
    ];
    const { keep, close } = findDuplicates(tabs);
    expect(keep).toHaveLength(1);
    expect(keep[0].id).toBe(2);
    expect(close[0].id).toBe(1);
  });

  it('keeps the tab with the highest lastAccessed among three duplicates', () => {
    const tabs = [
      { id: 1, url: 'https://a.com/page', lastAccessed: 3000 },
      { id: 2, url: 'https://a.com/page', lastAccessed: 1000 },
      { id: 3, url: 'https://a.com/page', lastAccessed: 2000 },
    ];
    const { keep, close } = findDuplicates(tabs);
    expect(keep).toHaveLength(1);
    expect(keep[0].id).toBe(1);
    expect(close.map(t => t.id).sort()).toEqual([2, 3]);
  });

  it('treats tabs with different URL hashes as distinct (only query string is stripped)', () => {
    const tabs = [
      { id: 1, url: 'https://a.com/page#section1', lastAccessed: 1000 },
      { id: 2, url: 'https://a.com/page#section2', lastAccessed: 2000 },
    ];
    const { keep, close } = findDuplicates(tabs);
    expect(keep).toHaveLength(2);
    expect(close).toHaveLength(0);
  });
});

describe('filterAutoCloseDomains', () => {
  it('closes tabs whose hostname exactly matches a configured domain', () => {
    const tabs = [
      { id: 1, url: 'https://mail.google.com/inbox' },
      { id: 2, url: 'https://github.com/issues' },
    ];
    const { keep, close } = filterAutoCloseDomains(tabs, ['mail.google.com']);
    expect(keep.map(t => t.id)).toEqual([2]);
    expect(close.map(t => t.id)).toEqual([1]);
  });

  it('returns all tabs as keep when domains list is empty', () => {
    const tabs = [{ id: 1, url: 'https://a.com/page' }];
    const { keep, close } = filterAutoCloseDomains(tabs, []);
    expect(keep).toHaveLength(1);
    expect(close).toHaveLength(0);
  });

  it('does not close a subdomain when only the parent domain is listed', () => {
    const tabs = [{ id: 1, url: 'https://mail.google.com/inbox' }];
    const { keep, close } = filterAutoCloseDomains(tabs, ['google.com']);
    expect(keep).toHaveLength(1);
    expect(close).toHaveLength(0);
  });

  it('keeps tabs with unparseable URLs rather than crashing', () => {
    const tabs = [{ id: 1, url: '' }];
    const { keep, close } = filterAutoCloseDomains(tabs, ['a.com']);
    expect(keep).toHaveLength(1);
    expect(close).toHaveLength(0);
  });
});

describe('runAutoProcess', () => {
  it('runs dedup then domain-close in sequence', async () => {
    const tabs = [
      { id: 1, url: 'https://mail.google.com/?q=1', lastAccessed: 2000 },
      { id: 2, url: 'https://mail.google.com/?q=2', lastAccessed: 1000 },
      { id: 3, url: 'https://github.com/issues', lastAccessed: 3000 },
    ];
    // Tab 1 survives dedup (higher lastAccessed) but is then domain-closed
    // Tab 2 closed by dedup
    // Tab 3 survives both
    const { remaining, closed } = await runAutoProcess(tabs, ['mail.google.com']);
    expect(remaining.map(t => t.id)).toEqual([3]);
    expect(closed.map(t => t.id).sort()).toEqual([1, 2]);
  });

  it('returns all tabs as remaining when there are no dupes and no auto-close domains', async () => {
    const tabs = [
      { id: 1, url: 'https://a.com', lastAccessed: 1000 },
      { id: 2, url: 'https://b.com', lastAccessed: 2000 },
    ];
    const { remaining, closed } = await runAutoProcess(tabs, []);
    expect(remaining).toHaveLength(2);
    expect(closed).toHaveLength(0);
  });
});
```

- [ ] **Step 2: Run to confirm they fail**

```bash
npx vitest run src/__tests__/cleanupAutoProcess.test.js
```

Expected: FAIL — module `../components/CleanupPanel/autoProcess` not found.

- [ ] **Step 3: Create autoProcess.js**

Create `src/components/CleanupPanel/autoProcess.js`:

```js
// @flow

function getDedupeKey(url: string): string {
  try {
    const u = new URL(url);
    return `${u.protocol}//${u.host}${u.pathname}`;
  } catch {
    return url;
  }
}

export function findDuplicates(tabs: Array<Object>): {| keep: Array<Object>, close: Array<Object> |} {
  const groups: Map<string, Array<Object>> = new Map();
  for (const tab of tabs) {
    const key = getDedupeKey(tab.url || '');
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key)?.push(tab);
  }

  const keep = [];
  const close = [];
  for (const group of groups.values()) {
    if (group.length === 1) {
      keep.push(group[0]);
    } else {
      const sorted = [...group].sort((a, b) => (b.lastAccessed || 0) - (a.lastAccessed || 0));
      keep.push(sorted[0]);
      close.push(...sorted.slice(1));
    }
  }
  return { keep, close };
}

export function filterAutoCloseDomains(
  tabs: Array<Object>,
  domains: Array<string>
): {| keep: Array<Object>, close: Array<Object> |} {
  if (domains.length === 0) return { keep: tabs, close: [] };
  const keep = [];
  const close = [];
  for (const tab of tabs) {
    try {
      const hostname = new URL(tab.url || '').hostname;
      if (domains.includes(hostname)) {
        close.push(tab);
      } else {
        keep.push(tab);
      }
    } catch {
      keep.push(tab);
    }
  }
  return { keep, close };
}

export async function runAutoProcess(
  tabs: Array<Object>,
  autoCloseDomains: Array<string>
): Promise<{| remaining: Array<Object>, closed: Array<Object> |}> {
  const { keep: dedupedTabs, close: dupes } = findDuplicates(tabs);
  const { keep: remaining, close: domainClosed } = filterAutoCloseDomains(dedupedTabs, autoCloseDomains);
  return { remaining, closed: [...dupes, ...domainClosed] };
}
```

- [ ] **Step 4: Run to confirm they pass**

```bash
npx vitest run src/__tests__/cleanupAutoProcess.test.js
```

Expected: PASS (9 tests).

- [ ] **Step 5: Commit**

```bash
git add src/components/CleanupPanel/autoProcess.js src/__tests__/cleanupAutoProcess.test.js
git commit -m "feat: add cleanup auto-processing logic (dedup by URL path, domain auto-close)"
```

---

### Task 3: Tab grouping logic

**Files:**
- Create: `src/components/CleanupPanel/groupTabs.js`
- Create: `src/__tests__/cleanupGroupTabs.test.js`

- [ ] **Step 1: Write failing tests**

Create `src/__tests__/cleanupGroupTabs.test.js`:

```js
import { describe, it, expect } from 'vitest';
import { groupTabs } from '../components/CleanupPanel/groupTabs';

const NOW = Date.now();
const DAY_MS = 24 * 60 * 60 * 1000;

const tabs = [
  { id: 1, url: 'https://github.com/issues', lastAccessed: NOW - 1000 },
  { id: 2, url: 'https://github.com/pulls', lastAccessed: NOW - 8 * DAY_MS },
  { id: 3, url: 'https://news.ycombinator.com/', lastAccessed: NOW - 3 * DAY_MS },
];

describe('groupTabs — flat', () => {
  it('returns a single group with an empty header containing all tabs', () => {
    const groups = groupTabs(tabs, 'flat');
    expect(groups).toHaveLength(1);
    expect(groups[0].header).toBe('');
    expect(groups[0].tabs).toHaveLength(3);
  });
});

describe('groupTabs — domain', () => {
  it('groups tabs by URL hostname', () => {
    const groups = groupTabs(tabs, 'domain');
    const headers = groups.map(g => g.header).sort();
    expect(headers).toEqual(['github.com', 'news.ycombinator.com'].sort());
  });

  it('puts both github tabs into the same group', () => {
    const groups = groupTabs(tabs, 'domain');
    const ghGroup = groups.find(g => g.header === 'github.com');
    expect(ghGroup?.tabs).toHaveLength(2);
  });
});

describe('groupTabs — age', () => {
  it('assigns tabs to the correct age buckets', () => {
    const groups = groupTabs(tabs, 'age');
    const today = groups.find(g => g.header === 'Opened today');
    const thisWeek = groups.find(g => g.header === 'Opened this week');
    const older = groups.find(g => g.header === 'Older');
    expect(today?.tabs.map(t => t.id)).toContain(1);
    expect(thisWeek?.tabs.map(t => t.id)).toContain(3);
    expect(older?.tabs.map(t => t.id)).toContain(2);
  });

  it('omits age buckets with no tabs', () => {
    const todayOnly = [{ id: 1, url: 'https://a.com', lastAccessed: NOW - 1000 }];
    const groups = groupTabs(todayOnly, 'age');
    expect(groups.every(g => g.tabs.length > 0)).toBe(true);
    expect(groups.some(g => g.header === 'Opened today')).toBe(true);
    expect(groups.some(g => g.header === 'Older')).toBe(false);
  });
});
```

- [ ] **Step 2: Run to confirm they fail**

```bash
npx vitest run src/__tests__/cleanupGroupTabs.test.js
```

Expected: FAIL — module not found.

- [ ] **Step 3: Create groupTabs.js**

Create `src/components/CleanupPanel/groupTabs.js`:

```js
// @flow

export type GroupBy = 'flat' | 'domain' | 'age';
export type TabGroup = {| header: string, tabs: Array<Object> |};

const DAY_MS = 24 * 60 * 60 * 1000;
const WEEK_MS = 7 * DAY_MS;

export function groupTabs(tabs: Array<Object>, groupBy: GroupBy): Array<TabGroup> {
  if (groupBy === 'flat') {
    return [{ header: '', tabs }];
  }

  if (groupBy === 'domain') {
    const map: Map<string, Array<Object>> = new Map();
    for (const tab of tabs) {
      let domain = '';
      try { domain = new URL(tab.url || '').hostname; } catch {}
      if (!map.has(domain)) map.set(domain, []);
      map.get(domain)?.push(tab);
    }
    return Array.from(map.entries()).map(([header, tabs]) => ({ header, tabs }));
  }

  // age
  const now = Date.now();
  const buckets: { [string]: Array<Object> } = {
    'Opened today': [],
    'Opened this week': [],
    'Older': [],
  };
  for (const tab of tabs) {
    const age = now - (tab.lastAccessed || 0);
    if (age < DAY_MS) buckets['Opened today'].push(tab);
    else if (age < WEEK_MS) buckets['Opened this week'].push(tab);
    else buckets['Older'].push(tab);
  }
  return Object.entries(buckets)
    .filter(([, t]) => t.length > 0)
    .map(([header, tabs]) => ({ header, tabs }));
}
```

- [ ] **Step 4: Run to confirm they pass**

```bash
npx vitest run src/__tests__/cleanupGroupTabs.test.js
```

Expected: PASS (6 tests).

- [ ] **Step 5: Run all tests**

```bash
npm test
```

Expected: All 66 tests + 6 new = 72 total pass.

- [ ] **Step 6: Commit**

```bash
git add src/components/CleanupPanel/groupTabs.js src/__tests__/cleanupGroupTabs.test.js
git commit -m "feat: add tab grouping logic (flat, domain, age)"
```

---

### Task 4: Routing

**Files:**
- Modify: `src/paths.js`
- Modify: `src/Router.jsx`
- Create: `src/components/CleanupPanel/index.jsx` (stub)

- [ ] **Step 1: Add CLEANUP_PATH to paths.js**

After the `POPUP_PATH` line in `src/paths.js`, add:

```js
export const CLEANUP_PATH = '/cleanup';
```

- [ ] **Step 2: Create stub CleanupPanel**

Create `src/components/CleanupPanel/index.jsx`:

```jsx
// @flow
import React from 'react';

export default function CleanupPanel(): React.Node {
  return <div style={{ padding: 16 }}>Cleanup Mode (stub)</div>;
}
```

- [ ] **Step 3: Wire the route in Router.jsx**

Add the lazy import alongside the others at the top of `src/Router.jsx`:

```js
const AsyncCleanupPanel = React.lazy(() =>
  import('./components/CleanupPanel')
);
```

Add `CLEANUP_PATH` to the import from `./paths`:

```js
import {
  POPUP_PATH,
  CLEANUP_PATH,
  OPTIONS_PATH,
  // ... rest unchanged
} from './paths';
```

Add the route after the `POPUP_PATH` route:

```jsx
<Route path={CLEANUP_PATH} element={<AsyncCleanupPanel />} />
```

- [ ] **Step 4: Build and verify**

```bash
npm run dev
```

Load the extension in Chrome. Open the popup, then in the Chrome DevTools console run `location.hash = '#/cleanup'`. The stub "Cleanup Mode (stub)" text should render without errors.

- [ ] **Step 5: Commit**

```bash
git add src/paths.js src/Router.jsx src/components/CleanupPanel/index.jsx
git commit -m "feat: add /cleanup route with stub CleanupPanel"
```

---

### Task 5: CleanupPanel — auto-processing, flat list, close action

**Files:**
- Modify: `src/components/CleanupPanel/index.jsx` (replace stub)

- [ ] **Step 1: Replace stub with full component**

Replace `src/components/CleanupPanel/index.jsx` entirely:

```jsx
// @flow
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import styled from 'styled-components';
import { styled as muiStyled } from '@mui/material/styles';
import { Helmet } from 'react-helmet-async';
import AppTopBar from '../AppTopBar';
import { POPUP_PATH } from '../../paths';
import { getSettings, DEFAULT_SETTINGS } from '../../core/settings';
import { filterSnoozableTabs } from '../../core/tabSelection';
import { runAutoProcess } from './autoProcess';
import { groupTabs } from './groupTabs';
import type { GroupBy } from './groupTabs';
import { MSG_LOG_TRIAGE, MSG_SNOOZE_TABS } from '../../core/messages';
import calcSnoozeOptions from '../SnoozePanel/calcSnoozeOptions';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import ListSubheader from '@mui/material/ListSubheader';
import IconButton from '@mui/material/IconButton';
import Button from '@mui/material/Button';
import CloseIcon from '@mui/icons-material/Close';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

async function logAndCloseTabs(tabs) {
  if (tabs.length === 0) return;
  const entries = tabs.map(tab => ({
    url: tab.url || '',
    title: tab.title || '',
    favicon: tab.favIconUrl || '',
    closedAt: Date.now(),
  }));
  const tabIds = tabs.map(t => t.id).filter(Boolean);
  await chrome.runtime.sendMessage({ action: MSG_LOG_TRIAGE, entries })
    .catch(err => console.error('Failed to log triage entries:', err));
  if (tabIds.length > 0) chrome.tabs.remove(tabIds);
}

export default function CleanupPanel(): React.Node {
  const navigate = useNavigate();
  const [tabs, setTabs] = useState([]);
  const [groupBy, setGroupBy] = useState<GroupBy>('flat');
  const [snoozeOptions, setSnoozeOptions] = useState(calcSnoozeOptions(DEFAULT_SETTINGS));
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const [settings, allTabs, highlighted] = await Promise.all([
        getSettings(),
        chrome.tabs.query({ currentWindow: true }),
        chrome.tabs.query({ highlighted: true, currentWindow: true }),
      ]);
      if (cancelled) return;

      const targetTabs = filterSnoozableTabs(
        highlighted.length > 1 ? highlighted : allTabs
      );
      const { remaining, closed } = await runAutoProcess(
        targetTabs,
        settings.cleanupAutocloseDomains || []
      );
      await logAndCloseTabs(closed);

      if (!cancelled) {
        setSnoozeOptions(calcSnoozeOptions(settings));
        setTabs(remaining);
        setReady(true);
      }
    })();
    return () => { cancelled = true; };
  }, []);

  useEffect(() => {
    if (!ready || tabs.length > 0) return;
    const id = setTimeout(() => navigate(POPUP_PATH), 1500);
    return () => clearTimeout(id);
  }, [ready, tabs.length, navigate]);

  const closeTab = useCallback(async (tab) => {
    await logAndCloseTabs([tab]);
    setTabs(prev => prev.filter(t => t.id !== tab.id));
  }, []);

  const snoozeTab = useCallback(async (tab, option) => {
    await chrome.runtime.sendMessage({
      action: MSG_SNOOZE_TABS,
      tabs: [{ url: tab.url, title: tab.title, favicon: tab.favIconUrl }],
      config: { type: option.id, wakeupTime: option.when.getTime(), closeTab: false },
    }).catch(err => console.error('Failed to snooze tab:', err));
    if (tab.id) chrome.tabs.remove([tab.id]);
    setTabs(prev => prev.filter(t => t.id !== tab.id));
  }, []);

  const closeGroup = useCallback(async (tabsToClose) => {
    await logAndCloseTabs(tabsToClose);
    const ids = new Set(tabsToClose.map(t => t.id));
    setTabs(prev => prev.filter(t => !ids.has(t.id)));
  }, []);

  const groups = useMemo(() => groupTabs(tabs, groupBy), [tabs, groupBy]);

  const cycleGroupBy = useCallback(() => {
    setGroupBy(prev =>
      prev === 'flat' ? 'domain' : prev === 'domain' ? 'age' : 'flat'
    );
  }, []);

  const groupByLabel =
    groupBy === 'flat' ? 'Group by...' :
    groupBy === 'domain' ? 'By domain' : 'By age';

  if (!ready) return null;

  return (
    <Root>
      <Helmet><title>Cleanup — Tab Snooze</title></Helmet>
      <AppTopBar
        actions={
          <TopBarActions>
            <GroupByToggle onClick={cycleGroupBy}>{groupByLabel}</GroupByToggle>
          </TopBarActions>
        }
      >
        <IconButton
          component={Link}
          to={POPUP_PATH}
          size="small"
          aria-label="Back to snooze panel"
          sx={{ padding: '2px', marginRight: '4px', color: '#fff' }}
        >
          <ArrowBackIcon sx={{ fontSize: 18 }} />
        </IconButton>
      </AppTopBar>

      {tabs.length === 0 ? (
        <EmptyState>All done!</EmptyState>
      ) : (
        <ScrollList>
          {groups.map((group, gi) => (
            <React.Fragment key={gi}>
              {groupBy !== 'flat' && (
                <GroupHeader disableSticky>
                  {group.header}
                  <CloseGroupBtn size="small" onClick={() => closeGroup(group.tabs)}>
                    Close all
                  </CloseGroupBtn>

                </GroupHeader>
              )}
              {group.tabs.map((tab, ti) => (
                <TabRow key={tab.id ?? ti} disableGutters>
                  <TabFavicon src={tab.favIconUrl} alt="" />
                  <ListItemText
                    primary={tab.title || tab.url}
                    primaryTypographyProps={{
                      noWrap: true,
                      style: { fontSize: 13, lineHeight: 1.4 },
                    }}
                  />
                  <TabActions>
                    {/* SnoozeDropdown wired in Task 7 */}
                    <IconButton
                      size="small"
                      onClick={() => closeTab(tab)}
                      aria-label="Close tab"
                    >
                      <CloseIcon sx={{ fontSize: 16 }} />
                    </IconButton>
                  </TabActions>
                </TabRow>
              ))}
            </React.Fragment>
          ))}
        </ScrollList>
      )}
    </Root>
  );
}

const Root = styled.div`
  position: relative;
  width: 390px;
  height: 509px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
`;

const ScrollList = styled(List)`
  flex: 1;
  overflow-y: auto;
  padding: 0 !important;
`;

const TabRow = muiStyled(ListItem)(() => ({
  height: 48,
  paddingLeft: 8,
  paddingRight: 4,
  display: 'flex',
  alignItems: 'center',
  gap: 6,
  borderBottom: '1px solid #f0f0f0',
}));

const TabFavicon = styled.img`
  width: 20px;
  height: 20px;
  min-width: 20px;
  border-radius: 3px;
  object-fit: cover;
`;

const TabActions = styled.div`
  display: flex;
  align-items: center;
  flex-shrink: 0;
  margin-left: auto;
`;

const EmptyState = styled.div`
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
  color: #bbb;
`;

const GroupHeader = muiStyled(ListSubheader)(({ theme }) => ({
  backgroundColor: theme.palette.background.paper,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  lineHeight: '36px',
  fontSize: 12,
  fontWeight: 600,
  color: '#666',
  paddingLeft: 8,
  paddingRight: 4,
}));

const CloseGroupBtn = muiStyled(Button)(() => ({
  fontSize: 11,
  padding: '2px 6px',
  minWidth: 0,
  color: '#999',
  textTransform: 'none',
}));

const TopBarActions = styled.div`
  display: flex;
  align-items: center;
`;

const GroupByToggle = styled.button`
  background: rgba(0, 0, 0, 0.15);
  border: none;
  cursor: pointer;
  font-size: 12px;
  font-weight: 500;
  color: #fff;
  padding: 2px 8px;
  border-radius: 4px;
  &:hover { background-color: rgba(0, 0, 0, 0.25); }
`;
```

- [ ] **Step 2: Build and manually test**

```bash
npm run dev
```

Load the extension in Chrome. Navigate to cleanup via DevTools console: `location.hash = '#/cleanup'`. Confirm:
- Tab list appears with favicon + title per row and an X button
- Clicking X closes the browser tab and removes the row immediately
- "Group by..." button cycles: By domain → By age → Group by... (→ repeat)
- Grouped views show sticky section headers with "Close all" buttons
- "Close all" closes the entire group's browser tabs at once
- When last tab is removed, "All done!" flashes then navigates back to the popup after 1.5s

- [ ] **Step 3: Commit**

```bash
git add src/components/CleanupPanel/index.jsx
git commit -m "feat: CleanupPanel — auto-processing, flat list, grouping, close action"
```

---

### Task 6: SnoozeDropdown component

**Files:**
- Create: `src/components/CleanupPanel/SnoozeDropdown.jsx`

- [ ] **Step 1: Create SnoozeDropdown.jsx**

```jsx
// @flow
import React, { useState, useCallback } from 'react';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import IconButton from '@mui/material/IconButton';
import AlarmIcon from '@mui/icons-material/Alarm';
import type { SnoozeOption } from '../SnoozePanel/calcSnoozeOptions';

type Props = {
  options: Array<SnoozeOption>,
  onSelect: (SnoozeOption) => void,
};

export default function SnoozeDropdown({ options, onSelect }: Props): React.Node {
  const [anchorEl, setAnchorEl] = useState(null);

  const handleOpen = useCallback((e) => {
    e.stopPropagation();
    setAnchorEl(e.currentTarget);
  }, []);

  const handleClose = useCallback(() => setAnchorEl(null), []);

  const handleSelect = useCallback((option: SnoozeOption) => {
    handleClose();
    onSelect(option);
  }, [handleClose, onSelect]);

  // Exclude Repeatedly and Pick a Date — they need a dialog, which doesn't fit this compact flow
  const schedulableOptions = options.filter(o => o.when != null);

  return (
    <>
      <IconButton size="small" onClick={handleOpen} aria-label="Snooze tab">
        <AlarmIcon sx={{ fontSize: 16 }} />
      </IconButton>
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        {schedulableOptions.map(opt => (
          <MenuItem key={opt.id} onClick={() => handleSelect(opt)} dense>
            {opt.title}
          </MenuItem>
        ))}
      </Menu>
    </>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add src/components/CleanupPanel/SnoozeDropdown.jsx
git commit -m "feat: add compact SnoozeDropdown for CleanupPanel"
```

---

### Task 7: Wire snooze into CleanupPanel rows

**Files:**
- Modify: `src/components/CleanupPanel/index.jsx`

- [ ] **Step 1: Import SnoozeDropdown and add to rows**

Add the import at the top of `src/components/CleanupPanel/index.jsx` (with the other local imports):

```js
import SnoozeDropdown from './SnoozeDropdown';
```

In the `TabActions` block inside the row render, replace the `{/* SnoozeDropdown wired in Task 7 */}` comment with:

```jsx
<TabActions>
  <SnoozeDropdown
    options={snoozeOptions}
    onSelect={opt => snoozeTab(tab, opt)}
  />
  <IconButton
    size="small"
    onClick={() => closeTab(tab)}
    aria-label="Close tab"
  >
    <CloseIcon sx={{ fontSize: 16 }} />
  </IconButton>
</TabActions>
```

- [ ] **Step 2: Build and manually test**

```bash
npm run dev
```

In the cleanup panel, confirm:
- Each row now has a clock (alarm) icon to the left of the X
- Clicking the clock opens a dropdown listing Later Today, Tomorrow, This Evening, This Weekend, Next Week, In a Month, Someday
- "Repeatedly" and "Pick a Date" are NOT in the list
- Selecting a snooze option closes the browser tab and removes the row
- The tab appears in the sleeping tabs list in Options

- [ ] **Step 3: Run all tests**

```bash
npm test
```

Expected: All 72 tests pass.

- [ ] **Step 4: Commit**

```bash
git add src/components/CleanupPanel/index.jsx
git commit -m "feat: wire SnoozeDropdown into CleanupPanel tab rows"
```

---

### Task 8: SnoozePanel — add Cleanup Link button

**Files:**
- Modify: `src/components/SnoozePanel/SnoozePanel.jsx`

- [ ] **Step 1: Add imports**

In `src/components/SnoozePanel/SnoozePanel.jsx`, add to the existing imports:

```js
import { Link } from 'react-router-dom';
import { CLEANUP_PATH } from '../../paths';
```

- [ ] **Step 2: Add the Cleanup button to TabControls**

In the `AppTopBar` `actions` prop, add `CleanupLink` after `SingleTabToggle`, conditionally hidden when `singleTabMode`:

```jsx
<TabControls>
  <TabCountLabel>
    {singleTabMode
      ? '1 tab'
      : `${targetTabs.length} tab${targetTabs.length !== 1 ? 's' : ''}`}
  </TabCountLabel>
  <SingleTabToggle
    onClick={toggleSingleTabMode}
    title={singleTabMode ? 'Switch to snooze all tabs in window' : 'Switch to snooze only this tab'}
    aria-label={singleTabMode ? 'Switch to snooze all tabs mode' : 'Switch to snooze this tab only'}
  >
    {singleTabMode ? '⇄ All tabs' : '⇄ Single tab'}
  </SingleTabToggle>
  {!singleTabMode && (
    <CleanupLink to={CLEANUP_PATH}>Cleanup</CleanupLink>
  )}
</TabControls>
```

- [ ] **Step 3: Add CleanupLink styled component**

Add alongside `SingleTabToggle` at the bottom of the file:

```js
const CleanupLink = styled(Link)`
  background: rgba(0, 0, 0, 0.15);
  border: none;
  cursor: pointer;
  font-size: 12px;
  font-weight: 500;
  color: #fff;
  padding: 2px 8px;
  border-radius: 4px;
  text-decoration: none;
  &:hover {
    background-color: rgba(0, 0, 0, 0.25);
  }
`;
```

- [ ] **Step 4: Build and manually test**

```bash
npm run dev
```

Open the extension popup. Confirm:
- In all-tabs mode: "Cleanup" appears in the top bar next to "⇄ Single tab"
- Clicking "Cleanup" navigates to the cleanup panel
- In single-tab mode: "Cleanup" is not visible
- The back arrow in CleanupPanel returns to the snooze popup

- [ ] **Step 5: Run all tests**

```bash
npm test
```

Expected: All 72 tests pass.

- [ ] **Step 6: Commit**

```bash
git add src/components/SnoozePanel/SnoozePanel.jsx
git commit -m "feat: add Cleanup link to SnoozePanel AppTopBar, hidden in single-tab mode"
```

---

### Task 9: Triage History in SleepingTabsPage

**Files:**
- Modify: `src/components/OptionsPage/SleepingTabsPage.jsx`

- [ ] **Step 1: Add getTriageHistory import and state**

In `src/components/OptionsPage/SleepingTabsPage.jsx`, add to the storage import:

```js
import { openTabs } from '../../core/wakeup';
import { MSG_DELETE_SNOOZED_TABS } from '../../core/messages';
import { getTriageHistory } from '../../core/storage';
```

Add state after `hidePeriodicState`:

```js
const [triageHistory, setTriageHistory] = useState([]);
```

- [ ] **Step 2: Add refreshTriageHistory and wire the storage listener**

Add alongside `refreshSnoozedTabs`:

```js
const refreshTriageHistory = useCallback(async () => {
  const history = await getTriageHistory();
  setTriageHistory(history);
}, []);
```

Update the `useEffect` to call both refresh functions and include `refreshTriageHistory` in the dependency array:

```js
useEffect(() => {
  refreshSnoozedTabs();
  refreshTriageHistory();

  const storageListener = () => {
    refreshSnoozedTabs();
    refreshTriageHistory();
  };

  chrome.storage.onChanged.addListener(storageListener);
  return () => {
    chrome.storage.onChanged.removeListener(storageListener);
  }
}, [refreshSnoozedTabs, refreshTriageHistory]);
```

- [ ] **Step 3: Add relative time helper and Triage History JSX**

Add this helper function inside the component body, before the `return`:

```js
const formatRelativeTime = (timestamp) => {
  const diff = Date.now() - timestamp;
  const minutes = Math.floor(diff / 60000);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(diff / 3600000);
  if (hours < 24) return `${hours}h ago`;
  return `${Math.floor(diff / 86400000)}d ago`;
};
```

In the returned JSX, add the section before `<NewTodoBtn />`:

```jsx
{triageHistory.length > 0 && (
  <TriageSection>
    <StyledListSubheader disableSticky>Triage History (last 24h)</StyledListSubheader>
    {[...triageHistory].reverse().map((entry, i) => (
      <StyledListItem
        key={i}
        button
        component="a"
        href={entry.url}
        target="_blank"
        rel="noopener noreferrer"
      >
        <TriageIcon src={entry.favicon} alt="" />
        <ListItemText
          primary={entry.title || entry.url}
          secondary={`${formatRelativeTime(entry.closedAt)} — ${entry.url}`}
          primaryTypographyProps={{ noWrap: true, style: { lineHeight: 1.4 } }}
          secondaryTypographyProps={{ noWrap: true, style: { fontSize: 11 } }}
        />
      </StyledListItem>
    ))}
  </TriageSection>
)}
```

Add styled components at the bottom of the file:

```js
const TriageSection = styled.div`
  margin-top: 8px;
  border-top: 1px solid #f0f0f0;
`;

const TriageIcon = styled.img`
  width: 20px;
  height: 20px;
  min-width: 20px;
  border-radius: 3px;
  margin-right: 10px;
  align-self: flex-start;
  margin-top: 6px;
`;
```

- [ ] **Step 4: Build and manually test**

```bash
npm run dev
```

Trigger cleanup mode, close a couple of tabs, then open Options → Sleeping Tabs. Confirm:
- A "Triage History (last 24h)" section appears at the bottom
- Each entry shows favicon, title, relative time, and URL as secondary text
- Entries are newest-first
- Clicking an entry opens the URL in a new tab
- The section is absent when no tabs have been triaged

- [ ] **Step 5: Run all tests**

```bash
npm test
```

Expected: All 72 tests pass.

- [ ] **Step 6: Commit**

```bash
git add src/components/OptionsPage/SleepingTabsPage.jsx
git commit -m "feat: add Triage History section to SleepingTabsPage"
```

---

### Task 10: Auto-close domains setting

**Files:**
- Create: `src/components/OptionsPage/DomainTagInput.jsx`
- Modify: `src/components/OptionsPage/SettingsPage.jsx`

- [ ] **Step 1: Create DomainTagInput.jsx**

```jsx
// @flow
import React, { useState, useCallback } from 'react';
import styled from 'styled-components';
import Chip from '@mui/material/Chip';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';

type Props = {
  domains: Array<string>,
  onChange: (Array<string>) => void,
};

export default function DomainTagInput({ domains, onChange }: Props): React.Node {
  const [inputValue, setInputValue] = useState('');

  const addDomain = useCallback(() => {
    const trimmed = inputValue.trim().toLowerCase();
    if (!trimmed || domains.includes(trimmed)) {
      setInputValue('');
      return;
    }
    onChange([...domains, trimmed]);
    setInputValue('');
  }, [inputValue, domains, onChange]);

  const removeDomain = useCallback((domain: string) => {
    onChange(domains.filter(d => d !== domain));
  }, [domains, onChange]);

  const handleKeyDown = useCallback((e: SyntheticKeyboardEvent<>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addDomain();
    }
  }, [addDomain]);

  return (
    <Root>
      <ChipList>
        {domains.map(domain => (
          <Chip
            key={domain}
            label={domain}
            size="small"
            onDelete={() => removeDomain(domain)}
          />
        ))}
        {domains.length === 0 && (
          <EmptyHint>No domains configured</EmptyHint>
        )}
      </ChipList>
      <InputRow>
        <TextField
          size="small"
          placeholder="e.g. mail.google.com"
          value={inputValue}
          onChange={e => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          variant="outlined"
          style={{ flex: 1 }}
        />
        <Button size="small" onClick={addDomain} variant="outlined">
          Add
        </Button>
      </InputRow>
    </Root>
  );
}

const Root = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 4px 0;
`;

const ChipList = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
  min-height: 24px;
`;

const InputRow = styled.div`
  display: flex;
  gap: 8px;
  align-items: center;
`;

const EmptyHint = styled.span`
  font-size: 12px;
  color: #bbb;
  align-self: center;
`;
```

- [ ] **Step 2: Add the Cleanup Mode section to SettingsPage.jsx**

Add to the imports at the top of `src/components/OptionsPage/SettingsPage.jsx`:

```js
import DomainTagInput from './DomainTagInput';
import FilterListIcon from '@mui/icons-material/FilterList';
```

Find the `<Header>Keyboard Shortcuts` block and insert the following **before** it:

```jsx
<Header>Cleanup Mode</Header>
<ListItem>
  <ListItemIcon><FilterListIcon /></ListItemIcon>
  <ListItemText
    primary="Auto-close domains"
    secondary="Tabs matching these hostnames are closed automatically when cleanup mode starts (exact match, e.g. mail.google.com)"
  />
</ListItem>
<ListItem>
  <DomainTagInput
    domains={settingsState.cleanupAutocloseDomains || []}
    onChange={(domains) => {
      const next = { ...settingsState, cleanupAutocloseDomains: domains };
      saveSettings(next);
      setSettingsState(next);
    }}
  />
</ListItem>
```

- [ ] **Step 3: Build and manually test**

```bash
npm run dev
```

Open Options → Settings, scroll to "Cleanup Mode". Confirm:
- An input + Add button appears with "No domains configured" hint
- Typing `mail.google.com` and pressing Enter creates a chip
- Typing a duplicate domain is silently ignored
- Clicking the X on a chip removes it
- Reopen settings — domain list persists
- Open cleanup mode — tabs from that domain are gone from the list before it renders

- [ ] **Step 4: Run all tests**

```bash
npm test
```

Expected: All 72 tests pass.

- [ ] **Step 5: Commit**

```bash
git add src/components/OptionsPage/DomainTagInput.jsx src/components/OptionsPage/SettingsPage.jsx
git commit -m "feat: add auto-close domains setting with DomainTagInput component"
```

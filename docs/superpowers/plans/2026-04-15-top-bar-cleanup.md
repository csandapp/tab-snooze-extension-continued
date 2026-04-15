# Top Bar Cleanup Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make the AppBar toolbar structure identical in SnoozePanel and OptionsPage so the logo never jumps when navigating between the two views.

**Architecture:** Extract a shared `AppTopBar` component that owns the AppBar, Toolbar, two-row layout, and the Spacer logic. Both SnoozePanel and OptionsPage render `AppTopBar` and pass their unique content via props: `children` (left side of row 1), `actions` (right side of row 1), and `hint` (right-aligned content for row 2). Row heights and spacing are defined once inside `AppTopBar`, guaranteeing visual consistency.

**Tech Stack:** React, styled-components, MUI AppBar/Toolbar

---

## Progress

- [x] **Task 1 — SnoozePanel spacer restructure** *(committed: `0523dd2`)*
- [x] **Task 2 — OptionsPage row height fix** *(committed: `c793b18`)*
- [x] **Patch — Width and hint-text fixes** *(committed: `130fa3b`)*

Remaining: Tasks 3–5 below.

---

### Task 3: Create shared `AppTopBar` component

**Files:**
- Create: `src/components/AppTopBar/index.jsx`

- [ ] **Step 1: Create the file**

```jsx
// @flow
import React from 'react';
import styled from 'styled-components';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import navbarLogo from '../OptionsPage/images/navbar_logo.svg';

type Props = {
  /** Left side of row 1. Always rendered immediately after the logo. */
  children?: React.Node,
  /** Right side of row 1 (pushed right by Spacer). */
  actions?: React.Node,
  /** Right-aligned content for row 2. Omit to render an empty row. */
  hint?: React.Node,
};

export default function AppTopBar({ children, actions, hint }: Props): React.Node {
  return (
    <AppBar position="relative" sx={{ zIndex: 1 }}>
      <TopBarToolbar>
        <MainRow>
          <Logo src={navbarLogo} />
          {children}
          <Spacer />
          {actions}
        </MainRow>
        <SecondRow>
          <Spacer />
          {hint}
        </SecondRow>
      </TopBarToolbar>
    </AppBar>
  );
}

const TopBarToolbar = styled(Toolbar)`
  flex-direction: column !important;
  align-items: stretch !important;
  padding: 6px 16px 4px !important;
  gap: 2px;
  min-height: auto !important;
  height: auto;
`;

const MainRow = styled.div`
  display: flex;
  align-items: center;
  min-height: 32px;
`;

const SecondRow = styled.div`
  display: flex;
  align-items: center;
  font-size: 11px;
  line-height: 1.5;
`;

const Logo = styled.img.attrs({ alt: '' })`
  height: 22px;
  flex-shrink: 0;
`;

const Spacer = styled.div`
  flex: 1;
`;
```

- [ ] **Step 2: Commit**

```bash
git add src/components/AppTopBar/index.jsx
git commit -m "feat(AppTopBar): shared top bar component"
```

---

### Task 4: Refactor SnoozePanel to use AppTopBar

**Files:**
- Modify: `src/components/SnoozePanel/SnoozePanel.jsx`

- [ ] **Step 1: Replace the AppBar block in JSX**

Remove the entire `<AppBar>…</AppBar>` block (roughly lines 240–265) and replace it with:

```jsx
import AppTopBar from '../AppTopBar';
```

Add to the existing imports at the top of the file, then in the render:

```jsx
<AppTopBar
  actions={
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
    </TabControls>
  }
  hint={<HintText>{MULTI_TAB_HINT}</HintText>}
/>
```

- [ ] **Step 2: Remove imports and styled components that are now owned by AppTopBar**

Remove these imports (no longer needed in SnoozePanel):
```js
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import navbarLogo from '../OptionsPage/images/navbar_logo.svg';
```

Remove these styled components (now in AppTopBar):
- `PanelToolbar`
- `PanelHeaderRow`
- `Logo`
- `Spacer`
- `HintRow`

Keep `HintText`, `TabControls`, `TabCountLabel`, `SingleTabToggle` — these are SnoozePanel-specific.

- [ ] **Step 3: Verify build compiles**

```bash
npm run build 2>&1 | grep -E 'error|warning|Error' | head -20
```

Expected: no errors.

- [ ] **Step 4: Commit**

```bash
git add src/components/SnoozePanel/SnoozePanel.jsx
git commit -m "refactor(SnoozePanel): use shared AppTopBar"
```

---

### Task 5: Refactor OptionsPage to use AppTopBar

**Files:**
- Modify: `src/components/OptionsPage/OptionsPage.jsx`

- [ ] **Step 1: Replace the AppBar block in JSX**

Remove the entire `<AppBar>…</AppBar>` block and replace it with:

```jsx
import AppTopBar from '../AppTopBar';
```

Add to imports, then in the render:

```jsx
<AppTopBar
  actions={
    <Tooltip title="Open in a tab">
      <StyledIconButton
        component={NavLink}
        to={location.pathname}
        target="_blank"
      >
        <OpenInNewIcon />
      </StyledIconButton>
    </Tooltip>
  }
>
  <NavButton component={NavLink} to={SLEEPING_TABS_PATH}>
    <StyledSleepingIcon /> Sleeping Tabs
  </NavButton>
  <NavButton component={NavLink} to={SETTINGS_PATH}>
    <StyledSettingsIcon /> Settings
  </NavButton>
</AppTopBar>
```

- [ ] **Step 2: Remove imports and styled components now owned by AppTopBar**

Remove these imports:
```js
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import navbarLogo from './images/navbar_logo.svg';
```

Remove these styled components (now in AppTopBar):
- `OptionsToolbar`
- `NavRow`
- `AlignmentRow`
- `Logo`
- `Spacer`

Keep `StyledSleepingIcon`, `StyledSettingsIcon`, `StyledIconButton`, `NavButton` — these are OptionsPage-specific.

- [ ] **Step 3: Verify build compiles**

```bash
npm run build 2>&1 | grep -E 'error|warning|Error' | head -20
```

Expected: no errors.

- [ ] **Step 4: Commit**

```bash
git add src/components/OptionsPage/OptionsPage.jsx
git commit -m "refactor(OptionsPage): use shared AppTopBar"
```

---

### Task 6: Visual verification

**Files:** none

- [ ] **Step 1: Run tests**

```bash
npm test
```

Expected: all 62 tests pass.

- [ ] **Step 2: Build and load in Chrome**

```bash
npm run dev
```

Load `./build/` as an unpacked extension. Check:
1. Popup logo is vertically centered in the bar.
2. Navigate to Options — logo is at the **exact same vertical position**, no jump.
3. Hint text ("⌘+click tabs…") is fully inside the bar and right-aligned.
4. OptionsPage second row is empty but the same height as SnoozePanel's.
5. Both pages are the same width.

# Top Bar Cleanup Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make the AppBar toolbar structure identical in SnoozePanel and OptionsPage so the logo never jumps when navigating between the two views.

**Architecture:** Both toolbars get the same two-row flex layout — row 1 uses an explicit `<Spacer>` child (not `justify-content: space-between`) and a fixed `min-height: 32px`; row 2 is a flex container with `height: 17px` and a leading `<Spacer>`, with optional right-side content. Both toolbars already share identical outer CSS so no outer changes are needed.

**Tech Stack:** React, styled-components, MUI AppBar/Toolbar

---

### Task 1: Restructure SnoozePanel toolbar rows

**Files:**
- Modify: `src/components/SnoozePanel/SnoozePanel.jsx`

No unit-testable logic changes. Verification is visual (step 5).

- [ ] **Step 1: Update `PanelHeaderRow` JSX — add `<Spacer>` before `<TabControls>`**

In `SnoozePanel.jsx`, find the `<PanelHeaderRow>` block (around line 242) and add a `<Spacer />` between `<Logo>` and `<TabControls>`:

```jsx
<PanelHeaderRow>
  <Logo src={navbarLogo} />
  <Spacer />
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
</PanelHeaderRow>
```

- [ ] **Step 2: Wrap `<HintText>` in a new `<HintRow>` with a leading `<Spacer>`**

Replace the standalone `<HintText>` line (around line 259) with:

```jsx
<HintRow>
  <Spacer />
  <HintText>{MULTI_TAB_HINT}</HintText>
</HintRow>
```

- [ ] **Step 3: Update styled components**

Replace the `PanelHeaderRow` and `HintText` definitions and add `HintRow` and `Spacer` (at the bottom of the file, alongside the other styled components):

```js
const PanelHeaderRow = styled.div`
  display: flex;
  align-items: center;
  min-height: 32px;
`;

const HintRow = styled.div`
  display: flex;
  align-items: center;
  height: 17px;
`;

const HintText = styled.div`
  font-size: 11px;
  color: #fff;
  opacity: 0.8;
`;

const Spacer = styled.div`
  flex: 1;
`;
```

Remove the old `PanelHeaderRow` definition (which had `justify-content: space-between`) and the old `HintText` definition (which had `text-align: right`).

- [ ] **Step 4: Commit**

```bash
git add src/components/SnoozePanel/SnoozePanel.jsx
git commit -m "refactor(SnoozePanel): uniform two-row toolbar with spacers"
```

---

### Task 2: Restructure OptionsPage toolbar rows

**Files:**
- Modify: `src/components/OptionsPage/OptionsPage.jsx`

No unit-testable logic changes. Verification is visual (step 4).

- [ ] **Step 1: Add `min-height: 32px` to `NavRow`**

Find the `NavRow` styled component (around line 117) and add `min-height: 32px`:

```js
const NavRow = styled.div`
  display: flex;
  align-items: center;
  min-height: 32px;
`;
```

- [ ] **Step 2: Replace `AlignmentRow` with a height-fixed flex row**

Find the `AlignmentRow` styled component (around line 122) and replace it:

```js
const AlignmentRow = styled.div`
  display: flex;
  align-items: center;
  height: 17px;
`;
```

- [ ] **Step 3: Commit**

```bash
git add src/components/OptionsPage/OptionsPage.jsx
git commit -m "refactor(OptionsPage): uniform two-row toolbar with fixed row heights"
```

---

### Task 3: Visual verification

**Files:** none

- [ ] **Step 1: Build in dev mode**

```bash
npm run dev
```

Expected: build completes with no errors.

- [ ] **Step 2: Load the extension and verify**

In Chrome, go to `chrome://extensions`, load `./build/` as an unpacked extension (or reload if already loaded).

Check:
1. Open the popup — the logo should be vertically centered in the top bar.
2. Click through to the Options page (sleeping tabs / settings) — the logo should be at the **exact same vertical position** as in the popup, with no jump.
3. The hint text ("⌘+click tabs…") in the popup should be right-aligned in the second row.
4. The OptionsPage second row should be empty but the same height as the SnoozePanel second row.

- [ ] **Step 3: Run tests to confirm no regressions**

```bash
npm test
```

Expected: all 62 tests pass.

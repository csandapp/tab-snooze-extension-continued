# Top Bar Cleanup Design

**Date:** 2026-04-15  
**Branch:** top-bar-cleanup  
**Scope:** `SnoozePanel.jsx`, `OptionsPage.jsx`

## Problem

The two AppBar toolbars are structurally inconsistent:

1. **Row 1 alignment technique differs** — SnoozePanel uses `justify-content: space-between` on `PanelHeaderRow`; OptionsPage uses an explicit `<Spacer>` flex child in `NavRow`.
2. **Row 2 structure differs** — SnoozePanel's `HintText` is a plain `div` with `text-align: right`; OptionsPage's `AlignmentRow` is an empty `div` with no flex context.
3. **Row 1 heights differ** — OptionsPage `NavButton` elements render ~33px tall (`font-size: 1.2rem`, `line-height: 1.5`, `padding: 2px 6px`); SnoozePanel row 1 is dominated by the Logo at 22px. This causes the logo to appear at a different vertical position when navigating between the two pages.

## Design

Both toolbars already share identical outer CSS (column flex, `padding: 6px 16px 4px`, `gap: 2px`, `min-height: auto`). No change needed there.

### Uniform row structure

Both toolbars will use the same two-row pattern:

```
Row 1: [Logo] [left items...] [<Spacer>] [right items]   — min-height: 32px, align-items: center
Row 2: [<Spacer>] [optional right content]                — height: 17px, align-items: center
```

This produces a fixed total toolbar height of **61px** (`6 + 32 + 2 + 17 + 4`), pinning the logo to the same absolute vertical position in both views.

### SnoozePanel.jsx changes

- `PanelHeaderRow`: remove `justify-content: space-between`, add `min-height: 32px`, insert `<Spacer>` before `<TabControls>` in JSX.
- Replace standalone `<HintText>` with a `<HintRow>` flex container (`height: 17px`, `align-items: center`) containing `<Spacer>` then `<HintText>`. Drop `text-align: right` from `HintText` (spacer handles alignment).

### OptionsPage.jsx changes

- `NavRow`: add `min-height: 32px` (spacer already present ✓).
- `AlignmentRow`: replace current implementation (`font-size: 11px; line-height: 1.5`) with a flex row (`height: 17px`, `align-items: center`, no content) — structurally mirrors SnoozePanel's `HintRow`.

## Non-goals

- No changes to item colors, fonts, or existing behavior.
- No shared component extraction — both toolbars remain self-contained.
- No changes outside the two AppBar toolbar structures.

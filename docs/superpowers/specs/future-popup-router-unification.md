# Future: Popup Router Unification

**Status:** Deferred — not part of the cleanup-mode implementation

## The Problem

The sleeping tabs list (`SleepingTabsPage`) currently lives in `OptionsPage` at `/options/sleeping-tabs`. Cleanup Mode lives at `/cleanup` in the popup router. These are the same conceptual domain (tab management) but split across two surfaces.

The current split is: popup = act on open tabs, Options = manage snoozed tabs + settings. That's a defensible boundary, but it means a user must leave the popup and open the Options page to review snoozed tabs — a friction point as the popup grows into a fuller tab-management tool.

## The Goal

Move `SleepingTabsPage` and triage history into the popup router as first-class routes, making the popup a unified tab-management hub:

| Route | View |
|---|---|
| `/popup` | Snooze panel (current) |
| `/cleanup` | Cleanup/triage (cleanup-mode feature) |
| `/sleeping-tabs` | Currently at `/options/sleeping-tabs` |

The `OptionsPage` would become settings-only (`/options/settings`), and the `/options/sleeping-tabs` route would redirect to `/sleeping-tabs`.

## What a Future Agent Needs to Do

1. Add `SLEEPING_TABS_POPUP_PATH = '/sleeping-tabs'` to `src/paths.js`
2. Add the route to `src/Router.jsx` (lazy-loaded, same pattern as existing routes)
3. Move or copy `SleepingTabsPage` into `src/components/CleanupPanel/` or its own `src/components/SleepingTabsPanel/` — whichever feels more consistent with the structure at that time
4. Add a redirect from `/options/sleeping-tabs` → `/sleeping-tabs` in the Options router so existing deep links don't break
5. Add bottom navigation or tab bar to the popup so users can move between Snooze / Sleeping / Cleanup views without using the back button
6. Remove `SleepingTabsPage` from `OptionsPage` once the redirect is in place
7. Update `OptionsPage` index to only expose Settings

## Key Files at Time of Writing

- `src/components/OptionsPage/SleepingTabsPage.jsx` — the component to migrate
- `src/components/OptionsPage/OptionsPage.jsx` — remove sleeping tabs nav from here
- `src/Router.jsx` — add the new route
- `src/paths.js` — add the new path constant

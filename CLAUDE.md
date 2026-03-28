# CLAUDE.md

## Project Context

**Tab Snooze** — A Chrome extension that lets users temporarily "snooze" browser tabs, hiding them and automatically reopening them at a scheduled time. Supports one-time and recurring schedules, a snoozed tabs dashboard, todo management, keyboard shortcuts, and audio notifications.

This is a Chrome Extension (MV3) project using TypeScript. The main codebase involves service workers, popup UI, chrome.storage, chrome.alarms, and chrome.tabs APIs. There is no DOM access in the service worker context.

## Tech Stack

| Category | Technology |
|---|---|
| Build Tool | Vite 7 + @crxjs/vite-plugin (MV3 bundling) |
| UI Framework | React 18 |
| Routing | React Router DOM 7 (hash-based) |
| Component Library | Material UI (MUI) 7 + Emotion |
| Styling | Styled Components 6 |
| Date/Time | moment.js + React Day Picker 9 |
| Type Checking | TypeScript 5.9 (strict mode) |
| Testing | Vitest + @testing-library/react (jsdom) |
| Linting | ESLint 9 (flat config) |

## Architecture

Manifest V3 extension built around a Service Worker background script.

### Entry Points

- `index.html` — Single SPA container; all UI routes use hash routing (`#/popup`, `#/options/settings`, etc.)
- `src/core/backgroundMain.ts` — Service Worker entry (registers all listeners synchronously per MV3 requirement)
- `offscreen.html` + `src/core/offscreen.ts` — Isolated document for audio playback (Service Workers have no DOM)

### Key Layers

- `src/core/` — Service Worker and business logic
  - `backgroundMain.ts` — Lifecycle, alarms, keyboard commands
  - `snooze.ts` / `wakeup.ts` — Core snooze/wake logic
  - `storage.ts` — chrome.storage.local abstraction with promise-chain mutex
  - `settings.ts` — User preferences (badge, notification times, etc.)
  - `badge.ts` — Browser action badge management
  - `audio.ts` — Audio loading/playback via offscreen document
  - `utils.ts` — Tab creation, formatters, period calculations
- `src/components/` — React UI
  - `SnoozePanel/` — Main popup UI with snooze options grid
  - `OptionsPage/` — Settings + snoozed tabs dashboard
  - `TodoPage/` — Todo management
  - `dialogs/` — Modal dialogs (FirstSnooze, Tutorial, WhatsNew, SupportTS)
- `src/types/index.ts` — Domain types (`SnoozedTab`, `SnoozeConfig`, `SnoozePeriod`, `Settings`, etc.)

### Chrome APIs Used

tabs, alarms, storage, offscreen, commands, notifications, activeTab, idle

### Notable Patterns

- **Offscreen document** for audio playback (DOM requirement in a Service Worker world)
- **Promise-chain mutex** in storage.ts prevents concurrent write race conditions
- **Message retry logic** in wakeup.ts for offscreen document communication
- **Lazy-loaded components** via React.lazy() for popup, options, and dialogs
- **Dual theme system** — MUI theme + styled-components ThemeProvider with shared theme object
- **Hash-based routing** — All UI served from single index.html with `#/path` routes
- TypeScript strict mode with domain types in src/types/

## Development

```bash
npm start          # Dev server (Vite)
npm run build      # Production build → build/
npm test           # Vitest
npm run lint       # ESLint
npm run type-check # tsc --noEmit
```

Build output goes to `build/` (minification disabled for Chrome Web Store review). Path alias: `@` → `src/`.

## General Principles

When proposing solutions, start with the simplest approach.

## Workflow

Before editing code, confirm the approach with the user. Do not jump straight to editing files. When the user provides a hypothesis or context, address that specifically before exploring alternatives.

## Git & Branching

- `master` is the Chrome Web Store live branch
- `release/*` branches are used for new version work
- New feature/fix branches should be created from the current `release/*` branch
- PRs target the current release branch, not master
- master is updated on releases

Never commit without asking the user first. Always present the staged changes and proposed commit message, then wait for explicit approval before running `git commit`.

For commit messages: use conventional commits format with the scope. Do not use 'fix' when 'feat' is more appropriate. Keep closely related changes in a single commit unless explicitly asked to split. Always verify the commit type matches the actual change.

## Code Review & PRs

When reviewing code or writing PR descriptions, only describe what actually changed. Do not infer or assume root causes — ask the user to confirm before writing descriptions of bugs or fixes.
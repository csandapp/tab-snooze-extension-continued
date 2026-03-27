# CLAUDE.md

## Project Context

This is a Chrome Extension (MV3) project using TypeScript. The main codebase involves service workers, popup UI, chrome.storage, chrome.alarms, and chrome.tabs APIs. There is no DOM access in the service worker context.

Tab Snooze Chrome Extension
What it does: A Chrome extension that lets users temporarily "snooze" browser tabs — hiding them and automatically reopening them at a scheduled time. Supports one-time and recurring schedules, a snoozed tabs dashboard, todo management, keyboard shortcuts, and audio notifications.

Tech Stack
Category	Technology
Build Tool	Vite 7 + @crxjs/vite-plugin
UI Framework	React 18
Routing	React Router DOM 7
Component Library	Material UI (MUI) 7 + Emotion
Styling	Styled Components 6
Date/Time	moment.js + React Day Picker 9
Type Checking	TypeScript (strict mode)
Testing	Vitest + Testing Library
Linting	ESLint 9
Architecture
Manifest V3 extension built around a Service Worker background script.

Key layers:

src/core/backgroundMain.ts — Service Worker handling lifecycle, alarms, and keyboard commands
src/core/snooze.ts / wakeup.ts — Core snooze/wake logic
src/core/storage.ts — chrome.storage.local abstraction
src/components/SnoozePanel/ — Main popup UI
src/components/OptionsPage/ — Settings + snoozed tab management
public/offscreen.html — Isolated document for audio playback (required since Service Workers have no DOM)
Chrome APIs used: tabs, alarms, storage, offscreen, commands, notifications, activeTab, idle

Notable Patterns
Offscreen Document for audio playback (DOM requirement in a Service Worker world)
Lock-based race condition prevention for concurrent offscreen document creation
TypeScript strict mode with domain types in src/types/


## General Principles

When proposing solutions, start with the simplest approach.

## Workflow

Before editing code, confirm the approach with the user. Do not jump straight to editing files. When the user provides a hypothesis or context, address that specifically before exploring alternatives.

## Git & Commits

Never commit without asking the user first. Always present the staged changes and proposed commit message, then wait for explicit approval before running `git commit`.

For commit messages: use conventional commits format with the scope. Do not use 'fix' when 'feat' is more appropriate. Keep closely related changes in a single commit unless explicitly asked to split. Always verify the commit type matches the actual change.

## Code Review & PRs

When reviewing code or writing PR descriptions, only describe what actually changed. Do not infer or assume root causes — ask the user to confirm before writing descriptions of bugs or fixes.
# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project structure

This is a **pnpm workspace monorepo** (`pnpm-workspace.yaml`, root `.npmrc` sets `node-linker=hoisted` so Expo/Metro works under pnpm):

- `apps/mobile` — Expo (React Native + expo-router) app, targets iOS, Android, and Web. This is where almost all product code lives. Package name `@islam-pro/mobile`.
  - `apps/mobile/src-tauri` — Tauri (Rust) wrapper that ships the Expo web build as a native desktop app (`.dmg` / `.exe`).
- `apps/api` — Hono + TypeScript service (Node), package `@islam-pro/api`. Exposes `/api/health` and MongoDB-backed `/api/status`. **It is not the data source** for prayer times, Quran, or hadith content — the app does not currently call it.
- `packages/shared` — shared TypeScript types (`@islam-pro/shared`), imported by both `apps/api` and `apps/mobile` so the API contract stays in sync.

## Commands

Run from the repo root (pnpm). `corepack enable` first if pnpm is missing.

- `pnpm install` — install the whole workspace.
- `pnpm mobile` — start the Expo Metro dev server (then `w`/`i`/`a` for web/iOS/Android).
- `pnpm mobile:web` / `pnpm mobile:ios` / `pnpm mobile:android` — target a platform.
- `pnpm api` — run the Hono API in watch mode (`apps/api`, needs `apps/api/.env` with `MONGO_URL` / `DB_NAME`; Mongo is optional — `/api/health` works without it).
- `pnpm lint` — `expo lint` on the mobile app.
- `pnpm typecheck` — typecheck every package (`pnpm -r typecheck`).
- Desktop: `cd apps/mobile && pnpm desktop:build` (needs Rust + Tauri CLI).
- No test script is currently defined.

## Architecture

### State and theming
- `apps/mobile/src/context/AppContext.tsx` is the single global context — holds language, dark mode, and translation helper `t()`. Screens consume it via `useApp()`.
- `apps/mobile/src/constants/theme.ts` defines the color palette (`colors.gold`, `colors.backgroundDark/Light`, etc.) referenced throughout the UI instead of hardcoded colors.
- `apps/mobile/src/i18n/translations.ts` holds FR/EN/AR strings; `t('key')` from `AppContext` looks entries up here.

### Data layer
There is no custom backend for content — screens call public third-party APIs directly through `apps/mobile/src/services/*Service.ts` files:
- `prayerService.ts` / `calendarService.ts` — Aladhan API (`api.aladhan.com`) for prayer times and Hijri calendar.
- `quranService.ts` — AlQuran Cloud API (`api.alquran.cloud`) for Quran text/translations.
- `audioService.ts` — `cdn.islamic.network` for per-ayah recitation audio (Alafasy) and podcast/story audio.
- `hadithService.ts` — hadith-of-the-day content.
- Each new feature area should follow this same pattern: a dedicated `src/services/xService.ts` that a screen imports, rather than routing through `apps/api`.
- Types shared with the API belong in `packages/shared` (e.g. `PrayerTimes`, `HijriDate`), re-exported by the relevant service.

### Deployment
- **Render has been abandoned** (services deleted). The app is distributed as a mobile app and a desktop app, not a hosted website.
- **Mobile** (iOS/Android): EAS builds — `apps/mobile/app.json` already contains `extra.eas.projectId` and `owner`, so EAS builds should target that existing project rather than creating a new one.
- **Desktop** (macOS/Windows): Tauri bundles in `apps/mobile/src-tauri/target/release/bundle/`.

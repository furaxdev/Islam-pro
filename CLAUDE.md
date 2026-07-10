# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project structure

- `/frontend` — Expo (React Native + expo-router) app, targets iOS, Android, and Web. This is where almost all product code lives.
- `/backend` — FastAPI + MongoDB (motor/pymongo) service. Currently exposes only a `status` health-check endpoint and a source-code download endpoint under `/api`; it is not the data source for prayer times, Quran, or hadith content.
- `render.yaml` — Render.com deploy config: backend as a Python web service, frontend built via `expo export --platform web` and served as a static site.

## Commands

### Frontend (`cd frontend`)
- `yarn install` — install deps (project uses Yarn; `yarn.lock` is authoritative).
- `yarn start` / `npx expo start` — start Metro dev server.
- `yarn ios` / `yarn android` / `yarn web` — start targeting a specific platform.
- `yarn lint` — `expo lint` (ESLint via `eslint.config.js`).
- `yarn reset-project` — runs `scripts/reset-project.js`, moves current `app/` to `app-example/` and creates a blank `app/` (destructive; don't run unless explicitly asked).
- No test script is currently defined in `package.json`.

### Backend (`cd backend`)
- `pip install -r requirements.txt`
- `uvicorn server:app --reload` — run dev server (expects a `.env` with `MONGO_URL` and `DB_NAME`).
- Dev deps available: `pytest`, `black`, `isort`, `flake8`, `mypy` (no config files or test suite currently present, so run them ad hoc).

## Architecture

### Routing
File-based routing via `expo-router`. Top-level tab bar is defined in `app/(tabs)/_layout.tsx` with tabs: `index` (home), `prayer`, `quran`, `audio`, `qibla`, `dhikr`, `calendar`. Additional stack screens live outside the tab group: `surah/[id].tsx`, `audio/[id].tsx`, `settings.tsx`, `asma.tsx`, `dua.tsx`, `salah.tsx`, `wudu.tsx`.

### State and theming
- `src/context/AppContext.tsx` is the single global context — holds language, dark mode, and translation helper `t()`. Screens consume it via `useApp()`.
- `src/constants/theme.ts` defines the color palette (`colors.gold`, `colors.backgroundDark/Light`, etc.) referenced throughout the UI instead of hardcoded colors.
- `src/i18n/translations.ts` holds FR/EN/AR strings; `t('key')` from `AppContext` looks entries up here.

### Data layer
There is no custom backend for content — screens call public third-party APIs directly through `src/services/*Service.ts` files:
- `prayerService.ts` / `calendarService.ts` — Aladhan API (`api.aladhan.com`) for prayer times and Hijri calendar.
- `quranService.ts` — AlQuran Cloud API (`api.alquran.cloud`) for Quran text/translations.
- `audioService.ts` — `cdn.islamic.network` for per-ayah recitation audio (Alafasy) and podcast/story audio.
- `hadithService.ts` — hadith-of-the-day content.
- Each new feature area should follow this same pattern: a dedicated `src/services/xService.ts` that a screen imports, rather than routing through the FastAPI backend.

### Deployment
- `render.yaml` deploys backend and frontend-as-static-web to Render. Mobile (iOS/Android) distribution is handled separately via Expo/EAS, not by this Render config — `app.json` already contains `extra.eas.projectId` and `owner`, so EAS builds should target that existing project rather than creating a new one.

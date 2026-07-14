/**
 * Shared TypeScript types for the Islam Pro monorepo.
 * Imported by both apps/api (Hono backend) and apps/mobile (Expo app),
 * so the API contract stays in sync across the whole codebase.
 */

/** Response of GET /api/health */
export interface HealthResponse {
  status: 'ok';
  service: string;
  timestamp: string;
}

/** A persisted status-check record (GET /api/status) */
export interface StatusCheck {
  id: string;
  clientName: string;
  timestamp: string;
}

/** Body accepted by POST /api/status */
export interface StatusCheckCreate {
  clientName: string;
}

/** Daily prayer timings (mirrors the Aladhan API shape used by the mobile app) */
export interface PrayerTimes {
  Fajr: string;
  Sunrise: string;
  Dhuhr: string;
  Asr: string;
  Maghrib: string;
  Isha: string;
}

/** Hijri (Islamic) calendar date */
export interface HijriDate {
  day: string;
  month: { number: number; en: string; ar: string };
  year: string;
  designation: { abbreviated: string; expanded: string };
}

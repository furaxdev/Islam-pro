/**
 * © FuraxDev — github.com/furaxdev/Islam-pro
 * Licensed under PolyForm Noncommercial 1.0.0. Sig: 24c0c5cc
 */
import axios from 'axios';
// Shared API-contract types live in packages/shared so the API and the app
// stay in sync. Re-exported here to keep existing local imports working.
import type { PrayerTimes, HijriDate } from '@islam-pro/shared';

export type { PrayerTimes, HijriDate };

const ALADHAN_API = 'https://api.aladhan.com/v1';

export async function getPrayerTimesByCoords(
  latitude: number,
  longitude: number,
  date?: Date
): Promise<{ timings: PrayerTimes; hijri: HijriDate }> {
  const d = date || new Date();
  const dateStr = `${d.getDate().toString().padStart(2, '0')}-${(d.getMonth() + 1).toString().padStart(2, '0')}-${d.getFullYear()}`;
  
  const response = await axios.get(`${ALADHAN_API}/timings/${dateStr}`, {
    params: {
      latitude,
      longitude,
      method: 2, // Islamic Society of North America
    },
  });
  
  return {
    timings: response.data.data.timings,
    hijri: response.data.data.date.hijri,
  };
}

export function getNextPrayer(timings: PrayerTimes): { name: string; time: string; minutesLeft: number } {
  const now = new Date();
  const currentMinutes = now.getHours() * 60 + now.getMinutes();
  
  const prayers = [
    { name: 'Fajr', time: timings.Fajr },
    { name: 'Dhuhr', time: timings.Dhuhr },
    { name: 'Asr', time: timings.Asr },
    { name: 'Maghrib', time: timings.Maghrib },
    { name: 'Isha', time: timings.Isha },
  ];
  
  for (const prayer of prayers) {
    const [hours, minutes] = prayer.time.split(':').map(Number);
    const prayerMinutes = hours * 60 + minutes;
    
    if (prayerMinutes > currentMinutes) {
      return {
        name: prayer.name,
        time: prayer.time,
        minutesLeft: prayerMinutes - currentMinutes,
      };
    }
  }
  
  // If all prayers passed, next is Fajr tomorrow
  const [fajrHours, fajrMinutes] = timings.Fajr.split(':').map(Number);
  const fajrTotalMinutes = fajrHours * 60 + fajrMinutes;
  const minutesUntilMidnight = 24 * 60 - currentMinutes;
  
  return {
    name: 'Fajr',
    time: timings.Fajr,
    minutesLeft: minutesUntilMidnight + fajrTotalMinutes,
  };
}

// Jumu'ah replaces Dhuhr on Fridays, but its actual start time is set by
// each mosque, not calculable from a location like the other prayers — so
// this only tells callers WHEN to apply a user-provided override, never a
// time itself.
export function isJumuaDay(date: Date = new Date()): boolean {
  return date.getDay() === 5;
}

export function formatMinutesLeft(minutes: number): string {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  
  if (hours > 0) {
    return `${hours}h ${mins}min`;
  }
  return `${mins}min`;
}

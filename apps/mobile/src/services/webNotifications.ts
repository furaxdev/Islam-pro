import {
  isPermissionGranted,
  requestPermission,
  sendNotification,
} from '@tauri-apps/plugin-notification';

// Desktop/web notification path.
//
// expo-notifications has no web implementation (its native module is a no-op on
// web), so on the Tauri desktop build — which runs the Expo *web* bundle inside
// a WKWebView — none of the scheduled prayer notifications ever fire.
//
// The Tauri desktop build additionally can't rely on the browser's
// `Notification` API: WKWebView doesn't implement it, so `'Notification' in
// window` is false there and everything silently no-ops. Detect that case
// (Tauri injects `window.__TAURI_INTERNALS__`) and drive the real macOS
// notification center through the `tauri-plugin-notification` bridge instead.
// A plain browser preview (e.g. `expo export --platform web` served outside
// Tauri) still falls back to the standard Web Notification API.
//
// Two important limitations, inherent to running inside a webview rather than a
// real OS background service:
//   1. Scheduling is done with setTimeout, so notifications only fire while the
//      app window is actually open. Closing the app cancels everything.
//   2. Autoplaying the adhan requires a prior user gesture in the page. The
//      "test notification" button is itself a gesture, so its sound always
//      plays; the automatically-scheduled prayer sounds play too as long as the
//      user has interacted with the window at least once this session.

// Metro resolves an asset require() to a URL string on web.
const ADHAN_SOUND_URI: string = require('../../assets/sounds/adhan.wav');

// Track pending prayer timers so a reschedule can cancel the previous batch.
let scheduledTimers: ReturnType<typeof setTimeout>[] = [];

function isTauri(): boolean {
  return typeof window !== 'undefined' && '__TAURI_INTERNALS__' in window;
}

function hasNotificationApi(): boolean {
  return typeof window !== 'undefined' && 'Notification' in window;
}

export async function ensureWebPermission(): Promise<boolean> {
  if (isTauri()) {
    try {
      let granted = await isPermissionGranted();
      if (!granted) {
        granted = (await requestPermission()) === 'granted';
      }
      return granted;
    } catch {
      return false;
    }
  }
  if (!hasNotificationApi()) return false;
  if (Notification.permission === 'granted') return true;
  if (Notification.permission === 'denied') return false;
  try {
    const result = await Notification.requestPermission();
    return result === 'granted';
  } catch {
    return false;
  }
}

function playAdhan(): void {
  try {
    const audio = new Audio(ADHAN_SOUND_URI);
    audio.volume = 1;
    // Ignore autoplay rejections — the notification still shows either way.
    audio.play().catch(() => {});
  } catch {
    // ignore
  }
}

export async function showWebNotification(
  title: string,
  body: string,
  sound: boolean
): Promise<boolean> {
  const granted = await ensureWebPermission();
  if (!granted) return false;
  try {
    if (isTauri()) {
      sendNotification({ title, body });
    } else {
      // eslint-disable-next-line no-new
      new Notification(title, { body });
    }
    if (sound) playAdhan();
    return true;
  } catch {
    return false;
  }
}

export function cancelWebPrayerNotifications(): void {
  for (const t of scheduledTimers) clearTimeout(t);
  scheduledTimers = [];
}

interface WebPrayer {
  time: string; // "HH:MM"
  title: string;
}

/**
 * Schedules a setTimeout per prayer still to come today. Prayers whose time has
 * already passed are skipped (we don't reschedule them for tomorrow — the next
 * app open / data refresh does that).
 */
export function scheduleWebPrayerNotifications(
  prayers: WebPrayer[],
  body: string,
  sound: boolean
): void {
  cancelWebPrayerNotifications();
  if (!isTauri() && !hasNotificationApi()) return;

  const now = new Date();
  for (const prayer of prayers) {
    const [hour, minute] = prayer.time.substring(0, 5).split(':').map(Number);
    if (Number.isNaN(hour) || Number.isNaN(minute)) continue;

    const when = new Date();
    when.setHours(hour, minute, 0, 0);
    const delay = when.getTime() - now.getTime();
    if (delay <= 0) continue; // already passed today

    const timer = setTimeout(() => {
      void showWebNotification(prayer.title, body, sound);
    }, delay);
    scheduledTimers.push(timer);
  }
}

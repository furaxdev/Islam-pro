import {
  isPermissionGranted,
  requestPermission,
  sendNotification,
} from '@tauri-apps/plugin-notification';
import { ADHAN_SOUNDS, getAdhanSound } from '../data/adhanSounds';

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
// The plugin's `sound` option can't carry the adhan clip on macOS: its
// backend (notify-rust, on the legacy NSUserNotification API — the modern
// UNUserNotificationCenter path exists but isn't the default) only accepts
// *named system sounds* ("Glass", "Ping"...), silently playing nothing for
// an unrecognized name like a bundled file. So the adhan is played
// separately, through the Web Audio API (AudioContext) rather than an
// <audio> element — HTMLMediaElement playback is what macOS picks up as a
// Now Playing / Control Center media session; raw AudioContext buffer
// playback isn't a "media element" and doesn't get that treatment.
//
// Two important limitations, inherent to running inside a webview rather than a
// real OS background service:
//   1. Scheduling is done with setTimeout, so notifications only fire while the
//      app window is actually open. Closing the app cancels everything.
//   2. Autoplaying the adhan requires a prior user gesture in the page. The
//      "test notification" button is itself a gesture, so its sound always
//      plays; the automatically-scheduled prayer sounds play too as long as the
//      user has interacted with the window at least once this session.

// Metro resolves an asset require() to a URL string on web. Build a lookup
// from adhan id -> short-clip URL, keyed the same way ADHAN_SOUNDS is.
const ADHAN_SOUND_URIS: Record<string, string> = Object.fromEntries(
  ADHAN_SOUNDS.map((a) => [a.id, a.shortFile as unknown as string])
);

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

function playAdhan(soundId: string): void {
  try {
    const uri = ADHAN_SOUND_URIS[soundId] ?? ADHAN_SOUND_URIS[getAdhanSound(soundId).id];
    const audio = new Audio(uri);
    audio.volume = 1;
    // Ignore autoplay rejections — the notification still shows either way.
    audio.play().catch(() => {});
  } catch {
    // ignore
  }
}

// Tauri-only path (see file header): raw AudioContext buffer playback, not
// an <audio> element, so macOS doesn't surface it as a Now Playing session.
let audioCtx: AudioContext | null = null;
const adhanBufferPromises: Record<string, Promise<AudioBuffer | null>> = {};

function loadAdhanBuffer(ctx: AudioContext, soundId: string): Promise<AudioBuffer | null> {
  if (!adhanBufferPromises[soundId]) {
    const uri = ADHAN_SOUND_URIS[soundId] ?? ADHAN_SOUND_URIS[getAdhanSound(soundId).id];
    adhanBufferPromises[soundId] = fetch(uri)
      .then((res) => res.arrayBuffer())
      .then((data) => ctx.decodeAudioData(data))
      .catch(() => null);
  }
  return adhanBufferPromises[soundId];
}

async function playAdhanViaWebAudio(soundId: string): Promise<void> {
  try {
    const ctx = audioCtx ?? (audioCtx = new AudioContext());
    if (ctx.state === 'suspended') await ctx.resume().catch(() => {});
    const buffer = await loadAdhanBuffer(ctx, soundId);
    if (!buffer) return;
    const source = ctx.createBufferSource();
    source.buffer = buffer;
    source.connect(ctx.destination);
    source.start(0);
  } catch {
    // ignore
  }
}

export async function showWebNotification(
  title: string,
  body: string,
  sound: boolean,
  soundId: string = 'mecca'
): Promise<boolean> {
  const granted = await ensureWebPermission();
  if (!granted) return false;
  try {
    if (isTauri()) {
      sendNotification({ title, body });
      if (sound) void playAdhanViaWebAudio(soundId);
    } else {
      // eslint-disable-next-line no-new
      new Notification(title, { body });
      if (sound) playAdhan(soundId);
    }
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
  sound: boolean,
  soundId: string = 'mecca'
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
      void showWebNotification(prayer.title, body, sound, soundId);
    }, delay);
    scheduledTimers.push(timer);
  }
}

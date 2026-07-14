import * as Notifications from 'expo-notifications';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';
import { PrayerTimes } from './prayerService';

const STORAGE_KEY = 'lastPrayerTimings';
// Sunrise is intentionally excluded — it is not a prayer, just an informational time.
const PRAYER_ORDER: (keyof PrayerTimes)[] = ['Fajr', 'Dhuhr', 'Asr', 'Maghrib', 'Isha'];
const ANDROID_CHANNEL_ID = 'prayers';

/**
 * Must run once at app startup. Sets how notifications behave in foreground and
 * registers the Android notification channel (required for sound/importance).
 */
export async function configureNotifications(): Promise<void> {
  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowBanner: true,
      shouldShowList: true,
      shouldPlaySound: true,
      shouldSetBadge: false,
    }),
  });

  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync(ANDROID_CHANNEL_ID, {
      name: 'Prayer times',
      importance: Notifications.AndroidImportance.HIGH,
      sound: 'default',
      vibrationPattern: [0, 250, 250, 250],
    }).catch(() => {});
  }
}

export async function requestNotificationPermissions(): Promise<boolean> {
  const { status: existing } = await Notifications.getPermissionsAsync();
  let status = existing;
  if (existing !== 'granted') {
    const res = await Notifications.requestPermissionsAsync();
    status = res.status;
  }
  return status === 'granted';
}

/** Persist the latest fetched timings so settings toggles can reschedule later. */
export async function savePrayerTimings(timings: PrayerTimes): Promise<void> {
  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(timings)).catch(() => {});
}

async function getSavedTimings(): Promise<PrayerTimes | null> {
  try {
    const raw = await AsyncStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as PrayerTimes) : null;
  } catch {
    return null;
  }
}

interface SyncOptions {
  enabled: boolean;
  sound: boolean;
  labels: Record<string, string>;
  body: string;
  timings?: PrayerTimes | null;
}

/**
 * Cancels any previously scheduled prayer notifications and, if enabled,
 * schedules one daily-repeating notification per prayer at its time.
 */
async function syncPrayerNotifications(opts: SyncOptions): Promise<void> {
  await Notifications.cancelAllScheduledNotificationsAsync().catch(() => {});
  if (!opts.enabled) return;

  const timings = opts.timings ?? (await getSavedTimings());
  if (!timings) return;

  const granted = await requestNotificationPermissions();
  if (!granted) return;

  for (const key of PRAYER_ORDER) {
    const raw = timings[key];
    if (!raw) continue;
    const [hour, minute] = raw.substring(0, 5).split(':').map(Number);
    if (Number.isNaN(hour) || Number.isNaN(minute)) continue;

    await Notifications.scheduleNotificationAsync({
      content: {
        title: opts.labels[key] ?? String(key),
        body: opts.body,
        sound: opts.sound ? 'default' : undefined,
      },
      trigger: {
        type: Notifications.SchedulableTriggerInputTypes.DAILY,
        hour,
        minute,
        channelId: ANDROID_CHANNEL_ID,
      },
    }).catch(() => {});
  }
}

/**
 * High-level entry point used by screens. Builds localized prayer labels and
 * (re)schedules notifications. Pass fresh `timings` after a fetch, or omit to
 * reuse the last saved ones (e.g. when a settings toggle changes).
 */
export async function applyPrayerNotifications(
  translate: (key: any) => string,
  enabled: boolean,
  sound: boolean,
  timings?: PrayerTimes | null
): Promise<void> {
  const labels: Record<string, string> = {
    Fajr: translate('fajr'),
    Dhuhr: translate('dhuhr'),
    Asr: translate('asr'),
    Maghrib: translate('maghrib'),
    Isha: translate('isha'),
  };
  await syncPrayerNotifications({
    enabled,
    sound,
    labels,
    body: translate('prayerTimeNotifBody'),
    timings,
  });
}

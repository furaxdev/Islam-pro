import axios from 'axios';
import * as Location from 'expo-location';
import { withTimeout } from '../utils/withTimeout';

export interface Coords {
  latitude: number;
  longitude: number;
}

// The desktop (Tauri) build serves the app from a custom protocol, where the
// browser geolocation permission prompt often never fires (no secure origin,
// no OS entitlement), so requestForegroundPermissionsAsync() silently stays
// stuck instead of resolving to 'granted' or 'denied'. IP-based lookup gives
// an approximate location without needing that prompt at all.
async function getIpLocation(): Promise<Coords | null> {
  try {
    const { data } = await withTimeout(
      axios.get('https://ipapi.co/json/'),
      5000,
      'IP location lookup timed out'
    );
    if (typeof data?.latitude === 'number' && typeof data?.longitude === 'number') {
      return { latitude: data.latitude, longitude: data.longitude };
    }
    return null;
  } catch {
    return null;
  }
}

export async function getDeviceLocation(): Promise<Coords | null> {
  try {
    const { status } = await withTimeout(
      Location.requestForegroundPermissionsAsync(),
      8000,
      'Location permission timed out'
    );
    if (status === 'granted') {
      const loc = await withTimeout(
        Location.getCurrentPositionAsync({}),
        8000,
        'Location fix timed out'
      );
      return { latitude: loc.coords.latitude, longitude: loc.coords.longitude };
    }
  } catch {
    // fall through to IP-based lookup
  }

  return getIpLocation();
}

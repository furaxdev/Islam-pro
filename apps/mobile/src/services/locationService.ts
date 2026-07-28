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
//
// ipapi.co alone isn't reliable here: it echoes back the request's exact
// Origin instead of sending `*`, and that specific-origin response was
// observed failing with a generic "Network Error" from this app's webview
// (desktop/Tauri) even though the same request works fine from curl and
// from a plain browser — try wildcard-CORS providers first since those seem
// to be more consistently reachable from embedded/non-browser webviews.
const IP_PROVIDERS: Array<{ url: string; parse: (data: any) => Coords | null }> = [
  {
    url: 'https://get.geojs.io/v1/ip/geo.json',
    parse: (data) => {
      const lat = parseFloat(data?.latitude);
      const lon = parseFloat(data?.longitude);
      return Number.isFinite(lat) && Number.isFinite(lon) ? { latitude: lat, longitude: lon } : null;
    },
  },
  {
    url: 'https://ipwho.is/',
    parse: (data) => {
      if (data?.success === false) return null;
      const lat = Number(data?.latitude);
      const lon = Number(data?.longitude);
      return Number.isFinite(lat) && Number.isFinite(lon) ? { latitude: lat, longitude: lon } : null;
    },
  },
  {
    url: 'https://ipapi.co/json/',
    parse: (data) => {
      const lat = Number(data?.latitude);
      const lon = Number(data?.longitude);
      return Number.isFinite(lat) && Number.isFinite(lon) ? { latitude: lat, longitude: lon } : null;
    },
  },
];

async function getIpLocation(): Promise<Coords | null> {
  for (const provider of IP_PROVIDERS) {
    try {
      const { data } = await withTimeout(
        axios.get(provider.url),
        5000,
        'IP location lookup timed out'
      );
      const coords = provider.parse(data);
      if (coords) return coords;
    } catch {
      // try the next provider
    }
  }
  return null;
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

// expo-location's geocodeAsync throws unconditionally on web (unimplemented),
// so typed city search never found anything smaller than the hardcoded
// popular-cities list. Nominatim (OpenStreetMap) works on every platform and
// resolves villages that Aladhan's own city lookup wouldn't recognize either.
export async function geocodePlaceName(query: string): Promise<Coords | null> {
  try {
    const { data } = await withTimeout(
      axios.get('https://nominatim.openstreetmap.org/search', {
        params: { q: query, format: 'json', limit: 1 },
        headers: { 'Accept-Language': 'fr' },
      }),
      8000,
      'Geocoding timed out'
    );
    if (Array.isArray(data) && data.length > 0) {
      const { lat, lon } = data[0];
      return { latitude: parseFloat(lat), longitude: parseFloat(lon) };
    }
    return null;
  } catch {
    return null;
  }
}

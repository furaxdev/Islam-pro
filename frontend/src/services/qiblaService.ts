import * as Location from 'expo-location';

const KAABA_LAT = 21.4225;
const KAABA_LNG = 39.8262;

export interface QiblaDirection {
  angle: number;
  distanceKm: number;
  userLatitude: number;
  userLongitude: number;
}

function toRadians(deg: number): number {
  return (deg * Math.PI) / 180;
}

function toDegrees(rad: number): number {
  return (rad * 180) / Math.PI;
}

function computeQiblaAngle(lat: number, lng: number): number {
  const phiK = toRadians(KAABA_LAT);
  const lambdaK = toRadians(KAABA_LNG);
  const phi = toRadians(lat);
  const lambda = toRadians(lng);

  const y = Math.sin(lambdaK - lambda);
  const x =
    Math.cos(phi) * Math.tan(phiK) - Math.sin(phi) * Math.cos(lambdaK - lambda);

  const angle = toDegrees(Math.atan2(y, x));
  return (angle + 360) % 360;
}

function computeDistanceKm(lat: number, lng: number): number {
  const R = 6371;
  const dLat = toRadians(KAABA_LAT - lat);
  const dLng = toRadians(KAABA_LNG - lng);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRadians(lat)) * Math.cos(toRadians(KAABA_LAT)) * Math.sin(dLng / 2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

export async function getQiblaDirection(): Promise<QiblaDirection> {
  const { status } = await Location.requestForegroundPermissionsAsync();
  if (status !== 'granted') {
    throw new Error('Location permission not granted');
  }

  const location = await Location.getCurrentPositionAsync({});
  const { latitude, longitude } = location.coords;

  return {
    angle: computeQiblaAngle(latitude, longitude),
    distanceKm: computeDistanceKm(latitude, longitude),
    userLatitude: latitude,
    userLongitude: longitude,
  };
}

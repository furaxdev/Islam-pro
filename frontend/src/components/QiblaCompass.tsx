import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Magnetometer } from 'expo-sensors';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing } from '../constants/theme';
import { QiblaDirection } from '../services/qiblaService';

interface QiblaCompassProps {
  direction: QiblaDirection | null;
  darkMode: boolean;
}

function angleFromMagnetometer({ x, y }: { x: number; y: number; z: number }): number {
  let angle = Math.atan2(y, x) * (180 / Math.PI);
  angle = 90 - angle;
  return (angle + 360) % 360;
}

export default function QiblaCompass({ direction, darkMode }: QiblaCompassProps) {
  const [heading, setHeading] = useState(0);
  const [compassAvailable, setCompassAvailable] = useState<boolean | null>(null);

  useEffect(() => {
    let subscription: { remove: () => void } | undefined;

    Magnetometer.isAvailableAsync()
      .then((available) => {
        setCompassAvailable(available);
        if (!available) return;
        Magnetometer.setUpdateInterval(150);
        subscription = Magnetometer.addListener((data) => {
          setHeading(angleFromMagnetometer(data));
        });
      })
      .catch(() => setCompassAvailable(false));

    return () => subscription?.remove();
  }, []);

  const textColor = darkMode ? colors.textDark : colors.textLight;
  const textSecondary = darkMode ? colors.textSecondaryDark : colors.textSecondaryLight;

  if (!direction) {
    return null;
  }

  const needleRotation = direction.angle - heading;

  if (compassAvailable === false) {
    return (
      <View style={styles.container}>
        <View style={[styles.compass, { borderColor: textSecondary + '40' }]}>
          <Ionicons name="warning" size={32} color={colors.error} />
        </View>
        <Text style={[styles.angleText, { color: textColor }]}>
          Boussole non disponible sur cet appareil
        </Text>
        <Text style={[styles.distanceText, { color: textSecondary }]}>
          La direction de la Qibla est à {Math.round(direction.angle)}° depuis le Nord
        </Text>
        <Text style={[styles.distanceText, { color: textSecondary }]}>
          {Math.round(direction.distanceKm)} km de la Kaaba
        </Text>
        <Text style={[styles.sorryText, { color: textSecondary }]}>
          Nous sommes désolés pour cet imprévu. Qu'Allah vous soutienne.
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={[styles.compass, { borderColor: textSecondary + '40' }]}>
        <View style={[styles.compassInner, { transform: [{ rotate: `${-heading}deg` }] }]}>
          <Text style={[styles.cardinal, styles.north, { color: textColor }]}>N</Text>
          <Text style={[styles.cardinal, styles.east, { color: textSecondary }]}>E</Text>
          <Text style={[styles.cardinal, styles.south, { color: textSecondary }]}>S</Text>
          <Text style={[styles.cardinal, styles.west, { color: textSecondary }]}>O</Text>
        </View>

        <View style={[styles.needle, { transform: [{ rotate: `${needleRotation}deg` }] }]}>
          <Ionicons name="location" size={40} color={colors.gold} />
        </View>

        <View style={[styles.centerDot, { backgroundColor: colors.primary }]} />
      </View>

      <Text style={[styles.angleText, { color: textColor }]}>
        {Math.round(direction.angle)}° depuis le Nord
      </Text>
      <Text style={[styles.distanceText, { color: textSecondary }]}>
        {Math.round(direction.distanceKm)} km de la Kaaba
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { alignItems: 'center', paddingVertical: spacing.lg },
  compass: {
    width: 260,
    height: 260,
    borderRadius: 130,
    borderWidth: 3,
    justifyContent: 'center',
    alignItems: 'center',
  },
  compassInner: { ...StyleSheet.absoluteFillObject, justifyContent: 'center', alignItems: 'center' },
  cardinal: { position: 'absolute', fontSize: 16, fontWeight: '700' },
  north: { top: 12 },
  south: { bottom: 12 },
  east: { right: 12 },
  west: { left: 12 },
  needle: {
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
  },
  centerDot: { width: 10, height: 10, borderRadius: 5, position: 'absolute' },
  angleText: { fontSize: 20, fontWeight: '700', marginTop: spacing.lg },
  distanceText: { fontSize: 14, marginTop: spacing.xs },
  sorryText: { fontSize: 13, marginTop: spacing.md, fontStyle: 'italic', textAlign: 'center' },
});

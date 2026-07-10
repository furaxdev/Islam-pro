import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import * as Haptics from 'expo-haptics';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, borderRadius } from '../constants/theme';
import { Dhikr } from '../services/dhikrService';

interface TasbihCounterProps {
  dhikr: Dhikr;
  darkMode: boolean;
}

export default function TasbihCounter({ dhikr, darkMode }: TasbihCounterProps) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    setCount(0);
  }, [dhikr.id]);

  const textColor = darkMode ? colors.textDark : colors.textLight;
  const textSecondary = darkMode ? colors.textSecondaryDark : colors.textSecondaryLight;
  const cardBg = darkMode ? colors.cardDark : colors.cardLight;

  const cyclesCompleted = Math.floor(count / dhikr.targetCount);
  const progressInCycle = count % dhikr.targetCount;
  const progress = progressInCycle / dhikr.targetCount;

  const increment = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
    setCount((c) => c + 1);
  };

  const reset = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium).catch(() => {});
    setCount(0);
  };

  return (
    <View style={[styles.card, { backgroundColor: cardBg }]}>
      <Text style={[styles.arabic, { color: dhikr.color }]}>{dhikr.textAr}</Text>
      <Text style={[styles.meaning, { color: textSecondary }]}>{dhikr.meaning}</Text>

      <View style={[styles.progressRing, { borderColor: textSecondary + '30' }]}>
        <View
          style={[
            styles.progressFill,
            {
              borderColor: dhikr.color,
              transform: [{ rotate: `${progress * 360}deg` }],
            },
          ]}
        />
        <TouchableOpacity style={styles.counterButton} onPress={increment} activeOpacity={0.7}>
          <Text style={[styles.countText, { color: textColor }]}>{progressInCycle}</Text>
          <Text style={[styles.targetText, { color: textSecondary }]}>/ {dhikr.targetCount}</Text>
        </TouchableOpacity>
      </View>

      <Text style={[styles.totalText, { color: textSecondary }]}>
        Total: {count} {cyclesCompleted > 0 ? `(${cyclesCompleted} cycle${cyclesCompleted > 1 ? 's' : ''})` : ''}
      </Text>

      <TouchableOpacity style={[styles.resetButton, { borderColor: textSecondary + '40' }]} onPress={reset}>
        <Ionicons name="refresh" size={18} color={textSecondary} />
        <Text style={[styles.resetText, { color: textSecondary }]}>Réinitialiser</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    alignItems: 'center',
  },
  arabic: { fontSize: 26, fontWeight: '600', marginBottom: spacing.xs, textAlign: 'center' },
  meaning: { fontSize: 14, marginBottom: spacing.lg, textAlign: 'center' },
  progressRing: {
    width: 200,
    height: 200,
    borderRadius: 100,
    borderWidth: 6,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  progressFill: {
    position: 'absolute',
    width: 200,
    height: 200,
    borderRadius: 100,
    borderWidth: 6,
    borderLeftColor: 'transparent',
    borderBottomColor: 'transparent',
  },
  counterButton: {
    width: 160,
    height: 160,
    borderRadius: 80,
    justifyContent: 'center',
    alignItems: 'center',
  },
  countText: { fontSize: 48, fontWeight: '700' },
  targetText: { fontSize: 16 },
  totalText: { fontSize: 14, marginBottom: spacing.md },
  resetButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.full,
    borderWidth: 1,
  },
  resetText: { fontSize: 13, fontWeight: '600' },
});

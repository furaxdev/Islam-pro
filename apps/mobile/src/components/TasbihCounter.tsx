import React, { useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated } from 'react-native';
import Svg, { Circle } from 'react-native-svg';
import * as Haptics from 'expo-haptics';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, borderRadius } from '../constants/theme';
import { Dhikr } from '../services/dhikrService';
import { useApp } from '../context/AppContext';

// Progress-ring geometry. Radius leaves room for the stroke so it isn't clipped.
const RING_SIZE = 200;
const RING_STROKE = 8;
const RING_RADIUS = (RING_SIZE - RING_STROKE) / 2;
const RING_CIRCUMFERENCE = 2 * Math.PI * RING_RADIUS;

interface TasbihCounterProps {
  dhikr: Dhikr;
  darkMode: boolean;
}

export default function TasbihCounter({ dhikr, darkMode }: TasbihCounterProps) {
  const { t, language } = useApp();
  const [count, setCount] = useState(0);
  const glowOpacity = useRef(new Animated.Value(0)).current;

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
    const next = count + 1;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
    setCount(next);
    // Easter egg: a golden pulse at 99, a nod to the 99 Names of Allah.
    if (next === 99) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => {});
      Animated.sequence([
        Animated.timing(glowOpacity, { toValue: 0.4, duration: 300, useNativeDriver: true }),
        Animated.delay(700),
        Animated.timing(glowOpacity, { toValue: 0, duration: 600, useNativeDriver: true }),
      ]).start();
    }
  };

  const reset = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium).catch(() => {});
    setCount(0);
  };

  return (
    <View style={[styles.card, { backgroundColor: cardBg }]}>
      <Text style={[styles.arabic, { color: colors.gold }]}>
        {language === 'ar' ? dhikr.textAr : dhikr.transliteration}
      </Text>
      <Text style={[styles.meaning, { color: textSecondary }]}>{t(dhikr.meaningKey)}</Text>

      <View style={styles.progressRing}>
        <Svg width={RING_SIZE} height={RING_SIZE} style={StyleSheet.absoluteFill}>
          {/* Track */}
          <Circle
            cx={RING_SIZE / 2}
            cy={RING_SIZE / 2}
            r={RING_RADIUS}
            stroke={textSecondary + '30'}
            strokeWidth={RING_STROKE}
            fill="none"
          />
          {/* Progress arc — starts at top (rotated -90°) and fills clockwise */}
          <Circle
            cx={RING_SIZE / 2}
            cy={RING_SIZE / 2}
            r={RING_RADIUS}
            stroke={colors.gold}
            strokeWidth={RING_STROKE}
            fill="none"
            strokeLinecap="round"
            strokeDasharray={RING_CIRCUMFERENCE}
            strokeDashoffset={RING_CIRCUMFERENCE * (1 - progress)}
            transform={`rotate(-90 ${RING_SIZE / 2} ${RING_SIZE / 2})`}
          />
        </Svg>
        <TouchableOpacity style={styles.counterButton} onPress={increment} activeOpacity={0.7}>
          <Text style={[styles.countText, { color: textColor }]}>{progressInCycle}</Text>
          <Text style={[styles.targetText, { color: textSecondary }]}>/ {dhikr.targetCount}</Text>
        </TouchableOpacity>
      </View>

      <Text style={[styles.totalText, { color: textSecondary }]}>
        {t('total')}: {count} {cyclesCompleted > 0 ? `(${cyclesCompleted} ${cyclesCompleted > 1 ? t('cycles') : t('cycle')})` : ''}
      </Text>

      <TouchableOpacity style={[styles.resetButton, { borderColor: textSecondary + '40' }]} onPress={reset}>
        <Ionicons name="refresh" size={18} color={textSecondary} />
        <Text style={[styles.resetText, { color: textSecondary }]}>{t('reset')}</Text>
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
    width: RING_SIZE,
    height: RING_SIZE,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.md,
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

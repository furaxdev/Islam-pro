import React, { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSequence,
  Easing,
} from 'react-native-reanimated';
import { colors, spacing } from '../../constants/theme';
import StarrySky from './StarrySky';
import Crescent from './Crescent';

interface SplashStarryMoonProps {
  darkMode: boolean;
  label?: string;
}

export default function SplashStarryMoon({ darkMode, label }: SplashStarryMoonProps) {
  const translateY = useSharedValue(-140);
  const opacity = useSharedValue(0);

  useEffect(() => {
    translateY.value = withTiming(0, { duration: 1400, easing: Easing.out(Easing.cubic) });
    opacity.value = withSequence(
      withTiming(1, { duration: 900 }),
    );
  }, []);

  const moonStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
    opacity: opacity.value,
  }));

  const bgColor = darkMode ? colors.backgroundDark : '#0A1230';
  const textColor = '#FFFFFF';

  return (
    <View style={[styles.container, { backgroundColor: bgColor }]}>
      <StarrySky />
      <Animated.View style={moonStyle}>
        <Crescent size={96} bgColor={bgColor} />
      </Animated.View>
      <Text style={[styles.appName, { color: textColor }]}>Islam Pro</Text>
      {label ? <Text style={[styles.label, { color: textColor }]}>{label}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  appName: {
    fontSize: 22,
    fontWeight: '700',
    marginTop: spacing.xl,
    letterSpacing: 1,
  },
  label: {
    fontSize: 13,
    marginTop: spacing.sm,
    opacity: 0.6,
  },
});

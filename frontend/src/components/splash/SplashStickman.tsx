import React, { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withSequence,
  withTiming,
  withDelay,
  Easing,
} from 'react-native-reanimated';
import { colors, spacing } from '../../constants/theme';
import Crescent from './Crescent';

interface SplashStickmanProps {
  darkMode: boolean;
  label?: string;
}

const STAGE_W = 220;
const STAGE_H = 260;
const HAND_X = 150;
const HAND_Y = 150;
const MOON_X = 96;
const MOON_Y = 8;

export default function SplashStickman({ darkMode, label }: SplashStickmanProps) {
  const bgColor = darkMode ? colors.backgroundDark : colors.backgroundLight;
  const textColor = darkMode ? colors.textDark : colors.textLight;
  const figureColor = darkMode ? '#E8E8E8' : '#2A2A2A';

  const starX = useSharedValue(HAND_X);
  const starY = useSharedValue(HAND_Y);
  const starOpacity = useSharedValue(1);
  const starScale = useSharedValue(1);
  const armRotate = useSharedValue(0);

  useEffect(() => {
    const runCycle = () => {
      starX.value = HAND_X;
      starY.value = HAND_Y;
      starOpacity.value = 1;
      starScale.value = 1;
      armRotate.value = 0;

      armRotate.value = withDelay(400, withTiming(-18, { duration: 500, easing: Easing.out(Easing.ease) }));
      starX.value = withDelay(600, withTiming(MOON_X + 30, { duration: 900, easing: Easing.inOut(Easing.ease) }));
      starY.value = withDelay(600, withTiming(MOON_Y + 30, { duration: 900, easing: Easing.inOut(Easing.ease) }));
      starScale.value = withDelay(600, withSequence(
        withTiming(1.3, { duration: 300 }),
        withTiming(0, { duration: 600 })
      ));
      starOpacity.value = withDelay(1300, withTiming(0, { duration: 200 }));
    };

    runCycle();
    const interval = setInterval(runCycle, 2600);
    return () => clearInterval(interval);
  }, []);

  const starStyle = useAnimatedStyle(() => ({
    position: 'absolute',
    left: starX.value,
    top: starY.value,
    opacity: starOpacity.value,
    transform: [{ scale: starScale.value }],
  }));

  const armStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${armRotate.value}deg` }],
  }));

  return (
    <View style={[styles.container, { backgroundColor: bgColor }]}>
      <View style={{ width: STAGE_W, height: STAGE_H }}>
        <View style={{ position: 'absolute', left: MOON_X, top: MOON_Y }}>
          <Crescent size={64} bgColor={bgColor} />
        </View>

        {/* Stickman */}
        <View style={styles.stickman}>
          <View style={[styles.hat, { borderBottomColor: figureColor }]} />
          <View style={[styles.head, { borderColor: figureColor }]} />
          <View style={[styles.body, { backgroundColor: figureColor }]} />
          <Animated.View style={[styles.arm, { backgroundColor: figureColor }, armStyle]} />
          <View style={[styles.legLeft, { backgroundColor: figureColor }]} />
          <View style={[styles.legRight, { backgroundColor: figureColor }]} />
        </View>

        <Animated.View style={starStyle}>
          <Ionicons name="star" size={22} color={colors.gold} />
        </Animated.View>
      </View>

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
  stickman: {
    position: 'absolute',
    left: 96,
    top: 140,
    width: 60,
    height: 100,
  },
  hat: {
    position: 'absolute',
    top: -10,
    left: 6,
    width: 0,
    height: 0,
    borderLeftWidth: 10,
    borderRightWidth: 10,
    borderBottomWidth: 14,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
  },
  head: {
    position: 'absolute',
    top: 4,
    left: 4,
    width: 18,
    height: 18,
    borderRadius: 9,
    borderWidth: 2,
  },
  body: {
    position: 'absolute',
    top: 22,
    left: 6,
    width: 14,
    height: 34,
    borderRadius: 6,
  },
  arm: {
    position: 'absolute',
    top: 26,
    left: 18,
    width: 26,
    height: 5,
    borderRadius: 3,
  },
  legLeft: {
    position: 'absolute',
    top: 54,
    left: 6,
    width: 5,
    height: 24,
    borderRadius: 3,
    transform: [{ rotate: '10deg' }],
  },
  legRight: {
    position: 'absolute',
    top: 54,
    left: 14,
    width: 5,
    height: 24,
    borderRadius: 3,
    transform: [{ rotate: '-6deg' }],
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

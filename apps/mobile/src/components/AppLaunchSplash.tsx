import React, { useEffect, useState } from 'react';
import { StyleSheet } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  Easing,
  runOnJS,
} from 'react-native-reanimated';
import LoadingSplash from './LoadingSplash';
import { colors } from '../constants/theme';

interface AppLaunchSplashProps {
  darkMode: boolean;
  ready: boolean;
  onFinish: () => void;
}

// How long the launch animation stays up at minimum, even if the app is
// ready instantly — long enough to read as intentional, not a stutter.
const MIN_DURATION_MS = 1600;
const EXIT_DURATION_MS = 450;

export default function AppLaunchSplash({ darkMode, ready, onFinish }: AppLaunchSplashProps) {
  const [minDurationElapsed, setMinDurationElapsed] = useState(false);
  const opacity = useSharedValue(1);

  useEffect(() => {
    const timer = setTimeout(() => setMinDurationElapsed(true), MIN_DURATION_MS);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!ready || !minDurationElapsed) return;
    opacity.value = withTiming(
      0,
      { duration: EXIT_DURATION_MS, easing: Easing.in(Easing.cubic) },
      (finished) => {
        if (finished) runOnJS(onFinish)();
      }
    );
  }, [ready, minDurationElapsed]);

  const containerStyle = useAnimatedStyle(() => ({ opacity: opacity.value }));
  const bgColor = darkMode ? colors.backgroundDark : colors.backgroundLight;

  return (
    <Animated.View style={[styles.overlay, { backgroundColor: bgColor }, containerStyle]}>
      <LoadingSplash darkMode={darkMode} />
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 999,
    elevation: 999,
  },
});

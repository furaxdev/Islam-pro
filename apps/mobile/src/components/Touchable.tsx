import React, { useState } from 'react';
import { Platform, StyleProp, ViewStyle } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
  withSpring,
  Easing,
} from 'react-native-reanimated';
import { Pressable, PressableProps } from 'react-native';

interface TouchableProps extends PressableProps {
  style?: StyleProp<ViewStyle> | ((state: { pressed: boolean; hovered: boolean }) => StyleProp<ViewStyle>);
  children?: React.ReactNode;
}

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export default function Touchable({ style, children, onPress, ...rest }: TouchableProps) {
  const scale = useSharedValue(1);
  const [hovered, setHovered] = useState(false);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePressIn = () => {
    // Quick, decisive shrink on press — no bounce, just a snappy response.
    scale.value = withTiming(0.96, { duration: 90, easing: Easing.out(Easing.quad) });
  };

  const handlePressOut = () => {
    // Gentle spring back on release for a natural, premium settle instead
    // of a linear snap to 1.
    scale.value = withSpring(1, { damping: 14, stiffness: 220, mass: 0.5 });
  };

  const resolvedStyle = ({ pressed }: { pressed: boolean }) => [
    typeof style === 'function' ? style({ pressed, hovered }) : style,
    Platform.OS === 'web' && hovered ? { opacity: 0.85 } : null,
  ];

  return (
    <AnimatedPressable
      style={[animatedStyle, resolvedStyle({ pressed: false })]}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      onPress={onPress}
      {...(Platform.OS === 'web'
        ? {
            onHoverIn: () => setHovered(true),
            onHoverOut: () => setHovered(false),
          }
        : {})}
      {...rest}
    >
      {children}
    </AnimatedPressable>
  );
}

import React, { useState } from 'react';
import { Platform, StyleProp, ViewStyle } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
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
    scale.value = withTiming(0.96, { duration: 100 });
  };

  const handlePressOut = () => {
    scale.value = withTiming(1, { duration: 150 });
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

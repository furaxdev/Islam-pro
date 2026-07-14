import React from 'react';
import { View, StyleSheet } from 'react-native';
import { colors } from '../../constants/theme';

interface CrescentProps {
  size?: number;
  bgColor: string;
  color?: string;
}

export default function Crescent({ size = 80, bgColor, color = colors.gold }: CrescentProps) {
  const cutSize = size * 0.8;
  return (
    <View style={[styles.outer, { width: size, height: size, borderRadius: size / 2, backgroundColor: color }]}>
      <View
        style={[
          styles.cut,
          {
            width: cutSize,
            height: cutSize,
            borderRadius: cutSize / 2,
            backgroundColor: bgColor,
            top: size * 0.08,
            left: size * 0.28,
          },
        ]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  outer: {
    overflow: 'hidden',
  },
  cut: {
    position: 'absolute',
  },
});

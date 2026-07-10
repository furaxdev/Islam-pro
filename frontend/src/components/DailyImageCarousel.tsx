import React from 'react';
import { View, Text, StyleSheet, ScrollView, Dimensions } from 'react-native';
import { Image } from 'expo-image';
import { colors, spacing, borderRadius } from '../constants/theme';
import { DailyImage } from '../services/calendarService';

interface DailyImageCarouselProps {
  images: DailyImage[];
  darkMode: boolean;
}

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const CARD_WIDTH = SCREEN_WIDTH - spacing.md * 2 - spacing.md * 2;

export default function DailyImageCarousel({ images, darkMode }: DailyImageCarouselProps) {
  const textSecondary = darkMode ? colors.textSecondaryDark : colors.textSecondaryLight;

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.container}
      snapToInterval={CARD_WIDTH + spacing.md}
      decelerationRate="fast"
    >
      {images.map((image) => (
        <View key={image.id} style={[styles.card, { width: CARD_WIDTH }]}>
          <Image
            source={{ uri: image.uri }}
            style={styles.image}
            contentFit="cover"
            transition={200}
          />
          <Text style={[styles.caption, { color: textSecondary }]} numberOfLines={1}>
            {image.caption}
          </Text>
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { paddingHorizontal: spacing.md, gap: spacing.md },
  card: { marginRight: spacing.md },
  image: {
    width: '100%',
    height: 160,
    borderRadius: borderRadius.lg,
  },
  caption: { fontSize: 12, marginTop: spacing.xs },
});

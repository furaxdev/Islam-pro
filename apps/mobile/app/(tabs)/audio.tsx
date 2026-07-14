import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useApp } from '../../src/context/AppContext';
import { colors, spacing, borderRadius, shadows } from '../../src/constants/theme';
import {
  prophetStories,
  sleepStories,
  islamicPodcasts,
  AudioContent,
} from '../../src/services/audioService';
import Touchable from '../../src/components/Touchable';

type Category = 'all' | 'prophet' | 'sleep' | 'lecture';

export default function AudioScreen() {
  const { t, darkMode, language } = useApp();
  const router = useRouter();
  const [selectedCategory, setSelectedCategory] = useState<Category>('all');

  const bgColor = darkMode ? colors.backgroundDark : colors.backgroundLight;
  const cardBg = darkMode ? colors.cardDark : colors.cardLight;
  const textColor = darkMode ? colors.textDark : colors.textLight;
  const textSecondary = darkMode ? colors.textSecondaryDark : colors.textSecondaryLight;

  const categories: { id: Category; label: string; icon: string }[] = [
    { id: 'all', label: t('podcasts'), icon: 'apps' },
    { id: 'prophet', label: t('prophetStories'), icon: 'people' },
    { id: 'sleep', label: t('sleepStories'), icon: 'moon' },
    { id: 'lecture', label: t('lectures'), icon: 'school' },
  ];

  const getContent = (): AudioContent[] => {
    switch (selectedCategory) {
      case 'prophet':
        return prophetStories;
      case 'sleep':
        return sleepStories;
      case 'lecture':
        return islamicPodcasts;
      default:
        return [...prophetStories, ...sleepStories, ...islamicPodcasts];
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'prophet':
        return colors.primary;
      case 'sleep':
        return colors.maghrib;
      case 'lecture':
        return colors.gold;
      default:
        return colors.info;
    }
  };

  const renderAudioItem = (item: AudioContent) => (
    <Touchable
      key={item.id}
      style={[styles.audioItem, { backgroundColor: cardBg }, shadows.sm]}
      onPress={() => router.push(`/audio/${item.id}`)}
    >
      <View style={[styles.audioIcon, { backgroundColor: getCategoryColor(item.category) }]}>
        <Ionicons
          name={
            item.category === 'prophet'
              ? 'people'
              : item.category === 'sleep'
              ? 'moon'
              : 'headset'
          }
          size={28}
          color="#FFF"
        />
      </View>
      
      <View style={styles.audioInfo}>
        <Text style={[styles.audioTitle, { color: textColor }]} numberOfLines={2}>
          {language === 'ar' && item.titleAr ? item.titleAr : item.title}
        </Text>
        <Text style={[styles.audioDescription, { color: textSecondary }]} numberOfLines={1}>
          {language === 'ar' && item.descriptionAr ? item.descriptionAr : item.description}
        </Text>
        <View style={styles.audioMeta}>
          {item.speaker && (
            <>
              <Ionicons name="person-outline" size={14} color={colors.gold} />
              <Text style={[styles.audioSpeaker, { color: colors.gold }]}>
                {item.speaker}
              </Text>
              <Text style={{ color: textSecondary }}> • </Text>
            </>
          )}
          <Ionicons name="time-outline" size={14} color={textSecondary} />
          <Text style={[styles.audioDuration, { color: textSecondary }]}>
            {item.duration}
          </Text>
        </View>
      </View>
      
      <View style={styles.playButton}>
        <Ionicons name="play-circle" size={44} color={colors.gold} />
      </View>
    </Touchable>
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: bgColor }]} edges={['top']}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: textColor }]}>{t('islamicPodcasts')}</Text>
      </View>

      {/* Category Tabs */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.categoryScroll}
        contentContainerStyle={styles.categoryContainer}
      >
        {categories.map((cat) => (
          <Touchable
            key={cat.id}
            style={[
              styles.categoryTab,
              {
                backgroundColor:
                  selectedCategory === cat.id ? colors.primary : cardBg,
              },
            ]}
            onPress={() => setSelectedCategory(cat.id)}
          >
            <Ionicons
              name={cat.icon as any}
              size={18}
              color={selectedCategory === cat.id ? '#FFF' : textSecondary}
            />
            <Text
              style={[
                styles.categoryLabel,
                {
                  color: selectedCategory === cat.id ? '#FFF' : textColor,
                },
              ]}
            >
              {cat.label}
            </Text>
          </Touchable>
        ))}
      </ScrollView>

      {/* Audio Content List */}
      <ScrollView
        style={styles.contentScroll}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        {getContent().map(renderAudioItem)}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    padding: spacing.md,
    paddingBottom: spacing.sm,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
  },
  categoryScroll: {
    flexGrow: 0,
  },
  categoryContainer: {
    paddingHorizontal: spacing.md,
    paddingBottom: spacing.md,
    gap: spacing.sm,
  },
  categoryTab: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.full,
    gap: spacing.xs,
  },
  categoryLabel: {
    fontSize: 14,
    fontWeight: '600',
  },
  contentScroll: {
    flex: 1,
  },
  contentContainer: {
    padding: spacing.md,
    paddingTop: 0,
    paddingBottom: spacing.xxl,
  },
  audioItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.md,
    borderRadius: borderRadius.lg,
    marginBottom: spacing.md,
  },
  audioIcon: {
    width: 56,
    height: 56,
    borderRadius: borderRadius.md,
    justifyContent: 'center',
    alignItems: 'center',
  },
  audioInfo: {
    flex: 1,
    marginLeft: spacing.md,
    marginRight: spacing.sm,
  },
  audioTitle: {
    fontSize: 15,
    fontWeight: '600',
    marginBottom: 4,
  },
  audioDescription: {
    fontSize: 13,
    marginBottom: 4,
  },
  audioMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  audioDuration: {
    fontSize: 12,
  },
  audioSpeaker: {
    fontSize: 12,
    fontWeight: '500',
  },
  playButton: {
    padding: spacing.xs,
  },
});

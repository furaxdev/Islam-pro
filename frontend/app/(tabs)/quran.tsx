import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  TextInput,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useApp } from '../../src/context/AppContext';
import { colors, spacing, borderRadius, shadows } from '../../src/constants/theme';
import { getAllSurahs, Surah } from '../../src/services/quranService';
import Touchable from '../../src/components/Touchable';

export default function QuranScreen() {
  const { t, darkMode, language } = useApp();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [surahs, setSurahs] = useState<Surah[]>([]);
  const [searchQuery, setSearchQuery] = useState('');

  const bgColor = darkMode ? colors.backgroundDark : colors.backgroundLight;
  const cardBg = darkMode ? colors.cardDark : colors.cardLight;
  const textColor = darkMode ? colors.textDark : colors.textLight;
  const textSecondary = darkMode ? colors.textSecondaryDark : colors.textSecondaryLight;

  useEffect(() => {
    loadSurahs();
  }, []);

  const loadSurahs = async () => {
    try {
      setLoading(true);
      const data = await getAllSurahs();
      setSurahs(data);
    } catch (error) {
      console.error('Error loading surahs:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredSurahs = surahs.filter(
    (surah) =>
      surah.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      surah.englishName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      surah.englishNameTranslation.toLowerCase().includes(searchQuery.toLowerCase()) ||
      surah.number.toString().includes(searchQuery)
  );

  const renderSurah = ({ item }: { item: Surah }) => (
    <Touchable
      style={[styles.surahItem, { backgroundColor: cardBg }, shadows.sm]}
      onPress={() => router.push(`/surah/${item.number}`)}
    >
      <View style={styles.surahNumber}>
        <View style={[styles.numberBadge, { backgroundColor: colors.primary }]}>
          <Text style={styles.numberText}>{item.number}</Text>
        </View>
      </View>
      
      <View style={styles.surahInfo}>
        <Text style={[styles.surahEnglishName, { color: textColor }]}>
          {item.englishName}
        </Text>
        <Text style={[styles.surahTranslation, { color: textSecondary }]}>
          {item.englishNameTranslation}
        </Text>
        <Text style={[styles.surahMeta, { color: textSecondary }]}>
          {item.revelationType} • {item.numberOfAyahs} {t('verse')}s
        </Text>
      </View>
      
      <View style={styles.surahArabic}>
        <Text style={[styles.arabicName, { color: textColor }]}>
          {item.name}
        </Text>
      </View>
    </Touchable>
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: bgColor }]} edges={['top']}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: textColor }]}>{t('readQuran')}</Text>
        <Text style={[styles.subtitle, { color: textSecondary }]}>
          114 {t('surah')}s
        </Text>
      </View>

      <View style={[styles.searchContainer, { backgroundColor: cardBg }]}>
        <Ionicons name="search" size={20} color={textSecondary} />
        <TextInput
          style={[styles.searchInput, { color: textColor }]}
          placeholder={`${t('surah')}...`}
          placeholderTextColor={textSecondary}
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        {searchQuery.length > 0 && (
          <Touchable onPress={() => setSearchQuery('')}>
            <Ionicons name="close-circle" size={20} color={textSecondary} />
          </Touchable>
        )}
      </View>

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.gold} />
        </View>
      ) : (
        <FlatList
          data={filteredSurahs}
          keyExtractor={(item) => item.number.toString()}
          renderItem={renderSurah}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        />
      )}
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
  subtitle: {
    fontSize: 14,
    marginTop: 4,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: spacing.md,
    marginBottom: spacing.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.md,
    gap: spacing.sm,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    paddingVertical: spacing.xs,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  listContent: {
    padding: spacing.md,
    paddingTop: 0,
    paddingBottom: spacing.xxl,
  },
  surahItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.md,
    borderRadius: borderRadius.lg,
    marginBottom: spacing.sm,
  },
  surahNumber: {
    marginRight: spacing.md,
  },
  numberBadge: {
    width: 40,
    height: 40,
    borderRadius: 8,
    transform: [{ rotate: '45deg' }],
    justifyContent: 'center',
    alignItems: 'center',
  },
  numberText: {
    color: '#FFF',
    fontWeight: '700',
    fontSize: 14,
    transform: [{ rotate: '-45deg' }],
  },
  surahInfo: {
    flex: 1,
  },
  surahEnglishName: {
    fontSize: 16,
    fontWeight: '600',
  },
  surahTranslation: {
    fontSize: 13,
    marginTop: 2,
  },
  surahMeta: {
    fontSize: 11,
    marginTop: 4,
  },
  surahArabic: {
    alignItems: 'flex-end',
  },
  arabicName: {
    fontSize: 22,
    fontFamily: 'System',
  },
});

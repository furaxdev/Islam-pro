import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useApp } from '../../src/context/AppContext';
import { colors, spacing, borderRadius, shadows } from '../../src/constants/theme';
import { dhikrList, Dhikr } from '../../src/services/dhikrService';
import TasbihCounter from '../../src/components/TasbihCounter';
import Touchable from '../../src/components/Touchable';

export default function DhikrScreen() {
  const { t, darkMode, language } = useApp();
  const [selectedDhikr, setSelectedDhikr] = useState<Dhikr>(dhikrList[0]);

  const bgColor = darkMode ? colors.backgroundDark : colors.backgroundLight;
  const cardBg = darkMode ? colors.cardDark : colors.cardLight;
  const textColor = darkMode ? colors.textDark : colors.textLight;
  const textSecondary = darkMode ? colors.textSecondaryDark : colors.textSecondaryLight;

  const dhikrLabel = (dhikr: Dhikr) => (language === 'ar' ? dhikr.nameAr : dhikr.transliteration);
  const dhikrText = (dhikr: Dhikr) => (language === 'ar' ? dhikr.textAr : dhikr.transliteration);

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: bgColor }]} edges={['top']}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={[styles.title, { color: textColor }]}>{t('tasbih')}</Text>
          <Text style={[styles.subtitle, { color: textSecondary }]}>
            {t('dhikrCounter')}
          </Text>
        </View>

        {/* Dhikr selector */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.dhikrScroll}
          contentContainerStyle={styles.dhikrContainer}
        >
          {dhikrList.map((dhikr) => {
            const isSelected = selectedDhikr.id === dhikr.id;
            return (
              <Touchable
                key={dhikr.id}
                style={[
                  styles.dhikrTab,
                  {
                    backgroundColor: isSelected ? colors.gold : cardBg,
                    borderColor: isSelected ? colors.gold : textSecondary + '40',
                    borderWidth: 1,
                  },
                ]}
                onPress={() => setSelectedDhikr(dhikr)}
              >
                <Text
                  style={[
                    styles.dhikrTabText,
                    { color: isSelected ? colors.backgroundDark : textColor },
                  ]}
                  numberOfLines={1}
                >
                  {dhikrLabel(dhikr)}
                </Text>
              </Touchable>
            );
          })}
        </ScrollView>

        {/* Counter */}
        <View style={styles.counterContainer}>
          <TasbihCounter dhikr={selectedDhikr} darkMode={darkMode} />
        </View>

        {/* Quick dhikr buttons */}
        <View style={[styles.quickSection, { backgroundColor: cardBg }, shadows.sm]}>
          <Text style={[styles.quickTitle, { color: textColor }]}>
            {t('shortcuts')}
          </Text>
          <View style={styles.quickGrid}>
            {dhikrList.map((dhikr) => (
              <Touchable
                key={dhikr.id}
                style={[styles.quickButton, { backgroundColor: bgColor, borderColor: textSecondary + '30' }]}
                onPress={() => setSelectedDhikr(dhikr)}
              >
                <Text style={[styles.quickButtonText, { color: colors.gold }]} numberOfLines={2}>
                  {dhikrText(dhikr)}
                </Text>
                <Text style={[styles.quickButtonTarget, { color: textSecondary }]}>
                  x{dhikr.targetCount}
                </Text>
              </Touchable>
            ))}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollView: { flex: 1 },
  header: { padding: spacing.md, paddingBottom: spacing.sm },
  title: { fontSize: 28, fontWeight: '700' },
  subtitle: { fontSize: 16, marginTop: 4 },
  dhikrScroll: { flexGrow: 0 },
  dhikrContainer: { paddingHorizontal: spacing.md, paddingBottom: spacing.md, gap: spacing.sm },
  dhikrTab: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.full,
    minWidth: 80,
    maxWidth: 170,
    alignItems: 'center',
  },
  dhikrTabText: { fontSize: 14, fontWeight: '600' },
  counterContainer: { paddingHorizontal: spacing.md },
  quickSection: { margin: spacing.md, padding: spacing.lg, borderRadius: borderRadius.lg },
  quickTitle: { fontSize: 16, fontWeight: '700', marginBottom: spacing.md },
  quickGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm },
  quickButton: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    alignItems: 'center',
    minWidth: 90,
    maxWidth: 150,
  },
  quickButtonText: { fontSize: 13, fontWeight: '600', textAlign: 'center' },
  quickButtonTarget: { fontSize: 11 },
});

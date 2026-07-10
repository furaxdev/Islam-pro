import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useApp } from '../src/context/AppContext';
import { colors, spacing, borderRadius, shadows } from '../src/constants/theme';
import { duaCategories, duas, DuaCategory, Dua } from '../src/services/duaService';
import Touchable from '../src/components/Touchable';

export default function DuaScreen() {
  const { t, darkMode, language } = useApp();
  const [selectedCategory, setSelectedCategory] = useState<DuaCategory>(duaCategories[0]);
  const [selectedDua, setSelectedDua] = useState<Dua | null>(null);

  const bgColor = darkMode ? colors.backgroundDark : colors.backgroundLight;
  const cardBg = darkMode ? colors.cardDark : colors.cardLight;
  const textColor = darkMode ? colors.textDark : colors.textLight;
  const textSecondary = darkMode ? colors.textSecondaryDark : colors.textSecondaryLight;

  const filteredDuas = duas.filter((dua) => dua.category === selectedCategory.id);

  const renderDua = ({ dua }: { dua: Dua }) => (
    <Touchable
      style={[styles.duaCard, { backgroundColor: cardBg }, shadows.sm]}
      onPress={() => setSelectedDua(dua)}
    >
      <View style={styles.duaHeader}>
        <Ionicons name={selectedCategory.icon as any} size={20} color={colors.gold} />
        <Text style={[styles.duaName, { color: textColor }]}>{dua.name}</Text>
      </View>
      <Text style={[styles.duaArabic, { color: colors.gold }]} numberOfLines={2}>
        {dua.textAr}
      </Text>
      <Text style={[styles.duaTransliteration, { color: textSecondary }]} numberOfLines={1}>
        {dua.transliteration}
      </Text>
    </Touchable>
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: bgColor }]} edges={['top']}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: textColor }]}>Douas</Text>
        <Text style={[styles.subtitle, { color: colors.gold }]}>الأدعية</Text>
      </View>

      {selectedDua ? (
        <ScrollView style={styles.detailContainer} showsVerticalScrollIndicator={false}>
          <Touchable
            style={styles.backButton}
            onPress={() => setSelectedDua(null)}
          >
            <Ionicons name="arrow-back" size={24} color={textColor} />
            <Text style={[styles.backText, { color: textColor }]}>Retour</Text>
          </Touchable>

          <View style={[styles.detailCard, { backgroundColor: cardBg }, shadows.md]}>
            <Text style={[styles.detailName, { color: textColor }]}>{selectedDua.name}</Text>
            <Text style={[styles.detailNameAr, { color: colors.gold }]}>{selectedDua.nameAr}</Text>
            
            <View style={[styles.divider, { backgroundColor: textSecondary + '30' }]} />
            
            <Text style={[styles.detailArabic, { color: colors.gold }]}>
              {selectedDua.textAr}
            </Text>
            
            <Text style={[styles.detailTransliteration, { color: textSecondary }]}>
              {selectedDua.transliteration}
            </Text>
            
            <Text style={[styles.detailFrench, { color: textColor }]}>
              {selectedDua.text}
            </Text>
            
            <View style={[styles.sourceContainer, { backgroundColor: colors.primary + '15' }]}>
              <Ionicons name="book" size={16} color={colors.primary} />
              <Text style={[styles.sourceText, { color: colors.primary }]}>
                {selectedDua.source}
              </Text>
            </View>
            
            <Text style={[styles.detailOccasion, { color: textSecondary }]}>
              {selectedDua.occasion}
            </Text>
          </View>
        </ScrollView>
      ) : (
        <>
          {/* Category selector */}
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.categoryScroll}
            contentContainerStyle={styles.categoryContainer}
          >
            {duaCategories.map((cat) => (
              <Touchable
                key={cat.id}
                style={[
                  styles.categoryTab,
                  {
                    backgroundColor: selectedCategory.id === cat.id ? colors.primary : cardBg,
                  },
                ]}
                onPress={() => setSelectedCategory(cat)}
              >
                <Ionicons
                  name={cat.icon as any}
                  size={18}
                  color={selectedCategory.id === cat.id ? '#FFF' : textColor}
                />
                <Text
                  style={[
                    styles.categoryText,
                    { color: selectedCategory.id === cat.id ? '#FFF' : textColor },
                  ]}
                  numberOfLines={1}
                >
                  {cat.name}
                </Text>
              </Touchable>
            ))}
          </ScrollView>

          {/* Duas list */}
          <ScrollView style={styles.duasList} showsVerticalScrollIndicator={false}>
            {filteredDuas.map((dua) => (
              <View key={dua.id}>
                {renderDua({ dua })}
              </View>
            ))}
            {filteredDuas.length === 0 && (
              <View style={[styles.emptyState, { backgroundColor: cardBg }]}>
                <Ionicons name="book-outline" size={48} color={textSecondary} />
                <Text style={[styles.emptyText, { color: textSecondary }]}>
                  Aucune doua dans cette catégorie
                </Text>
              </View>
            )}
          </ScrollView>
        </>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { padding: spacing.md, paddingBottom: spacing.sm },
  title: { fontSize: 28, fontWeight: '700' },
  subtitle: { fontSize: 20, marginTop: 4 },
  categoryScroll: { flexGrow: 0 },
  categoryContainer: { paddingHorizontal: spacing.md, paddingBottom: spacing.md, gap: spacing.sm },
  categoryTab: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.full,
    gap: spacing.xs,
  },
  categoryText: { fontSize: 13, fontWeight: '600' },
  duasList: { flex: 1, paddingHorizontal: spacing.md },
  duaCard: { padding: spacing.md, borderRadius: borderRadius.lg, marginBottom: spacing.sm },
  duaHeader: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, marginBottom: spacing.sm },
  duaName: { fontSize: 16, fontWeight: '600' },
  duaArabic: { fontSize: 20, fontWeight: '600', marginBottom: spacing.xs },
  duaTransliteration: { fontSize: 12, fontStyle: 'italic' },
  emptyState: { padding: spacing.xl, borderRadius: borderRadius.lg, alignItems: 'center', justifyContent: 'center' },
  emptyText: { marginTop: spacing.md, fontSize: 16 },
  detailContainer: { flex: 1, padding: spacing.md },
  backButton: { flexDirection: 'row', alignItems: 'center', marginBottom: spacing.lg, gap: spacing.sm },
  backText: { fontSize: 16 },
  detailCard: { padding: spacing.xl, borderRadius: borderRadius.lg, alignItems: 'center' },
  detailName: { fontSize: 22, fontWeight: '700', marginBottom: spacing.xs },
  detailNameAr: { fontSize: 28, fontWeight: '600', marginBottom: spacing.md },
  divider: { width: '60%', height: 1, marginBottom: spacing.lg },
  detailArabic: { fontSize: 24, fontWeight: '600', textAlign: 'center', marginBottom: spacing.md, lineHeight: 40 },
  detailTransliteration: { fontSize: 14, fontStyle: 'italic', marginBottom: spacing.md, textAlign: 'center' },
  detailFrench: { fontSize: 15, textAlign: 'center', lineHeight: 22, marginBottom: spacing.lg },
  sourceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.md,
    gap: spacing.xs,
    marginBottom: spacing.sm,
  },
  sourceText: { fontSize: 13, fontWeight: '500' },
  detailOccasion: { fontSize: 13, fontStyle: 'italic' },
});

import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, FlatList } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useApp } from '../src/context/AppContext';
import { colors, spacing, borderRadius, shadows } from '../src/constants/theme';
import { asmaAllah, AsmaName } from '../src/services/asmaService';
import Touchable from '../src/components/Touchable';

export default function AsmaScreen() {
  const { t, darkMode, language } = useApp();
  const [selectedName, setSelectedName] = useState<AsmaName | null>(null);

  const bgColor = darkMode ? colors.backgroundDark : colors.backgroundLight;
  const cardBg = darkMode ? colors.cardDark : colors.cardLight;
  const textColor = darkMode ? colors.textDark : colors.textLight;
  const textSecondary = darkMode ? colors.textSecondaryDark : colors.textSecondaryLight;

  const renderName = ({ item }: { item: AsmaName }) => (
    <Touchable
      style={[styles.nameCard, { backgroundColor: cardBg }, shadows.sm]}
      onPress={() => setSelectedName(item)}
    >
      <View style={[styles.numberBadge, { backgroundColor: colors.primary }]}>
        <Text style={styles.numberText}>{item.id}</Text>
      </View>
      <View style={styles.nameInfo}>
        <Text style={[styles.nameArabic, { color: colors.gold }]}>{item.nameAr}</Text>
        <Text style={[styles.nameEnglish, { color: textColor }]}>{item.name}</Text>
        <Text style={[styles.nameMeaning, { color: textSecondary }]}>{item.meaning}</Text>
      </View>
      <Ionicons name="chevron-forward" size={20} color={textSecondary} />
    </Touchable>
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: bgColor }]} edges={['top']}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: textColor }]}>Les 99 Noms</Text>
        <Text style={[styles.subtitle, { color: colors.gold }]}>أسماء الله الحسنى</Text>
      </View>

      {selectedName ? (
        <ScrollView style={styles.detailContainer} showsVerticalScrollIndicator={false}>
          <Touchable
            style={styles.backButton}
            onPress={() => setSelectedName(null)}
          >
            <Ionicons name="arrow-back" size={24} color={textColor} />
            <Text style={[styles.backText, { color: textColor }]}>Retour à la liste</Text>
          </Touchable>

          <View style={[styles.detailCard, { backgroundColor: cardBg }, shadows.md]}>
            <View style={[styles.detailNumber, { backgroundColor: colors.primary }]}>
              <Text style={styles.detailNumberText}>{selectedName.id}</Text>
            </View>
            <Text style={[styles.detailArabic, { color: colors.gold }]}>
              {selectedName.nameAr}
            </Text>
            <Text style={[styles.detailEnglish, { color: textColor }]}>
              {selectedName.name}
            </Text>
            <View style={[styles.divider, { backgroundColor: textSecondary + '30' }]} />
            <Text style={[styles.detailMeaning, { color: textColor }]}>
              {selectedName.meaning}
            </Text>
            <Text style={[styles.detailDescription, { color: textSecondary }]}>
              {selectedName.description}
            </Text>
          </View>
        </ScrollView>
      ) : (
        <FlatList
          data={asmaAllah}
          renderItem={renderName}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { padding: spacing.md, paddingBottom: spacing.sm },
  title: { fontSize: 28, fontWeight: '700' },
  subtitle: { fontSize: 20, marginTop: 4 },
  listContainer: { padding: spacing.md },
  nameCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.md,
    borderRadius: borderRadius.lg,
    marginBottom: spacing.sm,
  },
  numberBadge: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.md,
  },
  numberText: { color: '#FFF', fontSize: 14, fontWeight: '700' },
  nameInfo: { flex: 1 },
  nameArabic: { fontSize: 22, fontWeight: '600', marginBottom: 2 },
  nameEnglish: { fontSize: 14, fontWeight: '500' },
  nameMeaning: { fontSize: 12, marginTop: 2 },
  detailContainer: { flex: 1, padding: spacing.md },
  backButton: { flexDirection: 'row', alignItems: 'center', marginBottom: spacing.lg, gap: spacing.sm },
  backText: { fontSize: 16 },
  detailCard: { padding: spacing.xl, borderRadius: borderRadius.lg, alignItems: 'center' },
  detailNumber: { width: 56, height: 56, borderRadius: 28, justifyContent: 'center', alignItems: 'center', marginBottom: spacing.md },
  detailNumberText: { color: '#FFF', fontSize: 20, fontWeight: '700' },
  detailArabic: { fontSize: 40, fontWeight: '600', marginBottom: spacing.sm },
  detailEnglish: { fontSize: 18, fontWeight: '500', marginBottom: spacing.md },
  divider: { width: '60%', height: 1, marginBottom: spacing.md },
  detailMeaning: { fontSize: 20, fontWeight: '700', marginBottom: spacing.sm },
  detailDescription: { fontSize: 14, textAlign: 'center', lineHeight: 22 },
});

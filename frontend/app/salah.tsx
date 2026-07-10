import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useApp } from '../src/context/AppContext';
import { colors, spacing, borderRadius, shadows } from '../src/constants/theme';
import { salahSteps, SalahStep } from '../src/data/salahSteps';
import Touchable from '../src/components/Touchable';

export default function SalahScreen() {
  const { t, darkMode } = useApp();
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);

  const bgColor = darkMode ? colors.backgroundDark : colors.backgroundLight;
  const cardBg = darkMode ? colors.cardDark : colors.cardLight;
  const textColor = darkMode ? colors.textDark : colors.textLight;
  const textSecondary = darkMode ? colors.textSecondaryDark : colors.textSecondaryLight;

  const toggleStep = (id: number) => {
    if (completedSteps.includes(id)) {
      setCompletedSteps(completedSteps.filter((s) => s !== id));
    } else {
      setCompletedSteps([...completedSteps, id]);
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: bgColor }]} edges={['top']}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={[styles.title, { color: textColor }]}>Guide Salah</Text>
          <Text style={[styles.subtitle, { color: colors.gold }]}>الصلاة</Text>
          <Text style={[styles.description, { color: textSecondary }]}>
            Guide étape par étape pour accomplir la prière (salah).
          </Text>
        </View>

        {/* Progress */}
        <View style={[styles.progressContainer, { backgroundColor: cardBg }, shadows.sm]}>
          <View style={styles.progressInfo}>
            <Text style={[styles.progressText, { color: textColor }]}>
              {completedSteps.length} / {salahSteps.length} étapes
            </Text>
            <Text style={[styles.progressPercent, { color: colors.gold }]}>
              {Math.round((completedSteps.length / salahSteps.length) * 100)}%
            </Text>
          </View>
          <View style={[styles.progressBar, { backgroundColor: textSecondary + '30' }]}>
            <View
              style={[
                styles.progressFill,
                {
                  width: `${(completedSteps.length / salahSteps.length) * 100}%`,
                  backgroundColor: colors.primary,
                },
              ]}
            />
          </View>
        </View>

        {/* Steps */}
        {salahSteps.map((step) => {
          const isCompleted = completedSteps.includes(step.id);
          return (
            <Touchable
              key={step.id}
              style={[
                styles.stepCard,
                { backgroundColor: cardBg },
                shadows.sm,
                isCompleted && { borderColor: colors.primary, borderWidth: 2 },
              ]}
              onPress={() => toggleStep(step.id)}
            >
              <View style={styles.stepHeader}>
                <View
                  style={[
                    styles.stepNumber,
                    { backgroundColor: isCompleted ? colors.primary : textSecondary + '30' },
                  ]}
                >
                  {isCompleted ? (
                    <Ionicons name="checkmark" size={20} color="#FFF" />
                  ) : (
                    <Text style={[styles.stepNumberText, { color: textColor }]}>{step.id}</Text>
                  )}
                </View>
                <View style={styles.stepInfo}>
                  <Text style={[styles.stepTitle, { color: textColor }]}>{step.title}</Text>
                  <Text style={[styles.stepTitleAr, { color: colors.gold }]}>{step.titleAr}</Text>
                </View>
              </View>
              <Text style={[styles.stepDescription, { color: textSecondary }]}>
                {step.description}
              </Text>
              {step.rakat > 0 && (
                <View style={[styles.rakatBadge, { backgroundColor: colors.primary + '15' }]}>
                  <Ionicons name="repeat" size={14} color={colors.primary} />
                  <Text style={[styles.rakatText, { color: colors.primary }]}>
                    Rak'ah {step.rakat}
                  </Text>
                </View>
              )}
            </Touchable>
          );
        })}

        {/* Reset button */}
        {completedSteps.length > 0 && (
          <Touchable
            style={[styles.resetButton, { backgroundColor: cardBg }]}
            onPress={() => setCompletedSteps([])}
          >
            <Ionicons name="refresh" size={20} color={textSecondary} />
            <Text style={[styles.resetText, { color: textSecondary }]}>
              Réinitialiser
            </Text>
          </Touchable>
        )}

        <View style={{ height: spacing.xxl }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollView: { flex: 1 },
  header: { padding: spacing.md, paddingBottom: spacing.sm },
  title: { fontSize: 28, fontWeight: '700' },
  subtitle: { fontSize: 22, marginTop: 4 },
  description: { fontSize: 14, marginTop: spacing.sm, lineHeight: 20 },
  progressContainer: { margin: spacing.md, padding: spacing.md, borderRadius: borderRadius.lg },
  progressInfo: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: spacing.sm },
  progressText: { fontSize: 14, fontWeight: '600' },
  progressPercent: { fontSize: 14, fontWeight: '700' },
  progressBar: { height: 8, borderRadius: 4, overflow: 'hidden' },
  progressFill: { height: '100%', borderRadius: 4 },
  stepCard: { marginHorizontal: spacing.md, padding: spacing.md, borderRadius: borderRadius.lg, marginBottom: spacing.sm },
  stepHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: spacing.sm },
  stepNumber: { width: 36, height: 36, borderRadius: 18, justifyContent: 'center', alignItems: 'center', marginRight: spacing.md },
  stepNumberText: { fontSize: 16, fontWeight: '700' },
  stepInfo: { flex: 1 },
  stepTitle: { fontSize: 16, fontWeight: '600' },
  stepTitleAr: { fontSize: 18, fontWeight: '600', marginTop: 2 },
  stepDescription: { fontSize: 14, lineHeight: 20, marginBottom: spacing.sm },
  rakatBadge: { flexDirection: 'row', alignItems: 'center', gap: spacing.xs, paddingHorizontal: spacing.sm, paddingVertical: spacing.xs, borderRadius: borderRadius.sm, alignSelf: 'flex-start' },
  rakatText: { fontSize: 12, fontWeight: '500' },
  resetButton: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', margin: spacing.md, padding: spacing.md, borderRadius: borderRadius.lg, gap: spacing.sm },
  resetText: { fontSize: 14, fontWeight: '600' },
});

import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useApp } from '../../src/context/AppContext';
import { colors, spacing } from '../../src/constants/theme';
import { getQiblaDirection, QiblaDirection } from '../../src/services/qiblaService';
import QiblaCompass from '../../src/components/QiblaCompass';

export default function QiblaScreen() {
  const { t, darkMode } = useApp();
  const [loading, setLoading] = useState(true);
  const [direction, setDirection] = useState<QiblaDirection | null>(null);
  const [error, setError] = useState<string | null>(null);

  const bgColor = darkMode ? colors.backgroundDark : colors.backgroundLight;
  const textColor = darkMode ? colors.textDark : colors.textLight;
  const textSecondary = darkMode ? colors.textSecondaryDark : colors.textSecondaryLight;

  useEffect(() => {
    loadQiblaDirection();
  }, []);

  const loadQiblaDirection = async () => {
    try {
      setLoading(true);
      setError(null);
      const dir = await getQiblaDirection();
      setDirection(dir);
    } catch (err) {
      setError('Impossible d\'obtenir la direction. Activez la localisation.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: bgColor }]}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.gold} />
          <Text style={[styles.loadingText, { color: textSecondary }]}>
            Calcul de la direction...
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: bgColor }]} edges={['top']}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={[styles.title, { color: textColor }]}>Qibla</Text>
          <Text style={[styles.subtitle, { color: textSecondary }]}>
            Direction de la prière
          </Text>
        </View>

        {error ? (
          <View style={styles.errorContainer}>
            <Text style={[styles.errorText, { color: colors.error }]}>{error}</Text>
          </View>
        ) : (
          <QiblaCompass direction={direction} darkMode={darkMode} />
        )}

        {/* Info card */}
        <View style={[styles.infoCard, { backgroundColor: darkMode ? colors.cardDark : colors.cardLight }]}>
          <Text style={[styles.infoTitle, { color: textColor }]}>À propos de la Qibla</Text>
          <Text style={[styles.infoText, { color: textSecondary }]}>
            La Qibla est la direction de la Kaaba à La Mecque, vers laquelle les musulmans se tournent pour prier. Elle est située à 21.4225° N, 39.8262° E.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  loadingText: { marginTop: spacing.md, fontSize: 16 },
  scrollView: { flex: 1 },
  header: { padding: spacing.md, paddingBottom: spacing.sm },
  title: { fontSize: 28, fontWeight: '700' },
  subtitle: { fontSize: 16, marginTop: 4 },
  errorContainer: { padding: spacing.lg, alignItems: 'center' },
  errorText: { fontSize: 16, textAlign: 'center' },
  infoCard: { margin: spacing.md, padding: spacing.lg, borderRadius: 16 },
  infoTitle: { fontSize: 16, fontWeight: '700', marginBottom: spacing.sm },
  infoText: { fontSize: 14, lineHeight: 22 },
});

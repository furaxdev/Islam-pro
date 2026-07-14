import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useApp } from '../../src/context/AppContext';
import { colors, spacing, borderRadius, shadows } from '../../src/constants/theme';
import Touchable from '../../src/components/Touchable';

type MenuItem = {
  key: string;
  label: string;
  subtitle?: string;
  icon: keyof typeof Ionicons.glyphMap;
  color: string;
  route: string;
};

export default function MoreScreen() {
  const router = useRouter();
  const { t, darkMode } = useApp();

  const bgColor = darkMode ? colors.backgroundDark : colors.backgroundLight;
  const cardBg = darkMode ? colors.cardDark : colors.cardLight;
  const textColor = darkMode ? colors.textDark : colors.textLight;
  const textSecondary = darkMode ? colors.textSecondaryDark : colors.textSecondaryLight;

  const sections: { title: string; items: MenuItem[] }[] = [
    {
      title: t('exploreSection'),
      items: [
        { key: 'podcasts', label: t('podcasts'), icon: 'headset', color: colors.info, route: '/(tabs)/audio' },
        { key: 'calendar', label: t('calendar'), icon: 'calendar', color: colors.gold, route: '/(tabs)/calendar' },
        { key: 'asma', label: t('asmaulHusna'), icon: 'sparkles', color: colors.isha, route: '/asma' },
      ],
    },
    {
      title: t('toolsSection'),
      items: [
        { key: 'dhikr', label: t('dhikr'), icon: 'hand-left', color: colors.primary, route: '/(tabs)/dhikr' },
        { key: 'dua', label: t('duas'), icon: 'book', color: colors.maghrib, route: '/dua' },
      ],
    },
    {
      title: t('guidesSection'),
      items: [
        { key: 'salah', label: t('salahGuide'), icon: 'body', color: colors.primary, route: '/salah' },
        { key: 'wudu', label: t('wuduGuide'), icon: 'water', color: colors.info, route: '/wudu' },
      ],
    },
  ];

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: bgColor }]} edges={['top']}>
      <View style={styles.header}>
        <View>
          <Text style={[styles.title, { color: textColor }]}>{t('more')}</Text>
          <Text style={[styles.subtitle, { color: textSecondary }]}>{t('moreSubtitle')}</Text>
        </View>
        <Touchable
          style={[styles.settingsButton, { backgroundColor: cardBg }, shadows.sm]}
          onPress={() => router.push('/settings')}
        >
          <Ionicons name="settings-outline" size={22} color={textColor} />
        </Touchable>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {sections.map((section) => (
          <View key={section.title} style={styles.section}>
            <Text style={[styles.sectionTitle, { color: textSecondary }]}>
              {section.title}
            </Text>
            <View style={[styles.card, { backgroundColor: cardBg }, shadows.sm]}>
              {section.items.map((item, index) => (
                <Touchable
                  key={item.key}
                  style={[
                    styles.row,
                    index < section.items.length - 1 && {
                      borderBottomWidth: 1,
                      borderBottomColor: bgColor,
                    },
                  ]}
                  onPress={() => router.push(item.route as any)}
                >
                  <View style={[styles.iconBox, { backgroundColor: item.color }]}>
                    <Ionicons name={item.icon} size={20} color="#FFF" />
                  </View>
                  <Text style={[styles.rowLabel, { color: textColor }]}>{item.label}</Text>
                  <Ionicons name="chevron-forward" size={20} color={textSecondary} />
                </Touchable>
              ))}
            </View>
          </View>
        ))}

        {/* Settings */}
        <View style={styles.section}>
          <View style={[styles.card, { backgroundColor: cardBg }, shadows.sm]}>
            <Touchable style={styles.row} onPress={() => router.push('/settings')}>
              <View style={[styles.iconBox, { backgroundColor: colors.textSecondaryLight }]}>
                <Ionicons name="settings" size={20} color="#FFF" />
              </View>
              <Text style={[styles.rowLabel, { color: textColor }]}>{t('settings')}</Text>
              <Ionicons name="chevron-forward" size={20} color={textSecondary} />
            </Touchable>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.md,
    paddingTop: spacing.sm,
    paddingBottom: spacing.md,
  },
  title: { fontSize: 28, fontWeight: '700' },
  subtitle: { fontSize: 14, marginTop: 2 },
  settingsButton: {
    width: 44,
    height: 44,
    borderRadius: borderRadius.full,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollView: { flex: 1 },
  content: { padding: spacing.md, paddingBottom: spacing.xxl },
  section: { marginBottom: spacing.lg },
  sectionTitle: {
    fontSize: 13,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: spacing.sm,
    marginLeft: spacing.sm,
  },
  card: { borderRadius: borderRadius.lg, overflow: 'hidden' },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.md,
    gap: spacing.md,
  },
  iconBox: {
    width: 38,
    height: 38,
    borderRadius: borderRadius.md,
    justifyContent: 'center',
    alignItems: 'center',
  },
  rowLabel: { flex: 1, fontSize: 16, fontWeight: '500' },
});

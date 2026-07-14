import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import * as Location from 'expo-location';
import { useApp } from '../../src/context/AppContext';
import { colors, spacing, borderRadius, shadows } from '../../src/constants/theme';
import {
  getPrayerTimesByCoords,
  getNextPrayer,
  formatMinutesLeft,
  PrayerTimes,
  HijriDate,
} from '../../src/services/prayerService';
import { getDailyHadith, Hadith } from '../../src/services/hadithService';
import { getUpcomingEvents, IslamicEvent, hijriMonths } from '../../src/services/calendarService';
import Touchable from '../../src/components/Touchable';
import LoadingSplash from '../../src/components/LoadingSplash';
import { withTimeout } from '../../src/utils/withTimeout';

export default function HomeScreen() {
  const { t, darkMode, language, setLocation: saveLocation } = useApp();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [prayerTimes, setPrayerTimes] = useState<PrayerTimes | null>(null);
  const [hijriDate, setHijriDate] = useState<HijriDate | null>(null);
  const [nextPrayer, setNextPrayer] = useState<{ name: string; time: string; minutesLeft: number } | null>(null);
  const [hadith, setHadith] = useState<Hadith | null>(null);
  const [upcomingEvents, setUpcomingEvents] = useState<IslamicEvent[]>([]);
  const [currentTime, setCurrentTime] = useState(new Date());

  const bgColor = darkMode ? colors.backgroundDark : colors.backgroundLight;
  const cardBg = darkMode ? colors.cardDark : colors.cardLight;
  const textColor = darkMode ? colors.textDark : colors.textLight;
  const textSecondary = darkMode ? colors.textSecondaryDark : colors.textSecondaryLight;

  useEffect(() => {
    loadData();
    const interval = setInterval(() => {
      setCurrentTime(new Date());
      if (prayerTimes) {
        setNextPrayer(getNextPrayer(prayerTimes));
      }
    }, 60000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (prayerTimes) {
      setNextPrayer(getNextPrayer(prayerTimes));
    }
  }, [prayerTimes]);

  const loadData = async () => {
    try {
      setLoading(true);
      
      // Get location
      const { status } = await withTimeout(
        Location.requestForegroundPermissionsAsync(),
        8000,
        'Location permission timed out'
      );
      if (status === 'granted') {
        const location = await withTimeout(
          Location.getCurrentPositionAsync({}),
          8000,
          'Location fix timed out'
        );
        saveLocation({
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
        });

        // Get prayer times
        const data = await withTimeout(
          getPrayerTimesByCoords(location.coords.latitude, location.coords.longitude),
          8000,
          'Prayer times request timed out'
        );
        setPrayerTimes(data.timings);
        setHijriDate(data.hijri);
        
        // Get upcoming events
        if (data.hijri) {
          const events = getUpcomingEvents(
            data.hijri.month.number,
            parseInt(data.hijri.day)
          );
          setUpcomingEvents(events);
        }
      }
      
      // Get daily hadith
      setHadith(getDailyHadith());
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString(language === 'ar' ? 'ar-SA' : 'fr-FR', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getPrayerNameTranslation = (name: string) => {
    const translations: Record<string, string> = {
      Fajr: t('fajr'),
      Dhuhr: t('dhuhr'),
      Asr: t('asr'),
      Maghrib: t('maghrib'),
      Isha: t('isha'),
    };
    return translations[name] || name;
  };

  if (loading) {
    return <LoadingSplash darkMode={darkMode} label={t('loading')} />;
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: bgColor }]} edges={['top']}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.contentContainer}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.gold} />
        }
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={[styles.greeting, { color: colors.gold }]}>
              {t('assalamuAlaikum')}
            </Text>
            <Text style={[styles.time, { color: textColor }]}>
              {formatTime(currentTime)}
            </Text>
          </View>
          <Touchable
            style={[styles.settingsButton, { backgroundColor: cardBg }]}
            onPress={() => router.push('/settings')}
          >
            <Ionicons name="settings-outline" size={24} color={textColor} />
          </Touchable>
        </View>

        {/* Islamic Date */}
        {hijriDate && (
          <View style={[styles.dateCard, { backgroundColor: cardBg }, shadows.sm]}>
            <Ionicons name="moon" size={20} color={colors.gold} />
            <Text style={[styles.hijriDate, { color: textColor }]}>
              {hijriDate.day} {language === 'ar' ? hijriDate.month.ar : hijriMonths[hijriDate.month.number - 1]?.name} {hijriDate.year}
            </Text>
          </View>
        )}

        {/* Next Prayer Card */}
        {nextPrayer && (
          <Touchable
            style={[styles.nextPrayerCard, shadows.md]}
            onPress={() => router.push('/(tabs)/prayer')}
          >
            <View style={styles.nextPrayerContent}>
              <Text style={styles.nextPrayerLabel}>{t('nextPrayer')}</Text>
              <Text style={styles.nextPrayerName}>
                {getPrayerNameTranslation(nextPrayer.name)}
              </Text>
              <Text style={styles.nextPrayerTime}>{nextPrayer.time}</Text>
            </View>
            <View style={styles.countdownContainer}>
              <Text style={styles.countdownLabel}>{t('inMinutes')}</Text>
              <Text style={styles.countdown}>
                {formatMinutesLeft(nextPrayer.minutesLeft)}
              </Text>
            </View>
          </Touchable>
        )}

        {/* Quick Actions */}
        <View style={styles.quickActions}>
          <Touchable
            style={[styles.quickAction, { backgroundColor: cardBg }, shadows.sm]}
            onPress={() => router.push('/(tabs)/quran')}
          >
            <Ionicons name="book" size={28} color={colors.primary} />
            <Text style={[styles.quickActionText, { color: textColor }]}>
              {t('readQuran')}
            </Text>
          </Touchable>
          
          <Touchable
            style={[styles.quickAction, { backgroundColor: cardBg }, shadows.sm]}
            onPress={() => router.push('/(tabs)/audio')}
          >
            <Ionicons name="headset" size={28} color={colors.gold} />
            <Text style={[styles.quickActionText, { color: textColor }]}>
              {t('islamicPodcasts')}
            </Text>
          </Touchable>
        </View>

        {/* Hadith of the Day */}
        {hadith && (
          <View style={[styles.hadithCard, { backgroundColor: cardBg }, shadows.sm]}>
            <View style={styles.hadithHeader}>
              <Ionicons name="sparkles" size={20} color={colors.gold} />
              <Text style={[styles.hadithTitle, { color: colors.gold }]}>
                {t('hadithOfDay')}
              </Text>
            </View>
            <Text style={[styles.hadithArabic, { color: textColor }]}>
              {hadith.arabic}
            </Text>
            <Text style={[styles.hadithTranslation, { color: textSecondary }]}>
              {hadith.translation}
            </Text>
            <Text style={[styles.hadithSource, { color: textSecondary }]}>
              {hadith.source}
            </Text>
          </View>
        )}

        {/* Upcoming Events */}
        {upcomingEvents.length > 0 && (
          <View style={styles.eventsSection}>
            <Text style={[styles.sectionTitle, { color: textColor }]}>
              {t('events')}
            </Text>
            {upcomingEvents.slice(0, 3).map((event) => (
              <View
                key={event.id}
                style={[styles.eventCard, { backgroundColor: cardBg }, shadows.sm]}
              >
                <View
                  style={[
                    styles.eventBadge,
                    {
                      backgroundColor:
                        event.type === 'eid'
                          ? colors.gold
                          : event.type === 'ramadan'
                          ? colors.primary
                          : colors.info,
                    },
                  ]}
                />
                <View style={styles.eventContent}>
                  <Text style={[styles.eventName, { color: textColor }]}>
                    {language === 'ar' ? event.nameAr : event.name}
                  </Text>
                  <Text style={[styles.eventDate, { color: textSecondary }]}>
                    {event.hijriDay} {hijriMonths[event.hijriMonth - 1]?.name}
                  </Text>
                </View>
              </View>
            ))}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: spacing.md,
    fontSize: 16,
  },
  scrollView: {
    flex: 1,
  },
  contentContainer: {
    padding: spacing.md,
    paddingBottom: spacing.xxl,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  greeting: {
    fontSize: 24,
    fontWeight: '700',
  },
  time: {
    fontSize: 36,
    fontWeight: '300',
    marginTop: spacing.xs,
  },
  settingsButton: {
    width: 44,
    height: 44,
    borderRadius: borderRadius.full,
    justifyContent: 'center',
    alignItems: 'center',
  },
  dateCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.md,
    borderRadius: borderRadius.md,
    marginBottom: spacing.lg,
    gap: spacing.sm,
  },
  hijriDate: {
    fontSize: 16,
    fontWeight: '500',
  },
  nextPrayerCard: {
    backgroundColor: colors.primary,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  nextPrayerContent: {
    flex: 1,
  },
  nextPrayerLabel: {
    color: colors.gold,
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  nextPrayerName: {
    color: '#FFFFFF',
    fontSize: 28,
    fontWeight: '700',
    marginTop: spacing.xs,
  },
  nextPrayerTime: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 18,
    marginTop: spacing.xs,
  },
  countdownContainer: {
    alignItems: 'flex-end',
  },
  countdownLabel: {
    color: 'rgba(255,255,255,0.6)',
    fontSize: 12,
  },
  countdown: {
    color: colors.gold,
    fontSize: 24,
    fontWeight: '700',
  },
  quickActions: {
    flexDirection: 'row',
    gap: spacing.md,
    marginBottom: spacing.lg,
  },
  quickAction: {
    flex: 1,
    padding: spacing.md,
    borderRadius: borderRadius.md,
    alignItems: 'center',
    gap: spacing.sm,
  },
  quickActionText: {
    fontSize: 13,
    fontWeight: '600',
    textAlign: 'center',
  },
  hadithCard: {
    padding: spacing.lg,
    borderRadius: borderRadius.lg,
    marginBottom: spacing.lg,
  },
  hadithHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
  hadithTitle: {
    fontSize: 16,
    fontWeight: '600',
  },
  hadithArabic: {
    fontSize: 20,
    lineHeight: 36,
    textAlign: 'right',
    fontFamily: 'System',
    marginBottom: spacing.md,
  },
  hadithTranslation: {
    fontSize: 15,
    lineHeight: 24,
    fontStyle: 'italic',
    marginBottom: spacing.sm,
  },
  hadithSource: {
    fontSize: 12,
  },
  eventsSection: {
    marginBottom: spacing.lg,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: spacing.md,
  },
  eventCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.md,
    borderRadius: borderRadius.md,
    marginBottom: spacing.sm,
    gap: spacing.md,
  },
  eventBadge: {
    width: 4,
    height: 40,
    borderRadius: 2,
  },
  eventContent: {
    flex: 1,
  },
  eventName: {
    fontSize: 15,
    fontWeight: '600',
  },
  eventDate: {
    fontSize: 13,
    marginTop: 2,
  },
});

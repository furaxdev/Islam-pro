import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  TextInput,
  Modal,
  FlatList,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import * as Location from 'expo-location';
import { useApp } from '../../src/context/AppContext';
import { colors, spacing, borderRadius, shadows } from '../../src/constants/theme';
import {
  getPrayerTimesByCoords,
  getPrayerTimesByCity,
  getNextPrayer,
  PrayerTimes,
  HijriDate,
} from '../../src/services/prayerService';
import Touchable from '../../src/components/Touchable';
import LoadingSplash from '../../src/components/LoadingSplash';
import { withTimeout } from '../../src/utils/withTimeout';

const POPULAR_CITIES = [
  { city: 'Paris', country: 'France' },
  { city: 'Lyon', country: 'France' },
  { city: 'Marseille', country: 'France' },
  { city: 'Mecca', country: 'Saudi Arabia' },
  { city: 'Medina', country: 'Saudi Arabia' },
  { city: 'Cairo', country: 'Egypt' },
  { city: 'Dubai', country: 'UAE' },
  { city: 'London', country: 'UK' },
  { city: 'New York', country: 'USA' },
  { city: 'Toronto', country: 'Canada' },
  { city: 'Brussels', country: 'Belgium' },
  { city: 'Amsterdam', country: 'Netherlands' },
];

export default function PrayerScreen() {
  const { t, darkMode, language, location, setLocation } = useApp();
  const [loading, setLoading] = useState(true);
  const [prayerTimes, setPrayerTimes] = useState<PrayerTimes | null>(null);
  const [hijriDate, setHijriDate] = useState<HijriDate | null>(null);
  const [nextPrayer, setNextPrayer] = useState<{ name: string; time: string; minutesLeft: number } | null>(null);
  const [showCityModal, setShowCityModal] = useState(false);
  const [selectedCity, setSelectedCity] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const bgColor = darkMode ? colors.backgroundDark : colors.backgroundLight;
  const cardBg = darkMode ? colors.cardDark : colors.cardLight;
  const textColor = darkMode ? colors.textDark : colors.textLight;
  const textSecondary = darkMode ? colors.textSecondaryDark : colors.textSecondaryLight;

  useEffect(() => {
    loadPrayerTimes();
  }, []);

  useEffect(() => {
    if (prayerTimes) {
      setNextPrayer(getNextPrayer(prayerTimes));
      const interval = setInterval(() => {
        setNextPrayer(getNextPrayer(prayerTimes));
      }, 60000);
      return () => clearInterval(interval);
    }
  }, [prayerTimes]);

  const loadPrayerTimes = async () => {
    try {
      setLoading(true);
      const { status } = await withTimeout(
        Location.requestForegroundPermissionsAsync(),
        8000,
        'Location permission timed out'
      );

      if (status === 'granted') {
        const loc = await withTimeout(
          Location.getCurrentPositionAsync({}),
          8000,
          'Location fix timed out'
        );
        setLocation({
          latitude: loc.coords.latitude,
          longitude: loc.coords.longitude,
        });

        const data = await withTimeout(
          getPrayerTimesByCoords(loc.coords.latitude, loc.coords.longitude),
          8000,
          'Prayer times request timed out'
        );
        setPrayerTimes(data.timings);
        setHijriDate(data.hijri);
        setSelectedCity(null);
      }
    } catch (error) {
      console.error('Error loading prayer times:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadPrayerTimesByCity = async (city: string, country: string) => {
    try {
      setLoading(true);
      setShowCityModal(false);
      setSelectedCity(`${city}, ${country}`);
      
      const data = await getPrayerTimesByCity(city, country);
      setPrayerTimes(data.timings);
      setHijriDate(data.hijri);
    } catch (error) {
      console.error('Error loading prayer times for city:', error);
    } finally {
      setLoading(false);
    }
  };

  const prayersList = prayerTimes
    ? [
        { name: 'Fajr', time: prayerTimes.Fajr, icon: 'moon', color: colors.fajr },
        { name: 'Sunrise', time: prayerTimes.Sunrise, icon: 'sunny', color: colors.sunrise },
        { name: 'Dhuhr', time: prayerTimes.Dhuhr, icon: 'sunny', color: colors.dhuhr },
        { name: 'Asr', time: prayerTimes.Asr, icon: 'partly-sunny', color: colors.asr },
        { name: 'Maghrib', time: prayerTimes.Maghrib, icon: 'cloudy-night', color: colors.maghrib },
        { name: 'Isha', time: prayerTimes.Isha, icon: 'moon', color: colors.isha },
      ]
    : [];

  const getPrayerNameTranslation = (name: string) => {
    const translations: Record<string, string> = {
      Fajr: t('fajr'),
      Sunrise: t('sunrise'),
      Dhuhr: t('dhuhr'),
      Asr: t('asr'),
      Maghrib: t('maghrib'),
      Isha: t('isha'),
    };
    return translations[name] || name;
  };

  const filteredCities = POPULAR_CITIES.filter(
    (c) =>
      c.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.country.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: bgColor }]} edges={['top']}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: textColor }]}>{t('prayerTimes')}</Text>
      </View>

      {/* Location Selection */}
      <View style={styles.locationContainer}>
        <Touchable
          style={[styles.locationButton, { backgroundColor: cardBg }, shadows.sm]}
          onPress={loadPrayerTimes}
        >
          <Ionicons name="location" size={20} color={colors.primary} />
          <Text style={[styles.locationButtonText, { color: textColor }]}>
            {t('useGPS')}
          </Text>
        </Touchable>
        
        <Touchable
          style={[styles.locationButton, { backgroundColor: cardBg }, shadows.sm]}
          onPress={() => setShowCityModal(true)}
        >
          <Ionicons name="search" size={20} color={colors.gold} />
          <Text style={[styles.locationButtonText, { color: textColor }]}>
            {t('selectCity')}
          </Text>
        </Touchable>
      </View>

      {selectedCity && (
        <View style={[styles.selectedCityBadge, { backgroundColor: colors.primary }]}>
          <Ionicons name="location" size={16} color="#FFF" />
          <Text style={styles.selectedCityText}>{selectedCity}</Text>
        </View>
      )}

      {loading ? (
        <LoadingSplash darkMode={darkMode} label={t('loading')} />
      ) : (
        <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
          {/* Prayer Times List */}
          <View style={styles.prayerList}>
            {prayersList.map((prayer, index) => {
              const isNext = nextPrayer?.name === prayer.name;
              return (
                <View
                  key={prayer.name}
                  style={[
                    styles.prayerItem,
                    { backgroundColor: cardBg },
                    isNext && { borderColor: colors.gold, borderWidth: 2 },
                    shadows.sm,
                  ]}
                >
                  <View style={[styles.prayerIcon, { backgroundColor: prayer.color }]}>
                    <Ionicons name={prayer.icon as any} size={24} color="#FFF" />
                  </View>
                  <View style={styles.prayerInfo}>
                    <Text style={[styles.prayerName, { color: textColor }]}>
                      {getPrayerNameTranslation(prayer.name)}
                    </Text>
                    {isNext && (
                      <Text style={[styles.nextBadge, { color: colors.gold }]}>
                        {t('nextPrayer')}
                      </Text>
                    )}
                  </View>
                  <Text style={[styles.prayerTime, { color: textColor }]}>
                    {prayer.time.substring(0, 5)}
                  </Text>
                </View>
              );
            })}
          </View>
        </ScrollView>
      )}

      {/* City Selection Modal */}
      <Modal
        visible={showCityModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowCityModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: cardBg }]}>
            <View style={styles.modalHeader}>
              <Text style={[styles.modalTitle, { color: textColor }]}>
                {t('selectCity')}
              </Text>
              <Touchable onPress={() => setShowCityModal(false)}>
                <Ionicons name="close" size={28} color={textColor} />
              </Touchable>
            </View>
            
            <TextInput
              style={[styles.searchInput, { backgroundColor: bgColor, color: textColor }]}
              placeholder="Search city..."
              placeholderTextColor={textSecondary}
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
            
            <FlatList
              data={filteredCities}
              keyExtractor={(item) => `${item.city}-${item.country}`}
              renderItem={({ item }) => (
                <Touchable
                  style={[styles.cityItem, { borderBottomColor: bgColor }]}
                  onPress={() => loadPrayerTimesByCity(item.city, item.country)}
                >
                  <Text style={[styles.cityName, { color: textColor }]}>
                    {item.city}
                  </Text>
                  <Text style={[styles.countryName, { color: textSecondary }]}>
                    {item.country}
                  </Text>
                </Touchable>
              )}
            />
          </View>
        </View>
      </Modal>
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
  locationContainer: {
    flexDirection: 'row',
    paddingHorizontal: spacing.md,
    gap: spacing.md,
    marginBottom: spacing.md,
  },
  locationButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.md,
    borderRadius: borderRadius.md,
    gap: spacing.sm,
  },
  locationButtonText: {
    fontSize: 14,
    fontWeight: '600',
  },
  selectedCityBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.full,
    marginBottom: spacing.md,
    gap: spacing.xs,
  },
  selectedCityText: {
    color: '#FFF',
    fontWeight: '600',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollView: {
    flex: 1,
  },
  prayerList: {
    padding: spacing.md,
    gap: spacing.md,
  },
  prayerItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.md,
    borderRadius: borderRadius.lg,
    gap: spacing.md,
  },
  prayerIcon: {
    width: 48,
    height: 48,
    borderRadius: borderRadius.md,
    justifyContent: 'center',
    alignItems: 'center',
  },
  prayerInfo: {
    flex: 1,
  },
  prayerName: {
    fontSize: 18,
    fontWeight: '600',
  },
  nextBadge: {
    fontSize: 12,
    fontWeight: '600',
    marginTop: 2,
  },
  prayerTime: {
    fontSize: 24,
    fontWeight: '700',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    borderTopLeftRadius: borderRadius.xl,
    borderTopRightRadius: borderRadius.xl,
    padding: spacing.lg,
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '700',
  },
  searchInput: {
    padding: spacing.md,
    borderRadius: borderRadius.md,
    marginBottom: spacing.md,
    fontSize: 16,
  },
  cityItem: {
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
  },
  cityName: {
    fontSize: 16,
    fontWeight: '600',
  },
  countryName: {
    fontSize: 14,
    marginTop: 2,
  },
});

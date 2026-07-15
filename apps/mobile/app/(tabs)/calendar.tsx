import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useApp } from '../../src/context/AppContext';
import { colors, spacing, borderRadius, shadows } from '../../src/constants/theme';
import { getPrayerTimesByCoords, HijriDate } from '../../src/services/prayerService';
import { getDeviceLocation } from '../../src/services/locationService';
import {
  islamicEvents,
  hijriMonths,
  hijriWeekDays,
  getEventsForMonth,
  getDaysInHijriMonth,
  getHijriMonthStartDay,
  getDailyImages,
  IslamicEvent,
} from '../../src/services/calendarService';
import DailyImageCarousel from '../../src/components/DailyImageCarousel';
import Touchable from '../../src/components/Touchable';
import LoadingSplash from '../../src/components/LoadingSplash';
import { withTimeout } from '../../src/utils/withTimeout';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const CELL_SIZE = (SCREEN_WIDTH - spacing.md * 2 - spacing.sm * 6) / 7;

export default function CalendarScreen() {
  const { t, darkMode, language } = useApp();
  const [loading, setLoading] = useState(true);
  const [hijriDate, setHijriDate] = useState<HijriDate | null>(null);
  const [selectedMonth, setSelectedMonth] = useState(1);
  const [selectedDay, setSelectedDay] = useState<number | null>(null);
  const [monthEvents, setMonthEvents] = useState<IslamicEvent[]>([]);
  const [dailyImages, setDailyImages] = useState<any[]>([]);
  const scrollRef = useRef<ScrollView>(null);

  const bgColor = darkMode ? colors.backgroundDark : colors.backgroundLight;
  const cardBg = darkMode ? colors.cardDark : colors.cardLight;
  const textColor = darkMode ? colors.textDark : colors.textLight;
  const textSecondary = darkMode ? colors.textSecondaryDark : colors.textSecondaryLight;

  useEffect(() => {
    loadHijriDate();
  }, []);

  useEffect(() => {
    setMonthEvents(getEventsForMonth(selectedMonth));
  }, [selectedMonth]);

  useEffect(() => {
    if (selectedDay) {
      setDailyImages(getDailyImages(selectedDay));
    }
  }, [selectedDay]);

  const loadHijriDate = async () => {
    try {
      setLoading(true);
      const loc = await getDeviceLocation();

      if (loc) {
        const data = await withTimeout(
          getPrayerTimesByCoords(loc.latitude, loc.longitude),
          8000,
          'Prayer times request timed out'
        );
        setHijriDate(data.hijri);
        setSelectedMonth(data.hijri.month.number);
        setSelectedDay(parseInt(data.hijri.day, 10));
      } else {
        setSelectedMonth(9); // Ramadan
        setSelectedDay(15);
      }
    } catch (error) {
      console.error('Error loading hijri date:', error);
      // Fallback to a default date
      setSelectedMonth(9); // Ramadan
      setSelectedDay(15);
    } finally {
      setLoading(false);
    }
  };

  const getEventTypeColor = (type: string) => {
    switch (type) {
      case 'eid':
        return colors.gold;
      case 'ramadan':
        return colors.primary;
      case 'holy':
        return colors.info;
      default:
        return colors.textSecondaryDark;
    }
  };

  const getEventTypeIcon = (type: string) => {
    switch (type) {
      case 'eid':
        return 'gift';
      case 'ramadan':
        return 'moon';
      case 'holy':
        return 'star';
      default:
        return 'calendar';
    }
  };

  const getEventsForDay = (day: number): IslamicEvent[] => {
    return monthEvents.filter(event => event.hijriDay === day);
  };

  const renderCalendarGrid = () => {
    const daysInMonth = getDaysInHijriMonth(selectedMonth);
    const startDay = getHijriMonthStartDay(selectedMonth);
    const days = [];

    // Empty cells for days before the 1st
    for (let i = 0; i < startDay; i++) {
      days.push(
        <View key={`empty-${i}`} style={[styles.calendarCell, { width: CELL_SIZE, height: CELL_SIZE }]} />
      );
    }

    // Days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const isSelected = day === selectedDay;
      const isToday = hijriDate && hijriDate.month.number === selectedMonth && Number(hijriDate.day) === day;
      const dayEvents = getEventsForDay(day);
      const hasEvent = dayEvents.length > 0;

      days.push(
        <Touchable
          key={day}
          style={[
            styles.calendarCell,
            { width: CELL_SIZE, height: CELL_SIZE },
            isSelected && { backgroundColor: colors.primary },
            isToday && !isSelected && { borderColor: colors.gold, borderWidth: 2 },
          ]}
          onPress={() => setSelectedDay(day)}
        >
          <Text
            style={[
              styles.calendarDayText,
              { color: textColor },
              isSelected && { color: '#FFF' },
              isToday && !isSelected && { color: colors.gold, fontWeight: '700' },
            ]}
          >
            {day}
          </Text>
          {hasEvent && (
            <View
              style={[
                styles.eventDot,
                { backgroundColor: getEventTypeColor(dayEvents[0].type) },
                isSelected && { backgroundColor: '#FFF' },
              ]}
            />
          )}
        </Touchable>
      );
    }

    return days;
  };

  const renderEventsForSelectedDay = () => {
    if (!selectedDay) return null;

    const dayEvents = getEventsForDay(selectedDay);

    if (dayEvents.length === 0) {
      return (
        <View style={[styles.noEventsCard, { backgroundColor: cardBg }, shadows.sm]}>
          <Ionicons name="calendar-outline" size={32} color={textSecondary} />
          <Text style={[styles.noEventsText, { color: textSecondary }]}>
            {language === 'ar' ? 'لا أحداث في هذا اليوم' : 
             language === 'en' ? 'No events on this day' : 
             'Aucun événement ce jour'}
          </Text>
        </View>
      );
    }

    return dayEvents.map((event) => (
      <View
        key={event.id}
        style={[styles.eventCard, { backgroundColor: cardBg }, shadows.sm]}
      >
        <View
          style={[
            styles.eventIcon,
            { backgroundColor: getEventTypeColor(event.type) },
          ]}
        >
          <Ionicons
            name={getEventTypeIcon(event.type) as any}
            size={24}
            color="#FFF"
          />
        </View>
        
        <View style={styles.eventInfo}>
          <Text style={[styles.eventName, { color: textColor }]}>
            {language === 'ar' ? event.nameAr : event.name}
          </Text>
          <Text style={[styles.eventDescription, { color: textSecondary }]}>
            {language === 'ar' ? event.descriptionAr : event.description}
          </Text>
        </View>
      </View>
    ));
  };

  if (loading) {
    return <LoadingSplash darkMode={darkMode} label={t('loading')} />;
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: bgColor }]} edges={['top']}>
      <ScrollView
        ref={scrollRef}
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={[styles.title, { color: textColor }]}>{t('islamicCalendar')}</Text>
          {hijriDate && (
            <Text style={[styles.currentDate, { color: colors.gold }]}>
              {hijriDate.day} {language === 'ar' ? hijriDate.month.ar : hijriMonths[hijriDate.month.number - 1]?.name} {hijriDate.year}
            </Text>
          )}
        </View>

        {/* Daily Image Carousel */}
        {selectedDay && dailyImages.length > 0 && (
          <View style={styles.carouselSection}>
            <Text style={[styles.sectionTitle, { color: textColor, marginLeft: spacing.md }]}>
              {language === 'ar' ? 'صور اليوم' : 
               language === 'en' ? 'Today\'s Images' : 
               'Images du jour'} - {selectedDay}
            </Text>
            <DailyImageCarousel images={dailyImages} darkMode={darkMode} />
          </View>
        )}

        {/* Month Selector */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.monthScroll}
          contentContainerStyle={styles.monthContainer}
        >
          {hijriMonths.map((month) => (
            <Touchable
              key={month.number}
              style={[
                styles.monthTab,
                {
                  backgroundColor:
                    selectedMonth === month.number ? colors.primary : cardBg,
                },
              ]}
              onPress={() => {
                setSelectedMonth(month.number);
                setSelectedDay(null);
              }}
            >
              <Text
                style={[
                  styles.monthName,
                  {
                    color: selectedMonth === month.number ? '#FFF' : textColor,
                  },
                ]}
              >
                {language === 'ar' ? month.nameAr : month.name}
              </Text>
            </Touchable>
          ))}
        </ScrollView>

        {/* Calendar Grid */}
        <View style={[styles.calendarContainer, { backgroundColor: cardBg }, shadows.sm]}>
          {/* Week day headers */}
          <View style={styles.weekDayHeader}>
            {hijriWeekDays.map((day, index) => (
              <View key={index} style={[styles.weekDayCell, { width: CELL_SIZE }]}>
                <Text style={[styles.weekDayText, { color: colors.gold }]}>
                  {language === 'ar' ? day.nameAr : 
                   language === 'en' ? day.nameEn : 
                   day.name}
                </Text>
              </View>
            ))}
          </View>
          
          {/* Calendar days */}
          <View style={styles.calendarGrid}>
            {renderCalendarGrid()}
          </View>
        </View>

        {/* Events for Selected Day */}
        {selectedDay && (
          <View style={styles.eventsSection}>
            <Text style={[styles.sectionTitle, { color: textColor }]}>
              {language === 'ar' ? `أحداث اليوم ${selectedDay}` : 
               language === 'en' ? `Events for day ${selectedDay}` : 
               `Événements du ${selectedDay}`}
            </Text>
            {renderEventsForSelectedDay()}
          </View>
        )}

        {/* All Events for Month */}
        <View style={styles.eventsSection}>
          <Text style={[styles.sectionTitle, { color: textColor }]}>
            {language === 'ar' ? 'جميع الأحداث' : 
             language === 'en' ? 'All Events' : 
             'Tous les événements'} - {language === 'ar' ? hijriMonths[selectedMonth - 1]?.nameAr : hijriMonths[selectedMonth - 1]?.name}
          </Text>

          {monthEvents.length > 0 ? (
            monthEvents.map((event) => (
              <Touchable
                key={event.id}
                style={[styles.eventCardSmall, { backgroundColor: cardBg }, shadows.sm]}
                onPress={() => setSelectedDay(event.hijriDay)}
              >
                <View
                  style={[
                    styles.eventBadge,
                    { backgroundColor: getEventTypeColor(event.type) },
                  ]}
                />
                <View style={styles.eventInfoSmall}>
                  <Text style={[styles.eventNameSmall, { color: textColor }]}>
                    {language === 'ar' ? event.nameAr : event.name}
                  </Text>
                  <Text style={[styles.eventDateSmall, { color: textSecondary }]}>
                    {event.hijriDay} {language === 'ar' ? hijriMonths[event.hijriMonth - 1]?.nameAr : hijriMonths[event.hijriMonth - 1]?.name}
                  </Text>
                </View>
                <Ionicons name="chevron-forward" size={16} color={textSecondary} />
              </Touchable>
            ))
          ) : (
            <View style={[styles.emptyState, { backgroundColor: cardBg }]}>
              <Ionicons name="calendar-outline" size={48} color={textSecondary} />
              <Text style={[styles.emptyText, { color: textSecondary }]}>
                {language === 'ar' ? 'لا أحداث هذا الشهر' : 
                 language === 'en' ? 'No events this month' : 
                 'Aucun événement ce mois'}
              </Text>
            </View>
          )}
        </View>

        <View style={{ height: spacing.xxl }} />
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
  scrollView: {
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
  currentDate: {
    fontSize: 16,
    fontWeight: '600',
    marginTop: 4,
  },
  carouselSection: {
    marginBottom: spacing.md,
  },
  monthScroll: {
    flexGrow: 0,
  },
  monthContainer: {
    paddingHorizontal: spacing.md,
    paddingBottom: spacing.md,
    gap: spacing.sm,
  },
  monthTab: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.full,
  },
  monthName: {
    fontSize: 14,
    fontWeight: '600',
  },
  calendarContainer: {
    marginHorizontal: spacing.md,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
  },
  weekDayHeader: {
    flexDirection: 'row',
    marginBottom: spacing.sm,
  },
  weekDayCell: {
    alignItems: 'center',
  },
  weekDayText: {
    fontSize: 12,
    fontWeight: '700',
  },
  calendarGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  calendarCell: {
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: borderRadius.sm,
    marginBottom: spacing.xs,
  },
  calendarDayText: {
    fontSize: 16,
    fontWeight: '500',
  },
  eventDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginTop: 2,
  },
  eventsSection: {
    padding: spacing.md,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: spacing.md,
  },
  eventCard: {
    flexDirection: 'row',
    padding: spacing.md,
    borderRadius: borderRadius.lg,
    marginBottom: spacing.md,
  },
  eventIcon: {
    width: 48,
    height: 48,
    borderRadius: borderRadius.md,
    justifyContent: 'center',
    alignItems: 'center',
  },
  eventInfo: {
    flex: 1,
    marginLeft: spacing.md,
  },
  eventName: {
    fontSize: 16,
    fontWeight: '600',
  },
  eventDescription: {
    fontSize: 13,
    marginTop: 4,
    lineHeight: 18,
  },
  noEventsCard: {
    padding: spacing.lg,
    borderRadius: borderRadius.lg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  noEventsText: {
    marginTop: spacing.sm,
    fontSize: 14,
  },
  eventCardSmall: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.md,
    borderRadius: borderRadius.md,
    marginBottom: spacing.sm,
  },
  eventBadge: {
    width: 4,
    height: 36,
    borderRadius: 2,
  },
  eventInfoSmall: {
    flex: 1,
    marginLeft: spacing.md,
  },
  eventNameSmall: {
    fontSize: 14,
    fontWeight: '600',
  },
  eventDateSmall: {
    fontSize: 12,
    marginTop: 2,
  },
  emptyState: {
    padding: spacing.xl,
    borderRadius: borderRadius.lg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyText: {
    marginTop: spacing.md,
    fontSize: 16,
  },
});

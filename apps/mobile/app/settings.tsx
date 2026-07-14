import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Switch,
  Alert,
  Linking,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Constants from 'expo-constants';
import { useApp } from '../src/context/AppContext';
import { colors, spacing, borderRadius, shadows } from '../src/constants/theme';
import { Language } from '../src/i18n/translations';
import Touchable from '../src/components/Touchable';
import { applyPrayerNotifications } from '../src/services/notificationService';

const LANGUAGES: { code: Language; name: string; nativeName: string }[] = [
  { code: 'fr', name: 'French', nativeName: 'Français' },
  { code: 'en', name: 'English', nativeName: 'English' },
  { code: 'ar', name: 'Arabic', nativeName: 'العربية' },
];

const CALCULATION_METHODS = [
  { id: 2, name: 'ISNA (Amérique du Nord)' },
  { id: 1, name: 'Karachi (Asie du Sud)' },
  { id: 3, name: 'Ligue Islamique Mondiale' },
  { id: 4, name: 'Umm Al-Qura (Mecque)' },
  { id: 5, name: 'Égypte' },
  { id: 7, name: 'Téhéran (Iran)' },
  { id: 8, name: 'Golfe Persique' },
  { id: 9, name: 'Koweït' },
  { id: 10, name: 'Qatar' },
  { id: 11, name: 'Singapour' },
  { id: 12, name: 'UOIF (France)' },
  { id: 13, name: 'Diyanet (Turquie)' },
];

const RECITERS = [
  { id: 'ar.alafasy', name: 'Mishary Rashid Alafasy' },
  { id: 'ar.abdulbasitmurattal', name: 'Abdul Basit (Murattal)' },
  { id: 'ar.abdurrahmaansudais', name: 'Abdurrahman As-Sudais' },
  { id: 'ar.hudhaify', name: 'Ali Al-Hudhaify' },
  { id: 'ar.minshawi', name: 'Mohamed Siddiq Al-Minshawi' },
  { id: 'ar.husary', name: 'Mahmoud Khalil Al-Husary' },
];

export default function SettingsScreen() {
  const router = useRouter();
  const {
    t,
    darkMode,
    setDarkMode,
    language,
    setLanguage,
    showTranslation,
    setShowTranslation,
    calculationMethod,
    setCalculationMethod,
    reciter,
    setReciter,
    fontSize,
    setFontSize,
    prayerNotifications,
    setPrayerNotifications,
    adhanSound,
    setAdhanSound,
  } = useApp();

  const [showMethodPicker, setShowMethodPicker] = React.useState(false);
  const [showReciterPicker, setShowReciterPicker] = React.useState(false);
  const [secretTapCount, setSecretTapCount] = React.useState(0);
  const [showDevMenu, setShowDevMenu] = React.useState(false);

  const bgColor = darkMode ? colors.backgroundDark : colors.backgroundLight;
  const cardBg = darkMode ? colors.cardDark : colors.cardLight;
  const textColor = darkMode ? colors.textDark : colors.textLight;
  const textSecondary = darkMode ? colors.textSecondaryDark : colors.textSecondaryLight;

  const handlePrayerNotificationsToggle = async (value: boolean) => {
    setPrayerNotifications(value);
    // Reschedule (or cancel) using the last saved timings.
    await applyPrayerNotifications(t, value, adhanSound);
  };

  const handleAdhanSoundToggle = async (value: boolean) => {
    setAdhanSound(value);
    await applyPrayerNotifications(t, prayerNotifications, value);
  };

  const handleSecretTap = () => {
    const newCount = secretTapCount + 1;
    setSecretTapCount(newCount);
    if (newCount >= 5 && !showDevMenu) {
      setShowDevMenu(true);
      Alert.alert('Mode développeur', 'Menu développeur déverrouillé !');
    }
  };

  const clearCache = async () => {
    Alert.alert(
      'Vider le cache',
      'Êtes-vous sûr de vouloir vider le cache ?',
      [
        { text: 'Annuler', style: 'cancel' },
        {
          text: 'Confirmer',
          style: 'destructive',
          onPress: async () => {
            try {
              await AsyncStorage.clear();
              Alert.alert('Succès', 'Le cache a été vidé.');
            } catch {
              Alert.alert('Erreur', 'Impossible de vider le cache.');
            }
          },
        },
      ]
    );
  };

  const renderPickerModal = (
    visible: boolean,
    onClose: () => void,
    title: string,
    items: { id: any; name: string }[],
    selected: any,
    onSelect: (id: any) => void
  ) => {
    if (!visible) return null;
    return (
      <View style={styles.modalOverlay}>
        <View style={[styles.modalContent, { backgroundColor: cardBg }]}>
          <View style={styles.modalHeader}>
            <Text style={[styles.modalTitle, { color: textColor }]}>{title}</Text>
            <Touchable onPress={onClose}>
              <Ionicons name="close" size={28} color={textColor} />
            </Touchable>
          </View>
          <ScrollView style={styles.modalScroll}>
            {items.map((item) => (
              <Touchable
                key={item.id}
                style={[
                  styles.pickerItem,
                  { borderBottomColor: bgColor },
                  selected === item.id && { backgroundColor: colors.primary + '20' },
                ]}
                onPress={() => {
                  onSelect(item.id);
                  onClose();
                }}
              >
                <Text style={[styles.pickerItemText, { color: textColor }]}>
                  {item.name}
                </Text>
                {selected === item.id && (
                  <Ionicons name="checkmark-circle" size={24} color={colors.gold} />
                )}
              </Touchable>
            ))}
          </ScrollView>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: bgColor }]} edges={['top']}>
      <View style={styles.header}>
        <Touchable style={styles.backButton} onPress={() => router.back()}>
          <Ionicons name="close" size={28} color={textColor} />
        </Touchable>
        <Text style={[styles.title, { color: textColor }]}>{t('settings')}</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        {/* Language */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: textSecondary }]}>{t('language')}</Text>
          <View style={[styles.card, { backgroundColor: cardBg }, shadows.sm]}>
            {LANGUAGES.map((lang, index) => (
              <Touchable
                key={lang.code}
                style={[
                  styles.option,
                  index < LANGUAGES.length - 1 && styles.optionBorder,
                  { borderBottomColor: bgColor },
                ]}
                onPress={() => setLanguage(lang.code)}
              >
                <View style={styles.optionContent}>
                  <Text style={[styles.optionText, { color: textColor }]}>{lang.nativeName}</Text>
                  <Text style={[styles.optionSubtext, { color: textSecondary }]}>{lang.name}</Text>
                </View>
                {language === lang.code && (
                  <Ionicons name="checkmark-circle" size={24} color={colors.gold} />
                )}
              </Touchable>
            ))}
          </View>
        </View>

        {/* Prayer Settings */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: textSecondary }]}>Paramètres de prière</Text>
          <View style={[styles.card, { backgroundColor: cardBg }, shadows.sm]}>
            <View style={[styles.option, styles.optionBorder, { borderBottomColor: bgColor }]}>
              <View style={styles.optionContent}>
                <View style={styles.optionIconRow}>
                  <Ionicons name="notifications" size={20} color={colors.gold} />
                  <Text style={[styles.optionText, { color: textColor }]}>Notifications de prière</Text>
                </View>
                <Text style={[styles.optionSubtext, { color: textSecondary }]}>Rappels avant chaque prière</Text>
              </View>
              <Switch
                value={prayerNotifications}
                onValueChange={handlePrayerNotificationsToggle}
                trackColor={{ false: '#767577', true: colors.primaryLight }}
                thumbColor={prayerNotifications ? colors.gold : '#f4f3f4'}
              />
            </View>

            <View style={[styles.option, styles.optionBorder, { borderBottomColor: bgColor }]}>
              <View style={styles.optionContent}>
                <View style={styles.optionIconRow}>
                  <Ionicons name="volume-high" size={20} color={colors.primary} />
                  <Text style={[styles.optionText, { color: textColor }]}>Son de l'Adhan</Text>
                </View>
                <Text style={[styles.optionSubtext, { color: textSecondary }]}>Jouer l'appel à la prière</Text>
              </View>
              <Switch
                value={adhanSound}
                onValueChange={handleAdhanSoundToggle}
                trackColor={{ false: '#767577', true: colors.primaryLight }}
                thumbColor={adhanSound ? colors.gold : '#f4f3f4'}
              />
            </View>

            <Touchable style={styles.option} onPress={() => setShowMethodPicker(true)}>
              <View style={styles.optionContent}>
                <View style={styles.optionIconRow}>
                  <Ionicons name="calculator" size={20} color={colors.info} />
                  <Text style={[styles.optionText, { color: textColor }]}>Méthode de calcul</Text>
                </View>
                <Text style={[styles.optionSubtext, { color: textSecondary }]} numberOfLines={1}>
                  {CALCULATION_METHODS.find(m => m.id === calculationMethod)?.name}
                </Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color={textSecondary} />
            </Touchable>
          </View>
        </View>

        {/* Quran Settings */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: textSecondary }]}>Paramètres du Coran</Text>
          <View style={[styles.card, { backgroundColor: cardBg }, shadows.sm]}>
            <View style={[styles.option, styles.optionBorder, { borderBottomColor: bgColor }]}>
              <View style={styles.optionContent}>
                <View style={styles.optionIconRow}>
                  <Ionicons name="language" size={20} color={colors.info} />
                  <Text style={[styles.optionText, { color: textColor }]}>Afficher traduction</Text>
                </View>
                <Text style={[styles.optionSubtext, { color: textSecondary }]}>Traduction sous le texte arabe</Text>
              </View>
              <Switch
                value={showTranslation}
                onValueChange={setShowTranslation}
                trackColor={{ false: '#767577', true: colors.primaryLight }}
                thumbColor={showTranslation ? colors.gold : '#f4f3f4'}
              />
            </View>

            <Touchable
              style={[styles.option, styles.optionBorder, { borderBottomColor: bgColor }]}
              onPress={() => setShowReciterPicker(true)}
            >
              <View style={styles.optionContent}>
                <View style={styles.optionIconRow}>
                  <Ionicons name="mic" size={20} color={colors.maghrib} />
                  <Text style={[styles.optionText, { color: textColor }]}>Récitateur</Text>
                </View>
                <Text style={[styles.optionSubtext, { color: textSecondary }]}>
                  {RECITERS.find(r => r.id === reciter)?.name}
                </Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color={textSecondary} />
            </Touchable>

            <View style={styles.option}>
              <View style={styles.optionContent}>
                <View style={styles.optionIconRow}>
                  <Ionicons name="text" size={20} color={colors.gold} />
                  <Text style={[styles.optionText, { color: textColor }]}>Taille du texte arabe</Text>
                </View>
              </View>
              <View style={styles.fontSizeButtons}>
                {(['small', 'medium', 'large'] as const).map((size) => (
                  <Touchable
                    key={size}
                    style={[
                      styles.fontSizeButton,
                      { backgroundColor: fontSize === size ? colors.primary : bgColor },
                    ]}
                    onPress={() => setFontSize(size)}
                  >
                    <Text style={[
                      styles.fontSizeButtonText,
                      {
                        color: fontSize === size ? '#FFF' : textSecondary,
                        fontSize: size === 'small' ? 12 : size === 'medium' ? 14 : 16,
                      },
                    ]}>
                      أ
                    </Text>
                  </Touchable>
                ))}
              </View>
            </View>
          </View>
        </View>

        {/* Display */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: textSecondary }]}>Affichage</Text>
          <View style={[styles.card, { backgroundColor: cardBg }, shadows.sm]}>
            <View style={styles.option}>
              <View style={styles.optionContent}>
                <View style={styles.optionIconRow}>
                  <Ionicons name="moon" size={20} color={colors.maghrib} />
                  <Text style={[styles.optionText, { color: textColor }]}>{t('darkMode')}</Text>
                </View>
                <Text style={[styles.optionSubtext, { color: textSecondary }]}>Thème sombre pour les yeux</Text>
              </View>
              <Switch
                value={darkMode}
                onValueChange={setDarkMode}
                trackColor={{ false: '#767577', true: colors.primaryLight }}
                thumbColor={darkMode ? colors.gold : '#f4f3f4'}
              />
            </View>
          </View>
        </View>

        {/* Data & Storage */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: textSecondary }]}>Données et stockage</Text>
          <View style={[styles.card, { backgroundColor: cardBg }, shadows.sm]}>
            <Touchable
              style={[styles.option, styles.optionBorder, { borderBottomColor: bgColor }]}
              onPress={clearCache}
            >
              <View style={styles.optionContent}>
                <View style={styles.optionIconRow}>
                  <Ionicons name="trash" size={20} color={colors.error} />
                  <Text style={[styles.optionText, { color: textColor }]}>Vider le cache</Text>
                </View>
                <Text style={[styles.optionSubtext, { color: textSecondary }]}>Libérer de l'espace</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color={textSecondary} />
            </Touchable>
          </View>
        </View>

        {/* About */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: textSecondary }]}>{t('about')}</Text>
          <View style={[styles.card, { backgroundColor: cardBg }, shadows.sm]}>
            <View style={styles.aboutContent}>
              <Touchable
                onPress={handleSecretTap}
                style={[styles.appIcon, { backgroundColor: colors.primary }]}
              >
                <Ionicons name="moon" size={32} color={colors.gold} />
              </Touchable>
              <Text style={[styles.appName, { color: textColor }]}>Islam Pro</Text>
              <Text style={[styles.appVersion, { color: textSecondary }]}>Version 1.0.0</Text>
              <Text style={[styles.appDescription, { color: textSecondary }]}>
                Application complète pour les musulmans : horaires de prière,
                Coran, hadiths, podcasts et bien plus.
              </Text>
            </View>
          </View>
        </View>

        {/* Features */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: textSecondary }]}>Fonctionnalités</Text>
          <View style={[styles.card, { backgroundColor: cardBg }, shadows.sm]}>
            {[
              { icon: 'time', text: 'Horaires de prière avec GPS', color: colors.gold },
              { icon: 'book', text: 'Lecture du Coran avec traduction', color: colors.primary },
              { icon: 'headset', text: 'Podcasts islamiques', color: colors.info },
              { icon: 'compass', text: 'Boussole Qibla', color: colors.maghrib },
              { icon: 'hand-left', text: 'Compteur Dhikr/Tasbih', color: colors.gold },
              { icon: 'calendar', text: 'Calendrier islamique', color: colors.info },
              { icon: 'moon', text: '99 Noms d\'Allah', color: colors.isha },
              { icon: 'book', text: 'Douas et invocations', color: colors.primary },
              { icon: 'water', text: 'Guide du Wudu', color: colors.info },
              { icon: 'book', text: 'Guide de la Salah', color: colors.gold },
              { icon: 'sparkles', text: '50+ Hadiths', color: colors.maghrib },
              { icon: 'globe', text: 'Multi-langue (FR, EN, AR)', color: colors.primary },
            ].map((feature, index) => (
              <View
                key={index}
                style={[
                  styles.featureItem,
                  index < 11 && styles.optionBorder,
                  { borderBottomColor: bgColor },
                ]}
              >
                <Ionicons name={feature.icon as any} size={20} color={feature.color} />
                <Text style={[styles.featureText, { color: textColor }]}>{feature.text}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Support */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: textSecondary }]}>Support</Text>
          <View style={[styles.card, { backgroundColor: cardBg }, shadows.sm]}>
            <Touchable style={[styles.option, styles.optionBorder, { borderBottomColor: bgColor }]}>
              <View style={styles.optionContent}>
                <View style={styles.optionIconRow}>
                  <Ionicons name="star" size={20} color={colors.gold} />
                  <Text style={[styles.optionText, { color: textColor }]}>Noter l'application</Text>
                </View>
              </View>
              <Ionicons name="chevron-forward" size={20} color={textSecondary} />
            </Touchable>

            <Touchable style={styles.option}>
              <View style={styles.optionContent}>
                <View style={styles.optionIconRow}>
                  <Ionicons name="mail" size={20} color={colors.primary} />
                  <Text style={[styles.optionText, { color: textColor }]}>Nous contacter</Text>
                </View>
              </View>
              <Ionicons name="chevron-forward" size={20} color={textSecondary} />
            </Touchable>
          </View>
        </View>
      </ScrollView>

      {renderPickerModal(
        showMethodPicker,
        () => setShowMethodPicker(false),
        'Méthode de calcul',
        CALCULATION_METHODS,
        calculationMethod,
        setCalculationMethod
      )}

      {renderPickerModal(
        showReciterPicker,
        () => setShowReciterPicker(false),
        'Choisir un récitateur',
        RECITERS,
        reciter,
        setReciter
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: spacing.md,
  },
  backButton: { width: 44, height: 44, justifyContent: 'center', alignItems: 'center' },
  title: { fontSize: 20, fontWeight: '700' },
  placeholder: { width: 44 },
  scrollView: { flex: 1 },
  contentContainer: { padding: spacing.md, paddingBottom: spacing.xxl },
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
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: spacing.md,
  },
  optionBorder: { borderBottomWidth: 1 },
  optionContent: { flex: 1, marginRight: spacing.sm },
  optionIconRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  optionText: { fontSize: 16, fontWeight: '500' },
  optionSubtext: { fontSize: 13, marginTop: 2, marginLeft: 28 },
  fontSizeButtons: { flexDirection: 'row', gap: spacing.xs },
  fontSizeButton: {
    width: 36,
    height: 36,
    borderRadius: borderRadius.sm,
    justifyContent: 'center',
    alignItems: 'center',
  },
  fontSizeButtonText: { fontWeight: '600' },
  aboutContent: { padding: spacing.lg, alignItems: 'center' },
  appIcon: {
    width: 64,
    height: 64,
    borderRadius: borderRadius.lg,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  appName: { fontSize: 20, fontWeight: '700', marginBottom: spacing.xs },
  appVersion: { fontSize: 14, marginBottom: spacing.md },
  appDescription: { fontSize: 14, textAlign: 'center', lineHeight: 22 },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.md,
    gap: spacing.md,
  },
  featureText: { fontSize: 15 },
  modalOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    borderTopLeftRadius: borderRadius.xl,
    borderTopRightRadius: borderRadius.xl,
    padding: spacing.lg,
    maxHeight: '70%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  modalTitle: { fontSize: 20, fontWeight: '700' },
  modalScroll: { maxHeight: 400 },
  pickerItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
  },
  pickerItemText: { fontSize: 15, flex: 1, marginRight: spacing.sm },
});

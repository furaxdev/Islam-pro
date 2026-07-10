import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Localization from 'expo-localization';
import { translations, Language, TranslationKey } from '../i18n/translations';

interface Location {
  latitude: number;
  longitude: number;
  city?: string;
  country?: string;
}

interface AppContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: TranslationKey) => string;
  location: Location | null;
  setLocation: (loc: Location | null) => void;
  isRTL: boolean;
  darkMode: boolean;
  setDarkMode: (value: boolean) => void;
  showTranslation: boolean;
  setShowTranslation: (value: boolean) => void;
  calculationMethod: number;
  setCalculationMethod: (value: number) => void;
  reciter: string;
  setReciter: (value: string) => void;
  fontSize: 'small' | 'medium' | 'large';
  setFontSize: (value: 'small' | 'medium' | 'large') => void;
  prayerNotifications: boolean;
  setPrayerNotifications: (value: boolean) => void;
  adhanSound: boolean;
  setAdhanSound: (value: boolean) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>('fr');
  const [location, setLocation] = useState<Location | null>(null);
  const [darkMode, setDarkModeState] = useState(true);
  const [showTranslation, setShowTranslationState] = useState(true);
  const [calculationMethod, setCalculationMethodState] = useState(2);
  const [reciter, setReciterState] = useState('ar.alafasy');
  const [fontSize, setFontSizeState] = useState<'small' | 'medium' | 'large'>('medium');
  const [prayerNotifications, setPrayerNotificationsState] = useState(true);
  const [adhanSound, setAdhanSoundState] = useState(true);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const savedLang = await AsyncStorage.getItem('language');
      const savedDarkMode = await AsyncStorage.getItem('darkMode');
      const savedShowTranslation = await AsyncStorage.getItem('showTranslation');
      const savedLocation = await AsyncStorage.getItem('location');
      const savedCalculationMethod = await AsyncStorage.getItem('calculationMethod');
      const savedReciter = await AsyncStorage.getItem('reciter');
      const savedFontSize = await AsyncStorage.getItem('fontSize');
      const savedPrayerNotifications = await AsyncStorage.getItem('prayerNotifications');
      const savedAdhanSound = await AsyncStorage.getItem('adhanSound');

      if (savedLang) {
        setLanguageState(savedLang as Language);
      } else {
        // Get system language
        const deviceLang = Localization.getLocales()[0]?.languageCode || 'fr';
        const supportedLang = ['fr', 'ar', 'en'].includes(deviceLang) ? deviceLang as Language : 'fr';
        setLanguageState(supportedLang);
      }

      if (savedDarkMode !== null) {
        setDarkModeState(savedDarkMode === 'true');
      }

      if (savedShowTranslation !== null) {
        setShowTranslationState(savedShowTranslation === 'true');
      }

      if (savedLocation) {
        setLocation(JSON.parse(savedLocation));
      }

      if (savedCalculationMethod !== null) {
        setCalculationMethodState(parseInt(savedCalculationMethod, 10));
      }

      if (savedReciter) {
        setReciterState(savedReciter);
      }

      if (savedFontSize) {
        setFontSizeState(savedFontSize as 'small' | 'medium' | 'large');
      }

      if (savedPrayerNotifications !== null) {
        setPrayerNotificationsState(savedPrayerNotifications === 'true');
      }

      if (savedAdhanSound !== null) {
        setAdhanSoundState(savedAdhanSound === 'true');
      }
    } catch (error) {
      console.error('Error loading settings:', error);
    }
  };

  const setLanguage = async (lang: Language) => {
    setLanguageState(lang);
    await AsyncStorage.setItem('language', lang);
  };

  const setDarkMode = async (value: boolean) => {
    setDarkModeState(value);
    await AsyncStorage.setItem('darkMode', value.toString());
  };

  const setShowTranslation = async (value: boolean) => {
    setShowTranslationState(value);
    await AsyncStorage.setItem('showTranslation', value.toString());
  };

  const setCalculationMethod = async (value: number) => {
    setCalculationMethodState(value);
    await AsyncStorage.setItem('calculationMethod', value.toString());
  };

  const setReciter = async (value: string) => {
    setReciterState(value);
    await AsyncStorage.setItem('reciter', value);
  };

  const setFontSize = async (value: 'small' | 'medium' | 'large') => {
    setFontSizeState(value);
    await AsyncStorage.setItem('fontSize', value);
  };

  const setPrayerNotifications = async (value: boolean) => {
    setPrayerNotificationsState(value);
    await AsyncStorage.setItem('prayerNotifications', value.toString());
  };

  const setAdhanSound = async (value: boolean) => {
    setAdhanSoundState(value);
    await AsyncStorage.setItem('adhanSound', value.toString());
  };

  const saveLocation = async (loc: Location | null) => {
    setLocation(loc);
    if (loc) {
      await AsyncStorage.setItem('location', JSON.stringify(loc));
    } else {
      await AsyncStorage.removeItem('location');
    }
  };

  const t = (key: TranslationKey): string => {
    return translations[language][key] || translations.en[key] || key;
  };

  const isRTL = language === 'ar';

  return (
    <AppContext.Provider
      value={{
        language,
        setLanguage,
        t,
        location,
        setLocation: saveLocation,
        isRTL,
        darkMode,
        setDarkMode,
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
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within AppProvider');
  }
  return context;
}

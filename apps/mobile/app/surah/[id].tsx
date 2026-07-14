import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  Switch,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Audio } from 'expo-av';
import { useApp } from '../../src/context/AppContext';
import { colors, spacing, borderRadius, shadows } from '../../src/constants/theme';
import { getFullSurahData, SurahDetail, Ayah } from '../../src/services/quranService';
import Touchable from '../../src/components/Touchable';

export default function SurahScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { t, darkMode, language, showTranslation, setShowTranslation } = useApp();
  
  const [loading, setLoading] = useState(true);
  const [arabicSurah, setArabicSurah] = useState<SurahDetail | null>(null);
  const [translationSurah, setTranslationSurah] = useState<SurahDetail | null>(null);
  const [audioSurah, setAudioSurah] = useState<SurahDetail | null>(null);
  const [playingAyah, setPlayingAyah] = useState<number | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPlayingFullSurah, setIsPlayingFullSurah] = useState(false);
  const [currentAyahIndex, setCurrentAyahIndex] = useState(0);
  const soundRef = useRef<Audio.Sound | null>(null);
  const scrollViewRef = useRef<ScrollView>(null);

  const bgColor = darkMode ? colors.backgroundDark : colors.backgroundLight;
  const cardBg = darkMode ? colors.cardDark : colors.cardLight;
  const textColor = darkMode ? colors.textDark : colors.textLight;
  const textSecondary = darkMode ? colors.textSecondaryDark : colors.textSecondaryLight;

  useEffect(() => {
    loadSurah();
    return () => {
      stopAudio();
    };
  }, [id]);

  const loadSurah = async () => {
    try {
      setLoading(true);
      const surahNumber = parseInt(id || '1');
      const translationLang = language === 'en' ? 'en' : 'fr';
      const data = await getFullSurahData(surahNumber, translationLang);
      setArabicSurah(data.arabic);
      setTranslationSurah(data.translation);
      setAudioSurah(data.audio);
    } catch (error) {
      console.error('Error loading surah:', error);
    } finally {
      setLoading(false);
    }
  };

  const playAyah = async (ayahIndex: number, autoPlayNext: boolean = false) => {
    try {
      // Stop current audio if playing
      if (soundRef.current) {
        await soundRef.current.unloadAsync();
        soundRef.current = null;
      }

      if (audioSurah && audioSurah.ayahs[ayahIndex]) {
        const audioUrl = audioSurah.ayahs[ayahIndex].audio;
        if (audioUrl) {
          await Audio.setAudioModeAsync({
            playsInSilentModeIOS: true,
            staysActiveInBackground: true,
          });

          const { sound } = await Audio.Sound.createAsync(
            { uri: audioUrl },
            { shouldPlay: true }
          );
          soundRef.current = sound;
          setPlayingAyah(ayahIndex);
          setCurrentAyahIndex(ayahIndex);
          setIsPlaying(true);

          sound.setOnPlaybackStatusUpdate((status) => {
            if (status.isLoaded && status.didJustFinish) {
              // If playing full surah, play next ayah
              if (autoPlayNext || isPlayingFullSurah) {
                const nextIndex = ayahIndex + 1;
                if (audioSurah && nextIndex < audioSurah.ayahs.length) {
                  playAyah(nextIndex, true);
                } else {
                  // End of surah
                  setPlayingAyah(null);
                  setIsPlaying(false);
                  setIsPlayingFullSurah(false);
                  setCurrentAyahIndex(0);
                }
              } else {
                setPlayingAyah(null);
                setIsPlaying(false);
              }
            }
          });
        }
      }
    } catch (error) {
      console.error('Error playing audio:', error);
      setPlayingAyah(null);
      setIsPlaying(false);
      setIsPlayingFullSurah(false);
    }
  };

  const playFullSurah = async () => {
    if (isPlayingFullSurah) {
      // Stop playing
      await stopAudio();
    } else {
      // Start playing from beginning
      setIsPlayingFullSurah(true);
      await playAyah(0, true);
    }
  };

  const stopAudio = async () => {
    if (soundRef.current) {
      try {
        await soundRef.current.stopAsync();
        await soundRef.current.unloadAsync();
      } catch (e) {
        console.log('Error stopping audio:', e);
      }
      soundRef.current = null;
    }
    setPlayingAyah(null);
    setIsPlaying(false);
    setIsPlayingFullSurah(false);
  };

  const pauseResume = async () => {
    if (!soundRef.current) return;
    
    try {
      const status = await soundRef.current.getStatusAsync();
      if (status.isLoaded) {
        if (status.isPlaying) {
          await soundRef.current.pauseAsync();
          setIsPlaying(false);
        } else {
          await soundRef.current.playAsync();
          setIsPlaying(true);
        }
      }
    } catch (error) {
      console.error('Error pause/resume:', error);
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: bgColor }]}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.gold} />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: bgColor }]} edges={['top']}>
      {/* Header */}
      <View style={[styles.header, { backgroundColor: cardBg }]}>
        <Touchable
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Ionicons name="arrow-back" size={24} color={textColor} />
        </Touchable>
        
        <View style={styles.headerInfo}>
          <Text style={[styles.surahName, { color: textColor }]}>
            {arabicSurah?.englishName}
          </Text>
          <Text style={[styles.surahArabicName, { color: colors.gold }]}>
            {arabicSurah?.name}
          </Text>
        </View>
        
        <View style={styles.translationToggle}>
          <Text style={[styles.toggleLabel, { color: textSecondary }]}>
            {t('translation')}
          </Text>
          <Switch
            value={showTranslation}
            onValueChange={setShowTranslation}
            trackColor={{ false: '#767577', true: colors.primaryLight }}
            thumbColor={showTranslation ? colors.gold : '#f4f3f4'}
          />
        </View>
      </View>

      {/* Play Full Surah Button */}
      <View style={[styles.playFullContainer, { backgroundColor: cardBg }]}>
        <Touchable
          style={[
            styles.playFullButton,
            { backgroundColor: isPlayingFullSurah ? colors.error : colors.primary },
          ]}
          onPress={playFullSurah}
        >
          <Ionicons
            name={isPlayingFullSurah ? 'stop' : 'play'}
            size={20}
            color="#FFF"
          />
          <Text style={styles.playFullText}>
            {isPlayingFullSurah ? 'Arrêter' : 'Lire la sourate complète'}
          </Text>
        </Touchable>

        {/* Pause/Resume button when playing */}
        {isPlayingFullSurah && (
          <Touchable
            style={[styles.pauseButton, { backgroundColor: colors.gold }]}
            onPress={pauseResume}
          >
            <Ionicons
              name={isPlaying ? 'pause' : 'play'}
              size={20}
              color="#FFF"
            />
          </Touchable>
        )}

        {/* Current ayah indicator */}
        {isPlayingFullSurah && (
          <Text style={[styles.currentAyahText, { color: textSecondary }]}>
            Verset {currentAyahIndex + 1}/{arabicSurah?.ayahs.length}
          </Text>
        )}
      </View>

      {/* Bismillah */}
      {arabicSurah && arabicSurah.number !== 1 && arabicSurah.number !== 9 && (
        <View style={[styles.bismillah, { backgroundColor: cardBg }]}>
          <Text style={[styles.bismillahText, { color: textColor }]}>
            بِسْمِ اللَّهِ الرَّحْمَـٰنِ الرَّحِيمِ
          </Text>
        </View>
      )}

      {/* Ayahs */}
      <ScrollView
        ref={scrollViewRef}
        style={styles.scrollView}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        {arabicSurah?.ayahs.map((ayah, index) => (
          <View
            key={ayah.number}
            style={[
              styles.ayahCard,
              { backgroundColor: cardBg },
              playingAyah === index && { borderColor: colors.gold, borderWidth: 2 },
              shadows.sm,
            ]}
          >
            {/* Ayah Number & Actions */}
            <View style={styles.ayahHeader}>
              <View style={[styles.ayahNumber, { backgroundColor: colors.primary }]}>
                <Text style={styles.ayahNumberText}>{ayah.numberInSurah}</Text>
              </View>
              
              <Touchable
                style={[
                  styles.playButton, 
                  { backgroundColor: playingAyah === index ? colors.error : colors.gold }
                ]}
                onPress={() => {
                  if (playingAyah === index) {
                    stopAudio();
                  } else {
                    setIsPlayingFullSurah(false);
                    playAyah(index, false);
                  }
                }}
              >
                <Ionicons
                  name={playingAyah === index ? 'stop' : 'play'}
                  size={16}
                  color="#FFF"
                />
              </Touchable>
            </View>

            {/* Arabic Text */}
            <Text style={[styles.arabicText, { color: textColor }]}>
              {ayah.text}
            </Text>

            {/* Translation */}
            {showTranslation && translationSurah?.ayahs[index] && (
              <Text style={[styles.translationText, { color: textSecondary }]}>
                {translationSurah.ayahs[index].text}
              </Text>
            )}
          </View>
        ))}
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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.1)',
  },
  backButton: {
    width: 44,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerInfo: {
    flex: 1,
    alignItems: 'center',
  },
  surahName: {
    fontSize: 18,
    fontWeight: '700',
  },
  surahArabicName: {
    fontSize: 16,
    marginTop: 2,
  },
  translationToggle: {
    alignItems: 'center',
  },
  toggleLabel: {
    fontSize: 10,
    marginBottom: 4,
  },
  playFullContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.md,
    gap: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.1)',
  },
  playFullButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.full,
    gap: spacing.sm,
  },
  playFullText: {
    color: '#FFF',
    fontWeight: '600',
    fontSize: 14,
  },
  pauseButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  currentAyahText: {
    fontSize: 12,
    marginLeft: 'auto',
  },
  bismillah: {
    padding: spacing.lg,
    alignItems: 'center',
  },
  bismillahText: {
    fontSize: 28,
    fontFamily: 'System',
  },
  scrollView: {
    flex: 1,
  },
  contentContainer: {
    padding: spacing.md,
    paddingBottom: spacing.xxl,
  },
  ayahCard: {
    padding: spacing.md,
    borderRadius: borderRadius.lg,
    marginBottom: spacing.md,
  },
  ayahHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  ayahNumber: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  ayahNumberText: {
    color: '#FFF',
    fontWeight: '700',
    fontSize: 12,
  },
  playButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  arabicText: {
    fontSize: 24,
    lineHeight: 48,
    textAlign: 'right',
    fontFamily: 'System',
    marginBottom: spacing.md,
  },
  translationText: {
    fontSize: 15,
    lineHeight: 24,
    fontStyle: 'italic',
  },
});

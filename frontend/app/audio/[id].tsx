import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Audio } from 'expo-av';
import Slider from '@react-native-community/slider';
import { useApp } from '../../src/context/AppContext';
import { colors, spacing, borderRadius, shadows } from '../../src/constants/theme';
import {
  prophetStories,
  sleepStories,
  islamicPodcasts,
  AudioContent,
} from '../../src/services/audioService';
import Touchable from '../../src/components/Touchable';

export default function AudioPlayerScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { darkMode, language } = useApp();
  
  const [audioContent, setAudioContent] = useState<AudioContent | null>(null);
  const [loading, setLoading] = useState(true);
  const [audioLoaded, setAudioLoaded] = useState(false);
  const [audioError, setAudioError] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [position, setPosition] = useState(0);
  const [duration, setDuration] = useState(0);
  const soundRef = useRef<Audio.Sound | null>(null);

  const bgColor = darkMode ? colors.backgroundDark : colors.backgroundLight;
  const cardBg = darkMode ? colors.cardDark : colors.cardLight;
  const textColor = darkMode ? colors.textDark : colors.textLight;
  const textSecondary = darkMode ? colors.textSecondaryDark : colors.textSecondaryLight;

  useEffect(() => {
    findAndLoadAudio();
    return () => {
      unloadAudio();
    };
  }, [id]);

  const unloadAudio = async () => {
    if (soundRef.current) {
      try {
        await soundRef.current.unloadAsync();
      } catch (e) {
        console.log('Error unloading audio:', e);
      }
      soundRef.current = null;
    }
  };

  const findAndLoadAudio = async () => {
    try {
      setLoading(true);
      setAudioLoaded(false);
      setAudioError(null);
      
      // Find audio content by id
      const allContent = [...prophetStories, ...sleepStories, ...islamicPodcasts];
      const content = allContent.find((c) => c.id === id);
      
      if (content) {
        setAudioContent(content);
        await loadAudio(content.audioUrl);
      } else {
        setAudioError('Contenu audio non trouvé');
      }
    } catch (error) {
      console.error('Error loading audio:', error);
      setAudioError('Erreur lors du chargement');
    } finally {
      setLoading(false);
    }
  };

  const loadAudio = async (uri: string) => {
    try {
      // Unload any existing audio
      await unloadAudio();

      await Audio.setAudioModeAsync({
        playsInSilentModeIOS: true,
        staysActiveInBackground: true,
        shouldDuckAndroid: true,
      });

      console.log('Loading audio from:', uri);

      const { sound, status } = await Audio.Sound.createAsync(
        { uri },
        { shouldPlay: false },
        onPlaybackStatusUpdate
      );
      
      soundRef.current = sound;
      
      if (status.isLoaded) {
        setDuration(status.durationMillis || 0);
        setAudioLoaded(true);
        setAudioError(null);
        console.log('Audio loaded successfully, duration:', status.durationMillis);
      } else {
        setAudioError('Impossible de charger l\'audio');
      }
    } catch (error: any) {
      console.error('Error loading audio:', error);
      setAudioError(error.message || 'Erreur de chargement audio');
      setAudioLoaded(false);
    }
  };

  const onPlaybackStatusUpdate = (status: any) => {
    if (status.isLoaded) {
      setPosition(status.positionMillis || 0);
      setIsPlaying(status.isPlaying);
      if (status.durationMillis) {
        setDuration(status.durationMillis);
      }
      // Handle playback finish
      if (status.didJustFinish) {
        setIsPlaying(false);
        setPosition(0);
      }
    } else if (status.error) {
      console.error('Playback error:', status.error);
      setAudioError('Erreur de lecture');
    }
  };

  const togglePlayPause = async () => {
    if (!soundRef.current || !audioLoaded) {
      Alert.alert('Audio non prêt', 'Veuillez patienter pendant le chargement de l\'audio.');
      return;
    }
    
    try {
      const status = await soundRef.current.getStatusAsync();
      if (!status.isLoaded) {
        Alert.alert('Erreur', 'L\'audio n\'est pas chargé correctement.');
        return;
      }

      if (isPlaying) {
        await soundRef.current.pauseAsync();
      } else {
        await soundRef.current.playAsync();
      }
    } catch (error: any) {
      console.error('Error toggling play/pause:', error);
      Alert.alert('Erreur', 'Impossible de lire l\'audio: ' + (error.message || 'Erreur inconnue'));
    }
  };

  const seekTo = async (value: number) => {
    if (soundRef.current && audioLoaded) {
      try {
        await soundRef.current.setPositionAsync(value);
      } catch (error) {
        console.error('Error seeking:', error);
      }
    }
  };

  const skipBackward = async () => {
    if (soundRef.current && audioLoaded) {
      try {
        const newPosition = Math.max(0, position - 10000);
        await soundRef.current.setPositionAsync(newPosition);
      } catch (error) {
        console.error('Error skipping backward:', error);
      }
    }
  };

  const skipForward = async () => {
    if (soundRef.current && audioLoaded) {
      try {
        const newPosition = Math.min(duration, position + 10000);
        await soundRef.current.setPositionAsync(newPosition);
      } catch (error) {
        console.error('Error skipping forward:', error);
      }
    }
  };

  const formatTime = (millis: number) => {
    const totalSeconds = Math.floor(millis / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'prophet':
        return colors.primary;
      case 'sleep':
        return colors.maghrib;
      case 'lecture':
        return colors.gold;
      default:
        return colors.info;
    }
  };

  const retryLoad = () => {
    if (audioContent) {
      loadAudio(audioContent.audioUrl);
    }
  };

  if (loading || !audioContent) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: bgColor }]}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.gold} />
          <Text style={[styles.loadingText, { color: textSecondary }]}>
            Chargement...
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: bgColor }]} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <Touchable
          style={styles.closeButton}
          onPress={() => router.back()}
        >
          <Ionicons name="chevron-down" size={28} color={textColor} />
        </Touchable>
      </View>

      {/* Content */}
      <View style={styles.content}>
        {/* Album Art */}
        <View
          style={[
            styles.albumArt,
            { backgroundColor: getCategoryColor(audioContent.category) },
            shadows.lg,
          ]}
        >
          <Ionicons
            name={
              audioContent.category === 'prophet'
                ? 'people'
                : audioContent.category === 'sleep'
                ? 'moon'
                : 'headset'
            }
            size={80}
            color="#FFF"
          />
        </View>

        {/* Title */}
        <Text style={[styles.title, { color: textColor }]}>
          {language === 'ar' && audioContent.titleAr
            ? audioContent.titleAr
            : audioContent.title}
        </Text>
        {audioContent.speaker && (
          <Text style={[styles.speaker, { color: colors.gold }]}>
            {audioContent.speaker}
          </Text>
        )}
        <Text style={[styles.description, { color: textSecondary }]}>
          {language === 'ar' && audioContent.descriptionAr
            ? audioContent.descriptionAr
            : audioContent.description}
        </Text>

        {/* Error Message */}
        {audioError && (
          <View style={styles.errorContainer}>
            <Ionicons name="warning" size={24} color={colors.error} />
            <Text style={[styles.errorText, { color: colors.error }]}>
              {audioError}
            </Text>
            <Touchable style={styles.retryButton} onPress={retryLoad}>
              <Ionicons name="refresh" size={20} color={colors.gold} />
              <Text style={[styles.retryText, { color: colors.gold }]}>Réessayer</Text>
            </Touchable>
          </View>
        )}

        {/* Loading indicator for audio */}
        {!audioLoaded && !audioError && (
          <View style={styles.audioLoadingContainer}>
            <ActivityIndicator size="small" color={colors.gold} />
            <Text style={[styles.audioLoadingText, { color: textSecondary }]}>
              Chargement de l'audio...
            </Text>
          </View>
        )}

        {/* Progress Bar */}
        <View style={styles.progressContainer}>
          <Slider
            style={styles.slider}
            minimumValue={0}
            maximumValue={duration || 1}
            value={position}
            onSlidingComplete={seekTo}
            minimumTrackTintColor={colors.gold}
            maximumTrackTintColor={textSecondary}
            thumbTintColor={colors.gold}
            disabled={!audioLoaded}
          />
          <View style={styles.timeContainer}>
            <Text style={[styles.timeText, { color: textSecondary }]}>
              {formatTime(position)}
            </Text>
            <Text style={[styles.timeText, { color: textSecondary }]}>
              {formatTime(duration)}
            </Text>
          </View>
        </View>

        {/* Controls */}
        <View style={styles.controls}>
          <Touchable 
            style={[styles.controlButton, !audioLoaded && styles.disabledButton]} 
            onPress={skipBackward}
            disabled={!audioLoaded}
          >
            <Ionicons name="play-back" size={36} color={audioLoaded ? textColor : textSecondary} />
          </Touchable>
          
          <Touchable
            style={[
              styles.playPauseButton, 
              { backgroundColor: audioLoaded ? colors.gold : textSecondary }
            ]}
            onPress={togglePlayPause}
          >
            {!audioLoaded ? (
              <ActivityIndicator size="small" color="#FFF" />
            ) : (
              <Ionicons
                name={isPlaying ? 'pause' : 'play'}
                size={40}
                color="#FFF"
              />
            )}
          </Touchable>
          
          <Touchable 
            style={[styles.controlButton, !audioLoaded && styles.disabledButton]} 
            onPress={skipForward}
            disabled={!audioLoaded}
          >
            <Ionicons name="play-forward" size={36} color={audioLoaded ? textColor : textSecondary} />
          </Touchable>
        </View>
      </View>
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
  header: {
    padding: spacing.md,
    alignItems: 'center',
  },
  closeButton: {
    width: 44,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.xl,
  },
  albumArt: {
    width: 200,
    height: 200,
    borderRadius: borderRadius.xl,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.xl,
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: spacing.xs,
  },
  speaker: {
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: spacing.sm,
  },
  description: {
    fontSize: 14,
    textAlign: 'center',
    marginBottom: spacing.lg,
  },
  errorContainer: {
    alignItems: 'center',
    marginBottom: spacing.lg,
    padding: spacing.md,
    backgroundColor: 'rgba(244, 67, 54, 0.1)',
    borderRadius: borderRadius.md,
  },
  errorText: {
    fontSize: 14,
    marginTop: spacing.xs,
    textAlign: 'center',
  },
  retryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: spacing.sm,
    padding: spacing.sm,
    gap: spacing.xs,
  },
  retryText: {
    fontSize: 14,
    fontWeight: '600',
  },
  audioLoadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.lg,
    gap: spacing.sm,
  },
  audioLoadingText: {
    fontSize: 14,
  },
  progressContainer: {
    width: '100%',
    marginBottom: spacing.xl,
  },
  slider: {
    width: '100%',
    height: 40,
  },
  timeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.sm,
  },
  timeText: {
    fontSize: 12,
  },
  controls: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.xl,
  },
  controlButton: {
    width: 56,
    height: 56,
    justifyContent: 'center',
    alignItems: 'center',
  },
  disabledButton: {
    opacity: 0.5,
  },
  playPauseButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

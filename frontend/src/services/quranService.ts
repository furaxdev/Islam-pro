import axios from 'axios';

const QURAN_API = 'https://api.alquran.cloud/v1';

export interface Surah {
  number: number;
  name: string;
  englishName: string;
  englishNameTranslation: string;
  numberOfAyahs: number;
  revelationType: string;
}

export interface Ayah {
  number: number;
  numberInSurah: number;
  text: string;
  audio?: string;
  translation?: string;
}

export interface SurahDetail {
  number: number;
  name: string;
  englishName: string;
  ayahs: Ayah[];
}

export async function getAllSurahs(): Promise<Surah[]> {
  const response = await axios.get(`${QURAN_API}/surah`);
  return response.data.data;
}

export async function getSurahWithArabic(surahNumber: number): Promise<SurahDetail> {
  const response = await axios.get(`${QURAN_API}/surah/${surahNumber}`);
  return response.data.data;
}

export async function getSurahWithTranslation(
  surahNumber: number,
  language: string = 'fr'
): Promise<SurahDetail> {
  // Get translation edition based on language
  let edition = 'fr.hamidullah'; // French default
  if (language === 'en') edition = 'en.sahih';
  if (language === 'ar') edition = 'ar.muyassar';
  
  const response = await axios.get(`${QURAN_API}/surah/${surahNumber}/${edition}`);
  return response.data.data;
}

export async function getSurahWithAudio(
  surahNumber: number,
  reciter: string = 'ar.alafasy'
): Promise<SurahDetail> {
  const response = await axios.get(`${QURAN_API}/surah/${surahNumber}/${reciter}`);
  return response.data.data;
}

export async function getFullSurahData(
  surahNumber: number,
  translationLang: string = 'fr'
): Promise<{ arabic: SurahDetail; translation: SurahDetail; audio: SurahDetail }> {
  let translationEdition = 'fr.hamidullah';
  if (translationLang === 'en') translationEdition = 'en.sahih';
  
  const [arabicRes, translationRes, audioRes] = await Promise.all([
    axios.get(`${QURAN_API}/surah/${surahNumber}`),
    axios.get(`${QURAN_API}/surah/${surahNumber}/${translationEdition}`),
    axios.get(`${QURAN_API}/surah/${surahNumber}/ar.alafasy`),
  ]);
  
  return {
    arabic: arabicRes.data.data,
    translation: translationRes.data.data,
    audio: audioRes.data.data,
  };
}

export function getAudioUrl(surahNumber: number, ayahNumber: number): string {
  // Using Alafasy reciter
  const formattedSurah = surahNumber.toString().padStart(3, '0');
  const formattedAyah = ayahNumber.toString().padStart(3, '0');
  return `https://cdn.islamic.network/quran/audio/128/ar.alafasy/${surahNumber}${formattedAyah}.mp3`;
}

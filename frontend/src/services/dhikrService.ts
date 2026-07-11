import { TranslationKey } from '../i18n/translations';

export interface Dhikr {
  id: string;
  nameAr: string;
  textAr: string;
  transliteration: string;
  meaningKey: TranslationKey;
  targetCount: number;
}

export const dhikrList: Dhikr[] = [
  {
    id: 'subhanallah',
    nameAr: 'سبحان الله',
    textAr: 'سُبْحَانَ اللَّهِ',
    transliteration: 'SubhanAllah',
    meaningKey: 'meaningSubhanallah',
    targetCount: 33,
  },
  {
    id: 'alhamdulillah',
    nameAr: 'الحمد لله',
    textAr: 'الْحَمْدُ لِلَّهِ',
    transliteration: 'Alhamdulillah',
    meaningKey: 'meaningAlhamdulillah',
    targetCount: 33,
  },
  {
    id: 'allahuakbar',
    nameAr: 'الله أكبر',
    textAr: 'اللَّهُ أَكْبَرُ',
    transliteration: 'Allahu Akbar',
    meaningKey: 'meaningAllahuAkbar',
    targetCount: 34,
  },
  {
    id: 'lailahaillallah',
    nameAr: 'لا إله إلا الله',
    textAr: 'لَا إِلَهَ إِلَّا اللَّهُ',
    transliteration: 'La ilaha illa Allah',
    meaningKey: 'meaningLaIlahaIllallah',
    targetCount: 100,
  },
  {
    id: 'astaghfirullah',
    nameAr: 'أستغفر الله',
    textAr: 'أَسْتَغْفِرُ اللَّهَ',
    transliteration: 'Astaghfirullah',
    meaningKey: 'meaningAstaghfirullah',
    targetCount: 100,
  },
  {
    id: 'lahawla',
    nameAr: 'لا حول ولا قوة إلا بالله',
    textAr: 'لَا حَوْلَ وَلَا قُوَّةَ إِلَّا بِاللَّهِ',
    transliteration: 'La hawla wa la quwwata illa billah',
    meaningKey: 'meaningLaHawla',
    targetCount: 100,
  },
];

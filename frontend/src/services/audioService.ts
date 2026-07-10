export interface AudioContent {
  id: string;
  title: string;
  titleAr?: string;
  description: string;
  descriptionAr?: string;
  duration: string;
  category: 'podcast' | 'sleep' | 'prophet' | 'lecture';
  audioUrl: string;
  speaker?: string;
}

// Prophet Stories - Using reliable Quran audio URLs (Surahs that tell prophet stories)
export const prophetStories: AudioContent[] = [
  {
    id: 'prophet-adam',
    title: 'Histoire du Prophète Adam',
    titleAr: 'قصة النبي آدم',
    description: 'Sourate Al-Baqarah - La création d\'Adam et son histoire',
    duration: '15:00',
    category: 'prophet',
    speaker: 'Mishary Rashid Alafasy',
    // Al-Baqarah verses about Adam (30-39)
    audioUrl: 'https://cdn.islamic.network/quran/audio/128/ar.alafasy/30.mp3',
  },
  {
    id: 'prophet-nuh',
    title: 'Histoire du Prophète Noé (Nuh)',
    titleAr: 'قصة النبي نوح',
    description: 'Sourate Nuh - L\'histoire complète de Noé',
    duration: '6:00',
    category: 'prophet',
    speaker: 'Mishary Rashid Alafasy',
    // Surah Nuh (71) - first verse
    audioUrl: 'https://cdn.islamic.network/quran/audio/128/ar.alafasy/5670.mp3',
  },
  {
    id: 'prophet-ibrahim',
    title: 'Histoire du Prophète Ibrahim',
    titleAr: 'قصة النبي إبراهيم',
    description: 'Sourate Ibrahim - L\'ami d\'Allah',
    duration: '12:00',
    category: 'prophet',
    speaker: 'Mishary Rashid Alafasy',
    // Surah Ibrahim (14) 
    audioUrl: 'https://cdn.islamic.network/quran/audio/128/ar.alafasy/1588.mp3',
  },
  {
    id: 'prophet-yusuf',
    title: 'Histoire du Prophète Youssef',
    titleAr: 'قصة النبي يوسف',
    description: 'Sourate Yusuf - La plus belle des histoires',
    duration: '45:00',
    category: 'prophet',
    speaker: 'Mishary Rashid Alafasy',
    // Surah Yusuf (12)
    audioUrl: 'https://cdn.islamic.network/quran/audio/128/ar.alafasy/1378.mp3',
  },
  {
    id: 'prophet-musa-1',
    title: 'Histoire du Prophète Moïse (Partie 1)',
    titleAr: 'قصة النبي موسى - الجزء الأول',
    description: 'Sourate Ta-Ha - La révélation à Moïse',
    duration: '20:00',
    category: 'prophet',
    speaker: 'Mishary Rashid Alafasy',
    // Surah Ta-Ha (20)
    audioUrl: 'https://cdn.islamic.network/quran/audio/128/ar.alafasy/2431.mp3',
  },
  {
    id: 'prophet-musa-2',
    title: 'Histoire du Prophète Moïse (Partie 2)',
    titleAr: 'قصة النبي موسى - الجزء الثاني',
    description: 'Sourate Al-Qasas - Le récit complet',
    duration: '30:00',
    category: 'prophet',
    speaker: 'Mishary Rashid Alafasy',
    // Surah Al-Qasas (28)
    audioUrl: 'https://cdn.islamic.network/quran/audio/128/ar.alafasy/3159.mp3',
  },
  {
    id: 'prophet-isa',
    title: 'Histoire du Prophète Jésus (Isa)',
    titleAr: 'قصة النبي عيسى',
    description: 'Sourate Maryam - La naissance miraculeuse',
    duration: '18:00',
    category: 'prophet',
    speaker: 'Mishary Rashid Alafasy',
    // Surah Maryam (19)
    audioUrl: 'https://cdn.islamic.network/quran/audio/128/ar.alafasy/2346.mp3',
  },
  {
    id: 'prophet-dawud',
    title: 'Histoire du Prophète David (Dawud)',
    titleAr: 'قصة النبي داود',
    description: 'Sourate Sad - Le roi prophète',
    duration: '15:00',
    category: 'prophet',
    speaker: 'Mishary Rashid Alafasy',
    // Surah Sad (38)
    audioUrl: 'https://cdn.islamic.network/quran/audio/128/ar.alafasy/3820.mp3',
  },
  {
    id: 'prophet-sulayman',
    title: 'Histoire du Prophète Salomon (Sulayman)',
    titleAr: 'قصة النبي سليمان',
    description: 'Sourate An-Naml - Le roi et les djinns',
    duration: '22:00',
    category: 'prophet',
    speaker: 'Mishary Rashid Alafasy',
    // Surah An-Naml (27)
    audioUrl: 'https://cdn.islamic.network/quran/audio/128/ar.alafasy/3066.mp3',
  },
  {
    id: 'prophet-ayyub',
    title: 'Histoire du Prophète Job (Ayyub)',
    titleAr: 'قصة النبي أيوب',
    description: 'Sourate Al-Anbiya - La patience exemplaire',
    duration: '15:00',
    category: 'prophet',
    speaker: 'Mishary Rashid Alafasy',
    // Surah Al-Anbiya (21)
    audioUrl: 'https://cdn.islamic.network/quran/audio/128/ar.alafasy/2563.mp3',
  },
];

// Sleep stories - Relaxing Quran recitation
export const sleepStories: AudioContent[] = [
  {
    id: 'sleep-yaseen',
    title: 'Sourate Ya-Sin',
    titleAr: 'سورة يس',
    description: 'Le cœur du Coran pour un sommeil paisible',
    duration: '13:00',
    category: 'sleep',
    speaker: 'Mishary Rashid Alafasy',
    audioUrl: 'https://cdn.islamic.network/quran/audio/128/ar.alafasy/3705.mp3',
  },
  {
    id: 'sleep-rahman',
    title: 'Sourate Ar-Rahman',
    titleAr: 'سورة الرحمن',
    description: 'Les bienfaits d\'Allah - Le Tout Miséricordieux',
    duration: '12:00',
    category: 'sleep',
    speaker: 'Mishary Rashid Alafasy',
    audioUrl: 'https://cdn.islamic.network/quran/audio/128/ar.alafasy/4817.mp3',
  },
  {
    id: 'sleep-mulk',
    title: 'Sourate Al-Mulk',
    titleAr: 'سورة الملك',
    description: 'Protection nocturne - La Royauté',
    duration: '5:00',
    category: 'sleep',
    speaker: 'Mishary Rashid Alafasy',
    audioUrl: 'https://cdn.islamic.network/quran/audio/128/ar.alafasy/5058.mp3',
  },
  {
    id: 'sleep-waqiah',
    title: 'Sourate Al-Waqiah',
    titleAr: 'سورة الواقعة',
    description: 'Protection contre la pauvreté - L\'Événement',
    duration: '8:00',
    category: 'sleep',
    speaker: 'Mishary Rashid Alafasy',
    audioUrl: 'https://cdn.islamic.network/quran/audio/128/ar.alafasy/4895.mp3',
  },
  {
    id: 'sleep-kahf',
    title: 'Sourate Al-Kahf',
    titleAr: 'سورة الكهف',
    description: 'La Caverne - Lumière du vendredi',
    duration: '25:00',
    category: 'sleep',
    speaker: 'Mishary Rashid Alafasy',
    audioUrl: 'https://cdn.islamic.network/quran/audio/128/ar.alafasy/2236.mp3',
  },
  {
    id: 'sleep-dukhan',
    title: 'Sourate Ad-Dukhan',
    titleAr: 'سورة الدخان',
    description: 'La Fumée - Récitation douce',
    duration: '6:00',
    category: 'sleep',
    speaker: 'Mishary Rashid Alafasy',
    audioUrl: 'https://cdn.islamic.network/quran/audio/128/ar.alafasy/4489.mp3',
  },
  {
    id: 'sleep-sajdah',
    title: 'Sourate As-Sajdah',
    titleAr: 'سورة السجدة',
    description: 'La Prosternation - Recommandée avant de dormir',
    duration: '5:00',
    category: 'sleep',
    speaker: 'Mishary Rashid Alafasy',
    audioUrl: 'https://cdn.islamic.network/quran/audio/128/ar.alafasy/3473.mp3',
  },
  {
    id: 'sleep-muzzammil',
    title: 'Sourate Al-Muzzammil',
    titleAr: 'سورة المزمل',
    description: 'L\'Enveloppé - La prière de nuit',
    duration: '4:00',
    category: 'sleep',
    speaker: 'Mishary Rashid Alafasy',
    audioUrl: 'https://cdn.islamic.network/quran/audio/128/ar.alafasy/5297.mp3',
  },
];

// Islamic lectures - Short Surahs with explanations
export const islamicPodcasts: AudioContent[] = [
  {
    id: 'lecture-fatiha',
    title: 'Sourate Al-Fatiha',
    titleAr: 'سورة الفاتحة',
    description: 'L\'Ouverture - La mère du Livre',
    duration: '1:00',
    category: 'lecture',
    speaker: 'Mishary Rashid Alafasy',
    audioUrl: 'https://cdn.islamic.network/quran/audio/128/ar.alafasy/1.mp3',
  },
  {
    id: 'lecture-ikhlas',
    title: 'Sourate Al-Ikhlas',
    titleAr: 'سورة الإخلاص',
    description: 'Le Monothéisme Pur - Équivaut à 1/3 du Coran',
    duration: '0:30',
    category: 'lecture',
    speaker: 'Mishary Rashid Alafasy',
    audioUrl: 'https://cdn.islamic.network/quran/audio/128/ar.alafasy/6222.mp3',
  },
  {
    id: 'lecture-falaq',
    title: 'Sourate Al-Falaq',
    titleAr: 'سورة الفلق',
    description: 'L\'Aube Naissante - Protection contre le mal',
    duration: '0:30',
    category: 'lecture',
    speaker: 'Mishary Rashid Alafasy',
    audioUrl: 'https://cdn.islamic.network/quran/audio/128/ar.alafasy/6226.mp3',
  },
  {
    id: 'lecture-nas',
    title: 'Sourate An-Nas',
    titleAr: 'سورة الناس',
    description: 'Les Hommes - Refuge contre le chuchoteur',
    duration: '0:30',
    category: 'lecture',
    speaker: 'Mishary Rashid Alafasy',
    audioUrl: 'https://cdn.islamic.network/quran/audio/128/ar.alafasy/6231.mp3',
  },
  {
    id: 'lecture-ayat-kursi',
    title: 'Ayat Al-Kursi',
    titleAr: 'آية الكرسي',
    description: 'Le Verset du Trône - Le plus grand verset',
    duration: '1:00',
    category: 'lecture',
    speaker: 'Mishary Rashid Alafasy',
    audioUrl: 'https://cdn.islamic.network/quran/audio/128/ar.alafasy/262.mp3',
  },
  {
    id: 'lecture-baqarah-end',
    title: 'Fin de Sourate Al-Baqarah',
    titleAr: 'خواتيم سورة البقرة',
    description: 'Les deux derniers versets - Protection nocturne',
    duration: '1:00',
    category: 'lecture',
    speaker: 'Mishary Rashid Alafasy',
    audioUrl: 'https://cdn.islamic.network/quran/audio/128/ar.alafasy/285.mp3',
  },
  {
    id: 'lecture-asr',
    title: 'Sourate Al-Asr',
    titleAr: 'سورة العصر',
    description: 'Le Temps - La sagesse en 3 versets',
    duration: '0:20',
    category: 'lecture',
    speaker: 'Mishary Rashid Alafasy',
    audioUrl: 'https://cdn.islamic.network/quran/audio/128/ar.alafasy/6188.mp3',
  },
  {
    id: 'lecture-kafirun',
    title: 'Sourate Al-Kafirun',
    titleAr: 'سورة الكافرون',
    description: 'Les Mécréants - La déclaration de foi',
    duration: '0:30',
    category: 'lecture',
    speaker: 'Mishary Rashid Alafasy',
    audioUrl: 'https://cdn.islamic.network/quran/audio/128/ar.alafasy/6204.mp3',
  },
  {
    id: 'lecture-nasr',
    title: 'Sourate An-Nasr',
    titleAr: 'سورة النصر',
    description: 'Le Secours - La victoire d\'Allah',
    duration: '0:20',
    category: 'lecture',
    speaker: 'Mishary Rashid Alafasy',
    audioUrl: 'https://cdn.islamic.network/quran/audio/128/ar.alafasy/6210.mp3',
  },
  {
    id: 'lecture-masad',
    title: 'Sourate Al-Masad',
    titleAr: 'سورة المسد',
    description: 'Les Fibres - Leçon de l\'histoire',
    duration: '0:25',
    category: 'lecture',
    speaker: 'Mishary Rashid Alafasy',
    audioUrl: 'https://cdn.islamic.network/quran/audio/128/ar.alafasy/6215.mp3',
  },
];

export function getContentByCategory(category: string): AudioContent[] {
  switch (category) {
    case 'prophet':
      return prophetStories;
    case 'sleep':
      return sleepStories;
    case 'podcast':
    case 'lecture':
      return islamicPodcasts;
    default:
      return [...prophetStories, ...sleepStories, ...islamicPodcasts];
  }
}

export function getAllAudioContent(): AudioContent[] {
  return [...prophetStories, ...sleepStories, ...islamicPodcasts];
}

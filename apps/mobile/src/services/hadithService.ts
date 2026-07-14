import axios from 'axios';

export interface Hadith {
  id: number;
  arabic: string;
  translation: string;
  source: string;
  narrator?: string;
}

// Sample hadiths for daily display (you can expand this)
const sampleHadiths: Hadith[] = [
  {
    id: 1,
    arabic: 'إِنَّمَا الْأَعْمَالُ بِالنِّيَّاتِ وَإِنَّمَا لِكُلِّ امْرِئٍ مَا نَوَى',
    translation: 'Les actions ne valent que par les intentions et chacun n\'a que ce qu\'il a eu l\'intention de faire.',
    source: 'Sahih al-Bukhari 1, Sahih Muslim 1907',
    narrator: 'Omar ibn al-Khattab',
  },
  {
    id: 2,
    arabic: 'مَنْ كَانَ يُؤْمِنُ بِاللَّهِ وَالْيَوْمِ الْآخِرِ فَلْيَقُلْ خَيْرًا أَوْ لِيَصْمُتْ',
    translation: 'Que celui qui croit en Allah et au Jour dernier dise du bien ou se taise.',
    source: 'Sahih al-Bukhari 6018, Sahih Muslim 47',
    narrator: 'Abu Hurayra',
  },
  {
    id: 3,
    arabic: 'لَا يُؤْمِنُ أَحَدُكُمْ حَتَّى يُحِبَّ لِأَخِيهِ مَا يُحِبُّ لِنَفْسِهِ',
    translation: 'Aucun d\'entre vous ne sera croyant jusqu\'à ce qu\'il aime pour son frère ce qu\'il aime pour lui-même.',
    source: 'Sahih al-Bukhari 13, Sahih Muslim 45',
    narrator: 'Anas ibn Malik',
  },
  {
    id: 4,
    arabic: 'الْمُسْلِمُ مَنْ سَلِمَ الْمُسْلِمُونَ مِنْ لِسَانِهِ وَيَدِهِ',
    translation: 'Le musulman est celui dont les autres musulmans sont à l\'abri de sa langue et de sa main.',
    source: 'Sahih al-Bukhari 10, Sahih Muslim 40',
    narrator: 'Abdullah ibn Amr',
  },
  {
    id: 5,
    arabic: 'مَنْ صَلَّى عَلَيَّ صَلَاةً صَلَّى اللَّهُ عَلَيْهِ بِهَا عَشْرًا',
    translation: 'Quiconque prie sur moi une fois, Allah prie sur lui dix fois.',
    source: 'Sahih Muslim 384',
    narrator: 'Abu Hurayra',
  },
  {
    id: 6,
    arabic: 'خَيْرُكُمْ مَنْ تَعَلَّمَ الْقُرْآنَ وَعَلَّمَهُ',
    translation: 'Le meilleur d\'entre vous est celui qui apprend le Coran et l\'enseigne.',
    source: 'Sahih al-Bukhari 5027',
    narrator: 'Uthman ibn Affan',
  },
  {
    id: 7,
    arabic: 'تَبَسُّمُكَ فِي وَجْهِ أَخِيكَ لَكَ صَدَقَةٌ',
    translation: 'Ton sourire à ton frère est une aumône pour toi.',
    source: 'Jami at-Tirmidhi 1956',
    narrator: 'Abu Dharr',
  },
];

export function getDailyHadith(): Hadith {
  // Use day of year to get consistent daily hadith
  const now = new Date();
  const start = new Date(now.getFullYear(), 0, 0);
  const diff = now.getTime() - start.getTime();
  const oneDay = 1000 * 60 * 60 * 24;
  const dayOfYear = Math.floor(diff / oneDay);
  
  return sampleHadiths[dayOfYear % sampleHadiths.length];
}

export function getAllHadiths(): Hadith[] {
  return sampleHadiths;
}

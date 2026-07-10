export interface Dhikr {
  id: string;
  nameAr: string;
  textAr: string;
  transliteration: string;
  meaning: string;
  targetCount: number;
  color: string;
}

export const dhikrList: Dhikr[] = [
  {
    id: 'subhanallah',
    nameAr: 'سبحان الله',
    textAr: 'سُبْحَانَ اللَّهِ',
    transliteration: 'SubhanAllah',
    meaning: 'Gloire à Allah',
    targetCount: 33,
    color: '#1B5E20',
  },
  {
    id: 'alhamdulillah',
    nameAr: 'الحمد لله',
    textAr: 'الْحَمْدُ لِلَّهِ',
    transliteration: 'Alhamdulillah',
    meaning: 'Louange à Allah',
    targetCount: 33,
    color: '#D4AF37',
  },
  {
    id: 'allahuakbar',
    nameAr: 'الله أكبر',
    textAr: 'اللَّهُ أَكْبَرُ',
    transliteration: 'Allahu Akbar',
    meaning: 'Allah est le plus Grand',
    targetCount: 34,
    color: '#3F51B5',
  },
  {
    id: 'lailahaillallah',
    nameAr: 'لا إله إلا الله',
    textAr: 'لَا إِلَهَ إِلَّا اللَّهُ',
    transliteration: 'La ilaha illa Allah',
    meaning: 'Il n\'y a de divinité qu\'Allah',
    targetCount: 100,
    color: '#9C27B0',
  },
  {
    id: 'astaghfirullah',
    nameAr: 'أستغفر الله',
    textAr: 'أَسْتَغْفِرُ اللَّهَ',
    transliteration: 'Astaghfirullah',
    meaning: 'Je demande pardon à Allah',
    targetCount: 100,
    color: '#FF5722',
  },
  {
    id: 'lahawla',
    nameAr: 'لا حول ولا قوة إلا بالله',
    textAr: 'لَا حَوْلَ وَلَا قُوَّةَ إِلَّا بِاللَّهِ',
    transliteration: 'La hawla wa la quwwata illa billah',
    meaning: 'Il n\'y a de force ni de puissance qu\'en Allah',
    targetCount: 100,
    color: '#1A237E',
  },
];

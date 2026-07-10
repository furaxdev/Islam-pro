export interface IslamicEvent {
  id: string;
  name: string;
  nameAr: string;
  description: string;
  descriptionAr: string;
  hijriMonth: number;
  hijriDay: number;
  type: 'eid' | 'holy' | 'historical' | 'ramadan';
}

export const islamicEvents: IslamicEvent[] = [
  // Muharram (1)
  {
    id: 'new-year',
    name: 'Nouvel An Islamique',
    nameAr: 'رأس السنة الهجرية',
    description: 'Début de l\'année islamique',
    descriptionAr: 'بداية السنة الهجرية الجديدة',
    hijriMonth: 1,
    hijriDay: 1,
    type: 'holy',
  },
  {
    id: 'ashura',
    name: 'Jour d\'Achoura',
    nameAr: 'يوم عاشوراء',
    description: 'Le 10ème jour de Muharram, jour de jeûne recommandé',
    descriptionAr: 'اليوم العاشر من محرم',
    hijriMonth: 1,
    hijriDay: 10,
    type: 'holy',
  },
  // Rabi al-Awwal (3)
  {
    id: 'mawlid',
    name: 'Mawlid an-Nabi',
    nameAr: 'المولد النبوي',
    description: 'Commémoration de la naissance du Prophète ﷺ',
    descriptionAr: 'ذكرى مولد النبي محمد ﷺ',
    hijriMonth: 3,
    hijriDay: 12,
    type: 'holy',
  },
  // Rajab (7)
  {
    id: 'isra-miraj',
    name: 'Isra et Mi\'raj',
    nameAr: 'الإسراء والمعراج',
    description: 'Voyage nocturne et ascension du Prophète ﷺ',
    descriptionAr: 'رحلة الإسراء والمعراج',
    hijriMonth: 7,
    hijriDay: 27,
    type: 'holy',
  },
  // Sha'ban (8)
  {
    id: 'nisf-shaban',
    name: 'Nuit du 15 Sha\'ban',
    nameAr: 'ليلة النصف من شعبان',
    description: 'Nuit bénie du milieu de Sha\'ban',
    descriptionAr: 'ليلة مباركة في منتصف شعبان',
    hijriMonth: 8,
    hijriDay: 15,
    type: 'holy',
  },
  // Ramadan (9)
  {
    id: 'ramadan-start',
    name: 'Début du Ramadan',
    nameAr: 'بداية رمضان',
    description: 'Premier jour du mois béni de Ramadan',
    descriptionAr: 'أول يوم من شهر رمضان المبارك',
    hijriMonth: 9,
    hijriDay: 1,
    type: 'ramadan',
  },
  {
    id: 'laylat-qadr',
    name: 'Laylat al-Qadr',
    nameAr: 'ليلة القدر',
    description: 'La Nuit du Destin, meilleure que mille mois',
    descriptionAr: 'ليلة خير من ألف شهر',
    hijriMonth: 9,
    hijriDay: 27,
    type: 'ramadan',
  },
  // Shawwal (10)
  {
    id: 'eid-fitr',
    name: 'Aïd al-Fitr',
    nameAr: 'عيد الفطر',
    description: 'Fête de la rupture du jeûne',
    descriptionAr: 'عيد الفطر المبارك',
    hijriMonth: 10,
    hijriDay: 1,
    type: 'eid',
  },
  // Dhul Hijjah (12)
  {
    id: 'arafat',
    name: 'Jour d\'Arafat',
    nameAr: 'يوم عرفة',
    description: 'Le meilleur jour de l\'année, jour de jeûne recommandé',
    descriptionAr: 'أفضل يوم في السنة',
    hijriMonth: 12,
    hijriDay: 9,
    type: 'holy',
  },
  {
    id: 'eid-adha',
    name: 'Aïd al-Adha',
    nameAr: 'عيد الأضحى',
    description: 'Fête du sacrifice',
    descriptionAr: 'عيد الأضحى المبارك',
    hijriMonth: 12,
    hijriDay: 10,
    type: 'eid',
  },
];

export const hijriMonths = [
  { number: 1, name: 'Muharram', nameAr: 'محرم' },
  { number: 2, name: 'Safar', nameAr: 'صفر' },
  { number: 3, name: 'Rabi al-Awwal', nameAr: 'ربيع الأول' },
  { number: 4, name: 'Rabi al-Thani', nameAr: 'ربيع الثاني' },
  { number: 5, name: 'Jumada al-Awwal', nameAr: 'جمادى الأولى' },
  { number: 6, name: 'Jumada al-Thani', nameAr: 'جمادى الثانية' },
  { number: 7, name: 'Rajab', nameAr: 'رجب' },
  { number: 8, name: 'Sha\'ban', nameAr: 'شعبان' },
  { number: 9, name: 'Ramadan', nameAr: 'رمضان' },
  { number: 10, name: 'Shawwal', nameAr: 'شوال' },
  { number: 11, name: 'Dhul Qi\'dah', nameAr: 'ذو القعدة' },
  { number: 12, name: 'Dhul Hijjah', nameAr: 'ذو الحجة' },
];

export function getEventsForMonth(month: number): IslamicEvent[] {
  return islamicEvents.filter(event => event.hijriMonth === month);
}

export function getRamadanEvents(): IslamicEvent[] {
  return islamicEvents.filter(event => event.type === 'ramadan' || event.hijriMonth === 9);
}

export function getUpcomingEvents(currentHijriMonth: number, currentHijriDay: number): IslamicEvent[] {
  return islamicEvents.filter(event => {
    if (event.hijriMonth > currentHijriMonth) return true;
    if (event.hijriMonth === currentHijriMonth && event.hijriDay >= currentHijriDay) return true;
    return false;
  }).slice(0, 5);
}

export const hijriWeekDays = [
  { name: 'Dim', nameEn: 'Sun', nameAr: 'الأحد' },
  { name: 'Lun', nameEn: 'Mon', nameAr: 'الإثنين' },
  { name: 'Mar', nameEn: 'Tue', nameAr: 'الثلاثاء' },
  { name: 'Mer', nameEn: 'Wed', nameAr: 'الأربعاء' },
  { name: 'Jeu', nameEn: 'Thu', nameAr: 'الخميس' },
  { name: 'Ven', nameEn: 'Fri', nameAr: 'الجمعة' },
  { name: 'Sam', nameEn: 'Sat', nameAr: 'السبت' },
];

// Hijri months alternate between 30 and 29 days (odd months have 30, even have 29),
// with Dhul Hijjah (12) sometimes having 30 in a leap year — 29 is used as a safe default.
export function getDaysInHijriMonth(month: number): number {
  if (month === 12) return 30;
  return month % 2 === 1 ? 30 : 29;
}

export function getHijriMonthStartDay(month: number): number {
  return (month * 2) % 7;
}

export interface DailyImage {
  id: string;
  uri: string;
  caption: string;
}

export function getDailyImages(day: number): DailyImage[] {
  const seed = day % 5;
  const sets: DailyImage[][] = [
    [
      { id: 'kaaba', uri: 'https://images.unsplash.com/photo-1565019011521-b0575cb84e7f?w=800', caption: 'La Kaaba, La Mecque' },
    ],
    [
      { id: 'medina', uri: 'https://images.unsplash.com/photo-1591604129939-f1efa4d9f7fa?w=800', caption: 'Mosquée du Prophète, Médine' },
    ],
    [
      { id: 'quran', uri: 'https://images.unsplash.com/photo-1609599006353-e629aaabfeae?w=800', caption: 'Lecture du Coran' },
    ],
    [
      { id: 'aqsa', uri: 'https://images.unsplash.com/photo-1591123120675-6f7f1aae0e5b?w=800', caption: 'Mosquée Al-Aqsa, Jérusalem' },
    ],
    [
      { id: 'prayer', uri: 'https://images.unsplash.com/photo-1585036156171-384164a8c675?w=800', caption: 'Moment de prière' },
    ],
  ];
  return sets[seed];
}

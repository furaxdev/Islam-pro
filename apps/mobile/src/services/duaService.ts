export interface DuaCategory {
  id: string;
  name: string;
  icon: string;
}

export interface Dua {
  id: string;
  category: string;
  name: string;
  nameAr: string;
  textAr: string;
  transliteration: string;
  text: string;
  source: string;
  occasion: string;
}

export const duaCategories: DuaCategory[] = [
  { id: 'daily', name: 'Quotidien', icon: 'sunny' },
  { id: 'morning-evening', name: 'Matin/Soir', icon: 'partly-sunny' },
  { id: 'food', name: 'Repas', icon: 'restaurant' },
  { id: 'travel', name: 'Voyage', icon: 'car' },
  { id: 'protection', name: 'Protection', icon: 'shield-checkmark' },
];

export const duas: Dua[] = [
  {
    id: 'wake-up',
    category: 'daily',
    name: 'Au réveil',
    nameAr: 'دعاء الاستيقاظ',
    textAr: 'الْحَمْدُ لِلَّهِ الَّذِي أَحْيَانَا بَعْدَ مَا أَمَاتَنَا وَإِلَيْهِ النُّشُورُ',
    transliteration: 'Alhamdu lillahi alladhi ahyana ba\'da ma amatana wa ilayhi n-nushur',
    text: 'Louange à Allah qui nous a redonné la vie après nous avoir fait mourir (le sommeil), et c\'est vers Lui qu\'est la résurrection.',
    source: 'Rapporté par Al-Bukhari',
    occasion: 'À réciter au réveil chaque matin',
  },
  {
    id: 'sleep',
    category: 'daily',
    name: 'Avant de dormir',
    nameAr: 'دعاء النوم',
    textAr: 'بِاسْمِكَ اللَّهُمَّ أَمُوتُ وَأَحْيَا',
    transliteration: 'Bismika Allahumma amutu wa ahya',
    text: 'C\'est en Ton nom, ô Allah, que je meurs et que je vis.',
    source: 'Rapporté par Al-Bukhari',
    occasion: 'À réciter avant de s\'endormir',
  },
  {
    id: 'leaving-home',
    category: 'daily',
    name: 'En sortant de la maison',
    nameAr: 'دعاء الخروج من المنزل',
    textAr: 'بِسْمِ اللَّهِ تَوَكَّلْتُ عَلَى اللَّهِ وَلَا حَوْلَ وَلَا قُوَّةَ إِلَّا بِاللَّهِ',
    transliteration: 'Bismillah, tawakkaltu \'ala Allah, wa la hawla wa la quwwata illa billah',
    text: 'Au nom d\'Allah, je place ma confiance en Allah, il n\'y a de force ni de puissance qu\'en Allah.',
    source: 'Rapporté par Abu Dawud et At-Tirmidhi',
    occasion: 'En quittant son domicile',
  },
  {
    id: 'entering-home',
    category: 'daily',
    name: 'En entrant à la maison',
    nameAr: 'دعاء دخول المنزل',
    textAr: 'اللَّهُمَّ إِنِّي أَسْأَلُكَ خَيْرَ الْمَوْلَجِ وَخَيْرَ الْمَخْرَجِ',
    transliteration: 'Allahumma inni as\'aluka khayra al-mawlaji wa khayra al-makhraji',
    text: 'Ô Allah, je Te demande le meilleur de l\'entrée et le meilleur de la sortie.',
    source: 'Rapporté par Abu Dawud',
    occasion: 'En entrant chez soi',
  },
  {
    id: 'morning-adhkar',
    category: 'morning-evening',
    name: 'Rappel du matin',
    nameAr: 'أذكار الصباح',
    textAr: 'أَصْبَحْنَا وَأَصْبَحَ الْمُلْكُ لِلَّهِ وَالْحَمْدُ لِلَّهِ',
    transliteration: 'Asbahna wa asbaha al-mulku lillah wal hamdu lillah',
    text: 'Nous voici au matin, et la royauté appartient à Allah, louange à Allah.',
    source: 'Rapporté par Muslim',
    occasion: 'Le matin, après Fajr',
  },
  {
    id: 'evening-adhkar',
    category: 'morning-evening',
    name: 'Rappel du soir',
    nameAr: 'أذكار المساء',
    textAr: 'أَمْسَيْنَا وَأَمْسَى الْمُلْكُ لِلَّهِ وَالْحَمْدُ لِلَّهِ',
    transliteration: 'Amsayna wa amsa al-mulku lillah wal hamdu lillah',
    text: 'Nous voici au soir, et la royauté appartient à Allah, louange à Allah.',
    source: 'Rapporté par Muslim',
    occasion: 'Le soir, après Maghrib',
  },
  {
    id: 'before-eating',
    category: 'food',
    name: 'Avant de manger',
    nameAr: 'دعاء قبل الأكل',
    textAr: 'بِسْمِ اللَّهِ',
    transliteration: 'Bismillah',
    text: 'Au nom d\'Allah.',
    source: 'Rapporté par Abu Dawud',
    occasion: 'Avant de commencer un repas',
  },
  {
    id: 'after-eating',
    category: 'food',
    name: 'Après avoir mangé',
    nameAr: 'دعاء بعد الأكل',
    textAr: 'الْحَمْدُ لِلَّهِ الَّذِي أَطْعَمَنِي هَذَا وَرَزَقَنِيهِ مِنْ غَيْرِ حَوْلٍ مِنِّي وَلَا قُوَّةٍ',
    transliteration: 'Alhamdu lillahi alladhi at\'amani hadha wa razaqanihi min ghayri hawlin minni wa la quwwah',
    text: 'Louange à Allah qui m\'a nourri de cela et me l\'a accordé sans force ni puissance de ma part.',
    source: 'Rapporté par Abu Dawud et At-Tirmidhi',
    occasion: 'Après avoir terminé un repas',
  },
  {
    id: 'travel-start',
    category: 'travel',
    name: 'Au début d\'un voyage',
    nameAr: 'دعاء السفر',
    textAr: 'اللَّهُ أَكْبَرُ، اللَّهُ أَكْبَرُ، اللَّهُ أَكْبَرُ، سُبْحَانَ الَّذِي سَخَّرَ لَنَا هَذَا وَمَا كُنَّا لَهُ مُقْرِنِينَ',
    transliteration: 'Allahu Akbar, Allahu Akbar, Allahu Akbar, subhana alladhi sakhkhara lana hadha wa ma kunna lahu muqrinin',
    text: 'Allah est le plus Grand (x3), gloire à Celui qui a mis ceci à notre service, nous n\'aurions pu le maîtriser nous-mêmes.',
    source: 'Rapporté par Muslim',
    occasion: 'En montant dans un véhicule pour voyager',
  },
  {
    id: 'entering-mosque',
    category: 'protection',
    name: 'En entrant à la mosquée',
    nameAr: 'دعاء دخول المسجد',
    textAr: 'اللَّهُمَّ افْتَحْ لِي أَبْوَابَ رَحْمَتِكَ',
    transliteration: 'Allahumma iftah li abwaba rahmatik',
    text: 'Ô Allah, ouvre-moi les portes de Ta miséricorde.',
    source: 'Rapporté par Muslim',
    occasion: 'En entrant dans une mosquée',
  },
  {
    id: 'distress',
    category: 'protection',
    name: 'En cas de détresse',
    nameAr: 'دعاء الكرب',
    textAr: 'لَا إِلَهَ إِلَّا اللَّهُ الْعَظِيمُ الْحَلِيمُ، لَا إِلَهَ إِلَّا اللَّهُ رَبُّ الْعَرْشِ الْعَظِيمِ',
    transliteration: 'La ilaha illa Allah al-Azim al-Halim, la ilaha illa Allah Rabb al-\'Arsh al-\'Azim',
    text: 'Nulle divinité si ce n\'est Allah, l\'Immense, le Longanime. Nulle divinité si ce n\'est Allah, Seigneur du Trône immense.',
    source: 'Rapporté par Al-Bukhari et Muslim',
    occasion: 'En cas d\'angoisse ou de difficulté',
  },
];

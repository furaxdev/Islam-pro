export interface SalahStep {
  id: number;
  title: string;
  titleAr: string;
  description: string;
  rakat: number;
}

export const salahSteps: SalahStep[] = [
  {
    id: 1,
    title: 'Intention (Niyyah)',
    titleAr: 'النية',
    description: 'Formuler intérieurement l\'intention d\'accomplir la prière, sans la prononcer à voix haute.',
    rakat: 0,
  },
  {
    id: 2,
    title: 'Takbir d\'ouverture',
    titleAr: 'تكبيرة الإحرام',
    description: 'Lever les mains à hauteur des épaules ou des oreilles et dire "Allahu Akbar" pour entrer en état de prière.',
    rakat: 0,
  },
  {
    id: 3,
    title: 'Position debout (Qiyam)',
    titleAr: 'القيام',
    description: 'Réciter la Fatiha puis une autre sourate ou des versets du Coran.',
    rakat: 1,
  },
  {
    id: 4,
    title: 'Inclinaison (Ruku)',
    titleAr: 'الركوع',
    description: 'S\'incliner en gardant le dos droit, les mains sur les genoux, en disant "Subhana Rabbiyal Adhim".',
    rakat: 1,
  },
  {
    id: 5,
    title: 'Redressement (I\'tidal)',
    titleAr: 'الاعتدال',
    description: 'Se relever de l\'inclinaison en disant "Sami\' Allahu liman hamidah, Rabbana wa lakal hamd".',
    rakat: 1,
  },
  {
    id: 6,
    title: 'Première prosternation (Sujud)',
    titleAr: 'السجود',
    description: 'Se prosterner front, nez, mains, genoux et pieds au sol en disant "Subhana Rabbiyal A\'la".',
    rakat: 1,
  },
  {
    id: 7,
    title: 'Position assise (Jalsa)',
    titleAr: 'الجلسة بين السجدتين',
    description: 'S\'asseoir brièvement entre les deux prosternations en disant "Rabbi ighfir li".',
    rakat: 1,
  },
  {
    id: 8,
    title: 'Deuxième prosternation',
    titleAr: 'السجدة الثانية',
    description: 'Se prosterner une seconde fois de la même manière, terminant ainsi le premier rak\'ah.',
    rakat: 1,
  },
  {
    id: 9,
    title: 'Tashahhud',
    titleAr: 'التشهد',
    description: 'S\'asseoir et réciter le tashahhud après le dernier rak\'ah, puis la prière sur le Prophète ﷺ.',
    rakat: 0,
  },
  {
    id: 10,
    title: 'Salutation finale (Taslim)',
    titleAr: 'التسليم',
    description: 'Tourner la tête à droite puis à gauche en disant "As-salamu alaykum wa rahmatullah" pour terminer la prière.',
    rakat: 0,
  },
];

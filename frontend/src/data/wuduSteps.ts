export interface WuduStep {
  id: number;
  title: string;
  titleAr: string;
  description: string;
  sunnah: string;
}

export const wuduSteps: WuduStep[] = [
  {
    id: 1,
    title: 'Intention',
    titleAr: 'النية',
    description: 'Formuler l\'intention de faire le wudu pour purifier son cœur et son corps avant la prière.',
    sunnah: 'Dire "Bismillah" avant de commencer',
  },
  {
    id: 2,
    title: 'Laver les mains',
    titleAr: 'غسل اليدين',
    description: 'Laver les mains jusqu\'aux poignets, trois fois, en commençant par la main droite.',
    sunnah: 'Passer les doigts entre eux (takhlil)',
  },
  {
    id: 3,
    title: 'Rincer la bouche',
    titleAr: 'المضمضة',
    description: 'Prendre de l\'eau dans la bouche, la faire circuler puis la recracher, trois fois.',
    sunnah: 'Se rincer énergiquement sauf en état de jeûne',
  },
  {
    id: 4,
    title: 'Nettoyer le nez',
    titleAr: 'الاستنشاق',
    description: 'Aspirer de l\'eau par le nez puis l\'expulser, trois fois.',
    sunnah: 'Utiliser la main gauche pour expulser l\'eau',
  },
  {
    id: 5,
    title: 'Laver le visage',
    titleAr: 'غسل الوجه',
    description: 'Laver tout le visage, du haut du front au menton et d\'une oreille à l\'autre, trois fois.',
    sunnah: 'Faire passer les doigts mouillés dans la barbe',
  },
  {
    id: 6,
    title: 'Laver les avant-bras',
    titleAr: 'غسل اليدين إلى المرفقين',
    description: 'Laver les bras jusqu\'aux coudes, en commençant par le bras droit, trois fois.',
    sunnah: 'Frotter le bras tout en le lavant',
  },
  {
    id: 7,
    title: 'Essuyer la tête',
    titleAr: 'مسح الرأس',
    description: 'Passer les mains mouillées sur l\'ensemble de la tête, de l\'avant vers l\'arrière puis retour.',
    sunnah: 'Essuyer aussi l\'intérieur et l\'extérieur des oreilles',
  },
  {
    id: 8,
    title: 'Laver les pieds',
    titleAr: 'غسل القدمين',
    description: 'Laver les pieds jusqu\'aux chevilles, en commençant par le pied droit, trois fois.',
    sunnah: 'Passer les doigts entre les orteils',
  },
];

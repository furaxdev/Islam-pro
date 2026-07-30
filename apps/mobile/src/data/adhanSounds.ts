// All four recordings are freely licensed on Wikimedia Commons (verified
// provenance — unlike random re-uploads, Commons requires proof of rights
// before publishing). `shortFile` is a ~15s WAV used for the actual OS
// notification sound: iOS only accepts AIFF/WAV/CAF for custom notification
// sounds (no MP3/AAC), and both platforms expect short clips, not multi-
// minute recordings. `fullFile` is the complete recording, compressed to
// AAC/M4A, used only for in-app preview playback.
export interface AdhanSound {
  id: string;
  name: string;
  credit: string;
  shortFile: number;
  fullFile: number;
}

export const ADHAN_SOUNDS: AdhanSound[] = [
  {
    id: 'mecca',
    name: 'Grande Mosquée de La Mecque',
    credit: 'Seyfula Islam, Wikimedia Commons, CC BY 3.0',
    shortFile: require('../../assets/sounds/adhan-mecca.wav'),
    fullFile: require('../../assets/sounds/adhan-mecca-full.m4a'),
  },
  {
    id: 'maghrib',
    name: 'Masjid al-Haram (Maghrib)',
    credit: '3omar Faruq, Wikimedia Commons, CC BY 3.0',
    shortFile: require('../../assets/sounds/adhan-maghrib.wav'),
    fullFile: require('../../assets/sounds/adhan-maghrib-full.m4a'),
  },
  {
    id: 'hassan2',
    name: 'Mosquée Hassan II, Casablanca',
    credit: 'Fraguando, Wikimedia Commons, CC BY-SA 4.0',
    shortFile: require('../../assets/sounds/adhan-hassan2.wav'),
    fullFile: require('../../assets/sounds/adhan-hassan2-full.m4a'),
  },
  {
    id: 'beautiful',
    name: 'Adhan classique',
    credit: 'Adam-synagda, Wikimedia Commons, CC0',
    shortFile: require('../../assets/sounds/adhan-beautiful.wav'),
    fullFile: require('../../assets/sounds/adhan-beautiful-full.m4a'),
  },
];

export function getAdhanSound(id: string): AdhanSound {
  return ADHAN_SOUNDS.find((a) => a.id === id) ?? ADHAN_SOUNDS[0];
}

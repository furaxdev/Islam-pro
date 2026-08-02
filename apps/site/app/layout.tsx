import type { Metadata } from 'next';
import { Fraunces, Public_Sans, IBM_Plex_Mono, Amiri } from 'next/font/google';
import './globals.css';

const fraunces = Fraunces({
  subsets: ['latin'],
  variable: '--font-fraunces',
  axes: ['opsz', 'SOFT', 'WONK'],
  weight: 'variable',
});

const publicSans = Public_Sans({
  subsets: ['latin'],
  variable: '--font-public-sans',
  weight: ['400', '500', '600', '700'],
});

const plexMono = IBM_Plex_Mono({
  subsets: ['latin'],
  variable: '--font-plex-mono',
  weight: ['400', '500'],
});

const amiri = Amiri({
  subsets: ['arabic'],
  variable: '--font-amiri',
  weight: ['400', '700'],
});

export const metadata: Metadata = {
  title: 'Islam Pro : votre compagnon musulman au quotidien',
  description:
    "Horaires de prière précis, Coran, Qibla, Dhikr, calendrier hijri et hadiths. Sans compte, sans publicité, sans traqueur.",
  metadataBase: new URL('https://islampro.app'),
  openGraph: {
    title: 'Islam Pro',
    description: "Votre compagnon musulman au quotidien, sans compte et sans publicité.",
    images: ['/og.png'],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" className={`${fraunces.variable} ${publicSans.variable} ${plexMono.variable} ${amiri.variable}`}>
      <body>{children}</body>
    </html>
  );
}

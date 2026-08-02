import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Islam Pro',
    short_name: 'Islam Pro',
    description:
      'Horaires de prière, Coran, Qibla, Dhikr et calendrier hijri. Sans compte, sans publicité, sans traqueur.',
    start_url: '/',
    display: 'standalone',
    background_color: '#0a1612',
    theme_color: '#0a1612',
    lang: 'fr',
    icons: [
      { src: '/icon-192.png', sizes: '192x192', type: 'image/png', purpose: 'any' },
      { src: '/icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'any' },
      { src: '/icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
    ],
  };
}

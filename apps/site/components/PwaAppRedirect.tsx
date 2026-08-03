'use client';

import { useEffect } from 'react';

const APP_URL = 'https://islam-pro-app.vercel.app/';

/**
 * This site is the marketing landing page, not the app. When it's launched
 * as an installed PWA (home-screen icon, not a normal browser tab) we skip
 * straight to the real app instead of showing the landing page again.
 */
export default function PwaAppRedirect() {
  useEffect(() => {
    const launchedFromHomeScreen = new URLSearchParams(window.location.search).has('pwa');
    const isStandalone =
      window.matchMedia('(display-mode: standalone)').matches ||
      (window.navigator as Navigator & { standalone?: boolean }).standalone === true;

    if (launchedFromHomeScreen || isStandalone) {
      window.location.replace(APP_URL);
    }
  }, []);

  return null;
}

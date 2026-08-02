import { useEffect, useState } from 'react';
import { Platform } from 'react-native';

/**
 * True when the web build is running installed/standalone (added to the
 * home screen or launched from a desktop PWA), as opposed to a normal
 * browser tab. Always false on native iOS/Android/desktop builds.
 */
export function useIsInstalledPWA() {
  const [isStandalone, setIsStandalone] = useState(false);

  useEffect(() => {
    if (Platform.OS !== 'web' || typeof window === 'undefined') return;

    const nav = window.navigator as Navigator & { standalone?: boolean };
    const query = window.matchMedia('(display-mode: standalone)');

    const update = () => setIsStandalone(query.matches || nav.standalone === true);
    update();

    query.addEventListener('change', update);
    return () => query.removeEventListener('change', update);
  }, []);

  return isStandalone;
}

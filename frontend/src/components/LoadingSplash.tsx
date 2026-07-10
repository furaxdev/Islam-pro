import React, { useMemo } from 'react';
import SplashStickman from './splash/SplashStickman';
import SplashStarryMoon from './splash/SplashStarryMoon';

interface LoadingSplashProps {
  darkMode: boolean;
  label?: string;
}

export default function LoadingSplash({ darkMode, label }: LoadingSplashProps) {
  const variant = useMemo(() => (Math.random() < 0.5 ? 'stickman' : 'starry'), []);

  return variant === 'stickman' ? (
    <SplashStickman darkMode={darkMode} label={label} />
  ) : (
    <SplashStarryMoon darkMode={darkMode} label={label} />
  );
}

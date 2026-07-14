import React from 'react';
import SplashStarryMoon from './splash/SplashStarryMoon';

interface LoadingSplashProps {
  darkMode: boolean;
  label?: string;
}

export default function LoadingSplash({ darkMode, label }: LoadingSplashProps) {
  return <SplashStarryMoon darkMode={darkMode} label={label} />;
}

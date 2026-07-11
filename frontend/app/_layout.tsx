import React, { useEffect, useState } from 'react';
import { Stack } from 'expo-router';
import { AppProvider, useApp } from '../src/context/AppContext';
import { StatusBar } from 'expo-status-bar';
import * as SplashScreen from 'expo-splash-screen';
import AppLaunchSplash from '../src/components/AppLaunchSplash';

SplashScreen.preventAutoHideAsync().catch(() => {});
// `fade` is honored on iOS only; Android/Web get an instant hide from the
// native layer, which is why we run our own AppLaunchSplash overlay below
// to control the exit animation identically on every platform.
SplashScreen.setOptions({ duration: 400, fade: true });

function RootLayoutNav() {
  const { isReady, darkMode } = useApp();
  const [showLaunchSplash, setShowLaunchSplash] = useState(true);
  const [nativeSplashHidden, setNativeSplashHidden] = useState(false);

  useEffect(() => {
    // Hide the native splash only once our own overlay has painted a frame
    // underneath it, so there's never a blank gap between the two screens.
    const raf = requestAnimationFrame(() => {
      SplashScreen.hideAsync().catch(() => {});
      setNativeSplashHidden(true);
    });
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <>
      <StatusBar style="light" />
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="surah/[id]" options={{ presentation: 'card' }} />
        <Stack.Screen name="audio/[id]" options={{ presentation: 'modal' }} />
        <Stack.Screen name="settings" options={{ presentation: 'modal' }} />
      </Stack>

      {showLaunchSplash && nativeSplashHidden && (
        <AppLaunchSplash
          darkMode={darkMode}
          ready={isReady}
          onFinish={() => setShowLaunchSplash(false)}
        />
      )}
    </>
  );
}

export default function RootLayout() {
  return (
    <AppProvider>
      <RootLayoutNav />
    </AppProvider>
  );
}

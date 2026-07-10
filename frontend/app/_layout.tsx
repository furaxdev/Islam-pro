import React from 'react';
import { Stack } from 'expo-router';
import { AppProvider } from '../src/context/AppContext';
import { StatusBar } from 'expo-status-bar';

export default function RootLayout() {
  return (
    <AppProvider>
      <StatusBar style="light" />
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="surah/[id]" options={{ presentation: 'card' }} />
        <Stack.Screen name="audio/[id]" options={{ presentation: 'modal' }} />
        <Stack.Screen name="settings" options={{ presentation: 'modal' }} />
      </Stack>
    </AppProvider>
  );
}

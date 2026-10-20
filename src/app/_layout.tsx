import { router, Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';

import { colors } from '@/constants/theme';
import {
  addAlarmResponseListener,
  configureNotifications,
  consumeLaunchResponse,
} from '@/services/notificationService';

export default function RootLayout() {
  useEffect(() => {
    void configureNotifications();
    // HU-004, "Detener el aviso": al tocar la notificación o "Detener" la alarma se calla
    // y la app se abre en el temporizador mostrando la siguiente fase.
    void consumeLaunchResponse();
    const subscription = addAlarmResponseListener(() => router.navigate('/'));
    return () => subscription.remove();
  }, []);

  return (
    <>
      <StatusBar style="dark" />
      <Stack
        screenOptions={{
          headerStyle: { backgroundColor: colors.white },
          headerTintColor: colors.navy,
          headerTitleStyle: { fontWeight: '700' },
          contentStyle: { backgroundColor: colors.background },
        }}
      >
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name="settings" options={{ title: 'Ajustes del pomodoro' }} />
      </Stack>
    </>
  );
}

import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';

import { colors } from '@/constants/theme';

/**
 * Servicio de avisos locales (HU-003 y HU-004).
 *
 * Decisiones técnicas:
 * - El aviso se AGENDA en el sistema al iniciar la fase. Así llega aunque la app esté cerrada,
 *   porque Android lo dispara con AlarmManager sin necesitar el proceso JS vivo.
 * - `delivery: 'alarmClock'` usa AlarmManager.setAlarmClock(): Android no lo retrasa por ahorro
 *   de batería (Doze). Requiere USE_EXACT_ALARM / SCHEDULE_EXACT_ALARM declarados en app.json.
 * - El canal usa `AndroidAudioUsage.ALARM`: el sonido sale por el volumen de ALARMA, que suena
 *   aunque el celular esté en silencio o vibración (HU-004, escenario "celular en silencio").
 * - No hay push ni servidor: todo es local (HU-006).
 */

/** Los ajustes de un canal Android son inmutables tras crearse: si se cambian, subir la versión del id. */
export const ALARM_CHANNEL_ID = 'pomodoro-alarm-v1';
export const PHASE_END_CATEGORY_ID = 'pomodoro-phase-end';
export const STOP_ACTION_ID = 'stop-alarm';
const ALARM_SOUND = 'alarm.wav';
const VIBRATION_PATTERN = [0, 600, 300, 600, 300, 600];

export type NotificationPermission = 'granted' | 'undetermined' | 'denied';

let configured = false;

/**
 * Los avisos nunca deben romper el temporizador (constitución, principio II):
 * si el sistema rechaza una operación, se registra y la app sigue funcionando.
 */
async function safely<T>(action: () => Promise<T>, fallback: T): Promise<T> {
  try {
    return await action();
  } catch (error) {
    console.warn('[notificationService]', error);
    return fallback;
  }
}

/** Se llama una sola vez al arrancar la app (src/app/_layout.tsx). */
export async function configureNotifications(): Promise<void> {
  if (configured) return;
  configured = true;
  await safely(setupHandlerChannelAndCategory, undefined);
}

async function setupHandlerChannelAndCategory(): Promise<void> {
  // Con la app abierta también se muestra el aviso y suena.
  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowBanner: true,
      shouldShowList: true,
      shouldPlaySound: true,
      shouldSetBadge: false,
    }),
  });

  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync(ALARM_CHANNEL_ID, {
      name: 'Fin de estudio y descanso',
      description: 'Alarma que avisa cuando termina cada fase del pomodoro.',
      importance: Notifications.AndroidImportance.MAX,
      sound: ALARM_SOUND,
      audioAttributes: {
        usage: Notifications.AndroidAudioUsage.ALARM,
        contentType: Notifications.AndroidAudioContentType.SONIFICATION,
      },
      vibrationPattern: VIBRATION_PATTERN,
      enableVibrate: true,
      lockscreenVisibility: Notifications.AndroidNotificationVisibility.PUBLIC,
      bypassDnd: true,
      lightColor: colors.gold,
    });
  }

  // Botón "Detener" dentro de la notificación (HU-004, escenario "Detener el aviso").
  await Notifications.setNotificationCategoryAsync(PHASE_END_CATEGORY_ID, [
    {
      identifier: STOP_ACTION_ID,
      buttonTitle: 'Detener',
      options: { opensAppToForeground: true },
    },
  ]);
}

export async function getNotificationPermission(): Promise<NotificationPermission> {
  return safely(async () => {
    const { status, canAskAgain } = await Notifications.getPermissionsAsync();
    if (status === 'granted') return 'granted';
    return canAskAgain ? 'undetermined' : 'denied';
  }, 'denied' as NotificationPermission);
}

export async function requestNotificationPermission(): Promise<boolean> {
  return safely(async () => {
    const { status } = await Notifications.requestPermissionsAsync();
    return status === 'granted';
  }, false);
}

/** Agenda la alarma de fin de fase. Solo existe una alarma pendiente a la vez. */
export async function schedulePhaseEndAlarm(params: {
  endsAt: number;
  title: string;
  body: string;
}): Promise<void> {
  await cancelPhaseEndAlarm();
  await safely(() => Notifications.scheduleNotificationAsync({
    content: {
      title: params.title,
      body: params.body,
      sound: ALARM_SOUND,
      vibrate: VIBRATION_PATTERN,
      priority: Notifications.AndroidNotificationPriority.MAX,
      color: colors.navy,
      categoryIdentifier: PHASE_END_CATEGORY_ID,
      autoDismiss: true,
    },
    trigger: {
      type: Notifications.SchedulableTriggerInputTypes.DATE,
      date: params.endsAt,
      channelId: ALARM_CHANNEL_ID,
      delivery: 'alarmClock',
    },
  }), '');
}

/** HU-003, escenario "Pausar antes de cerrar": al pausar o reiniciar no debe llegar ningún aviso. */
export async function cancelPhaseEndAlarm(): Promise<void> {
  await safely(() => Notifications.cancelAllScheduledNotificationsAsync(), undefined);
}

/** Calla la alarma quitando la notificación que está sonando. */
export async function stopAlarm(): Promise<void> {
  await safely(() => Notifications.dismissAllNotificationsAsync(), undefined);
}

/**
 * Si la app se abrió en frío tocando la notificación (o "Detener"), el listener todavía no existía.
 * Esta función atiende esa respuesta pendiente al arrancar.
 */
export async function consumeLaunchResponse(): Promise<boolean> {
  const response = await safely(() => Notifications.getLastNotificationResponseAsync(), null);
  if (!response) return false;
  await stopAlarm();
  await safely(() => Notifications.clearLastNotificationResponseAsync(), undefined);
  return true;
}

/** Escucha cuando el estudiante toca la notificación o su botón "Detener". */
export function addAlarmResponseListener(onResponse: () => void): { remove: () => void } {
  return Notifications.addNotificationResponseReceivedListener(() => {
    void stopAlarm();
    onResponse();
  });
}

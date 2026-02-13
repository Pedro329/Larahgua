import { useEffect, useRef } from "react";
import * as Notifications from "expo-notifications";
import { Platform } from "react-native";
import { Settings } from "@/types/hydration";

// Configurar handler de notificações
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

export function useNotifications(settings: Settings) {
  const notificationListener = useRef<Notifications.EventSubscription | undefined>(undefined);
  const responseListener = useRef<Notifications.EventSubscription | undefined>(undefined);

  useEffect(() => {
    // Configurar canal de notificação no Android
    if (Platform.OS === "android") {
      Notifications.setNotificationChannelAsync("hydration-reminders", {
        name: "Lembretes de Hidratação",
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        sound: settings.soundEnabled ? "default" : undefined,
      });
    }

    // Listener para notificações recebidas
    notificationListener.current = Notifications.addNotificationReceivedListener((notification) => {
      console.log("Notificação recebida:", notification);
    });

    // Listener para interações com notificações
    responseListener.current = Notifications.addNotificationResponseReceivedListener((response) => {
      console.log("Interação com notificação:", response);
    });

    return () => {
      notificationListener.current?.remove();
      responseListener.current?.remove();
    };
  }, [settings.soundEnabled]);

  const requestPermissions = async () => {
    if (Platform.OS === "web") {
      return false;
    }

    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;

    if (existingStatus !== "granted") {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }

    return finalStatus === "granted";
  };

  const scheduleReminders = async () => {
    if (!settings.notificationsEnabled || Platform.OS === "web") {
      return;
    }

    // Cancelar todas as notificações agendadas anteriormente
    await Notifications.cancelAllScheduledNotificationsAsync();

    // Verificar permissões
    const hasPermission = await requestPermissions();
    if (!hasPermission) {
      console.log("Permissão de notificação negada");
      return;
    }

    // Agendar notificações recorrentes
    const intervalMinutes = settings.reminderInterval;
    const startHour = settings.reminderStartHour;
    const endHour = settings.reminderEndHour;

    // Calcular quantas notificações agendar por dia
    const hoursActive = endHour >= startHour ? endHour - startHour : 24 - startHour + endHour;
    const notificationsPerDay = Math.floor((hoursActive * 60) / intervalMinutes);

    // Agendar notificações para cada intervalo
    for (let i = 0; i < notificationsPerDay; i++) {
      const minutesFromStart = i * intervalMinutes;
      let hour = startHour + Math.floor(minutesFromStart / 60);
      const minute = minutesFromStart % 60;

      // Ajustar hora se passar de 24
      if (hour >= 24) {
        hour = hour - 24;
      }

      // Verificar se está dentro do horário permitido
      if (endHour >= startHour) {
        if (hour < startHour || hour >= endHour) {
          continue;
        }
      } else {
        if (hour >= endHour && hour < startHour) {
          continue;
        }
      }

      await Notifications.scheduleNotificationAsync({
        content: {
          title: "Hora de beber água! 💧",
          body: "Mantenha-se hidratado! Beba um copo de água agora.",
          sound: settings.soundEnabled ? "default" : undefined,
          data: { type: "hydration-reminder" },
        },
        trigger: {
          type: Notifications.SchedulableTriggerInputTypes.CALENDAR,
          hour,
          minute,
          repeats: true,
        },
      });
    }

    console.log(`${notificationsPerDay} lembretes agendados`);
  };

  const cancelAllReminders = async () => {
    await Notifications.cancelAllScheduledNotificationsAsync();
    console.log("Todos os lembretes cancelados");
  };

  const sendTestNotification = async () => {
    if (Platform.OS === "web") {
      return;
    }

    const hasPermission = await requestPermissions();
    if (!hasPermission) {
      console.log("Permissão de notificação negada");
      return;
    }

    await Notifications.scheduleNotificationAsync({
      content: {
        title: "Teste de Notificação 💧",
        body: "Este é um lembrete de teste!",
        sound: settings.soundEnabled ? "default" : undefined,
      },
      trigger: {
        type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
        seconds: 2,
      },
    });
  };

  return {
    requestPermissions,
    scheduleReminders,
    cancelAllReminders,
    sendTestNotification,
  };
}

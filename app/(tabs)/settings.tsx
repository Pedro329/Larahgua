import { ScrollView, Text, View, TextInput, Switch, Pressable, Alert } from "react-native";
import { ScreenContainer } from "@/components/screen-container";
import { useHydration } from "@/hooks/use-hydration";
import { useNotifications } from "@/hooks/use-notifications";
import { useColors } from "@/hooks/use-colors";
import { useState, useEffect } from "react";
import { Platform } from "react-native";

export default function SettingsScreen() {
  const { settings, updateSettings, resetData } = useHydration();
  const { scheduleReminders, cancelAllReminders, sendTestNotification } = useNotifications(settings);
  const colors = useColors();

  const [dailyGoal, setDailyGoal] = useState(settings.dailyGoal.toString());
  const [reminderInterval, setReminderInterval] = useState(settings.reminderInterval.toString());
  const [startHour, setStartHour] = useState(settings.reminderStartHour.toString());
  const [endHour, setEndHour] = useState(settings.reminderEndHour.toString());

  // Reagendar notificações quando configurações mudarem
  useEffect(() => {
    if (settings.notificationsEnabled) {
      scheduleReminders();
    } else {
      cancelAllReminders();
    }
  }, [
    settings.notificationsEnabled,
    settings.reminderInterval,
    settings.reminderStartHour,
    settings.reminderEndHour,
    settings.soundEnabled,
  ]);

  const handleSaveGoal = () => {
    const goal = parseInt(dailyGoal);
    if (isNaN(goal) || goal < 500 || goal > 10000) {
      if (Platform.OS === "web") {
        alert("Meta deve estar entre 500ml e 10000ml");
      } else {
        Alert.alert("Valor inválido", "Meta deve estar entre 500ml e 10000ml");
      }
      return;
    }
    updateSettings({ dailyGoal: goal });
  };

  const handleSaveInterval = () => {
    const interval = parseInt(reminderInterval);
    if (isNaN(interval) || interval < 15 || interval > 480) {
      if (Platform.OS === "web") {
        alert("Intervalo deve estar entre 15 e 480 minutos");
      } else {
        Alert.alert("Valor inválido", "Intervalo deve estar entre 15 e 480 minutos");
      }
      return;
    }
    updateSettings({ reminderInterval: interval });
  };

  const handleSaveStartHour = () => {
    const hour = parseInt(startHour);
    if (isNaN(hour) || hour < 0 || hour > 23) {
      if (Platform.OS === "web") {
        alert("Hora deve estar entre 0 e 23");
      } else {
        Alert.alert("Valor inválido", "Hora deve estar entre 0 e 23");
      }
      return;
    }
    updateSettings({ reminderStartHour: hour });
  };

  const handleSaveEndHour = () => {
    const hour = parseInt(endHour);
    if (isNaN(hour) || hour < 0 || hour > 23) {
      if (Platform.OS === "web") {
        alert("Hora deve estar entre 0 e 23");
      } else {
        Alert.alert("Valor inválido", "Hora deve estar entre 0 e 23");
      }
      return;
    }
    updateSettings({ reminderEndHour: hour });
  };

  const handleReset = () => {
    if (Platform.OS === "web") {
      if (confirm("Tem certeza que deseja resetar todos os dados?")) {
        resetData();
      }
    } else {
      Alert.alert(
        "Resetar dados",
        "Tem certeza que deseja resetar todos os dados? Esta ação não pode ser desfeita.",
        [
          { text: "Cancelar", style: "cancel" },
          { text: "Resetar", style: "destructive", onPress: resetData },
        ]
      );
    }
  };

  const handleTestNotification = () => {
    sendTestNotification();
    if (Platform.OS === "web") {
      alert("Notificações não funcionam na web");
    } else {
      Alert.alert("Teste enviado", "Você receberá uma notificação em alguns segundos");
    }
  };

  return (
    <ScreenContainer className="p-6">
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <View className="flex-1 gap-6">
          <Text className="text-2xl font-bold text-foreground">Configurações</Text>

          {/* Meta diária */}
          <View className="bg-surface rounded-xl p-4 gap-2">
            <Text className="text-base font-semibold text-foreground">Meta diária (ml)</Text>
            <Text className="text-sm text-muted">Quantidade de água que deseja beber por dia</Text>
            <View className="flex-row gap-2 mt-2">
              <TextInput
                className="flex-1 bg-background rounded-lg px-4 py-3 text-foreground"
                style={{ borderWidth: 1, borderColor: colors.border }}
                value={dailyGoal}
                onChangeText={setDailyGoal}
                keyboardType="numeric"
                returnKeyType="done"
                onSubmitEditing={handleSaveGoal}
              />
              <Pressable
                onPress={handleSaveGoal}
                style={({ pressed }) => [
                  {
                    backgroundColor: colors.primary,
                    borderRadius: 8,
                    paddingHorizontal: 20,
                    justifyContent: "center",
                    opacity: pressed ? 0.7 : 1,
                  },
                ]}
              >
                <Text className="text-white font-semibold">Salvar</Text>
              </Pressable>
            </View>
          </View>

          {/* Intervalo de lembretes */}
          <View className="bg-surface rounded-xl p-4 gap-2">
            <Text className="text-base font-semibold text-foreground">
              Intervalo entre lembretes (minutos)
            </Text>
            <Text className="text-sm text-muted">
              Com que frequência deseja receber lembretes
            </Text>
            <View className="flex-row gap-2 mt-2">
              <TextInput
                className="flex-1 bg-background rounded-lg px-4 py-3 text-foreground"
                style={{ borderWidth: 1, borderColor: colors.border }}
                value={reminderInterval}
                onChangeText={setReminderInterval}
                keyboardType="numeric"
                returnKeyType="done"
                onSubmitEditing={handleSaveInterval}
              />
              <Pressable
                onPress={handleSaveInterval}
                style={({ pressed }) => [
                  {
                    backgroundColor: colors.primary,
                    borderRadius: 8,
                    paddingHorizontal: 20,
                    justifyContent: "center",
                    opacity: pressed ? 0.7 : 1,
                  },
                ]}
              >
                <Text className="text-white font-semibold">Salvar</Text>
              </Pressable>
            </View>
          </View>

          {/* Horário de início */}
          <View className="bg-surface rounded-xl p-4 gap-2">
            <Text className="text-base font-semibold text-foreground">
              Horário de início (0-23)
            </Text>
            <Text className="text-sm text-muted">Hora em que os lembretes começam</Text>
            <View className="flex-row gap-2 mt-2">
              <TextInput
                className="flex-1 bg-background rounded-lg px-4 py-3 text-foreground"
                style={{ borderWidth: 1, borderColor: colors.border }}
                value={startHour}
                onChangeText={setStartHour}
                keyboardType="numeric"
                returnKeyType="done"
                onSubmitEditing={handleSaveStartHour}
              />
              <Pressable
                onPress={handleSaveStartHour}
                style={({ pressed }) => [
                  {
                    backgroundColor: colors.primary,
                    borderRadius: 8,
                    paddingHorizontal: 20,
                    justifyContent: "center",
                    opacity: pressed ? 0.7 : 1,
                  },
                ]}
              >
                <Text className="text-white font-semibold">Salvar</Text>
              </Pressable>
            </View>
          </View>

          {/* Horário de término */}
          <View className="bg-surface rounded-xl p-4 gap-2">
            <Text className="text-base font-semibold text-foreground">
              Horário de término (0-23)
            </Text>
            <Text className="text-sm text-muted">Hora em que os lembretes terminam</Text>
            <View className="flex-row gap-2 mt-2">
              <TextInput
                className="flex-1 bg-background rounded-lg px-4 py-3 text-foreground"
                style={{ borderWidth: 1, borderColor: colors.border }}
                value={endHour}
                onChangeText={setEndHour}
                keyboardType="numeric"
                returnKeyType="done"
                onSubmitEditing={handleSaveEndHour}
              />
              <Pressable
                onPress={handleSaveEndHour}
                style={({ pressed }) => [
                  {
                    backgroundColor: colors.primary,
                    borderRadius: 8,
                    paddingHorizontal: 20,
                    justifyContent: "center",
                    opacity: pressed ? 0.7 : 1,
                  },
                ]}
              >
                <Text className="text-white font-semibold">Salvar</Text>
              </Pressable>
            </View>
          </View>

          {/* Notificações */}
          <View className="bg-surface rounded-xl p-4">
            <View className="flex-row items-center justify-between">
              <View className="flex-1 pr-4">
                <Text className="text-base font-semibold text-foreground">Notificações</Text>
                <Text className="text-sm text-muted">Receber lembretes para beber água</Text>
              </View>
              <Switch
                value={settings.notificationsEnabled}
                onValueChange={(value) => updateSettings({ notificationsEnabled: value })}
                trackColor={{ false: colors.border, true: colors.primary }}
                thumbColor="#ffffff"
              />
            </View>
          </View>

          {/* Som de alarme */}
          <View className="bg-surface rounded-xl p-4">
            <View className="flex-row items-center justify-between">
              <View className="flex-1 pr-4">
                <Text className="text-base font-semibold text-foreground">Som de alarme</Text>
                <Text className="text-sm text-muted">Tocar som nas notificações</Text>
              </View>
              <Switch
                value={settings.soundEnabled}
                onValueChange={(value) => updateSettings({ soundEnabled: value })}
                trackColor={{ false: colors.border, true: colors.primary }}
                thumbColor="#ffffff"
              />
            </View>
          </View>

          {/* Botão de teste */}
          <Pressable
            onPress={handleTestNotification}
            style={({ pressed }) => [
              {
                backgroundColor: colors.success,
                borderRadius: 12,
                padding: 16,
                alignItems: "center",
                opacity: pressed ? 0.7 : 1,
              },
            ]}
          >
            <Text className="text-white font-semibold text-base">
              Testar notificação
            </Text>
          </Pressable>

          {/* Botão de reset */}
          <Pressable
            onPress={handleReset}
            style={({ pressed }) => [
              {
                backgroundColor: colors.error,
                borderRadius: 12,
                padding: 16,
                alignItems: "center",
                opacity: pressed ? 0.7 : 1,
              },
            ]}
          >
            <Text className="text-white font-semibold text-base">Resetar todos os dados</Text>
          </Pressable>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}

import { useState, useEffect, useCallback } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { WaterEntry, Settings, DailyStats } from "@/types/hydration";

const STORAGE_KEYS = {
  ENTRIES: "@hydration:entries",
  SETTINGS: "@hydration:settings",
};

const DEFAULT_SETTINGS: Settings = {
  dailyGoal: 2000,
  reminderInterval: 60,
  reminderStartHour: 8,
  reminderEndHour: 22,
  notificationsEnabled: true,
  soundEnabled: true,
};

export function useHydration() {
  const [entries, setEntries] = useState<WaterEntry[]>([]);
  const [settings, setSettings] = useState<Settings>(DEFAULT_SETTINGS);
  const [loading, setLoading] = useState(true);

  // Carregar dados do AsyncStorage
  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [entriesData, settingsData] = await Promise.all([
        AsyncStorage.getItem(STORAGE_KEYS.ENTRIES),
        AsyncStorage.getItem(STORAGE_KEYS.SETTINGS),
      ]);

      if (entriesData) {
        setEntries(JSON.parse(entriesData));
      }
      if (settingsData) {
        setSettings(JSON.parse(settingsData));
      }
    } catch (error) {
      console.error("Erro ao carregar dados:", error);
    } finally {
      setLoading(false);
    }
  };

  const saveEntries = async (newEntries: WaterEntry[]) => {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.ENTRIES, JSON.stringify(newEntries));
      setEntries(newEntries);
    } catch (error) {
      console.error("Erro ao salvar entradas:", error);
    }
  };

  const saveSettings = async (newSettings: Settings) => {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(newSettings));
      setSettings(newSettings);
    } catch (error) {
      console.error("Erro ao salvar configurações:", error);
    }
  };

  const addWater = useCallback(
    async (amount: number) => {
      const now = new Date();
      const newEntry: WaterEntry = {
        id: `${now.getTime()}-${Math.random()}`,
        amount,
        timestamp: now.getTime(),
        date: now.toISOString().split("T")[0],
      };

      const newEntries = [newEntry, ...entries];
      await saveEntries(newEntries);
      return newEntry;
    },
    [entries]
  );

  const getTodayStats = useCallback((): DailyStats => {
    const today = new Date().toISOString().split("T")[0];
    const todayEntries = entries.filter((entry) => entry.date === today);
    const consumed = todayEntries.reduce((sum, entry) => sum + entry.amount, 0);
    const percentage = Math.min(Math.round((consumed / settings.dailyGoal) * 100), 100);

    return {
      date: today,
      goal: settings.dailyGoal,
      consumed,
      percentage,
      entries: todayEntries,
    };
  }, [entries, settings.dailyGoal]);

  const getWeeklyStats = useCallback((): DailyStats[] => {
    const stats: DailyStats[] = [];
    const today = new Date();

    for (let i = 6; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split("T")[0];

      const dayEntries = entries.filter((entry) => entry.date === dateStr);
      const consumed = dayEntries.reduce((sum, entry) => sum + entry.amount, 0);
      const percentage = Math.min(Math.round((consumed / settings.dailyGoal) * 100), 100);

      stats.push({
        date: dateStr,
        goal: settings.dailyGoal,
        consumed,
        percentage,
        entries: dayEntries,
      });
    }

    return stats;
  }, [entries, settings.dailyGoal]);

  const updateSettings = useCallback(
    async (newSettings: Partial<Settings>) => {
      const updated = { ...settings, ...newSettings };
      await saveSettings(updated);
    },
    [settings]
  );

  const resetData = useCallback(async () => {
    try {
      await AsyncStorage.multiRemove([STORAGE_KEYS.ENTRIES, STORAGE_KEYS.SETTINGS]);
      setEntries([]);
      setSettings(DEFAULT_SETTINGS);
    } catch (error) {
      console.error("Erro ao resetar dados:", error);
    }
  }, []);

  return {
    entries,
    settings,
    loading,
    addWater,
    getTodayStats,
    getWeeklyStats,
    updateSettings,
    resetData,
  };
}

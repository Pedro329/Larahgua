export interface WaterEntry {
  id: string;
  amount: number; // em ml
  timestamp: number; // Unix timestamp
  date: string; // YYYY-MM-DD
}

export interface DailyGoal {
  goal: number; // em ml
  date: string; // YYYY-MM-DD
}

export interface Settings {
  dailyGoal: number; // em ml
  reminderInterval: number; // em minutos
  reminderStartHour: number; // 0-23
  reminderEndHour: number; // 0-23
  notificationsEnabled: boolean;
  soundEnabled: boolean;
}

export interface DailyStats {
  date: string;
  goal: number;
  consumed: number;
  percentage: number;
  entries: WaterEntry[];
}

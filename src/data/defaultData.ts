import type { AppData, UserSettings } from '@/types';
import { getNowTimestamp } from '@/utils/date';

export const DATA_VERSION = 1;

export const DEFAULT_SETTINGS: UserSettings = {
  vibrationEnabled: true,
  soundEnabled: false,
  fontSize: 'medium',
  gardenAnimationSpeed: 'normal',
};

export function createDefaultData(): AppData {
  return {
    version: DATA_VERSION,
    dhikrLogs: [],
    dailyPrograms: [],
    gardenProgress: {
      totalDhikrCount: 0,
      totalTasksCompleted: 0,
      unlockedItems: [],
    },
    settings: { ...DEFAULT_SETTINGS },
    dailyHistory: [],
    audioDownloads: [],
    favoriteDhikrIds: [],
    exportedAt: getNowTimestamp(),
  };
}

export function validateImportedData(data: unknown): data is AppData {
  if (!data || typeof data !== 'object') return false;
  const obj = data as Record<string, unknown>;
  if (typeof obj.version !== 'number') return false;
  if (!Array.isArray(obj.dhikrLogs)) return false;
  if (!Array.isArray(obj.dailyPrograms)) return false;
  if (!obj.gardenProgress || typeof obj.gardenProgress !== 'object') return false;
  if (!obj.settings || typeof obj.settings !== 'object') return false;
  if (!Array.isArray(obj.dailyHistory)) return false;
  if (!Array.isArray(obj.audioDownloads)) return false;
  return true;
}

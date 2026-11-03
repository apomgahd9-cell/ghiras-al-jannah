import { describe, it, expect } from 'vitest';
import {
  createDefaultData,
  validateImportedData,
  DEFAULT_SETTINGS,
  DATA_VERSION,
} from '@/data/defaultData';

describe('defaultData', () => {
  it('createDefaultData returns valid structure', () => {
    const data = createDefaultData();
    expect(data.version).toBe(DATA_VERSION);
    expect(data.dhikrLogs).toEqual([]);
    expect(data.dailyPrograms).toEqual([]);
    expect(data.dailyHistory).toEqual([]);
    expect(data.gardenProgress.totalDhikrCount).toBe(0);
    expect(data.gardenProgress.unlockedItems).toEqual([]);
  });

  it('DEFAULT_SETTINGS has expected defaults', () => {
    expect(DEFAULT_SETTINGS.vibrationEnabled).toBe(true);
    expect(DEFAULT_SETTINGS.soundEnabled).toBe(false);
    expect(DEFAULT_SETTINGS.fontSize).toBe('medium');
  });

  it('validateImportedData accepts valid data', () => {
    const data = createDefaultData();
    expect(validateImportedData(data)).toBe(true);
  });

  it('validateImportedData rejects null', () => {
    expect(validateImportedData(null)).toBe(false);
  });

  it('validateImportedData rejects non-object', () => {
    expect(validateImportedData('hello')).toBe(false);
  });

  it('validateImportedData rejects missing version', () => {
    const bad = { dhikrLogs: [], dailyPrograms: [] };
    expect(validateImportedData(bad)).toBe(false);
  });

  it('validateImportedData rejects wrong array types', () => {
    const bad = {
      version: 1,
      dhikrLogs: 'not array',
      dailyPrograms: [],
      gardenProgress: {},
      settings: {},
      dailyHistory: [],
      audioDownloads: [],
    };
    expect(validateImportedData(bad)).toBe(false);
  });
});

export type HadithGrade =
  | 'sahih'
  | 'hasan'
  | 'daif'
  | 'maudu'
  | 'needs_review';

export type VirtueType =
  | 'established'
  | 'general'
  | 'explanation'
  | 'weak';

export type DhikrStatus = 'verified' | 'needs_review' | 'weak' | 'disputed';

export type DhikrCategory =
  | 'tasbih_tahmid'
  | 'tahlil_takbir'
  | 'istighfar_tawbah'
  | 'salat_nabi'
  | 'morning'
  | 'evening'
  | 'sleep'
  | 'prayer_virtues'
  | 'quran'
  | 'charity'
  | 'parents'
  | 'kinship'
  | 'paradise_deeds'
  | 'dhikr_general';

export interface Source {
  id: string;
  bookName: string;
  hadithNumber?: string;
  verseNumber?: string;
  surahName?: string;
  grade: HadithGrade;
  scholar?: string;
  narrator?: string;
  hadithText?: string;
  gradingRef?: string;
  note?: string;
}

export interface Dhikr {
  id: string;
  name: string;
  arabicText: string;
  tashkeelText?: string;
  explanation: string;
  virtue: string;
  virtueType: VirtueType;
  sourceIds: string[];
  category: DhikrCategory;
  recommendedCount?: number;
  countNote?: string;
  audioFile?: string;
  published: boolean;
  status: DhikrStatus;
  statusNote?: string;
}

export interface Category {
  id: DhikrCategory;
  name: string;
  description: string;
  icon: string;
}

export interface DailyTask {
  id: string;
  name: string;
  description: string;
  suggestedTime: string;
  sourceRef?: string;
  isCustom: boolean;
}

export interface DailyProgram {
  date: string;
  tasks: DailyProgramTask[];
}

export interface DailyProgramTask {
  taskId: string;
  completed: boolean;
  skipped: boolean;
  completedAt?: string;
}

export interface DhikrLog {
  id: string;
  dhikrId: string;
  count: number;
  date: string;
  timestamp: string;
  target?: number;
}

export interface GardenItemDef {
  id: string;
  name: string;
  type: GardenItemType;
  unlockThreshold: number;
  description: string;
}

export type GardenItemType =
  | 'seed'
  | 'sprout'
  | 'young_tree'
  | 'mature_tree'
  | 'palm'
  | 'flower'
  | 'fountain'
  | 'pond'
  | 'path'
  | 'herb';

export interface GardenProgress {
  totalDhikrCount: number;
  totalTasksCompleted: number;
  unlockedItems: string[];
}

export interface AudioTrack {
  id: string;
  title: string;
  type: AudioTrackType;
  duration?: number;
  fileName: string;
  downloaded: boolean;
}

export type AudioTrackType =
  | 'morning'
  | 'evening'
  | 'dhikr_explanation'
  | 'bedtime'
  | 'encouragement'
  | 'story';

export interface UserSettings {
  vibrationEnabled: boolean;
  soundEnabled: boolean;
  dailyReminderTime?: string;
  fontSize: 'small' | 'medium' | 'large';
  gardenAnimationSpeed: 'off' | 'slow' | 'normal';
}

export interface DailyHistoryEntry {
  date: string;
  tasksCompleted: number;
  tasksTotal: number;
  dhikrCount: number;
  dhikrSessions: number;
}

export interface AppData {
  version: number;
  dhikrLogs: DhikrLog[];
  dailyPrograms: DailyProgram[];
  gardenProgress: GardenProgress;
  settings: UserSettings;
  dailyHistory: DailyHistoryEntry[];
  audioDownloads: string[];
  favoriteDhikrIds: string[];
  exportedAt: string;
}

export const LIBRARY_CONTENT_VERSION = 1;

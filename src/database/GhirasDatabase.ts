import type { AppData } from '@/types';
import { createDefaultData, DATA_VERSION } from '@/data/defaultData';

const DB_NAME = 'ghiras-al-jannah';
const DB_VERSION = 1;
const STORE_APP_DATA = 'app_data';
const KEY_APP_DATA = 'main';

type UpgradeCallback = (oldVersion: number, newVersion: number) => void;

export class GhirasDatabase {
  private db: IDBDatabase | null = null;
  private migrateFn: UpgradeCallback | null = null;

  constructor(migrateFn?: UpgradeCallback) {
    this.migrateFn = migrateFn ?? null;
  }

  async open(): Promise<void> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(DB_NAME, DB_VERSION);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => {
        this.db = request.result;
        resolve();
      };

      request.onupgradeneeded = (event) => {
        const db = request.result;
        if (!db.objectStoreNames.contains(STORE_APP_DATA)) {
          db.createObjectStore(STORE_APP_DATA, { keyPath: 'key' });
        }
        if (this.migrateFn && event.oldVersion > 0) {
          this.migrateFn(event.oldVersion, DB_VERSION);
        }
      };
    });
  }

  async loadData(): Promise<AppData> {
    if (!this.db) await this.open();
    return new Promise((resolve, reject) => {
      const tx = this.db!.transaction(STORE_APP_DATA, 'readonly');
      const store = tx.objectStore(STORE_APP_DATA);
      const request = store.get(KEY_APP_DATA);

      request.onsuccess = () => {
        if (request.result) {
          resolve(this.migrateData(request.result.data as AppData));
        } else {
          resolve(createDefaultData());
        }
      };
      request.onerror = () => reject(request.error);
    });
  }

  async saveData(data: AppData): Promise<void> {
    if (!this.db) await this.open();
    return new Promise((resolve, reject) => {
      const tx = this.db!.transaction(STORE_APP_DATA, 'readwrite');
      const store = tx.objectStore(STORE_APP_DATA);
      store.put({ key: KEY_APP_DATA, data });

      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error);
    });
  }

  async exportData(): Promise<AppData> {
    return this.loadData();
  }

  async importData(data: AppData): Promise<void> {
    await this.saveData(data);
  }

  async clearAll(): Promise<void> {
    if (!this.db) await this.open();
    return new Promise((resolve, reject) => {
      const tx = this.db!.transaction(STORE_APP_DATA, 'readwrite');
      const store = tx.objectStore(STORE_APP_DATA);
      store.clear();

      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error);
    });
  }

  private migrateData(data: AppData): AppData {
    if (data.version < DATA_VERSION) {
      return { ...data, version: DATA_VERSION };
    }
    return data;
  }
}

let dbInstance: GhirasDatabase | null = null;

export function getDatabase(): GhirasDatabase {
  if (!dbInstance) {
    dbInstance = new GhirasDatabase();
  }
  return dbInstance;
}

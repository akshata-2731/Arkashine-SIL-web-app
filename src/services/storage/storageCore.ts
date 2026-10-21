export const CURRENT_SCHEMA_VERSION = '1.1.0';

export const STORAGE_KEYS = {
  SCHEMA_VERSION: 'ark_sil_schema_version',
  SCHOOLS: 'ark_sil_schools',
  PARTNERS: 'ark_sil_partners',
  STUDENTS: 'ark_sil_students',
  DAILY_LOGS: 'ark_sil_daily_logs',
  SOIL_SAMPLES: 'ark_sil_soil_samples',
  OUTREACH: 'ark_sil_farmer_outreach',
  CAMPAIGNS: 'ark_sil_campaigns',
  BUDGET: 'ark_sil_budget_lines',
  INVENTORY: 'ark_sil_inventory',
  AUDIT_LOGS: 'ark_sil_audit_logs',
  NOTIFICATIONS: 'ark_sil_notifications',
  TARGETS: 'ark_sil_targets',
  DRAFT_DAILY_LOG: 'ark_sil_draft_daily_log'
} as const;

export class StorageCore {
  private cache: Map<string, unknown> = new Map();
  private listeners: Set<() => void> = new Set();
  private isInitialized = false;

  public subscribe(listener: () => void): () => void {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }

  public notify(): void {
    this.listeners.forEach(fn => {
      try {
        fn();
      } catch (err) {
        console.error('Error in storage listener', err);
      }
    });
  }

  public safeParse<T>(key: string, fallback: T): T {
    // Check in-memory cache first
    if (this.cache.has(key)) {
      return this.cache.get(key) as T;
    }

    try {
      const raw = localStorage.getItem(key);
      if (!raw) {
        this.cache.set(key, fallback);
        return fallback;
      }
      const parsed = JSON.parse(raw) as T;
      this.cache.set(key, parsed);
      return parsed;
    } catch (err) {
      console.warn(`[storageService] Corrupted JSON in key "${key}", falling back to safe default`, err);
      this.cache.set(key, fallback);
      return fallback;
    }
  }

  public safeWrite<T>(key: string, value: T): void {
    this.cache.set(key, value);
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (err) {
      console.error(`[storageService] Failed to write key "${key}" to localStorage`, err);
    }
    this.notify();
  }

  public safeRemove(key: string): void {
    this.cache.delete(key);
    try {
      localStorage.removeItem(key);
    } catch (err) {
      console.error(`[storageService] Failed to remove key "${key}" from localStorage`, err);
    }
    this.notify();
  }

  public clearCache(): void {
    this.cache.clear();
  }

  public runMigrations(): void {
    try {
      const storedVersion = localStorage.getItem(STORAGE_KEYS.SCHEMA_VERSION);
      if (!storedVersion) {
        // First run or version 1.0.0
        localStorage.setItem(STORAGE_KEYS.SCHEMA_VERSION, CURRENT_SCHEMA_VERSION);
        return;
      }

      if (storedVersion !== CURRENT_SCHEMA_VERSION) {
        // Example migration: ensure all students have verifiedQrHash if Issued
        const studentsRaw = localStorage.getItem(STORAGE_KEYS.STUDENTS);
        if (studentsRaw) {
          try {
            const students = JSON.parse(studentsRaw);
            if (Array.isArray(students)) {
              let updated = false;
              students.forEach(s => {
                if (s.certificateStatus === 'Issued' && !s.verifiedQrHash) {
                  s.verifiedQrHash = `ark-sil-${s.schoolId?.toLowerCase() || 'sch01'}-${s.rollNo?.replace(/[^a-zA-Z0-9]/g, '') || '101'}`;
                  updated = true;
                }
              });
              if (updated) {
                localStorage.setItem(STORAGE_KEYS.STUDENTS, JSON.stringify(students));
              }
            }
          } catch {
            // Ignore parse errors in migration
          }
        }
        localStorage.setItem(STORAGE_KEYS.SCHEMA_VERSION, CURRENT_SCHEMA_VERSION);
      }
    } catch (err) {
      console.warn('[storageService] Migration check failed', err);
    }
  }

  public setInitialized(value: boolean): void {
    this.isInitialized = value;
  }

  public getInitialized(): boolean {
    return this.isInitialized;
  }
}

export const storageCore = new StorageCore();

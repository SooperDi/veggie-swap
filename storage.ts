import { StorageResult } from '../types';

export const storage = {
  async get(key: string, shared = false): Promise<StorageResult | null> {
    const storageKey = shared ? `shared_${key}` : key;
    const value = localStorage.getItem(storageKey);
    return value ? { key, value, shared } : null;
  },

  async set(key: string, value: string, shared = false): Promise<StorageResult> {
    const storageKey = shared ? `shared_${key}` : key;
    localStorage.setItem(storageKey, value);
    return { key, value, shared };
  },

  async delete(key: string, shared = false): Promise<{ key: string; deleted: boolean; shared: boolean }> {
    const storageKey = shared ? `shared_${key}` : key;
    localStorage.removeItem(storageKey);
    return { key, deleted: true, shared };
  }
};

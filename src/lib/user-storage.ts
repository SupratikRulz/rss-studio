import { createJSONStorage } from "zustand/middleware";

let _currentUserId: string | null = null;

export function setCurrentUserId(id: string | null) {
  _currentUserId = id;
}

export function getCurrentUserId() {
  return _currentUserId;
}

function userNamespacedStorage() {
  return {
    getItem(name: string): string | null {
      const key = _currentUserId ? `${name}-${_currentUserId}` : name;
      return localStorage.getItem(key);
    },
    setItem(name: string, value: string) {
      if (!_currentUserId) return;
      const key = `${name}-${_currentUserId}`;
      localStorage.setItem(key, value);
    },
    removeItem(name: string) {
      const key = _currentUserId ? `${name}-${_currentUserId}` : name;
      localStorage.removeItem(key);
    },
  };
}

export function createUserStorage() {
  return createJSONStorage(() => userNamespacedStorage());
}

/**
 * One-time migration: copy data from the old generic key to the
 * user-specific key, then remove the generic key so it doesn't
 * interfere with future hydrations.
 */
export function migrateToUserStorage(baseName: string, userId: string) {
  if (typeof window === "undefined") return;
  const userKey = `${baseName}-${userId}`;
  const genericData = localStorage.getItem(baseName);
  if (genericData && !localStorage.getItem(userKey)) {
    localStorage.setItem(userKey, genericData);
    localStorage.removeItem(baseName);
  }
}

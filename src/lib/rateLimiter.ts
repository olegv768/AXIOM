/**
 * Client-Side Device Rate Limiter
 * 
 * Rules:
 * - Max 5 requests per 10 minutes (600,000 ms) per device.
 * - Sliding window based on timestamps stored in localStorage.
 * - Multi-tab synchronization via storage & custom events.
 * - React hook for real-time reactivity & countdown.
 */

import { useState, useEffect, useCallback } from 'react';

export const RATE_LIMIT_MAX_REQUESTS = 5;
export const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000; // 10 minutes = 600,000 ms

const STORAGE_KEY_TIMESTAMPS = 'axiom_rate_limit_timestamps_v1';
const STORAGE_KEY_DEVICE_ID = 'axiom_device_id_v1';
export const RATE_LIMIT_EVENT = 'axiom_rate_limit_changed';

export interface RateLimitStatus {
  isAllowed: boolean;
  remaining: number;
  total: number;
  msUntilReset: number;
  secondsUntilReset: number;
  formattedTimeRemaining: string;
  deviceId: string;
}

/**
 * Gets or creates a unique persistent device ID
 */
export function getOrCreateDeviceId(): string {
  try {
    let deviceId = localStorage.getItem(STORAGE_KEY_DEVICE_ID);
    if (!deviceId) {
      // Generate a distinct hardware/session signature-like device ID
      const randomPart = Math.random().toString(36).substring(2, 10);
      const timePart = Date.now().toString(36);
      deviceId = `dev_${timePart}_${randomPart}`;
      localStorage.setItem(STORAGE_KEY_DEVICE_ID, deviceId);
    }
    return deviceId;
  } catch {
    return 'dev_ephemeral_client';
  }
}

/**
 * Reads and cleans timestamps within the sliding window
 */
export function getValidTimestamps(now: number = Date.now()): number[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_TIMESTAMPS);
    if (!raw) return [];
    
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];

    const cutoff = now - RATE_LIMIT_WINDOW_MS;
    // Filter out expired or invalid timestamps, sort ascending
    const valid = parsed
      .map(Number)
      .filter((t) => !isNaN(t) && t > cutoff && t <= now + 5000)
      .sort((a, b) => a - b);

    // If cleaned list differs in length, persist the cleaned list
    if (valid.length !== parsed.length) {
      localStorage.setItem(STORAGE_KEY_TIMESTAMPS, JSON.stringify(valid));
    }

    return valid;
  } catch (e) {
    console.error('Failed to read rate limit timestamps', e);
    return [];
  }
}

/**
 * Formats milliseconds into MM:SS or human-readable format
 */
export function formatMillisecondsToTime(ms: number): string {
  if (ms <= 0) return '00:00';
  const totalSeconds = Math.ceil(ms / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
}

/**
 * Formats time remaining in localized text
 */
export function formatTimeRemainingText(ms: number, lang: 'ru' | 'en' = 'ru'): string {
  if (ms <= 0) return lang === 'ru' ? '0 сек' : '0s';
  const totalSeconds = Math.ceil(ms / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;

  if (lang === 'ru') {
    if (minutes > 0) {
      return `${minutes} мин ${seconds > 0 ? `${seconds} сек` : ''}`.trim();
    }
    return `${seconds} сек`;
  } else {
    if (minutes > 0) {
      return `${minutes}m ${seconds > 0 ? `${seconds}s` : ''}`.trim();
    }
    return `${seconds}s`;
  }
}

/**
 * Evaluates the current rate limit status without consuming a request token
 */
export function checkRateLimit(): RateLimitStatus {
  const now = Date.now();
  const deviceId = getOrCreateDeviceId();
  const validTimestamps = getValidTimestamps(now);

  const count = validTimestamps.length;
  const isAllowed = count < RATE_LIMIT_MAX_REQUESTS;
  const remaining = Math.max(0, RATE_LIMIT_MAX_REQUESTS - count);

  let msUntilReset = 0;
  if (!isAllowed && validTimestamps.length > 0) {
    // The earliest timestamp in the current window determines when the next request is unlocked
    const oldestTimestamp = validTimestamps[0];
    const resetTime = oldestTimestamp + RATE_LIMIT_WINDOW_MS;
    msUntilReset = Math.max(0, resetTime - now);
  }

  const secondsUntilReset = Math.ceil(msUntilReset / 1000);

  return {
    isAllowed,
    remaining,
    total: RATE_LIMIT_MAX_REQUESTS,
    msUntilReset,
    secondsUntilReset,
    formattedTimeRemaining: formatMillisecondsToTime(msUntilReset),
    deviceId,
  };
}

/**
 * Attempts to consume one request token. Returns true if allowed, false if limit exceeded.
 */
export function recordRequest(): { success: boolean; status: RateLimitStatus } {
  const currentStatus = checkRateLimit();
  if (!currentStatus.isAllowed) {
    return { success: false, status: currentStatus };
  }

  try {
    const now = Date.now();
    const validTimestamps = getValidTimestamps(now);
    const updated = [...validTimestamps, now];
    localStorage.setItem(STORAGE_KEY_TIMESTAMPS, JSON.stringify(updated));

    // Notify listeners in this window/tab
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new Event(RATE_LIMIT_EVENT));
    }
  } catch (e) {
    console.error('Failed to record rate limit timestamp', e);
  }

  const newStatus = checkRateLimit();
  return { success: true, status: newStatus };
}

/**
 * React Hook for live rate limit state and reactive countdown
 */
export function useRateLimit() {
  const [status, setStatus] = useState<RateLimitStatus>(() => checkRateLimit());

  const refreshStatus = useCallback(() => {
    setStatus(checkRateLimit());
  }, []);

  useEffect(() => {
    refreshStatus();

    // Listen to changes in other tabs
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === STORAGE_KEY_TIMESTAMPS || e.key === null) {
        refreshStatus();
      }
    };

    // Listen to local changes in same tab
    const handleCustomChange = () => {
      refreshStatus();
    };

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener(RATE_LIMIT_EVENT, handleCustomChange);

    // Real-time ticking timer: tick every second if there's any active request or cooldown
    const interval = setInterval(() => {
      setStatus(checkRateLimit());
    }, 1000);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener(RATE_LIMIT_EVENT, handleCustomChange);
      clearInterval(interval);
    };
  }, [refreshStatus]);

  return {
    ...status,
    refresh: refreshStatus,
    record: recordRequest,
  };
}

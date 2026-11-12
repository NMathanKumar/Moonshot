/**
 * Test check-in completion flag (ported from Figma Make export).
 *
 * Only a boolean is stored — no photos or personal details are persisted.
 * TODO: replace with the backend check-in status once an API is available.
 */
export const CHECK_IN_STORAGE_KEY = 'idp-test-check-in-complete';

export function isCheckInComplete(): boolean {
  try {
    return window.localStorage.getItem(CHECK_IN_STORAGE_KEY) === 'true';
  } catch {
    return false;
  }
}

export function completeCheckIn(): void {
  try {
    window.localStorage.setItem(CHECK_IN_STORAGE_KEY, 'true');
  } catch {
    // Route state still updates the dashboard when browser storage is unavailable.
  }
}

export function clearCheckIn(): void {
  try {
    window.localStorage.removeItem(CHECK_IN_STORAGE_KEY);
  } catch {
    // Silently fail if storage is unavailable
  }
}

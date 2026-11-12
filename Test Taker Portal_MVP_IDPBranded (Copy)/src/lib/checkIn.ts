export const CHECK_IN_STORAGE_KEY = "idp-test-check-in-complete";

export function isCheckInComplete() {
  try {
    return window.localStorage.getItem(CHECK_IN_STORAGE_KEY) === "true";
  } catch {
    return false;
  }
}

export function completeCheckIn() {
  try {
    window.localStorage.setItem(CHECK_IN_STORAGE_KEY, "true");
  } catch {
    // Route state still updates the dashboard when browser storage is unavailable.
  }
}

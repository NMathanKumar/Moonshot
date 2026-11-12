/**
 * Pending Profile Storage
 *
 * Safely stores profile information between confirmation and sign-in.
 * IMPORTANT: Never stores or persists the password.
 * Uses session storage which is cleared on browser close.
 */

export interface PendingProfileData {
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  gender: string;
}

const STORAGE_KEY = '__IDP_PENDING_PROFILE_DATA__';

/**
 * Store pending profile data for creation after sign-in
 * NEVER stores password - only stores the profile fields
 */
export function setPendingProfile(data: PendingProfileData): void {
  try {
    const sanitized = {
      firstName: data.firstName,
      lastName: data.lastName,
      dateOfBirth: data.dateOfBirth,
      gender: data.gender,
      // Explicitly exclude password if accidentally passed
    };
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(sanitized));
    console.log('pendingProfileStorage: Profile data stored');
  } catch (error) {
    console.error('pendingProfileStorage: Failed to store profile:', error);
  }
}

/**
 * Retrieve pending profile data (used after sign-in)
 * Returns null if no data is stored
 */
export function getPendingProfile(): PendingProfileData | null {
  try {
    const stored = sessionStorage.getItem(STORAGE_KEY);
    if (!stored) {
      return null;
    }
    const parsed = JSON.parse(stored);
    console.log('pendingProfileStorage: Profile data retrieved');
    return parsed as PendingProfileData;
  } catch (error) {
    console.error('pendingProfileStorage: Failed to retrieve profile:', error);
    return null;
  }
}

/**
 * Clear pending profile data
 * Called after profile creation succeeds or fails
 */
export function clearPendingProfile(): void {
  try {
    sessionStorage.removeItem(STORAGE_KEY);
    console.log('pendingProfileStorage: Profile data cleared');
  } catch (error) {
    console.error('pendingProfileStorage: Failed to clear profile:', error);
  }
}

/**
 * Check if pending profile data exists
 */
export function hasPendingProfile(): boolean {
  try {
    const stored = sessionStorage.getItem(STORAGE_KEY);
    return stored !== null;
  } catch (error) {
    return false;
  }
}

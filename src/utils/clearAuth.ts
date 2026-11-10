/**
 * Clear all authentication tokens and session data
 * Useful for testing or allowing users to sign out completely
 */
export function clearAuthStorage(): void {
  try {
    // Clear Amplify-specific storage
    const keysToRemove = Object.keys(localStorage).filter(key => 
      key.includes('amplify') || 
      key.includes('cognito') ||
      key.includes('auth')
    );
    
    keysToRemove.forEach(key => {
      localStorage.removeItem(key);
      console.log(`Cleared: ${key}`);
    });
    
    console.log('✅ clearAuthStorage: All auth storage cleared');
  } catch (error) {
    console.error('❌ clearAuthStorage: Error clearing storage:', error);
  }
}

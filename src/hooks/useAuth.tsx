/**
 * Auth Hook
 * React hook for authentication state management using Amplify v6 direct SDK auth
 */

import { useState, useEffect, useCallback, createContext, useContext } from 'react';
import { fetchAuthSession } from 'aws-amplify/auth';
import { Hub } from '@aws-amplify/core';
import { getCurrentUser, signOut as authSignOut } from '@services/auth';
import type { AuthUser } from 'aws-amplify/auth';
import type { HubCallback } from '@aws-amplify/core';

export type { AuthUser };

export interface AuthContextType {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  refreshAuth: () => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

/**
 * AuthProvider component
 * Wraps the application and provides authentication state via React Context
 */
export function AuthProvider({ children }: { children: React.ReactNode }): React.JSX.Element {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  /**
   * Initialize authentication state on app load
   * Checks if there is an existing valid Amplify session
   */
  const initializeAuth = useCallback(async () => {
    try {
      console.log('AuthProvider: Initializing authentication state...');
      
      // Attempt to restore session from Amplify token storage
      const session = await fetchAuthSession();
      
      if (session.tokens?.accessToken) {
        console.log('AuthProvider: Valid session found. Fetching current user...');
        
        // Session exists, get current user details
        const currentUser = await getCurrentUser();
        if (currentUser) {
          setUser(currentUser);
          setIsAuthenticated(true);
          console.log('✅ AuthProvider: User session restored:', currentUser.username);
        } else {
          console.warn('AuthProvider: Session found but user details unavailable');
          setUser(null);
          setIsAuthenticated(false);
        }
      } else {
        console.log('AuthProvider: No valid session found');
        setUser(null);
        setIsAuthenticated(false);
      }
    } catch (error) {
      // No session or session retrieval failed — treat as unauthenticated
      console.log('AuthProvider: No existing session (expected on first load)');
      setUser(null);
      setIsAuthenticated(false);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Initialize auth state on mount
  useEffect(() => {
    initializeAuth();
  }, [initializeAuth]);

  // Listen for Amplify authentication Hub events
  useEffect(() => {
    console.log('AuthProvider: Setting up auth Hub listener');
    
    const handleAuthEvent: HubCallback = (payload) => {
      const { event } = payload.data;
      console.log('AuthProvider: Auth Hub event:', event);
      
      switch (event) {
        case 'signedIn':
          // User successfully signed in via signIn()
          console.log('✅ AuthProvider: signedIn event detected');
          // Refresh user details from Amplify session
          refreshAuth();
          break;
          
        case 'signedOut':
          // User signed out
          console.log('AuthProvider: signedOut event detected');
          setUser(null);
          setIsAuthenticated(false);
          setIsLoading(false);
          break;
          
        case 'tokenRefresh':
          // Tokens were automatically refreshed
          console.log('AuthProvider: tokenRefresh event detected');
          setIsLoading(false);
          break;
          
        case 'tokenRefresh_failure':
          // Token refresh failed — session is invalid
          console.log('AuthProvider: tokenRefresh_failure event detected');
          setUser(null);
          setIsAuthenticated(false);
          setIsLoading(false);
          break;
          
        default:
          // Other Hub events we don't handle
          break;
      }
    };

    const removeListener = Hub.listen('auth', handleAuthEvent);

    // Cleanup listener on unmount
    return () => {
      console.log('AuthProvider: Removing auth Hub listener');
      removeListener();
    };
  }, []);

  /**
   * Refresh authentication state
   * Force re-fetch of current user and auth status
   */
  const refreshAuth = useCallback(async () => {
    try {
      console.log('AuthProvider: Refreshing auth state...');
      const currentUser = await getCurrentUser();
      
      if (currentUser) {
        setUser(currentUser);
        setIsAuthenticated(true);
        console.log('✅ AuthProvider: Auth state refreshed:', currentUser.username);
      } else {
        setUser(null);
        setIsAuthenticated(false);
      }
    } catch (error) {
      console.error('AuthProvider: Auth refresh error:', error);
      setUser(null);
      setIsAuthenticated(false);
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * Sign out the current user
   */
  const signOut = useCallback(async () => {
    try {
      console.log('AuthProvider: Signing out...');
      await authSignOut();
      // signOut() above will trigger 'signedOut' Hub event
      // which will update state via the Hub listener
    } catch (error) {
      console.error('AuthProvider: Sign out error:', error);
      // Re-throw to allow callers to handle the error
      throw error;
    }
  }, []);

  const value = {
    user,
    isAuthenticated,
    isLoading,
    refreshAuth,
    signOut,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

/**
 * useAuth hook
 * Convenience hook to access authentication context
 */
export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export default useAuth;

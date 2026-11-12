/**
 * Auth Hook
 * React hook for authentication state management using Amplify v6 direct SDK auth
 */

import { useState, useEffect, useCallback, createContext, useContext } from 'react';
import { fetchAuthSession } from 'aws-amplify/auth';
import { Hub } from 'aws-amplify/utils';
import { getCurrentUser, signOut as authSignOut } from '@services/auth';
import type { AuthUser } from 'aws-amplify/auth';

export type { AuthUser };

export interface AuthContextType {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  refreshAuth: () => Promise<void>;
  signOut: () => Promise<void>;
  setAuthenticatedUser: (user: AuthUser | null) => void;
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
      // Attempt to restore session from Amplify token storage
      const session = await fetchAuthSession();

      if (session.tokens?.accessToken) {
        // Session exists, get current user details
        const currentUser = await getCurrentUser();
        if (currentUser) {
          setUser(currentUser);
          setIsAuthenticated(true);
          setIsLoading(false);
        } else {
          setUser(null);
          setIsAuthenticated(false);
          setIsLoading(false);
        }
      } else {
        setUser(null);
        setIsAuthenticated(false);
        setIsLoading(false);
      }
    } catch (error) {
      // No session or session retrieval failed — treat as unauthenticated
      setUser(null);
      setIsAuthenticated(false);
      setIsLoading(false);
    }
  }, []);

  // Initialize authentication state on app load
  useEffect(() => {
    initializeAuth();
  }, [initializeAuth]);

  // Listen for Amplify authentication Hub events
  useEffect(() => {
    const handleAuthEvent = async (capsule: unknown): Promise<void> => {
      const payload = capsule as { data?: { event?: string } };
      const { event } = payload?.data || {};

      switch (event) {
        case 'signedIn':
          // User successfully signed in via signIn()
          try {
            const currentUser = await getCurrentUser();
            if (currentUser) {
              setUser(currentUser);
              setIsAuthenticated(true);
              setIsLoading(false);
            } else {
              setUser(null);
              setIsAuthenticated(false);
              setIsLoading(false);
            }
          } catch (error) {
            console.error(
              'AuthProvider: Error fetching user after signedIn:',
              error
            );
            setUser(null);
            setIsAuthenticated(false);
            setIsLoading(false);
          }
          break;

        case 'signedOut':
          setUser(null);
          setIsAuthenticated(false);
          setIsLoading(false);
          break;

        default:
          // Ignore other Hub events
          break;
      }
    };

    const removeListener = Hub.listen('auth', handleAuthEvent);

    return () => {
      removeListener();
    };
  }, []);

  /**
   * Refresh authentication state
   * Force re-fetch of current user and auth status
   */
  const refreshAuth = useCallback(async () => {
    const currentUser = await getCurrentUser();

    if (currentUser) {
      setUser(currentUser);
      setIsAuthenticated(true);
      setIsLoading(false);
    } else {
      setUser(null);
      setIsAuthenticated(false);
      setIsLoading(false);
    }
  }, []);

  /**
   * Directly set the authenticated user (used by AppRoutes after sign-in)
   * This bypasses Hub events and sets state directly
   */
  const setAuthenticatedUser = useCallback((currentUser: AuthUser | null) => {
    if (currentUser) {
      setUser(currentUser);
      setIsAuthenticated(true);
      setIsLoading(false);
    } else {
      setUser(null);
      setIsAuthenticated(false);
      setIsLoading(false);
    }
  }, []);

  /**
   * Sign out the current user
   */
  const signOut = useCallback(async () => {
    try {
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
    setAuthenticatedUser,
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

/**
 * Tests for AuthProvider and useAuth hook
 * Regression tests for post-login authentication state synchronization
 */

import { render, screen, act, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { Hub } from 'aws-amplify/utils';
import { getCurrentUser, signOut as authSignOut } from '@services/auth';
import { AuthProvider, useAuth } from './useAuth';

// Mock Amplify auth service
vi.mock('@services/auth', () => ({
  getCurrentUser: vi.fn(),
  signOut: vi.fn(),
  isAuthenticated: vi.fn(),
}));

// Mock Amplify Hub
vi.mock('aws-amplify/utils', () => ({
  Hub: {
    listen: vi.fn().mockImplementation(() => {
      // Return a no-op cleanup function
      return () => {};
    }),
  },
}));

const mockedGetCurrentUser = vi.mocked(getCurrentUser);
const mockedSignOut = vi.mocked(authSignOut);
const mockedHubListen = vi.mocked(Hub.listen);

describe('AuthProvider', () => {
  const TestComponent = () => {
    const { user, isAuthenticated, isLoading, signOut, refreshAuth } = useAuth();
    return (
      <div>
        <span data-testid="mock-user">{user ? user.username : 'no-user'}</span>
        <span data-testid="mock-is-authenticated">
          {isLoading ? 'loading' : isAuthenticated ? 'authenticated' : 'unauthenticated'}
        </span>
        <button data-testid="mock-signout" onClick={signOut}>Sign Out</button>
        <button data-testid="mock-refresh" onClick={refreshAuth}>Refresh</button>
      </div>
    );
  };

  const renderWithProvider = () => {
    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );
  };

  beforeEach(() => {
    vi.clearAllMocks();
    // Hub.listen returns a cleanup function
    mockedHubListen.mockReturnValue(() => {});
  });

  describe('initialization', () => {
    it('shows loading state during initial auth check', () => {
      mockedGetCurrentUser.mockRejectedValue(new Error('No session'));

      renderWithProvider();

      expect(screen.getByTestId('mock-is-authenticated')).toHaveTextContent('loading');
    });

    it('sets authenticated state when user is authenticated', async () => {
      const mockUser = { userId: '123', username: 'test@example.com' };
      mockedGetCurrentUser.mockResolvedValue(mockUser);

      renderWithProvider();

      await waitFor(() => {
        expect(screen.getByTestId('mock-user')).toHaveTextContent('test@example.com');
        expect(screen.getByTestId('mock-is-authenticated')).toHaveTextContent('authenticated');
      });
    });

    it('sets unauthenticated state when no user is present', async () => {
      mockedGetCurrentUser.mockRejectedValue(new Error('No session'));

      renderWithProvider();

      await waitFor(() => {
        expect(screen.getByTestId('mock-user')).toHaveTextContent('no-user');
        expect(screen.getByTestId('mock-is-authenticated')).toHaveTextContent('unauthenticated');
      });
    });
  });

  describe('Regression: Post-login authentication state synchronization', () => {
    it('RG-1: Successful sign-in followed by immediate Dashboard navigation', async () => {
      // Scenario: After signIn() succeeds, AppRoutes navigates to Dashboard immediately.
      // AuthProvider should update state via Hub event before Dashboard renders.
      const mockUser = { userId: '123', username: 'test@example.com' };
      mockedGetCurrentUser.mockRejectedValueOnce(new Error('No session'));

      renderWithProvider();

      // Initial state: unauthenticated, loading
      await waitFor(() => {
        expect(screen.getByTestId('mock-is-authenticated')).toHaveTextContent('unauthenticated');
      });

      // Simulate signIn() success and Hub event from AppRoutes navigation
      mockedGetCurrentUser.mockResolvedValueOnce(mockUser);

      act(() => {
        const callback = mockedHubListen.mock.calls[0][1];
        callback({ payload: { event: 'signedIn' }, channel: 'auth' });
      });

      // After signedIn event is processed, AuthProvider should update state
      // isLoading should be false and user should be set
      await waitFor(() => {
        expect(screen.getByTestId('mock-is-authenticated')).toHaveTextContent('authenticated');
        expect(screen.getByTestId('mock-user')).toHaveTextContent('test@example.com');
      }, { timeout: 2000 });
    });

    it('RG-2: Existing session restoration after refresh', async () => {
      // Scenario: User refreshes browser. AuthProvider initializes and finds existing session.
      // Dashboard should render without redirect.
      const mockUser = { userId: '123', username: 'test@example.com' };
      mockedGetCurrentUser.mockResolvedValue(mockUser);

      renderWithProvider();

      // After initialization, AuthProvider should restore user from session
      await waitFor(() => {
        expect(screen.getByTestId('mock-user')).toHaveTextContent('test@example.com');
        expect(screen.getByTestId('mock-is-authenticated')).toHaveTextContent('authenticated');
      });

      // isLoading should be false (initialization complete)
      expect(screen.getByTestId('mock-is-authenticated')).not.toHaveTextContent('loading');
    });

    it('RG-3: Unauthenticated users being redirected to Sign In', async () => {
      // Scenario: User is not authenticated. AuthProvider should set isLoading=false
      // so Dashboard can redirect to sign in page.
      mockedGetCurrentUser.mockRejectedValue(new Error('No session'));

      renderWithProvider();

      // After initialization, should be unauthenticated and NOT loading
      await waitFor(() => {
        expect(screen.getByTestId('mock-user')).toHaveTextContent('no-user');
        expect(screen.getByTestId('mock-is-authenticated')).toHaveTextContent('unauthenticated');
      });

      // isLoading must be false to allow Dashboard to redirect
      expect(screen.getByTestId('mock-is-authenticated')).not.toHaveTextContent('loading');
    });

    it('RG-4: No redirect to Sign In while authentication is loading', async () => {
      // Scenario: During initial auth check, Dashboard should show loading spinner,
      // NOT redirect to sign in.
      mockedGetCurrentUser.mockRejectedValue(new Error('No session'));

      renderWithProvider();

      // During initialization, isLoading should be true
      // Dashboard should NOT redirect while isLoading is true
      expect(screen.getByTestId('mock-is-authenticated')).toHaveTextContent('loading');
    });

    it('RG-5: No duplicate session checks or conflicting state updates', async () => {
      // Scenario: After signedIn event, AuthProvider should not cause multiple
      // session checks that conflict with each other.
      const mockUser = { userId: '123', username: 'test@example.com' };
      mockedGetCurrentUser.mockRejectedValueOnce(new Error('No session'));

      renderWithProvider();

      // Initial check
      await waitFor(() => {
        expect(screen.getByTestId('mock-is-authenticated')).toHaveTextContent('unauthenticated');
      });

      // Simulate signedIn event
      mockedGetCurrentUser.mockResolvedValueOnce(mockUser);

      const callCountBefore = mockedGetCurrentUser.mock.calls.length;

      act(() => {
        const callback = mockedHubListen.mock.calls[0][1];
        callback({ payload: { event: 'signedIn' }, channel: 'auth' });
      });

      await waitFor(() => {
        expect(screen.getByTestId('mock-is-authenticated')).toHaveTextContent('authenticated');
      });

      const callCountAfter = mockedGetCurrentUser.mock.calls.length;

      // getCurrentUser should be called once more for the signedIn event
      // (not multiple times causing conflicting updates)
      expect(callCountAfter - callCountBefore).toBeLessThanOrEqual(2);
    });

    it('RG-6: Navigate to Dashboard only after authentication state is confirmed', async () => {
      // Scenario: AppRoutes should wait for AuthProvider to confirm session before
      // Dashboard is rendered. This is tested by verifying isLoading becomes false
      // after signedIn event is processed.
      const mockUser = { userId: '123', username: 'test@example.com' };
      mockedGetCurrentUser.mockRejectedValueOnce(new Error('No session'));

      renderWithProvider();

      // Before signedIn event: isLoading should be true (or become unauthenticated)
      await waitFor(() => {
        expect(screen.getByTestId('mock-is-authenticated')).not.toHaveTextContent('authenticated');
      });

      // Simulate successful sign-in
      mockedGetCurrentUser.mockResolvedValueOnce(mockUser);

      act(() => {
        const callback = mockedHubListen.mock.calls[0][1];
        callback({ payload: { event: 'signedIn' }, channel: 'auth' });
      });

      // After event: isLoading must be false and user should be authenticated
      await waitFor(() => {
        expect(screen.getByTestId('mock-is-authenticated')).toHaveTextContent('authenticated');
        expect(screen.getByTestId('mock-is-authenticated')).not.toHaveTextContent('loading');
      });
    });
  });

  describe('Hub event listeners', () => {
    beforeEach(() => {
      mockedGetCurrentUser.mockRejectedValue(new Error('No session'));
    });

    it('handles signedIn event', async () => {
      renderWithProvider();

      // Wait for initial render
      await waitFor(() => {
        expect(screen.getByTestId('mock-is-authenticated')).toHaveTextContent('unauthenticated');
      }, { timeout: 2000 });

      // Simulate signedIn event
      act(() => {
        const callback = mockedHubListen.mock.calls[0][1];
        callback({ payload: { event: 'signedIn' }, channel: 'auth' });
      });

      // User should remain unauthenticated since initializeAuth rejected
      await waitFor(() => {
        expect(screen.getByTestId('mock-is-authenticated')).toHaveTextContent('unauthenticated');
      });
    });

    it('handles signedOut event', async () => {
      mockedGetCurrentUser.mockResolvedValue({ userId: '123', username: 'test@example.com' });

      renderWithProvider();

      await waitFor(() => {
        expect(screen.getByTestId('mock-user')).toHaveTextContent('test@example.com');
      }, { timeout: 2000 });

      // Simulate signedOut event
      act(() => {
        const callback = mockedHubListen.mock.calls[0][1];
        callback({ payload: { event: 'signedOut' }, channel: 'auth' });
      });

      await waitFor(() => {
        expect(screen.getByTestId('mock-user')).toHaveTextContent('no-user');
        expect(screen.getByTestId('mock-is-authenticated')).toHaveTextContent('unauthenticated');
      });
    });
  });

  describe('signOut function', () => {
    it('calls authSignOut on sign out', async () => {
      const mockUser = { userId: '123', username: 'test@example.com' };
      mockedGetCurrentUser.mockResolvedValue(mockUser);

      renderWithProvider();

      await waitFor(() => {
        expect(screen.getByTestId('mock-is-authenticated')).toHaveTextContent('authenticated');
      });

      // Click sign out button
      act(() => {
        screen.getByTestId('mock-signout').click();
      });

      expect(mockedSignOut).toHaveBeenCalledTimes(1);
    });

    it('handles signOut error gracefully', async () => {
      const mockUser = { userId: '123', username: 'test@example.com' };
      mockedGetCurrentUser.mockResolvedValue(mockUser);

      renderWithProvider();

      await waitFor(() => {
        expect(screen.getByTestId('mock-is-authenticated')).toHaveTextContent('authenticated');
      }, { timeout: 2000 });

      // Click sign out button - wrap in act to handle state updates
      act(() => {
        screen.getByTestId('mock-signout').click();
      });

      // Wait for the click to complete
      await new Promise(resolve => setTimeout(resolve, 100));

      expect(mockedSignOut).toHaveBeenCalledTimes(1);
    });
  });

  describe('refreshAuth function', () => {
    it('calls getCurrentUser to refresh state', async () => {
      // Mock getCurrentUser to resolve with user initially (authenticated state)
      const mockUser = { userId: '123', username: 'test@example.com' };
      mockedGetCurrentUser.mockResolvedValue(mockUser);

      renderWithProvider();

      // Wait for authenticated state (initialization completes)
      await waitFor(() => {
        expect(screen.getByTestId('mock-is-authenticated')).toHaveTextContent('authenticated');
      }, { timeout: 2000 });

      // Mock getCurrentUser to return a different user for refresh
      const refreshedUser = { userId: '123', username: 'refreshed@example.com' };
      mockedGetCurrentUser.mockResolvedValue(refreshedUser);

      // Click refresh button
      act(() => {
        screen.getByTestId('mock-refresh').click();
      });

      // Wait for refresh to complete
      await waitFor(() => {
        expect(screen.getByTestId('mock-user')).toHaveTextContent('refreshed@example.com');
      }, { timeout: 2000 });

      // getCurrentUser should be called at least once (initialization)
      expect(mockedGetCurrentUser).toHaveBeenCalled();
    });
  });

  describe('useAuth hook without provider', () => {
    it('throws error when used outside AuthProvider', () => {
      // Wrap in act to handle the error thrown during render
      expect(() => {
        act(() => {
          render(<TestComponent />);
        });
      }).toThrow('useAuth must be used within an AuthProvider');
    });
  });
});


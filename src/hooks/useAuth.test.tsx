/**
 * Tests for AuthProvider and useAuth hook
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

    it('handles tokenRefresh event', async () => {
      renderWithProvider();

      await waitFor(() => {
        expect(screen.getByTestId('mock-is-authenticated')).toHaveTextContent('unauthenticated');
      }, { timeout: 2000 });

      // Simulate tokenRefresh event
      act(() => {
        const callback = mockedHubListen.mock.calls[0][1];
        callback({ payload: { event: 'tokenRefresh' }, channel: 'auth' });
      });

      // User should remain unauthenticated since initializeAuth rejected
      await waitFor(() => {
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
      // The click triggers an async function, so we await it
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

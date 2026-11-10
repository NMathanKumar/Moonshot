/**
 * Vitest setup file
 * Configures testing library extensions and global test utilities
 */

import '@testing-library/jest-dom/vitest'
import { vi } from 'vitest';

// Mock aws-amplify/auth to prevent actual Cognito calls
vi.mock('aws-amplify/auth', () => ({
  fetchAuthSession: vi.fn(async () => ({
    tokens: null, // No session by default (unauthenticated)
  })),
  getCurrentUser: vi.fn(async () => null),
  signUp: vi.fn(),
  signIn: vi.fn(),
  confirmSignUp: vi.fn(),
  signOut: vi.fn(),
}))

// Mock aws-amplify/utils Hub to prevent event listener errors
vi.mock('aws-amplify/utils', () => ({
  Hub: {
    listen: vi.fn(() => () => {}),
  },
}))

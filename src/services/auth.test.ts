import { describe, it, expect, vi, beforeEach } from 'vitest';
import {
  signIn as amplifySignIn,
  signUp as amplifySignUp,
  confirmSignUp as amplifyConfirmSignUp,
  signOut as amplifySignOut,
  getCurrentUser as amplifyGetCurrentUser,
  resetPassword as amplifyResetPassword,
  confirmResetPassword as amplifyConfirmResetPassword,
} from 'aws-amplify/auth';
import { signIn, signUp, confirmSignUp, signOut, isAuthenticated, getCurrentUser, resetPassword, confirmResetPassword } from './auth';

// Mock Amplify auth functions
vi.mock('aws-amplify/auth', () => ({
  signIn: vi.fn(),
  signUp: vi.fn(),
  confirmSignUp: vi.fn(),
  resendSignUpCode: vi.fn(),
  signOut: vi.fn(),
  getCurrentUser: vi.fn(),
  resetPassword: vi.fn(),
  confirmResetPassword: vi.fn(),
}));

const mockedSignIn = vi.mocked(amplifySignIn);
const mockedSignUp = vi.mocked(amplifySignUp);
const mockedConfirmSignUp = vi.mocked(amplifyConfirmSignUp);
const mockedAmplifySignOut = vi.mocked(amplifySignOut);
const mockedAmplifyGetCurrentUser = vi.mocked(amplifyGetCurrentUser);
const mockedAmplifyResetPassword = vi.mocked(amplifyResetPassword);
const mockedAmplifyConfirmResetPassword = vi.mocked(amplifyConfirmResetPassword);

// Mock console to prevent test output pollution
vi.spyOn(console, 'error').mockImplementation(() => {});
vi.spyOn(console, 'log').mockImplementation(() => {});
vi.spyOn(console, 'warn').mockImplementation(() => {});

describe('auth service', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('signIn', () => {
    it('calls Amplify signIn with USER_SRP_AUTH and returns on success', async () => {
      mockedSignIn.mockResolvedValue({
        username: 'test@example.com',
        nextStep: { signInStep: 'DONE' },
      } as any);

      const credentials = { email: 'test@example.com', password: 'Password123!' };

      await signIn(credentials);

      expect(mockedSignIn).toHaveBeenCalledTimes(1);
      expect(mockedSignIn).toHaveBeenCalledWith({
        username: credentials.email,
        password: credentials.password,
        options: {
          authFlow: 'USER_SRP_AUTH',
        },
      });
    });

    it('throws user-friendly error for incorrect credentials', async () => {
      const errorMessage = 'Invalid username/password combination';
      mockedSignIn.mockRejectedValue(new Error(errorMessage));

      const credentials = { email: 'test@example.com', password: 'wrong' };

      await expect(signIn(credentials)).rejects.toThrow('Authentication failed. Please check your email and password and try again.');
    });

    it('throws user-friendly error for unconfirmed email', async () => {
      const errorMessage = 'UserNotConfirmedException';
      mockedSignIn.mockRejectedValue(new Error(errorMessage));

      const credentials = { email: 'test@example.com', password: 'Password123!' };

      await expect(signIn(credentials)).rejects.toThrow('Please confirm your email address');
    });

    it('throws user-friendly error for network error', async () => {
      const errorMessage = 'NetworkError: Failed to fetch';
      mockedSignIn.mockRejectedValue(new Error(errorMessage));

      const credentials = { email: 'test@example.com', password: 'Password123!' };

      await expect(signIn(credentials)).rejects.toThrow('Network error');
    });
  });

  describe('signUp', () => {
    it('calls Amplify signUp with user attributes', async () => {
      mockedSignUp.mockResolvedValue({
        userId: 'test-user-id',
        nextStep: { signUpStep: 'CONFIRM_SIGN_UP' },
      } as any);

      const credentials = {
        email: 'test@example.com',
        password: 'Password123!',
        firstName: 'John',
        lastName: 'Doe',
        dateOfBirth: '1990-01-01',
      };

      await signUp(credentials);

      expect(mockedSignUp).toHaveBeenCalledTimes(1);
      expect(mockedSignUp).toHaveBeenCalledWith({
        username: credentials.email,
        password: credentials.password,
        options: {
          userAttributes: {
            email: credentials.email,
            given_name: credentials.firstName,
            family_name: credentials.lastName,
            // custom:date_of_birth is not included — validated client-side only
          },
        },
      });
    });

    it('throws user-friendly error for existing email', async () => {
      const errorMessage = 'UsernameExistsException: User already exists';
      mockedSignUp.mockRejectedValue(new Error(errorMessage));

      const credentials = {
        email: 'existing@example.com',
        password: 'Password123!',
        firstName: 'John',
        lastName: 'Doe',
        dateOfBirth: '1990-01-01',
      };

      await expect(signUp(credentials)).rejects.toThrow('already exists');
    });

    it('throws user-friendly error for invalid password', async () => {
      const errorMessage = 'InvalidPasswordException: Password does not meet requirements';
      mockedSignUp.mockRejectedValue(new Error(errorMessage));

      const credentials = {
        email: 'test@example.com',
        password: 'weak',
        firstName: 'John',
        lastName: 'Doe',
        dateOfBirth: '1990-01-01',
      };

      await expect(signUp(credentials)).rejects.toThrow('Password must be at least 12 characters');
    });
  });

  describe('confirmSignUp', () => {
    it('calls Amplify confirmSignUp with correct parameters', async () => {
      mockedConfirmSignUp.mockResolvedValue({ isSignUpComplete: true } as any);

      await confirmSignUp('test@example.com', '123456');

      expect(mockedConfirmSignUp).toHaveBeenCalledTimes(1);
      expect(mockedConfirmSignUp).toHaveBeenCalledWith({
        username: 'test@example.com',
        confirmationCode: '123456',
      });
    });

    it('throws user-friendly error for expired code', async () => {
      const errorMessage = 'ExpiredCodeException: Code has expired';
      mockedConfirmSignUp.mockRejectedValue(new Error(errorMessage));

      await expect(confirmSignUp('test@example.com', 'expired')).rejects.toThrow('expired');
    });

    it('throws user-friendly error for incorrect code', async () => {
      const errorMessage = 'CodeMismatchException: Code does not match';
      mockedConfirmSignUp.mockRejectedValue(new Error(errorMessage));

      await expect(confirmSignUp('test@example.com', 'wrong')).rejects.toThrow('incorrect');
    });
  });

  describe('signOut', () => {
    it('calls Amplify signOut on success', async () => {
      mockedAmplifySignOut.mockResolvedValue(undefined);

      await signOut();

      expect(mockedAmplifySignOut).toHaveBeenCalledTimes(1);
    });

    it('re-throws error if signOut fails', async () => {
      const errorMessage = 'Sign-out failed: Network error';
      mockedAmplifySignOut.mockRejectedValue(new Error(errorMessage));

      await expect(signOut()).rejects.toThrow(errorMessage);
    });
  });

  describe('isAuthenticated', () => {
    it('returns true if getCurrentUser resolves', async () => {
      mockedAmplifyGetCurrentUser.mockResolvedValue({
        userId: '123',
        username: 'test@example.com',
      } as any);

      const authenticated = await isAuthenticated();

      expect(authenticated).toBe(true);
    });

    it('returns false if getCurrentUser rejects', async () => {
      mockedAmplifyGetCurrentUser.mockRejectedValue(new Error('No session'));

      const authenticated = await isAuthenticated();

      expect(authenticated).toBe(false);
    });
  });

  describe('getCurrentUser', () => {
    it('returns the current user if authenticated', async () => {
      const mockUser = { userId: '123', username: 'test@example.com' };
      mockedAmplifyGetCurrentUser.mockResolvedValue(mockUser);

      const user = await getCurrentUser();

      expect(user).toEqual(mockUser);
    });

    it('returns null if getCurrentUser rejects', async () => {
      mockedAmplifyGetCurrentUser.mockRejectedValue(new Error('No session'));

      const user = await getCurrentUser();

      expect(user).toBeNull();
    });
  });

  describe('resetPassword', () => {
    it('calls Amplify resetPassword with email', async () => {
      mockedAmplifyResetPassword.mockResolvedValue({ nextStep: { resetPasswordStep: 'CONFIRM_RESET_PASSWORD_WITH_CODE' } } as any);

      await resetPassword('test@example.com');

      expect(mockedAmplifyResetPassword).toHaveBeenCalledTimes(1);
      expect(mockedAmplifyResetPassword).toHaveBeenCalledWith({ username: 'test@example.com' });
    });

    it('translates UserNotFoundException to generic message (email enumeration protection)', async () => {
      mockedAmplifyResetPassword.mockRejectedValue(new Error('UserNotFoundException: User not found'));

      await expect(resetPassword('nonexistent@example.com')).rejects.toThrow(
        'We sent a 6-digit code to your email address.'
      );
    });

    it('translates NetworkError to user-friendly message', async () => {
      mockedAmplifyResetPassword.mockRejectedValue(new Error('NetworkError: Connection refused'));

      await expect(resetPassword('test@example.com')).rejects.toThrow(
        'Network error. Please check your connection and try again.'
      );
    });

    it('translates LimitExceededException to rate limit message', async () => {
      mockedAmplifyResetPassword.mockRejectedValue(new Error('LimitExceededException: Too many attempts'));

      await expect(resetPassword('test@example.com')).rejects.toThrow(
        'Too many requests. Please wait a few minutes and try again.'
      );
    });

    it('translates InvalidParameterException to invalid email message', async () => {
      mockedAmplifyResetPassword.mockRejectedValue(new Error('InvalidParameterException: Invalid email'));

      await expect(resetPassword('invalid-email')).rejects.toThrow(
        'Invalid email address. Please check and try again.'
      );
    });

    it('throws default fallback message for unknown errors', async () => {
      mockedAmplifyResetPassword.mockRejectedValue(new Error('UnknownError: Something went wrong'));

      await expect(resetPassword('test@example.com')).rejects.toThrow(
        'Unable to send code. Please check your email and try again.'
      );
    });
  });

  describe('confirmResetPassword', () => {
    it('calls Amplify confirmResetPassword with correct parameters', async () => {
      mockedAmplifyConfirmResetPassword.mockResolvedValue(undefined);

      await confirmResetPassword('test@example.com', '123456', 'NewPassword123!');

      expect(mockedAmplifyConfirmResetPassword).toHaveBeenCalledTimes(1);
      expect(mockedAmplifyConfirmResetPassword).toHaveBeenCalledWith({
        username: 'test@example.com',
        confirmationCode: '123456',
        newPassword: 'NewPassword123!',
      });
    });

    it('translates CodeMismatchException to invalid code message', async () => {
      mockedAmplifyConfirmResetPassword.mockRejectedValue(new Error('CodeMismatchException: Code does not match'));

      await expect(confirmResetPassword('test@example.com', 'wrong', 'Password123!')).rejects.toThrow(
        'Invalid code. Please check and try again.'
      );
    });

    it('translates ExpiredCodeException to expired message', async () => {
      mockedAmplifyConfirmResetPassword.mockRejectedValue(new Error('ExpiredCodeException: Code has expired'));

      await expect(confirmResetPassword('test@example.com', 'expired', 'Password123!')).rejects.toThrow(
        'Reset code has expired. Please request a new one.'
      );
    });

    it('translates InvalidPasswordException to password policy message', async () => {
      mockedAmplifyConfirmResetPassword.mockRejectedValue(new Error('InvalidPasswordException: Password does not meet requirements'));

      await expect(confirmResetPassword('test@example.com', '123456', 'weak')).rejects.toThrow(
        'Password must be at least 12 characters with 1 uppercase, 1 lowercase, and 1 number.'
      );
    });

    it('translates LimitExceededException to rate limit message', async () => {
      mockedAmplifyConfirmResetPassword.mockRejectedValue(new Error('LimitExceededException: Too many attempts'));

      await expect(confirmResetPassword('test@example.com', '123456', 'Password123!')).rejects.toThrow(
        'Too many failed attempts. Please wait a few minutes and try again.'
      );
    });

    it('translates NetworkError to user-friendly message', async () => {
      mockedAmplifyConfirmResetPassword.mockRejectedValue(new Error('Network error: Connection timeout'));

      await expect(confirmResetPassword('test@example.com', '123456', 'Password123!')).rejects.toThrow(
        'Network error. Please check your connection and try again.'
      );
    });

    it('throws default fallback message for unknown errors', async () => {
      mockedAmplifyConfirmResetPassword.mockRejectedValue(new Error('UnknownError: Something went wrong'));

      await expect(confirmResetPassword('test@example.com', '123456', 'Password123!')).rejects.toThrow(
        'Invalid code or password reset failed. Please try again.'
      );
    });
  });
});

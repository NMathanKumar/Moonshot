/**
 * Route Definitions
 */

import { Routes, Route, Navigate } from 'react-router-dom';
import { SignIn } from '@components/auth/SignIn';
import { SignUp } from '@components/auth/SignUp';
import { Dashboard } from '@components/dashboard';
import { signIn as authSignIn, signUp as authSignUp, confirmSignUp } from '@services/auth';

/**
 * Handles Sign In submission by calling direct SDK authentication
 */
async function handleSignInSubmit(
  credentials: { email: string; password: string },
): Promise<void> {
  try {
    console.log('AppRoutes: handleSignInSubmit called');
    await authSignIn(credentials);
    console.log('AppRoutes: handleSignInSubmit completed - awaiting navigation');
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Authentication failed';
    throw new Error(message);
  }
}

/**
 * Handles Sign Up submission by creating a new account
 */
async function handleSignUpSubmit(
  credentials: { email: string; password: string; firstName: string; lastName: string; dateOfBirth: string },
): Promise<void> {
  try {
    console.log('AppRoutes: handleSignUpSubmit called');
    await authSignUp(credentials);
    console.log('AppRoutes: handleSignUpSubmit completed - account created, confirmation code sent');
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Account creation failed';
    throw new Error(message);
  }
}

/**
 * Handles email verification for sign-up
 */
async function handleVerifyEmail(email: string, code: string): Promise<void> {
  try {
    console.log('AppRoutes: handleVerifyEmail called');
    await confirmSignUp(email, code);
    console.log('AppRoutes: Email verified successfully');
    // User can now sign in
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Email verification failed';
    throw new Error(message);
  }
}

export function AppRoutes(): React.JSX.Element {
  return (
    <Routes>
      {/* Sign in page */}
      <Route path="/signin" element={<SignIn onSubmit={handleSignInSubmit} />} />
      
      {/* Sign up page */}
      <Route path="/signup" element={<SignUp onSubmit={handleSignUpSubmit} />} />
      
      {/* Protected dashboard route */}
      <Route path="/dashboard" element={<Dashboard />} />
      
      {/* Default redirect to signin */}
      <Route path="/" element={<Navigate to="/signin" replace />} />
    </Routes>
  );
}

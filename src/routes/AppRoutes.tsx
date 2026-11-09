/**
 * Route Definitions
 */

import { Routes, Route, Navigate } from 'react-router-dom';
import { SignIn } from '@components/auth/SignIn';
import { signIn as authSignIn } from '@services/auth';

/**
 * Handles Sign In submission by calling Cognito
 */
async function handleSignInSubmit(
  credentials: { email: string; password: string },
): Promise<void> {
  try {
    await authSignIn(credentials);
    // Success: The API will redirect or set auth state
    // For now, we just resolve (no redirect logic yet)
  } catch (error) {
    // Re-throw with the error message for display in the Sign In form
    const message = error instanceof Error ? error.message : 'Authentication failed';
    throw new Error(message);
  }
}

export function AppRoutes(): React.JSX.Element {
  return (
    <Routes>
      <Route path="/signin" element={<SignIn onSubmit={handleSignInSubmit} />} />
      <Route path="/" element={<Navigate to="/signin" replace />} />
    </Routes>
  );
}

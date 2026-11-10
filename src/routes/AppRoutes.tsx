/**
 * Route Definitions
 */

import { useNavigate, Routes, Route, Navigate } from 'react-router-dom';
import { SignIn } from '@components/auth/SignIn';
import { SignUp } from '@components/auth/SignUp';
import { ConfirmSignUp } from '@components/auth/ConfirmSignUp';
import { Dashboard } from '@components/dashboard';
import { signIn as authSignIn, getCurrentUser, signUp as authSignUp, confirmSignUp as authConfirmSignUp } from '@services/auth';
import { useAuth } from '@hooks/useAuth';

/**
 * Component that handles sign-in and uses auth context
 * Must be inside Routes/AppRoutes so it has proper access to useAuth hook
 */
function SignInPage() {
  const navigate = useNavigate();
  const { setAuthenticatedUser } = useAuth();

  const handleSignInSubmit = async (
    credentials: { email: string; password: string },
  ): Promise<void> => {
    const timestamp = new Date().toISOString();
    console.log(`[${timestamp}] SignInPage: handleSignInSubmit called`);
    
    try {
      await authSignIn(credentials);
      console.log(`[${timestamp}] SignInPage: authSignIn completed`);
      
      // Add small delay to ensure Cognito session is fully established
      await new Promise(resolve => setTimeout(resolve, 100));
      
      // Get current user and verify user data is available
      const currentUser = await getCurrentUser();
      console.log(`[${timestamp}] SignInPage: getCurrentUser returned: ${currentUser?.username || 'null'}`);
      
      if (!currentUser) {
        throw new Error('User authenticated but user data is unavailable');
      }
      
      // Update AuthProvider state directly - THIS IS THE KEY FIX
      console.log(`[${timestamp}] SignInPage: Calling setAuthenticatedUser with user: ${currentUser.username}`);
      setAuthenticatedUser(currentUser);
      console.log(`[${timestamp}] SignInPage: AuthProvider state updated successfully`);
      
      // Small delay before navigation to ensure state update propagates
      await new Promise(resolve => setTimeout(resolve, 50));
      
      console.log(`[${timestamp}] SignInPage: Navigating to /dashboard`);
      // Navigate to dashboard with replace to prevent back button issues
      navigate('/dashboard', { replace: true });
      console.log(`[${timestamp}] SignInPage: Navigation triggered`);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Authentication failed';
      console.error(`[${new Date().toISOString()}] SignInPage: handleSignInSubmit error:`, message);
      throw new Error(message);
    }
  };

  return <SignIn onSubmit={handleSignInSubmit} />;
}

export function AppRoutes(): React.JSX.Element {
  const navigate = useNavigate();

  /**
   * Handles Sign Up submission by creating a new account
   * On success, navigates to confirmation page to verify email
   */
  const handleSignUpSubmit = async (
    credentials: { email: string; password: string; firstName: string; lastName: string; dateOfBirth: string },
  ): Promise<void> => {
    try {
      console.log('AppRoutes: handleSignUpSubmit called');
      await authSignUp(credentials);
      console.log('AppRoutes: handleSignUpSubmit completed - account created, confirmation code sent');
      
      // Navigate to confirmation page and pass email
      navigate('/confirm-signup', { 
        replace: true,
        state: { email: credentials.email }
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Account creation failed';
      console.error('AppRoutes: handleSignUpSubmit error:', message);
      throw new Error(message);
    }
  };

  /**
   * Handles email confirmation after sign up
   * On success, navigates to sign in page
   */
  const handleConfirmSignUpSubmit = async (
    email: string,
    confirmationCode: string,
  ): Promise<void> => {
    try {
      console.log('AppRoutes: handleConfirmSignUpSubmit called');
      await authConfirmSignUp(email, confirmationCode);
      console.log('AppRoutes: handleConfirmSignUpSubmit completed - email confirmed');
      // User will be directed to sign in after success message in ConfirmSignUp component
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Email confirmation failed';
      console.error('AppRoutes: handleConfirmSignUpSubmit error:', message);
      throw new Error(message);
    }
  };

  return (
    <Routes>
      {/* Sign in page - Now uses SignInPage component for proper hook access */}
      <Route path="/signin" element={<SignInPage />} />
      
      {/* Sign up page */}
      <Route path="/signup" element={<SignUp onSubmit={handleSignUpSubmit} />} />
      
      {/* Email confirmation page */}
      <Route path="/confirm-signup" element={<ConfirmSignUp onSubmit={handleConfirmSignUpSubmit} />} />
      
      {/* Protected dashboard route */}
      <Route path="/dashboard" element={<Dashboard />} />
      
      {/* Default redirect to signin */}
      <Route path="/" element={<Navigate to="/signin" replace />} />
    </Routes>
  );
}

/**
 * Route Definitions
 */

import { useNavigate, Routes, Route, Navigate } from 'react-router-dom';
import { SignIn } from '@components/auth/SignIn';
import { SignUp } from '@components/auth/SignUp';
import { ConfirmSignUp } from '@components/auth/ConfirmSignUp';
import { Dashboard } from '@components/dashboard';
import { signIn as authSignIn, getCurrentUser, signUp as authSignUp, confirmSignUp as authConfirmSignUp, getAuthSession } from '@services/auth';
import { useAuth } from '@hooks/useAuth';
import { EnrolmentService } from '@services';
import { CreateTestTakerRequest, Gender } from '@services/enrolment';
import { setPendingProfile, getPendingProfile, clearPendingProfile } from '@utils/pendingProfileStorage';

/**
 * Component that handles sign-in and uses auth context
 * Must be inside Routes/AppRoutes so it has proper access to useAuth hook
 */
function SignInPage() {
  const navigate = useNavigate();
  const { setAuthenticatedUser } = useAuth();

  /**
   * Create test taker profile if pending data exists
   * Only called after user is authenticated and has a valid session
   */
  const createPendingProfile = async (): Promise<void> => {
    const pendingData = getPendingProfile();
    
    if (!pendingData) {
      console.log('[SignInPage] No pending profile data found');
      return;
    }

    // Verify we have a valid access token before proceeding
    let hasValidToken = false;
    try {
      const session = await getAuthSession();
      hasValidToken = !!(session?.tokens?.accessToken);
      console.log('[SignInPage] Access token verification:', hasValidToken ? 'OK' : 'MISSING');
    } catch (tokenError) {
      console.error('[SignInPage] Failed to verify access token:', tokenError);
      return; // Silently fail - profile can be created later
    }

    if (!hasValidToken) {
      console.warn('[SignInPage] No valid access token - cannot create profile yet');
      return;
    }

    try {
      console.log('[SignInPage] Creating test taker profile with:', {
        givenName: pendingData.firstName,
        familyName: pendingData.lastName,
        dateOfBirth: pendingData.dateOfBirth,
        gender: pendingData.gender,
      });

      const testTakerData: CreateTestTakerRequest = {
        givenName: pendingData.firstName,
        familyName: pendingData.lastName,
        dateOfBirth: pendingData.dateOfBirth,
        gender: (pendingData.gender || 'PREFER_NOT_TO_SAY') as Gender,
      };

      await EnrolmentService.createTestTaker(testTakerData);
      console.log('[SignInPage] Test taker profile created successfully');
      
      // Clear pending data after successful creation
      clearPendingProfile();
    } catch (profileError) {
      // Log error but don't block sign-in
      // User can update profile later from dashboard or it will retry on next sign-in
      console.warn('[SignInPage] Failed to create test taker profile:', profileError);
      console.warn('[SignInPage] Profile creation can be retried from dashboard or on next sign-in');
      // Keep pending data in storage for retry attempt on next sign-in
    }
  };

  const handleSignInSubmit = async (
    credentials: { email: string; password: string },
  ): Promise<void> => {
    const timestamp = new Date().toISOString();
    console.log(`[${timestamp}] SignInPage: handleSignInSubmit called`);
    
    try {
      await authSignIn(credentials);
      console.log(`[${timestamp}] SignInPage: authSignIn completed - user authenticated`);
      
      // Add small delay to ensure Cognito session is fully established
      await new Promise(resolve => setTimeout(resolve, 100));
      
      // Get current user and verify user data is available
      const currentUser = await getCurrentUser();
      console.log(`[${timestamp}] SignInPage: getCurrentUser returned: ${currentUser?.username || 'null'}`);
      
      if (!currentUser) {
        throw new Error('User authenticated but user data is unavailable');
      }
      
      // Update AuthProvider state directly
      console.log(`[${timestamp}] SignInPage: Calling setAuthenticatedUser with user: ${currentUser.username}`);
      setAuthenticatedUser(currentUser);
      console.log(`[${timestamp}] SignInPage: AuthProvider state updated successfully`);
      
      // Now that user is authenticated with valid token, create profile if pending
      await createPendingProfile();
      
      // Small delay before navigation to ensure state update propagates
      await new Promise(resolve => setTimeout(resolve, 50));
      
      console.log(`[${timestamp}] SignInPage: Navigating to /dashboard`);
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
   * Stores profile data for creation after confirmation and sign-in
   * NEVER stores password
   */
  const handleSignUpSubmit = async (
    credentials: { email: string; password: string; firstName: string; lastName: string; dateOfBirth: string; gender: string },
  ): Promise<void> => {
    try {
      console.log('AppRoutes: handleSignUpSubmit called');
      
      // Store NON-SENSITIVE profile data (NOT password) for use after email confirmation and sign-in
      // Password is explicitly NOT stored - it's used only for Cognito sign-up
      setPendingProfile({
        firstName: credentials.firstName,
        lastName: credentials.lastName,
        dateOfBirth: credentials.dateOfBirth,
        gender: credentials.gender,
      });
      
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
   * Confirms the email but does NOT create the profile yet
   * Profile creation happens after sign-in when user has valid tokens
   */
  const handleConfirmSignUpSubmit = async (
    email: string,
    confirmationCode: string,
  ): Promise<void> => {
    try {
      console.log('AppRoutes: handleConfirmSignUpSubmit called');
      await authConfirmSignUp(email, confirmationCode);
      console.log('AppRoutes: handleConfirmSignUpSubmit completed - email confirmed in Cognito');
      console.log('AppRoutes: Profile creation will happen after user signs in');
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

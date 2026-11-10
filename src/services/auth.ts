/**
 * Authentication Service
 * Direct Amplify v6 SDK authentication using USER_SRP_AUTH flow
 */

import {
  signIn as amplifySignIn,
  signUp as amplifySignUp,
  confirmSignUp as amplifyConfirmSignUp,
  signOut as amplifySignOut,
  getCurrentUser as amplifyGetCurrentUser,
  fetchAuthSession,
} from 'aws-amplify/auth';

export interface SignInCredentials {
  email: string;
  password: string;
}

export interface SignUpCredentials {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  dateOfBirth: string;
}

export interface SignInResponse {
  success: boolean;
  message?: string;
}

/**
 * Sign in a user with email and password using USER_SRP_AUTH
 * 
 * This function performs direct SDK authentication without any Cognito Hosted UI redirect.
 * The password is securely transmitted using Secure Remote Password (SRP) protocol.
 * 
 * @param credentials - Email and password provided by the user
 * @throws Error if authentication fails
 */
/**
 * Sign in a user with email and password using USER_SRP_AUTH or USER_PASSWORD_AUTH
 * 
 * This function performs direct SDK authentication without any Cognito Hosted UI redirect.
 * First tries USER_SRP_AUTH (secure remote password), falls back to USER_PASSWORD_AUTH if needed.
 * 
 * @param credentials - Email and password provided by the user
 * @throws Error if authentication fails
 */
export async function signIn(credentials: SignInCredentials): Promise<void> {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] signIn: Attempting direct SDK authentication...`);
  console.log(`[${timestamp}] signIn: Email: ${credentials.email}`);
  
  try {
    // Try USER_SRP_AUTH first (secure)
    try {
      console.log(`[${timestamp}] signIn: Trying USER_SRP_AUTH...`);
      const result = await amplifySignIn({
        username: credentials.email,
        password: credentials.password,
        options: {
          authFlow: 'USER_SRP_AUTH',
        },
      });
      
      console.log(`[${timestamp}] ✅ signIn: User authenticated successfully with USER_SRP_AUTH`);
      console.log(`[${timestamp}] signIn: SignIn result:`, result);
      return;
    } catch (srpError) {
      console.warn(`[${timestamp}] signIn: USER_SRP_AUTH failed, trying USER_PASSWORD_AUTH...`);
      console.warn(`[${timestamp}] signIn: SRP Error:`, srpError);
    }
    
    // Fallback to USER_PASSWORD_AUTH
    try {
      console.log(`[${timestamp}] signIn: Trying USER_PASSWORD_AUTH...`);
      const result = await amplifySignIn({
        username: credentials.email,
        password: credentials.password,
        options: {
          authFlow: 'USER_PASSWORD_AUTH',
        },
      });
      
      console.log(`[${timestamp}] ✅ signIn: User authenticated successfully with USER_PASSWORD_AUTH`);
      console.log(`[${timestamp}] signIn: SignIn result:`, result);
      return;
    } catch (passwordError) {
      console.error(`[${timestamp}] signIn: USER_PASSWORD_AUTH also failed`);
      console.error(`[${timestamp}] signIn: Password Auth Error:`, passwordError);
      throw passwordError;
    }
  } catch (error) {
    console.error('❌ signIn: Direct auth failed with error:');
    console.error('Error object:', error);
    
    // Log detailed error information
    if (error instanceof Error) {
      console.error('Error name:', error.name);
      console.error('Error message:', error.message);
      console.error('Full error:', JSON.stringify(error, Object.getOwnPropertyNames(error)));
    }
    
    // Translate Cognito errors to user-friendly messages
    if (error instanceof Error) {
      const message = error.message;
      
      if (message.includes('UserAlreadyAuthenticated')) {
        throw new Error('You are already signed in. Please sign out first if you want to sign in with a different account.');
      }
      if (message.includes('UserNotConfirmedException')) {
        throw new Error('Please confirm your email address before signing in.');
      }
      if (message.includes('NotAuthorizedException') || message.includes('Invalid') || message.includes('invalid')) {
        throw new Error('Email or password is incorrect.');
      }
      if (message.includes('UserNotFoundException')) {
        throw new Error('No account found with this email address.');
      }
      if (message.includes('Password')) {
        throw new Error('Password does not meet the required criteria.');
      }
      if (message.includes('NetworkError') || message.includes('Network')) {
        throw new Error('Network error. Please check your connection and try again.');
      }
    }
    
    throw new Error('Authentication failed. Please check your email and password and try again.');
  }
}

/**
 * Sign up a user with email and password
 * Sends a confirmation code to the email address
 * 
 * Note: Date of birth is validated client-side for age verification but not stored
 * in Cognito as it's not a required User Pool attribute in the current MVP scope.
 * 
 * @param credentials - Email, password, name, and date of birth information
 * @throws Error if sign-up fails
 */
export async function signUp(credentials: SignUpCredentials): Promise<void> {
  try {
    console.log('signUp: Creating user account...');
    
    // Standard attributes only — custom:date_of_birth is not included because
    // it may not be configured in the Cognito User Pool or may require additional setup
    await amplifySignUp({
      username: credentials.email,
      password: credentials.password,
      options: {
        userAttributes: {
          email: credentials.email,
          given_name: credentials.firstName,
          family_name: credentials.lastName,
          // Date of birth is validated client-side but not stored in Cognito
        },
      },
    });
    
    console.log('✅ signUp: Account created. Confirmation code sent to email.');
    // Confirmation happens via confirmSignUp()
  } catch (error) {
    console.error('❌ signUp: Sign-up failed:', error);
    
    // Translate Cognito errors to user-friendly messages
    if (error instanceof Error) {
      const message = error.message;
      
      if (message.includes('UsernameExistsException') || message.includes('already exists')) {
        throw new Error('An account with this email address already exists.');
      }
      if (message.includes('InvalidPasswordException')) {
        throw new Error('Password does not meet the required criteria: at least 1 uppercase, 1 lowercase, 1 number, and 12 characters.');
      }
      if (message.includes('InvalidParameterException') || message.includes('Invalid')) {
        throw new Error('Invalid input. Please check your details and try again.');
      }
    }
    
    throw new Error('Account creation failed. Please try again.');
  }
}

/**
 * Confirm user sign-up with confirmation code sent to email
 * 
 * @param email - User's email address
 * @param confirmationCode - Code received in email
 * @throws Error if confirmation fails
 */
export async function confirmSignUp(email: string, confirmationCode: string): Promise<void> {
  try {
    console.log('confirmSignUp: Confirming email address...');
    
    await amplifyConfirmSignUp({
      username: email,
      confirmationCode,
    });
    
    console.log('✅ confirmSignUp: Email confirmed. Account is now active.');
  } catch (error) {
    console.error('❌ confirmSignUp: Confirmation failed:', error);
    
    if (error instanceof Error) {
      const message = error.message;
      
      if (message.includes('ExpiredCodeException') || message.includes('expired')) {
        throw new Error('Confirmation code has expired. Please request a new one.');
      }
      if (message.includes('CodeMismatchException') || message.includes('Mismatch')) {
        throw new Error('Confirmation code is incorrect.');
      }
      if (message.includes('LimitExceededException') || message.includes('Attempt limit')) {
        throw new Error('Too many failed attempts. Please request a new confirmation code.');
      }
    }
    
    throw new Error('Email confirmation failed. Please check the code and try again.');
  }
}

/**
 * Sign out the current user
 * Clears all tokens and ends the session
 */
export async function signOut(): Promise<void> {
  try {
    console.log('signOut: Signing out...');
    await amplifySignOut();
    console.log('✅ signOut: User signed out successfully.');
  } catch (error) {
    console.error('❌ signOut: Sign-out error:', error);
    throw error;
  }
}

/**
 * Check if the user is authenticated
 * Returns true if there is a valid Cognito session
 */
export async function isAuthenticated(): Promise<boolean> {
  try {
    await amplifyGetCurrentUser();
    return true;
  } catch (error) {
    return false;
  }
}

/**
 * Get the current authenticated user
 * Returns the user object if authenticated, throws error otherwise
 */
export async function getCurrentUser() {
  try {
    return await amplifyGetCurrentUser();
  } catch (error) {
    console.error('getCurrentUser error:', error);
    return null;
  }
}

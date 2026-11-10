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
export async function signIn(credentials: SignInCredentials): Promise<void> {
  try {
    console.log('signIn: Attempting direct SDK authentication with USER_SRP_AUTH...');
    
    await amplifySignIn({
      username: credentials.email,
      password: credentials.password,
      options: {
        authFlow: 'USER_SRP_AUTH',
      },
    });
    
    console.log('✅ signIn: User authenticated successfully');
    // AuthProvider will detect the 'signedIn' Hub event and fetch the current user
  } catch (error) {
    console.error('❌ signIn: Direct auth failed:', error);
    
    // Translate Cognito errors to user-friendly messages
    if (error instanceof Error) {
      const message = error.message;
      
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
 * @param credentials - Email, password, name, and date of birth information
 * @throws Error if sign-up fails
 */
export async function signUp(credentials: SignUpCredentials): Promise<void> {
  try {
    console.log('signUp: Creating user account...');
    
    await amplifySignUp({
      username: credentials.email,
      password: credentials.password,
      options: {
        userAttributes: {
          email: credentials.email,
          given_name: credentials.firstName,
          family_name: credentials.lastName,
          'custom:date_of_birth': credentials.dateOfBirth,
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

/**
 * Authentication Service
 * Placeholder until backend API is available
 */

export interface SignInCredentials {
  email: string;
  password: string;
}

export interface SignInResponse {
  success: boolean;
  message?: string;
}

/**
 * Placeholder authentication
 * TODO: Replace with real API client when backend is available
 */
export async function signIn(credentials: SignInCredentials): Promise<SignInResponse> {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 900));

  // TODO: Connect to real backend
  throw new Error(
    `Sign in is not connected to a backend yet (attempted for "${credentials.email}").`,
  );
}

export async function signOut(): Promise<void> {
  // TODO: Connect to real backend
}

export async function isAuthenticated(): Promise<boolean> {
  return false;
}

export async function getCurrentUser() {
  return null;
}
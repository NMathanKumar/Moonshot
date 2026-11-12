import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchAuthSession } from 'aws-amplify/auth';
import signinStudent from '@assets/idp-signin-student.png';

export interface SignInCredentials {
  email: string;
  password: string;
}

export interface SignInProps {
  onSubmit?: (credentials: SignInCredentials) => Promise<void>;
}

export function SignIn({ onSubmit }: SignInProps) {
  const navigate = useNavigate();
  const [show, setShow] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isCheckingSession, setIsCheckingSession] = useState(true);

  // Check if user is already authenticated on mount
  useEffect(() => {
    const checkSession = async () => {
      try {
        const session = await fetchAuthSession();
        if (session.tokens?.accessToken) {
          console.log('[SignIn] User already authenticated, redirecting to dashboard');
          navigate('/dashboard', { replace: true });
        }
      } catch (err) {
        console.log('[SignIn] No existing session');
      } finally {
        setIsCheckingSession(false);
      }
    };

    checkSession();
  }, [navigate]);

  const handleNavigateToSignUp = () => {
    navigate('/signup');
  };

  const handleForgotPassword = () => {
    navigate('/forgot-password');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      console.log('[SignIn] Form submitted with:', { email });
      if (onSubmit) {
        await onSubmit({ email, password });
        console.log('[SignIn] Auth handler completed successfully');
        // Handler will navigate to dashboard via AppRoutes
      } else {
        console.warn('[SignIn] No onSubmit handler provided');
        setError('Sign in handler not configured');
        setIsSubmitting(false);
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred';
      console.error('[SignIn] Submission error:', errorMessage);
      setError(errorMessage);
      setIsSubmitting(false);
    }
  };

  // Show loading while checking session
  if (isCheckingSession) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-white">
        <p className="text-center text-base text-[#232d3f]">Loading...</p>
      </div>
    );
  }

  return (
    <div className="login-grid">
      {/* Left brand panel */}
      <div className="login-brand-panel" style={{ flexDirection: 'column', justifyContent: 'center', alignItems: 'center', padding: 60, position: 'relative', overflow: 'hidden' }}>
        <img
          src={signinStudent}
          alt="Student holding a tablet"
          className="signin-illustration"
        />
      </div>

      {/* Right form panel */}
      <div className="login-form-panel">
        <form className="login-form-card" style={{ maxWidth: 480, padding: '40px 42px', borderRadius: 20, background: 'white', border: '1px solid #e5e7eb', boxShadow: '0 10px 40px rgba(0, 0, 0, 0.08)' }} onSubmit={handleSubmit}>
          {/* Header */}
          <div style={{ marginBottom: 36, textAlign: 'center' }}>
            <h1 style={{ fontSize: 28, fontWeight: 900, color: '#1f2937', marginBottom: 12, textAlign: 'center', margin: 0 }}>
              Sign in
            </h1>
            <p style={{ fontSize: 14, color: '#6b7280', textAlign: 'center', margin: 0 }}>
              Welcome back! Please enter your details.
            </p>
          </div>

          {/* Error Alert */}
          {error && (
            <div style={{ marginBottom: 16, padding: '10px 14px', borderRadius: 8, background: '#fef2f2', border: '1px solid #fecaca', color: '#dc2626', fontSize: 13 }}>
              {error}
            </div>
          )}

          {/* Form Fields */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16, marginBottom: 20 }}>
            {/* Email Field */}
            <div>
              <label style={{ display: 'block', fontSize: 11, fontWeight: 700, color: 'var(--color-slate)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 6 }}>
                Email
              </label>
              <input
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isSubmitting}
                required
                style={{ width: '100%', padding: '11px 14px', borderRadius: 8, border: '1.5px solid var(--border)', background: 'white', fontSize: 13, color: 'var(--color-ink)', outline: 'none', fontFamily: 'Inter, sans-serif' }}
              />
            </div>

            {/* Password Field */}
            <div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, marginBottom: 6 }}>
                <label style={{ fontSize: 11, fontWeight: 700, color: 'var(--color-slate)', textTransform: 'uppercase', letterSpacing: '0.06em', margin: 0 }}>
                  Password
                </label>
                <button
                  type="button"
                  onClick={handleForgotPassword}
                  disabled={isSubmitting}
                  style={{ fontSize: 12, color: '#FF6A00', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 700, padding: 0 }}
                >
                  Forgot password?
                </button>
              </div>
              <div style={{ position: 'relative' }}>
                <input
                  type={show ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={isSubmitting}
                  required
                  style={{ width: '100%', padding: '11px 14px', paddingRight: 44, borderRadius: 8, border: '1.5px solid var(--border)', background: 'white', fontSize: 13, color: 'var(--color-ink)', outline: 'none', fontFamily: 'Inter, sans-serif' }}
                />
                <button
                  type="button"
                  onClick={() => setShow(!show)}
                  disabled={isSubmitting}
                  style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', fontSize: 11, color: 'var(--color-slate)', fontWeight: 700, fontFamily: 'Inter, sans-serif', padding: 0 }}
                >
                  {show ? 'Hide password' : 'Show password'}
                </button>
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            style={{ width: '100%', display: 'block', textAlign: 'center', padding: '13px', borderRadius: 10, border: 'none', background: 'var(--color-action-primary)', color: 'white', fontSize: 14, fontWeight: 800, textDecoration: 'none', marginBottom: 16, cursor: 'pointer', fontFamily: 'Inter, sans-serif' }}
          >
            {isSubmitting ? 'Signing in...' : 'Sign in'}
          </button>

          {/* Sign Up Link */}
          <div style={{ textAlign: 'center', marginBottom: 18 }}>
            <span style={{ fontSize: 12, color: 'var(--color-slate)' }}>Don't have an account? </span>
            <button
              type="button"
              onClick={handleNavigateToSignUp}
              disabled={isSubmitting}
              style={{ fontSize: 12, color: 'var(--color-action-primary)', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 700 }}
            >
              Sign up
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default SignIn;

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
  const [showPassword, setShowPassword] = useState(false);
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
    // TODO: Implement forgot password flow
    console.log('[SignIn] Forgot password clicked');
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
      <div className="min-h-screen bg-[#f7f7f5] flex items-center justify-center">
        <p className="text-center text-[#232d3f] text-base">Loading...</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 min-h-screen bg-[#f7f7f5]">
      {/* LEFT PANEL - Student image with decorative circles */}
      <div className="hidden md:flex flex-col items-end justify-center p-10 relative overflow-hidden">
        <div className="absolute w-[280px] h-[280px] bg-white/6 rounded-full -top-16 -left-16 z-0" />
        <div className="absolute w-[200px] h-[200px] bg-white/8 rounded-full -bottom-8 left-96 z-0" />
        
        <div className="relative z-10 w-full max-w-[520px]">
          <img
            src={signinStudent}
            alt="Student holding a tablet"
            className="w-full h-auto object-cover"
          />
        </div>
      </div>

      {/* RIGHT PANEL - Sign In Form */}
      <div className="flex items-center justify-center p-6 md:p-9 bg-[#f7f7f5]">
        <div className="w-full max-w-[590px] bg-white rounded-[20px] border border-[#e0e0e0] shadow-[0px_16px_22.5px_rgba(35,45,63,0.12)] px-11 py-10">
          {/* HEADER */}
          <div className="flex flex-col items-center mb-7">
            <h1 className="text-[26px] font-bold text-[#232d3f] leading-[39px] tracking-[-0.39px] text-center">
              Sign in
            </h1>
            <p className="text-[14px] font-normal text-[#55657b] leading-[21px] text-center mt-2">
              Welcome back! Please enter your details.
            </p>
          </div>

          {/* ERROR ALERT */}
          {error && (
            <div className="w-full mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
              {error}
            </div>
          )}

          {/* FORM */}
          <form onSubmit={handleSubmit} className="w-full">
            {/* EMAIL FIELD */}
            <div className="mb-4">
              <label className="block text-[11px] font-bold text-[#55657b] uppercase tracking-[0.66px] pb-1.5">
                Email
              </label>
              <input
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isSubmitting}
                required
                className="w-full h-11 px-3.5 py-2.75 bg-white border border-[#e0e0e0] rounded-lg text-[13px] text-[#111827] font-medium placeholder-[#9CA3AF] focus:outline-none focus:border-[#FF6A00] focus:ring-1 focus:ring-[rgba(255,106,0,0.1)] disabled:opacity-60 autofill:text-[#111827] autofill:font-medium"
                style={{
                  WebkitTextFillColor: email ? '#111827' : undefined,
                }}
              />
            </div>

            {/* PASSWORD FIELD */}
            <div className="mb-6">
              <div className="flex items-center justify-between pb-1.5">
                <label className="text-[11px] font-bold text-[#55657b] uppercase tracking-[0.66px]">
                  Password
                </label>
                <button
                  type="button"
                  onClick={handleForgotPassword}
                  disabled={isSubmitting}
                  className="text-[12px] font-bold text-[#ff6a00] hover:underline focus:outline-none disabled:opacity-60"
                >
                  Forgot password?
                </button>
              </div>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={isSubmitting}
                  required
                  className="w-full h-11 px-3.5 py-2.75 bg-white border border-[#e0e0e0] rounded-lg text-[13px] text-[#111827] font-medium placeholder-[#9CA3AF] focus:outline-none focus:border-[#FF6A00] focus:ring-1 focus:ring-[rgba(255,106,0,0.1)] disabled:opacity-60 autofill:text-[#111827] autofill:font-medium"
                  style={{
                    WebkitTextFillColor: password ? '#111827' : undefined,
                  }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  disabled={isSubmitting}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[11px] font-bold text-[#55657b] hover:text-[#232d3f] focus:outline-none disabled:opacity-60"
                >
                  {showPassword ? 'Hide' : 'Show'}
                </button>
              </div>
            </div>

            {/* SUBMIT BUTTON */}
            <button
              type="submit"
              disabled={isSubmitting || !email || !password}
              className="w-full py-3 px-4 bg-gradient-to-r from-[#FFC01E] via-[#FF6A00] to-[#E01F26] rounded-[10px] text-white font-extrabold text-[14px] leading-[21px] hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0 active:shadow-md transition-all disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Signing in...' : 'Sign in'}
            </button>

            {/* SIGN UP LINK */}
            <div className="flex items-baseline justify-center gap-1.5 mt-6 pt-4 border-t border-gray-100">
              <span className="text-sm text-gray-500 font-normal">Don't have an account?</span>
              <button
                type="button"
                onClick={handleNavigateToSignUp}
                disabled={isSubmitting}
                className="text-sm font-semibold text-[#f97316] hover:text-[#ea580c] hover:underline focus:outline-none disabled:opacity-60 transition-colors"
              >
                Sign up
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default SignIn;

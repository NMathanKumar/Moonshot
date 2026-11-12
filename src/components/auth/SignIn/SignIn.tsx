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
          navigate('/dashboard', { replace: true });
        }
      } catch (err) {
        // No existing session
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
      if (onSubmit) {
        await onSubmit({ email, password });
        // Handler will navigate to dashboard via AppRoutes
      } else {
        setError('Sign in handler not configured');
        setIsSubmitting(false);
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred';
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
    <div className="min-h-screen w-screen flex flex-col md:flex-row bg-[#f7f7f5] overflow-x-hidden">
      {/* Left Illustration Panel: Hidden on mobile, 45% on desktop */}
      <div className="hidden md:flex md:w-[45%] flex-col justify-center items-center p-6 md:p-10 relative overflow-hidden bg-[#f7f7f5]">
        <div className="absolute top-[-60px] left-[-60px] w-[280px] h-[280px] rounded-full bg-white/10" />
        <div className="absolute bottom-[-40px] right-[-40px] w-[200px] h-[200px] rounded-full bg-white/[0.08]" />
        <img
          src={signinStudent}
          alt="Student holding a tablet"
          className="max-w-[496px] w-full h-auto object-contain relative z-10"
        />
      </div>

      {/* Right Form Panel: Full width on mobile, 55% on desktop */}
      <div className="w-full md:w-[55%] flex flex-col justify-center items-center p-3 sm:p-4 md:p-9 bg-[#f7f7f5] min-h-screen md:min-h-auto">
        <form className="w-full max-w-[590px] px-4 sm:px-5 md:px-[44px] py-6 sm:py-7 md:py-[40px] rounded-lg md:rounded-[20px] bg-white border border-[#e0e0e0] shadow-[0_16px_45px_rgba(35,45,63,0.12)]" onSubmit={handleSubmit}>
          {/* Header */}
          <div className="mb-5 sm:mb-6 md:mb-[28px] text-center">
            <h1 className="text-xl sm:text-2xl md:text-[24px] font-black text-[#232d3f] mb-1 md:mb-2 m-0 leading-tight">
              Sign in
            </h1>
            <p className="text-xs sm:text-sm md:text-[13px] text-[#55657b] m-0 leading-relaxed">
              Welcome back! Please enter your details.
            </p>
          </div>

          {/* Error Alert */}
          {error && (
            <div className="mb-3 sm:mb-4 md:mb-4 p-2.5 sm:p-3 md:p-3.5 rounded-lg bg-[#fef2f2] border border-[#fecaca] text-[#dc2626] text-xs sm:text-xs md:text-[13px] leading-relaxed">
              {error}
            </div>
          )}

          {/* Form Fields */}
          <div className="flex flex-col gap-3 sm:gap-3.5 md:gap-[16px] mb-4 sm:mb-5 md:mb-[20px]">
            {/* Email Field */}
            <div>
              <label className="block text-[10px] sm:text-[11px] font-bold text-[#55657b] uppercase tracking-[0.06em] mb-1.5 md:mb-[6px]">
                Email
              </label>
              <input
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isSubmitting}
                required
                className="w-full px-3 sm:px-3.5 md:px-[14px] py-2.5 sm:py-2.5 md:py-[11px] rounded-lg md:rounded-[8px] border border-[#dde2e7] bg-white text-xs sm:text-xs md:text-[13px] text-[#232d3f] outline-none font-sans disabled:bg-gray-100 disabled:cursor-not-allowed disabled:text-gray-600"
              />
            </div>

            {/* Password Field */}
            <div>
              <div className="flex items-center justify-between gap-1.5 sm:gap-2 md:gap-[12px] mb-1.5 md:mb-[6px]">
                <label className="text-[10px] sm:text-[11px] font-bold text-[#55657b] uppercase tracking-[0.06em] m-0">
                  Password
                </label>
                <button
                  type="button"
                  onClick={handleForgotPassword}
                  disabled={isSubmitting}
                  className="text-[9px] sm:text-[10px] md:text-[12px] text-[#FF6A00] bg-none border-none cursor-pointer font-bold p-0 disabled:cursor-not-allowed whitespace-nowrap"
                >
                  Forgot password?
                </button>
              </div>
              <div className="relative">
                <input
                  type={show ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={isSubmitting}
                  required
                  className="w-full px-3 sm:px-3.5 md:px-[14px] py-2.5 sm:py-2.5 md:py-[11px] rounded-lg md:rounded-[8px] border border-[#dde2e7] bg-white text-xs sm:text-xs md:text-[13px] text-[#232d3f] outline-none font-sans pr-10 sm:pr-11 md:pr-[44px] disabled:bg-gray-100 disabled:cursor-not-allowed disabled:text-gray-600"
                />
                <button
                  type="button"
                  onClick={() => setShow(!show)}
                  disabled={isSubmitting}
                  className="absolute right-2 sm:right-2.5 md:right-[12px] top-1/2 -translate-y-1/2 bg-none border-none cursor-pointer text-[8px] sm:text-[9px] md:text-[11px] text-[#55657b] font-bold font-sans p-0 disabled:cursor-not-allowed whitespace-nowrap px-1"
                >
                  {show ? 'Hide' : 'Show'}
                </button>
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full block text-center py-2.5 sm:py-2.75 md:py-[13px] rounded-lg md:rounded-[10px] border-none bg-[#FF6A00] text-white text-xs sm:text-xs md:text-[14px] font-black mb-3 sm:mb-4 md:mb-[16px] cursor-pointer disabled:cursor-not-allowed disabled:opacity-60 font-sans leading-tight"
          >
            {isSubmitting ? 'Signing in...' : 'Sign in'}
          </button>

          {/* Sign Up Link */}
          <div className="text-center">
            <span className="text-[10px] sm:text-[11px] md:text-[12px] text-[#55657b]">Don&apos;t have an account? </span>
            <button
              type="button"
              onClick={handleNavigateToSignUp}
              disabled={isSubmitting}
              className="text-[10px] sm:text-[11px] md:text-[12px] text-[#FF6A00] bg-none border-none cursor-pointer font-bold p-0 disabled:cursor-not-allowed"
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

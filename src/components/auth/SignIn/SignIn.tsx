import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import signinStudent from '@assets/idp-signin-student.png';
import { fetchAuthSession } from 'aws-amplify/auth';

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
          console.log('SignIn: User already authenticated, redirecting to dashboard');
          navigate('/dashboard', { replace: true });
        }
      } catch (err) {
        console.log('SignIn: No existing session');
      } finally {
        setIsCheckingSession(false);
      }
    };

    checkSession();
  }, [navigate]);

  const handleNavigateToSignUp = () => {
    navigate('/signup');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      console.log('SignIn: Form submitted with:', { email });
      if (onSubmit) {
        await onSubmit({ email, password });
        console.log('SignIn: Auth handler completed successfully');
        // Handler will navigate to dashboard via AppRoutes
      } else {
        console.warn('SignIn: No onSubmit handler provided');
        setError('Sign in handler not configured');
        setIsSubmitting(false);
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred';
      console.error('SignIn: Submission error:', errorMessage);
      setError(errorMessage);
      setIsSubmitting(false);
    }
  };

  // Show loading while checking session
  if (isCheckingSession) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 min-h-screen bg-[#f7f7f5]">
        <div className="flex items-center justify-center p-6 md:p-9 relative overflow-hidden bg-[#f7f7f5]">
          <div className="w-full max-w-[620px] bg-white rounded-[20px] border-[1.333px] border-[#e0e0e0] p-16 md:p-12 shadow-lg">
            <div className="text-center">
              <h1 className="font-['Farro'] text-2xl font-bold text-ink m-0 mb-2 leading-[1.5]">
                Loading...
              </h1>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 min-h-screen bg-[#f7f7f5]">
      {/* LEFT PANEL */}
      <div className="hidden md:flex items-center justify-center p-[60px] relative overflow-hidden bg-[#f7f7f5]">
        {/* Orange circle background */}
        <div className="absolute w-[280px] h-[280px] bg-white/6 rounded-full -top-[60px] -left-[60px] z-[1]"></div>
        {/* Green leaf */}
        <div className="absolute w-[200px] h-[200px] bg-white/8 rounded-full -bottom-[80px] -right-[80px] z-[1]"></div>

        {/* Content */}
        <div className="relative z-10 text-center max-w-[424px]">
          <img src={signinStudent} alt="Professional woman" className="w-full max-w-[424px] mb-8 block rounded-lg h-[314.458px] object-cover" />
          <h2 className="font-['Farro'] text-[20.48px] font-bold text-ink mb-8 leading-[1.2] w-[424px] m-0">
            Master English with confidence
          </h2>
          <p className="font-['Inter'] text-xs text-slate mb-6 leading-[1.65] font-normal m-0">
            Prepare for the IDP English Test with our comprehensive platform
          </p>
          <ul className="list-none p-0 m-0 text-sm text-left">
            <li className="flex gap-2.5 mb-4 items-start">
              <span className="text-brand font-black flex-shrink-0 text-base">✓</span>
              <p className="m-0 font-['Inter'] text-sm text-slate leading-[1.55]">Practice authentic exam questions</p>
            </li>
            <li className="flex gap-2.5 mb-4 items-start">
              <span className="text-brand font-black flex-shrink-0 text-base">✓</span>
              <p className="m-0 font-['Inter'] text-sm text-slate leading-[1.55]">Get personalized feedback</p>
            </li>
            <li className="flex gap-2.5 mb-4 items-start">
              <span className="text-brand font-black flex-shrink-0 text-base">✓</span>
              <p className="m-0 font-['Inter'] text-sm text-slate leading-[1.55]">Track your progress</p>
            </li>
          </ul>
        </div>
      </div>

      {/* RIGHT PANEL */}
      <div className="flex items-center justify-center p-6 md:p-9 min-h-screen md:min-h-auto relative overflow-hidden bg-[#f7f7f5] md:bg-[#f7f7f5]">
        <div className="w-full max-w-[620px] bg-white rounded-[20px] border-[1.333px] border-[#e0e0e0] p-16 md:p-9 shadow-lg">
          {/* HEADER */}
          <div className="text-center mb-7">
            <h1 className="font-['Farro'] text-2xl font-bold text-ink m-0 mb-2 leading-[1.5]">
              Welcome back
            </h1>
            <p className="font-['Inter'] text-xs text-slate m-0 leading-[1.5] font-normal">
              Sign in to your IDP account
            </p>
          </div>

          {/* Error Alert */}
          {error && (
            <div className="mb-4 p-3 rounded-lg bg-[#fff5f0] border border-[#ffb399]">
              <p className="m-0 text-sm text-[#d97f60] font-['Inter']">
                {error}
              </p>
            </div>
          )}

          {/* FORM */}
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            {/* EMAIL FIELD */}
            <div className="flex flex-col gap-1.5">
              <label className="font-['Inter'] text-xs font-bold uppercase tracking-[0.66px] text-slate">
                Email
              </label>
              <input
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isSubmitting}
                required
                className="px-3.5 py-2.75 border-[1.333px] border-[#e0e0e0] rounded-lg font-['Inter'] text-sm text-ink bg-white transition-all focus:outline-none"
                style={{ opacity: isSubmitting ? 0.6 : 1, cursor: isSubmitting ? 'not-allowed' : 'text' }}
              />
            </div>

            {/* PASSWORD FIELD */}
            <div className="flex flex-col gap-1.5">
              <label className="font-['Inter'] text-xs font-bold uppercase tracking-[0.66px] text-slate">
                Password
              </label>
              <div className="flex items-center border-[1.333px] border-[#e0e0e0] rounded-lg bg-white transition-all">
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={isSubmitting}
                  required
                  className="flex-1 border-0 bg-transparent px-3.5 py-2.75 font-['Inter'] text-sm text-ink focus:outline-none w-full"
                  style={{ opacity: isSubmitting ? 0.6 : 1, cursor: isSubmitting ? 'not-allowed' : 'text' }}
                />
                <button
                  type="button"
                  className="px-3.5 bg-none border-0 text-slate text-xs font-bold font-['Inter'] cursor-pointer whitespace-nowrap"
                  onClick={() => setShowPassword(!showPassword)}
                  disabled={isSubmitting}
                  style={{ opacity: isSubmitting ? 0.6 : 1, cursor: isSubmitting ? 'not-allowed' : 'pointer' }}
                >
                  {showPassword ? 'Hide' : 'Show'}
                </button>
              </div>
            </div>

            {/* SUBMIT BUTTON */}
            <button 
              type="submit" 
              className="px-5 py-3 bg-brand text-white border-0 rounded-[10px] font-['Inter'] text-base font-black cursor-pointer transition-all mt-5 w-full hover:opacity-90 active:translate-y-0 disabled:opacity-70 disabled:cursor-not-allowed"
              disabled={isSubmitting}
              style={{ opacity: isSubmitting ? 0.7 : 1, cursor: isSubmitting ? 'not-allowed' : 'pointer' }}
            >
              {isSubmitting ? 'Signing in...' : 'Sign in →'}
            </button>
          </form>

          {/* SIGN UP LINK */}
          <div className="text-center font-['Inter'] text-xs text-slate mt-4">
            Don't have an account?{' '}
            <button 
              type="button" 
              onClick={(e) => {
                e.preventDefault();
                handleNavigateToSignUp();
              }}
              disabled={isSubmitting}
              className="bg-none border-0 text-brand font-bold cursor-pointer text-xs font-['Inter'] hover:underline disabled:opacity-60 disabled:cursor-not-allowed"
              style={{
                opacity: isSubmitting ? 0.6 : 1,
              }}
            >
              Sign up
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SignIn;

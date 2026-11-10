import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import signinStudent from '@assets/idp-signin-student.png';
import { Button } from '@components/common/Button';
import { Input } from '@components/common/Input';
import { Alert } from '@components/common/Alert';

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
      <div className="min-h-screen bg-[#f7f7f5] flex items-center justify-center p-6">
        <div className="text-center" style={{ fontFamily: "'Inter', sans-serif" }}>
          <h1 className="text-2xl font-bold text-[#232d3f] mb-2">Loading...</h1>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#f7f7f5] grid grid-cols-1 md:grid-cols-2 min-h-screen">
      {/* LEFT PANEL - with background */}
      <div className="hidden md:flex flex-col items-end justify-center p-[60px] relative overflow-hidden">
        {/* Decorative background elements */}
        <div className="absolute left-[-60px] top-[-60px] w-[280px] h-[280px] bg-[rgba(255,255,255,0.06)] rounded-full z-0" />
        <div className="absolute left-[384px] top-[920px] w-[200px] h-[200px] bg-[rgba(255,255,255,0.08)] rounded-full z-0" />

        {/* Content */}
        <div className="flex flex-col items-start max-w-[430px] relative w-[424px]">
          <div className="h-[314.458px] max-w-[480px] relative w-full">
            <img
              src={signinStudent}
              alt="Professional woman"
              className="absolute inset-0 max-w-none object-cover pointer-events-none size-full"
            />
          </div>
          <h2 className="font-bold text-[26px] text-[#232d3f] mt-[34px] leading-[39px] tracking-[-0.39px]" style={{ fontFamily: "'Farro Bold', sans-serif" }}>
            Master English with confidence
          </h2>
          <p className="font-normal text-[#55657b] text-[14px] mt-[32px] mb-6 leading-[21px]" style={{ fontFamily: "'Inter', sans-serif" }}>
            Prepare for the IDP English Test with our comprehensive platform
          </p>
          <ul className="list-none p-0 m-0 flex flex-col gap-[16px]">
            <li className="flex gap-[10px] items-start w-full">
              <span className="font-bold text-[#FF6A00] text-[14px] flex-shrink-0" style={{ fontFamily: "'Inter', sans-serif" }}>✓</span>
              <p className="m-0 font-normal text-[#55657b] text-[14px] leading-[21px]" style={{ fontFamily: "'Inter', sans-serif" }}>Practice authentic exam questions</p>
            </li>
            <li className="flex gap-[10px] items-start w-full">
              <span className="font-bold text-[#FF6A00] text-[14px] flex-shrink-0" style={{ fontFamily: "'Inter', sans-serif" }}>✓</span>
              <p className="m-0 font-normal text-[#55657b] text-[14px] leading-[21px]" style={{ fontFamily: "'Inter', sans-serif" }}>Get personalized feedback</p>
            </li>
            <li className="flex gap-[10px] items-start w-full">
              <span className="font-bold text-[#FF6A00] text-[14px] flex-shrink-0" style={{ fontFamily: "'Inter', sans-serif" }}>✓</span>
              <p className="m-0 font-normal text-[#55657b] text-[14px] leading-[21px]" style={{ fontFamily: "'Inter', sans-serif" }}>Track your progress</p>
            </li>
          </ul>
          <p className="font-bold text-[#232d3f] text-[14px] mt-[24px] w-[424px]" style={{ fontFamily: "'Farro Bold', sans-serif" }}>
            <span style={{ fontFamily: "'Inter', sans-serif" }}>Clear and simple.</span>
            <span className="font-normal text-[#55657b]" style={{ fontFamily: "'Inter', sans-serif" }}> Your account keeps your preparation, purchases, and results together.</span>
          </p>
        </div>
      </div>

      {/* RIGHT PANEL - form */}
      <div className="flex flex-col items-center justify-center min-h-screen md:min-h-auto px-[36px] py-[24px] bg-[#f7f7f5]">
        <div className="bg-white border-[#E0E0E0] border-[1px] border-solid rounded-[20px] shadow-[0px_16px_45px_rgba(35,45,63,0.12)] px-[40px] py-[44px] w-full max-w-[590px] h-[463px]">
          {/* HEADER */}
          <div className="flex flex-col items-center w-full mb-[28px]">
            <h1 className="font-bold text-[26px] text-[#232D3F] w-full text-center tracking-[-0.39px] leading-[39px]" style={{ fontFamily: "'Farro Bold', sans-serif" }}>
              Sign in
            </h1>
          </div>

          {/* Error Alert */}
          {error && (
            <Alert
              variant="error"
              title="Authentication failed"
              className="mb-[28px]"
            >
              {error}
            </Alert>
          )}

          {/* FORM */}
          <form onSubmit={handleSubmit} className="flex flex-col gap-[16px]" style={{ fontFamily: "'Inter', sans-serif" }}>
            {/* EMAIL FIELD */}
            <div>
              <label className="font-bold text-[#55657b] text-[14px]" style={{ fontFamily: "'Inter', sans-serif" }}>
                Email <span className="text-[#eb7900]">*</span>
              </label>
              <Input
                type="email"
                name="email"
                label="Email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isSubmitting}
                required
                className="h-[44.167px] !rounded-[8px] !border-[#e0e0e0]"
              />
            </div>

            {/* PASSWORD FIELD */}
            <div>
              <div className="flex items-center justify-between mb-[6px]">
                <label className="font-bold text-[#55657b] text-[14px]" style={{ fontFamily: "'Inter', sans-serif" }}>
                  Password <span className="text-[#eb7900]">*</span>
                </label>
              </div>
              <div className="relative h-[44.167px] w-full">
                <Input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  label="Password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={isSubmitting}
                  required
                  className="h-full !rounded-[8px] !border-[#e0e0e0] pr-[44px] pl-[14px]"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  disabled={isSubmitting}
                  className="absolute left-[444.11px] top-[13.58px] font-bold text-[#55657b] text-[14px] focus:outline-none"
                  style={{ width: '88.729px', fontFamily: "'Inter', sans-serif" }}
                >
                  {showPassword ? 'Hide password' : 'Show password'}
                </button>
              </div>
            </div>

            {/* SUBMIT BUTTON */}
            <div className="mt-[20px]">
              <Button
                type="submit"
                variant="primary"
                size="medium"
                disabled={isSubmitting || !email || !password}
                fullWidth
                className="!bg-[#EB7900] !rounded-[10px] !py-[13px] !w-full"
              >
                {isSubmitting ? 'Signing in...' : 'Sign in'}
              </Button>
            </div>

            {/* SIGN UP LINK */}
            <div className="flex flex-col items-center pb-[18px] pt-[16px] mt-4" style={{ fontFamily: "'Inter', sans-serif" }}>
              <p className="text-[#55657b] text-[14px] text-center mb-0">
                Don't have an account?{' '}
                <button
                  type="button"
                  onClick={handleNavigateToSignUp}
                  disabled={isSubmitting}
                  className="font-bold text-[#EB7900] text-[14px] ml-1 hover:underline disabled:opacity-60 disabled:cursor-not-allowed focus:outline-none"
                  style={{ fontFamily: "'Inter', sans-serif" }}
                >
                  Sign up
                </button>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default SignIn;

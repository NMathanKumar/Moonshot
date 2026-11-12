import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import verifyEmailIllustration from '@assets/verify-email-illustration.png';
import { resendSignUpCode } from '@services/auth';

export interface ConfirmSignUpProps {
  onSubmit?: (email: string, confirmationCode: string) => Promise<void>;
}

export function ConfirmSignUp({ onSubmit }: ConfirmSignUpProps) {
  const navigate = useNavigate();
  const location = useLocation();

  // Email is passed from the sign-up page via route state
  const email = (location.state as { email?: string } | null)?.email || '';

  const [code, setCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [resent, setResent] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setSuccessMessage(null);

    if (!/^\d{6}$/.test(code)) return;

    if (!email) {
      setError('Email address is missing. Please start over from sign up.');
      return;
    }
    if (!onSubmit) {
      setError('Confirmation handler not configured');
      return;
    }

    setIsLoading(true);
    try {
      await onSubmit(email, code);
      setSuccessMessage('Email confirmed! Redirecting to sign in...');
      setTimeout(() => navigate('/signin', { replace: true }), 1500);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Confirmation failed';
      setError(message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleResend = async () => {
    setError(null);
    setResent(false);

    if (!email) {
      setError('Email address is missing. Please start over from sign up.');
      return;
    }

    setIsResending(true);
    try {
      await resendSignUpCode(email);
      setResent(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not resend the code.');
    } finally {
      setIsResending(false);
    }
  };

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#f5f5f5]" style={{ backgroundImage: 'radial-gradient(circle at 20% 45%, rgba(255, 192, 30, 0.08), transparent 28%), #f5f5f5' }}>

      {/* Layout container */}
      <div className="grid grid-cols-1 lg:grid-cols-[minmax(380px,0.9fr)_minmax(480px,1.1fr)] items-center mx-auto w-[min(100%-32px,520px)] lg:w-[min(1120px,calc(100%-64px))] min-h-screen gap-7 lg:gap-[clamp(48px,8vw,120px)] px-0 py-16">
        {/* Visual section - shown on lg desktop, hidden on mobile/tablet */}
        <div className="hidden lg:flex flex-col items-center" aria-hidden="true">
          <div className="w-[360px] max-w-full">
            <img src={verifyEmailIllustration} alt="" className="block w-full h-auto" />
          </div>
          <div className="max-w-[340px] -mt-1 text-center">
            <p className="mb-2 text-[#FF6A00] text-xs font-black uppercase tracking-widest">Almost there</p>
            <h2 className="text-[#232d3f] text-[22px] font-bold tracking-tight">Confirm your email to continue</h2>
          </div>
        </div>

        {/* Card section */}
        <section className="w-full max-w-[520px] px-6 py-8 md:px-8 md:py-8 lg:px-10 lg:py-10 border border-[#e0e0e0] rounded-xl md:rounded-2xl lg:rounded-2xl bg-white shadow-[0_18px_50px_rgba(35,45,63,0.13)]" aria-labelledby="verify-email-title">
          <p className="mb-2 text-[#FF6A00] text-xs font-black uppercase tracking-widest">Account verification</p>
          <h1 id="verify-email-title" className="mb-2 text-[#232d3f] text-2xl font-bold tracking-tight">Verify your email</h1>
          <p className="mb-7 text-[#55657b] text-sm leading-relaxed">
            We sent a verification code to <strong className="text-[#232d3f] font-bold break-words">{email || 'your email address'}</strong>
          </p>

          {/* Error alert */}
          {error && (
            <div className="mb-4 px-3.5 py-2.5 rounded-lg text-xs font-medium bg-red-50 border border-red-200 text-red-700" role="alert">
              {error}
            </div>
          )}

          {/* Success alert */}
          {successMessage && (
            <div className="mb-4 px-3.5 py-2.5 rounded-lg text-xs font-medium bg-green-100 border border-green-400 text-green-700" role="status">
              ✓ {successMessage}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="flex flex-col">
            <label htmlFor="verification-code" className="mb-1.5 text-[#55657b] text-xs font-bold uppercase tracking-wider">Verification code</label>
            <input
              id="verification-code"
              name="verificationCode"
              type="text"
              inputMode="numeric"
              autoComplete="one-time-code"
              pattern="[0-9]{6}"
              maxLength={6}
              value={code}
              onChange={(e) => {
                setCode(e.target.value.replace(/\D/g, '').slice(0, 6));
                setResent(false);
                setError(null);
              }}
              placeholder="Enter 6-digit code"
              disabled={isLoading || Boolean(successMessage)}
              required
              className="w-full mb-4 px-3.5 py-3 border-[1.5px] border-[#e0e0e0] rounded-lg bg-white text-[#232d3f] text-sm tracking-widest focus:border-gray-300 focus:outline-none focus:shadow-none disabled:cursor-not-allowed"
            />
            <button
              type="submit"
              disabled={code.length !== 6 || isLoading || Boolean(successMessage)}
              className="w-full min-h-11 px-4.5 py-3 border-0 rounded-[10px] bg-[#FF6A00] text-white cursor-pointer text-xs font-black shadow-[0_6px_16px_rgba(255,106,0,0.18)] transition-[box-shadow,transform] duration-160 ease-out hover:shadow-[0_8px_20px_rgba(255,106,0,0.25)] hover:disabled:shadow-[0_6px_16px_rgba(255,106,0,0.18)] hover:-translate-y-0.5 hover:disabled:-translate-y-0 disabled:cursor-not-allowed disabled:saturate-55 disabled:opacity-55"
            >
              {isLoading ? 'Verifying...' : 'Verify & continue →'}
            </button>
          </form>

          {/* Resend section */}
          <div className="flex justify-center items-center gap-1.25 mt-5 text-[#55657b] text-xs">
            <span>Didn&apos;t receive the code?</span>
            <button 
              type="button" 
              onClick={handleResend} 
              disabled={isResending}
              className="p-0 border-0 bg-transparent text-[#FF6A00] cursor-pointer text-xs font-bold hover:disabled:opacity-60 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isResending ? 'Sending...' : 'Resend code'}
            </button>
          </div>

          {/* Resend status */}
          {resent && (
            <p className="mt-2 text-green-600 text-xs text-center" role="status">
              A new code has been sent.
            </p>
          )}
        </section>
      </div>
    </main>
  );
}

export default ConfirmSignUp;

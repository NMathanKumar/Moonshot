import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import idpLogo from '@assets/idp-logo-transparent.png';

export interface ConfirmSignUpProps {
  onSubmit?: (email: string, confirmationCode: string) => Promise<void>;
}

export function ConfirmSignUp({ onSubmit }: ConfirmSignUpProps) {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Get email from previous route state
  const email = (location.state as { email?: string })?.email || '';
  
  const [confirmationCode, setConfirmationCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMessage(null);
    setIsLoading(true);

    try {
      if (!email) {
        throw new Error('Email address is missing. Please start over from sign up.');
      }
      
      if (!confirmationCode.trim()) {
        throw new Error('Please enter the confirmation code.');
      }

      console.log('ConfirmSignUp: Submitting confirmation code');
      
      if (onSubmit) {
        await onSubmit(email, confirmationCode);
        console.log('ConfirmSignUp: Email confirmed successfully');
        setSuccessMessage('Email confirmed! Redirecting to sign in...');
        
        // Wait a moment to show success message before navigating
        setTimeout(() => {
          navigate('/signin', { replace: true });
        }, 1500);
      } else {
        throw new Error('Confirmation handler not configured');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Confirmation failed';
      console.error('ConfirmSignUp: Submission error:', errorMessage);
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleBackToSignUp = () => {
    navigate('/signup', { replace: true });
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 min-h-screen bg-[#f7f7f5]">
      {/* LEFT PANEL - WITH BACKGROUND */}
      <div className="hidden md:flex items-center justify-center p-[60px] relative overflow-hidden bg-[#f7f7f5]">
        {/* Background decorative elements */}
        <div className="absolute w-[280px] h-[280px] bg-white/6 rounded-full -top-[60px] -left-[60px] z-[1]"></div>
        <div className="absolute w-[200px] h-[200px] bg-white/8 rounded-full -bottom-[80px] -right-[80px] z-[1]"></div>

        {/* Left content */}
        <div className="relative z-10 text-center max-w-[424px]">
          <h2 className="font-['Farro'] text-[20.48px] font-bold text-ink mb-8 leading-[1.2] w-[424px]">
            Verify your email
          </h2>
          <p className="font-['Inter'] text-xs text-slate leading-[1.65] font-normal">
            We've sent a verification code to your email address. Enter it below to complete your account setup.
          </p>
        </div>
      </div>

      {/* RIGHT PANEL */}
      <div className="flex items-center justify-center p-6 md:p-[60px] relative overflow-hidden bg-white md:bg-white md:min-h-screen">
        <div className="w-full max-w-[380px]">
          {/* LOGO */}
          <div className="flex justify-center mb-8">
            <img src={idpLogo} alt="IDP Logo" className="h-10 w-auto" />
          </div>

          {/* HEADER */}
          <div className="mb-7">
            <h1 className="font-['Farro'] text-[20.48px] font-bold text-ink mb-3 leading-[1.2]">
              Confirm your email
            </h1>
            <p className="font-['Inter'] text-xs text-slate mb-0 font-normal">We sent a verification code to</p>
            <p className="font-['Inter'] text-xs font-bold text-ink">{email}</p>
          </div>

          {/* Error Alert */}
          {error && (
            <div className="mb-4 p-3 rounded-lg border border-[#ffb399] bg-[#fff5f0]">
              <p className="font-['Inter'] text-sm m-0 font-medium text-[#d97f60]">
                {error}
              </p>
            </div>
          )}

          {/* Success Alert */}
          {successMessage && (
            <div className="mb-4 p-3 rounded-lg border border-[#86efac] bg-[#f0fdf4]">
              <p className="font-['Inter'] text-sm m-0 font-medium text-[#22c55e]">
                ✓ {successMessage}
              </p>
            </div>
          )}

          {/* FORM */}
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            {/* INFO TEXT */}
            <p className="font-['Inter'] text-xs text-slate mb-2 font-normal">
              Check your email (including spam folder) for a 6-character code
            </p>

            {/* CONFIRMATION CODE FIELD */}
            <div className="flex flex-col gap-2">
              <label className="font-['Inter'] text-xs font-semibold text-ink">Verification code</label>
              <input
                type="text"
                placeholder="Enter 6-character code"
                value={confirmationCode}
                onChange={(e) => setConfirmationCode(e.target.value.toUpperCase())}
                disabled={isLoading}
                required
                maxLength={10}
                className="px-3.5 py-2.5 border border-[#ddd] rounded-md font-['Inter'] text-sm text-ink bg-white transition-all focus:outline-none focus:border-brand"
                style={{ opacity: isLoading ? 0.6 : 1, cursor: isLoading ? 'not-allowed' : 'text' }}
              />
            </div>

            {/* SUBMIT BUTTON */}
            <button 
              type="submit" 
              className="px-4 py-3 bg-gradient-brand text-white border-0 rounded-md font-['Inter'] text-sm font-bold cursor-pointer transition-all flex items-center justify-center gap-2 min-h-10"
              disabled={isLoading || !confirmationCode.trim()}
              style={{ opacity: isLoading || !confirmationCode.trim() ? 0.65 : 1, cursor: isLoading ? 'not-allowed' : 'pointer' }}
            >
              {isLoading ? (
                <>
                  <span className="inline-block w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                  Verifying...
                </>
              ) : (
                'Verify email →'
              )}
            </button>

            {/* DIVIDER */}
            <div className="flex items-center gap-3 my-1">
              <div className="flex-1 h-px bg-[#e5e7eb]"></div>
              <span className="font-['Inter'] text-xs text-[#9ca3af] font-medium">or</span>
              <div className="flex-1 h-px bg-[#e5e7eb]"></div>
            </div>

            {/* BACK LINK */}
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                handleBackToSignUp();
              }}
              disabled={isLoading}
              className="px-4 py-3 bg-transparent text-brand border-1.5 border-brand rounded-md font-['Inter'] text-sm font-bold cursor-pointer transition-all"
              style={{ opacity: isLoading ? 0.65 : 1, cursor: isLoading ? 'not-allowed' : 'pointer' }}
            >
              Didn't receive the code? Start over
            </button>
          </form>

          {/* FOOTER */}
          <div className="mt-6 text-center pt-5 border-t border-[#e5e7eb]">
            <p className="font-['Inter'] text-xs text-[#9ca3af] m-0 leading-[1.6]">Trouble verifying?</p>
            <p className="font-['Inter'] text-xs text-[#9ca3af] m-0 leading-[1.6]">
              Contact us at <span className="text-brand font-semibold">support@idp.com</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ConfirmSignUp;

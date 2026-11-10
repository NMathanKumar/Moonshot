import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import idpLogo from '@assets/idp-logo-transparent.png';
import signupStudent from '@assets/idp-signup-student.png';

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
      {/* LEFT PANEL - Student image with decorative circles (matches SignUp) */}
      <div className="hidden md:flex flex-col items-end justify-center p-10 relative overflow-hidden">
        <div className="absolute w-[280px] h-[280px] bg-white/6 rounded-full -top-16 -left-16 z-0" />
        <div className="absolute w-[200px] h-[200px] bg-white/8 rounded-full -bottom-8 left-96 z-0" />
        
        <div className="relative z-10 w-full max-w-[520px]">
          <img
            src={signupStudent}
            alt="Student preparing to study"
            className="w-full h-auto object-cover"
          />
          <h2 className="text-[30px] font-bold text-[#232d3f] leading-[36px] tracking-[-0.45px] mt-8 mb-3">
            Verify your email
          </h2>
          <p className="text-[14px] font-normal text-[#55657b] leading-[23px] mb-0">
            We've sent a verification code to your email address. Enter it below to complete your account setup.
          </p>
        </div>
      </div>

      {/* RIGHT PANEL - Verification Form */}
      <div className="flex items-center justify-center p-6 md:p-9 bg-[#f7f7f5]">
        <div className="w-full max-w-[620px] bg-white rounded-[20px] border border-[#e0e0e0] shadow-[0px_16px_22.5px_rgba(35,45,63,0.12)] px-9 py-8">
          {/* LOGO */}
          <div className="flex justify-center mb-8">
            <img src={idpLogo} alt="IDP Logo" className="h-10 w-auto" />
          </div>

          {/* HEADER */}
          <div className="mb-7 text-center">
            <h1 className="text-[26px] font-bold text-[#232d3f] leading-[39px] tracking-[-0.39px]">
              Confirm your email
            </h1>
            <p className="text-[14px] font-normal text-[#55657b] leading-[21px] text-center mt-2 mb-0">
              We sent a verification code to
            </p>
            <p className="text-[14px] font-bold text-[#232d3f] leading-[21px]">{email}</p>
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
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* INFO TEXT */}
            <p className="text-[12px] font-normal text-[#55657b] leading-[18px]">
              Check your email (including spam folder) for a 6-character code
            </p>

            {/* CONFIRMATION CODE FIELD */}
            <div className="flex flex-col gap-2">
              <label className="block text-[11px] font-bold text-[#55657b] uppercase tracking-[0.66px] pb-1.5">
                Verification code
              </label>
              <input
                type="text"
                placeholder="Enter 6-character code"
                value={confirmationCode}
                onChange={(e) => setConfirmationCode(e.target.value.toUpperCase())}
                disabled={isLoading}
                required
                maxLength={10}
                className="w-full h-11 px-3.5 py-2.75 bg-white border border-[#e0e0e0] rounded-lg text-[13px] text-[#111827] font-medium placeholder-[#9CA3AF] focus:outline-none focus:border-[#FF6A00] focus:ring-1 focus:ring-[rgba(255,106,0,0.1)] disabled:opacity-60 autofill:text-[#111827] autofill:font-medium"
                style={{
                  WebkitTextFillColor: confirmationCode ? '#111827' : undefined,
                }}
              />
            </div>

            {/* VERIFY CODE BUTTON */}
            <button
              type="submit"
              disabled={isLoading || !confirmationCode.trim()}
              className="w-full py-3 px-4 bg-gradient-to-r from-[#FFC01E] via-[#FF6A00] to-[#E01F26] rounded-[10px] text-white font-extrabold text-[14px] leading-[21px] hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0 active:shadow-md transition-all disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <>
                  <span className="inline-block w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2"></span>
                  Verifying...
                </>
              ) : (
                'Verify Code'
              )}
            </button>

            {/* DIVIDER */}
            <div className="flex items-center gap-3 my-1">
              <div className="flex-1 h-px bg-[#e5e7eb]"></div>
              <span className="text-[12px] text-[#9ca3af] font-medium">or</span>
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
              className="w-full px-4 py-3 bg-transparent text-[#ff6a00] border-1.5 border-[#ff6a00] rounded-[10px] font-['Inter'] text-[14px] font-bold cursor-pointer transition-all hover:bg-[#fff5f0] disabled:opacity-60"
              style={{ opacity: isLoading ? 0.65 : 1, cursor: isLoading ? 'not-allowed' : 'pointer' }}
            >
              Didn't receive the code? Start over
            </button>
          </form>

          {/* FOOTER */}
          <div className="mt-6 text-center pt-5 border-t border-[#e5e7eb]">
            <p className="text-[12px] text-[#55657b] m-0 leading-[1.6]">Trouble verifying?</p>
            <p className="text-[12px] text-[#55657b] m-0 leading-[1.6]">
              Contact us at <span className="text-[#ff6a00] font-semibold">support@idp.com</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ConfirmSignUp;

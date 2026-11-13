import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { resetPassword, confirmResetPassword } from '@services/auth';

export default function ForgetPassword() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [isCodeSent, setIsCodeSent] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [isResendDisabled, setIsResendDisabled] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);
  const [showPassword, setShowPassword] = useState(false);
  const [initialResendCooldown, setInitialResendCooldown] = useState(0);

  // Cooldown timers for resend button
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (initialResendCooldown > 0 || resendCooldown > 0) {
      interval = setInterval(() => {
        if (initialResendCooldown > 0) {
          setInitialResendCooldown((prev) => {
            if (prev <= 1) {
              setIsResendDisabled(false);
              return 0;
            }
            return prev - 1;
          });
        } else if (resendCooldown > 0) {
          setResendCooldown((prev) => {
            if (prev <= 1) {
              setIsResendDisabled(false);
              return 0;
            }
            return prev - 1;
          });
        }
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [resendCooldown, initialResendCooldown]);

  const handleRequestCode = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMessage(null);
    if (!email) {
      setError('Please enter your email address');
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('Please enter a valid email address');
      return;
    }
    setIsLoading(true);
    try {
      await resetPassword(email);
      setIsCodeSent(true);
      setSuccessMessage('We sent a 6-digit code to your email address.');
      // Start initial 15-second cooldown before first resend is allowed
      setIsResendDisabled(true);
      setInitialResendCooldown(15);
    } catch (err: any) {
      console.error('Forgot password error:', err);
      // Auth service translates Cognito errors to user-friendly messages
      // Never expose raw error names from Cognito
      const errorMessage = err?.message || 'Unable to send code. Please check your email and try again.';
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMessage(null);
    if (!code) {
      setError('Please enter the verification code');
      return;
    }
    if (!newPassword) {
      setError('Please enter a new password');
      return;
    }
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{12,}$/;
    if (!passwordRegex.test(newPassword)) {
      setError('Password must be at least 12 characters with 1 uppercase, 1 lowercase, and 1 number');
      return;
    }
    setIsLoading(true);
    try {
      await confirmResetPassword(email, code, newPassword);
      setSuccessMessage('Your password has been reset successfully.');
      setTimeout(() => { navigate('/signin', { replace: true }); }, 2000);
    } catch (err: any) {
      console.error('Confirm forgot password error:', err);
      // Auth service translates Cognito errors to user-friendly messages
      // Never expose raw error names from Cognito
      const errorMessage = err?.message || 'Invalid code or password reset failed. Please try again.';
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendCode = async () => {
    setError(null);
    setSuccessMessage(null);
    setIsLoading(true);
    setIsResendDisabled(true);
    setResendCooldown(30);
    try {
      await resetPassword(email);
      setSuccessMessage('A new 6-digit code has been sent to your email address.');
    } catch (err: any) {
      console.error('Resend code error:', err);
      setError(err?.message || 'Unable to resend code. Please try again.');
      setIsResendDisabled(false);
      setResendCooldown(0);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex flex-col bg-[#f7f7f5]">
      <div className="absolute top-0 left-0 w-full h-[7px] bg-gradient-to-r from-[#FF6A00] to-[#FFC01E]" />
      <div className="flex-1 flex items-center justify-center px-4 sm:px-6 py-8">
        <div className="w-full max-w-[620px] bg-white rounded-[22px] border border-[#dde2e7] shadow-[0_20px_26px_rgba(35,45,63,0.12)] px-[48px] py-[44px]">
          <div className="mb-[40px]">
            <Link to="/signin" className="inline-flex items-center gap-[7px] text-[#9b4d16] font-extrabold text-[14px] no-underline hover:opacity-80 transition-opacity">
              <span>‹</span>
              <span>Back to sign in</span>
            </Link>
          </div>
          <div className="mb-5">
            <p className="text-[#eb7900] font-extrabold text-[11px] uppercase tracking-[0.09em] mb-1">Account recovery</p>
            <h1 className="text-[35px] font-bold text-[#232d3f] leading-[42px] tracking-[-0.525px] mb-0">Reset your password</h1>
          </div>
          <p className="text-[15px] text-[#55657b] mb-6 leading-[24px]">Enter the email you used to create your account. We will send you a 6-digit code.</p>
          <div aria-live="polite" aria-atomic="true">
            {error && <div className="mb-4 p-3 rounded-lg bg-[#fef2f2] border border-[#fecaca] text-[#dc2626] text-[13px] leading-relaxed" role="alert">{error}</div>}
            {successMessage && <div className="mb-4 p-3 rounded-lg bg-[#e8f5e9] border border-[#c8e6c9] text-[#2e7d32] text-[13px] leading-relaxed" role="status">{successMessage}</div>}
          </div>
          {!isCodeSent ? (
            <form onSubmit={handleRequestCode} className="flex flex-col gap-5">
              <div className="flex flex-col">
                <label htmlFor="email" className="text-[11px] font-extrabold text-[#55657b] uppercase tracking-[0.07em] mb-1.5">Email</label>
                <input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" disabled={isLoading} aria-describedby={error ? 'email-error' : undefined} aria-invalid={!!error} className="w-full px-[15px] py-[12px] rounded-[10px] border border-[#dde2e7] bg-white text-[14px] text-[#232d3f] outline-none placeholder:text-[rgba(35,45,63,0.5)] disabled:bg-gray-100 disabled:text-gray-600 disabled:cursor-not-allowed transition-colors" />
                {error && <span id="email-error" className="text-[11px] text-[#dc2626] mt-1">{error}</span>}
              </div>
              <button type="submit" disabled={isLoading || !email} aria-busy={isLoading} className="w-full min-h-[52px] px-[18px] py-[12px] rounded-[10px] bg-[#eb7900] text-white text-[14px] font-extrabold cursor-pointer disabled:bg-gray-300 disabled:cursor-not-allowed transition-all">{isLoading ? 'Sending code...' : 'Send code'}</button>
            </form>
          ) : (
            <form onSubmit={handleResetPassword} className="flex flex-col gap-5">
              <div className="flex flex-col">
                <div className="flex items-center justify-between gap-2 mb-1.5">
                  <label htmlFor="code" className="text-[11px] font-extrabold text-[#55657b] uppercase tracking-[0.07em]">Verification Code</label>
                  <button type="button" onClick={handleResendCode} disabled={isLoading || isResendDisabled || initialResendCooldown > 0} className="text-[11px] text-[#eb7900] bg-transparent border-none cursor-pointer font-semibold p-0 disabled:opacity-50 disabled:cursor-not-allowed hover:opacity-80 transition-opacity" aria-disabled={isLoading || isResendDisabled || initialResendCooldown > 0}>
                    {initialResendCooldown > 0 ? `Request code (${initialResendCooldown}s)` : isResendDisabled && resendCooldown > 0 ? `Request code (${resendCooldown}s)` : 'Request a new code'}
                  </button>
                </div>
                <input id="code" type="text" value={code} onChange={(e) => setCode(e.target.value)} placeholder="Enter 6-digit code" disabled={isLoading} maxLength={6} aria-describedby={error ? 'code-error' : undefined} aria-invalid={!!error} className="w-full px-[15px] py-[12px] rounded-[10px] border border-[#dde2e7] bg-white text-[14px] text-[#232d3f] outline-none placeholder:text-[rgba(35,45,63,0.5)] disabled:bg-gray-100 disabled:text-gray-600 disabled:cursor-not-allowed transition-colors" />
                {error && <span id="code-error" className="text-[11px] text-[#dc2626] mt-1">{error}</span>}
              </div>
              <div className="flex flex-col">
                <label htmlFor="newPassword" className="text-[11px] font-extrabold text-[#55657b] uppercase tracking-[0.07em] mb-1.5">New Password</label>
                <div className="relative">
                  <input id="newPassword" type={showPassword ? 'text' : 'password'} value={newPassword} onChange={(e) => setNewPassword(e.target.value)} placeholder="Enter new password" disabled={isLoading} aria-describedby="password-hint" className="w-full px-[15px] py-[12px] rounded-[10px] border border-[#dde2e7] bg-white text-[14px] text-[#232d3f] outline-none placeholder:text-[rgba(35,45,63,0.5)] disabled:bg-gray-100 disabled:text-gray-600 disabled:cursor-not-allowed transition-colors pr-12" />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    disabled={isLoading}
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                    className="absolute right-[12px] top-1/2 -translate-y-1/2 bg-none border-none cursor-pointer text-[11px] text-[#55657b] font-bold p-0 disabled:cursor-not-allowed whitespace-nowrap"
                  >
                    {showPassword ? 'Hide' : 'Show'}
                  </button>
                </div>
                <p id="password-hint" className="mt-1.5 text-[11px] text-[#55657b] leading-[16px]">Password must be at least 12 characters with 1 uppercase, 1 lowercase, and 1 number</p>
              </div>
              <div className="flex flex-col gap-3">
                <button type="submit" disabled={isLoading || !code || !newPassword} aria-busy={isLoading} className="w-full min-h-[52px] px-[18px] py-[12px] rounded-[10px] bg-[#eb7900] text-white text-[14px] font-extrabold cursor-pointer disabled:bg-gray-300 disabled:cursor-not-allowed transition-all">{isLoading ? 'Resetting password...' : 'Reset password'}</button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

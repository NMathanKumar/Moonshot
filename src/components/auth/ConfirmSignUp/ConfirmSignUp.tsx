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
      console.error('ConfirmSignUp: Submission error:', message);
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
    <main className="verify-page">
      <div className="verify-brand-bar" />
      <div className="verify-layout">
        <div className="verify-visual" aria-hidden="true">
          <div className="verify-illustration">
            <img src={verifyEmailIllustration} alt="" />
          </div>
          <div className="verify-visual-copy">
            <p>Almost there</p>
            <h2>Confirm your email to continue</h2>
          </div>
        </div>

        <section className="verify-card" aria-labelledby="verify-email-title">
          <p className="verify-eyebrow">Account verification</p>
          <h1 id="verify-email-title">Verify your email</h1>
          <p className="verify-description">
            We sent a verification code to <strong>{email || 'your email address'}</strong>
          </p>

          {error && (
            <div className="verify-alert verify-alert-error" role="alert">
              {error}
            </div>
          )}
          {successMessage && (
            <div className="verify-alert verify-alert-success" role="status">
              ✓ {successMessage}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <label htmlFor="verification-code">Verification code</label>
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
            />
            <button
              type="submit"
              disabled={code.length !== 6 || isLoading || Boolean(successMessage)}
            >
              {isLoading ? 'Verifying...' : 'Verify & continue →'}
            </button>
          </form>

          <div className="verify-resend">
            <span>Didn’t receive the code?</span>
            <button type="button" onClick={handleResend} disabled={isResending}>
              {isResending ? 'Sending...' : 'Resend code'}
            </button>
          </div>
          {resent && (
            <p className="verify-resend-status" role="status">
              A new code has been sent.
            </p>
          )}
        </section>
      </div>
    </main>
  );
}

export default ConfirmSignUp;

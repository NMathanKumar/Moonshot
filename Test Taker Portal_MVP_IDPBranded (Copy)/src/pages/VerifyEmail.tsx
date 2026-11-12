import { FormEvent, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import verifyEmailIllustration from "@/assets/verify-email-illustration.png";

type VerifyEmailLocationState = {
  email?: string;
};

export default function VerifyEmail() {
  const navigate = useNavigate();
  const location = useLocation();
  const email = (location.state as VerifyEmailLocationState | null)?.email || "your email address";
  const [code, setCode] = useState("");
  const [resent, setResent] = useState(false);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!/^\d{6}$/.test(code)) return;
    navigate("/login", { replace: true });
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
            We sent a verification code to <strong>{email}</strong>
          </p>

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
              onChange={(event) => {
                setCode(event.target.value.replace(/\D/g, "").slice(0, 6));
                setResent(false);
              }}
              placeholder="Enter 6-digit code"
              required
            />
            <button type="submit" disabled={code.length !== 6}>
              Verify &amp; continue →
            </button>
          </form>

          <div className="verify-resend">
            <span>Didn’t receive the code?</span>
            <button type="button" onClick={() => setResent(true)}>
              Resend code
            </button>
          </div>
          {resent && <p className="verify-resend-status" role="status">A new code has been sent.</p>}
        </section>
      </div>
    </main>
  );
}

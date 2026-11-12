import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import signupStudent from '@assets/idp-signup-student.png';

export interface GuardianDetails {
  firstName: string;
  lastName: string;
  country: string;
  relationship: string;
  relationshipDetails?: string;
  email: string;
  consentGiven: boolean;
}

export interface SignUpCredentials {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  gender: string;
  /** Present only when the test taker is under 18 */
  guardian?: GuardianDetails;
}

export interface SignUpProps {
  onSubmit?: (credentials: SignUpCredentials) => Promise<void>;
}

export function isUnder18(dateOfBirth: string) {
  const birthDate = new Date(`${dateOfBirth}T00:00:00`);
  if (Number.isNaN(birthDate.getTime())) return false;
  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const birthdayHasPassed =
    today.getMonth() > birthDate.getMonth() ||
    (today.getMonth() === birthDate.getMonth() && today.getDate() >= birthDate.getDate());
  if (!birthdayHasPassed) age -= 1;
  return age < 18;
}

function validatePassword(password: string): string | null {
  if (!password) return null;
  if (password.length < 12) return 'Password must be at least 12 characters';
  if (!/[A-Z]/.test(password)) return 'Password must contain at least 1 uppercase letter';
  if (!/[a-z]/.test(password)) return 'Password must contain at least 1 lowercase letter';
  if (!/\d/.test(password)) return 'Password must contain at least 1 number';
  return null;
}

/** Local date as YYYY-MM-DD (used as the max for the date picker) */
function todayIso(): string {
  const d = new Date();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${d.getFullYear()}-${month}-${day}`;
}

const GUARDIAN_COUNTRIES = [
  'Australia',
  'New Zealand',
  'Canada',
  'United Kingdom',
  'United States',
  'Other',
];

const inp: React.CSSProperties = {
  width: '100%',
  padding: '11px 14px',
  borderRadius: 8,
  border: '1.5px solid var(--border)',
  background: 'white',
  fontSize: 13,
  color: 'var(--color-ink)',
  outline: 'none',
  fontFamily: 'Inter, sans-serif',
};

const lbl: React.CSSProperties = {
  display: 'block',
  fontSize: 11,
  fontWeight: 700,
  color: 'var(--color-slate)',
  textTransform: 'uppercase',
  letterSpacing: '0.06em',
  marginBottom: 6,
};

const BENEFITS = [
  'Access your personalised dashboard and results.',
  'Practise all four skills at your own pace.',
  'Manage your tests and certificates in one place.',
];

export function SignUp({ onSubmit }: SignUpProps) {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [dateOfBirthError, setDateOfBirthError] = useState('');
  const [termsAccepted, setTermsAccepted] = useState(false);

  // Parent / guardian details (only used when the test taker is under 18)
  const [guardianFirstName, setGuardianFirstName] = useState('');
  const [guardianLastName, setGuardianLastName] = useState('');
  const [guardianCountry, setGuardianCountry] = useState('');
  const [guardianRelationship, setGuardianRelationship] = useState('');
  const [guardianRelationshipDetails, setGuardianRelationshipDetails] = useState('');
  const [guardianEmail, setGuardianEmail] = useState('');
  const [guardianConsent, setGuardianConsent] = useState(false);

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [passwordError, setPasswordError] = useState<string | null>(null);

  const needsGuardian = Boolean(dateOfBirth) && isUnder18(dateOfBirth);

  const handlePasswordChange = (value: string) => {
    setPassword(value);
    setPasswordError(value ? validatePassword(value) : null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!dateOfBirth) {
      setDateOfBirthError('Enter your date of birth to continue.');
      return;
    }

    const pwError = validatePassword(password);
    if (pwError) {
      setPasswordError(pwError);
      return;
    }

    if (
      needsGuardian &&
      guardianEmail.trim().toLowerCase() === email.trim().toLowerCase()
    ) {
      setError("The parent or guardian's email must be different from the test taker's email.");
      return;
    }

    if (!onSubmit) {
      console.warn('[SignUp] No onSubmit handler provided');
      setError('Sign up handler not configured');
      return;
    }

    setIsLoading(true);
    try {
      await onSubmit({
        email,
        password,
        firstName,
        lastName,
        dateOfBirth,
        // Gender is not collected on this form; AppRoutes defaults it to PREFER_NOT_TO_SAY
        gender: '',
        guardian: needsGuardian
          ? {
              firstName: guardianFirstName,
              lastName: guardianLastName,
              country: guardianCountry,
              relationship: guardianRelationship,
              relationshipDetails:
                guardianRelationship === 'other' ? guardianRelationshipDetails : undefined,
              email: guardianEmail,
              consentGiven: guardianConsent,
            }
          : undefined,
      });
      // AppRoutes handles navigation to /confirm-signup
    } catch (err) {
      const message = err instanceof Error ? err.message : 'An unknown error occurred';
      console.error('[SignUp] Submission error:', message);
      setError(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={`login-grid signup-layout${needsGuardian ? ' guardian-inline-layout' : ''}`}>
      {/* Left brand panel */}
      <div
        className="login-brand-panel"
        style={{
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          padding: 60,
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            position: 'absolute',
            top: -60,
            left: -60,
            width: 280,
            height: 280,
            borderRadius: '50%',
            background: 'rgba(255,255,255,0.06)',
          }}
        />
        <div
          style={{
            position: 'absolute',
            bottom: -40,
            right: -40,
            width: 200,
            height: 200,
            borderRadius: '50%',
            background: 'rgba(255,255,255,0.08)',
          }}
        />
        <div className="signup-intro">
          <img
            src={signupStudent}
            alt="Student preparing to study"
            className="signup-illustration"
          />
          <h2>One account for your English test journey</h2>
          <div className="signup-benefits">
            {BENEFITS.map((benefit) => (
              <div key={benefit}>
                <span aria-hidden="true">✓</span>
                <p>{benefit}</p>
              </div>
            ))}
          </div>
          <p className="signup-note">
            <strong>Clear and simple.</strong> Your account keeps your preparation, purchases, and
            results together.
          </p>
        </div>
      </div>

      {/* Right form panel */}
      <div className="login-form-panel">
        <form className="login-form-card" onSubmit={handleSubmit}>
          <div style={{ marginBottom: 28 }}>
            <h1
              style={{
                fontSize: 24,
                fontWeight: 900,
                color: 'var(--color-ink)',
                marginBottom: 8,
                textAlign: 'center',
              }}
            >
              Create your IDP English Test Account
            </h1>
            <p style={{ fontSize: 11, color: 'var(--color-slate)', textAlign: 'center' }}>
              <span aria-hidden="true">*</span> Mandatory fields
            </p>
          </div>

          {error && (
            <div
              role="alert"
              style={{
                marginBottom: 16,
                padding: '10px 14px',
                borderRadius: 8,
                background: '#fef2f2',
                border: '1px solid #fecaca',
                color: '#dc2626',
                fontSize: 13,
              }}
            >
              {error}
            </div>
          )}

          <div style={{ display: 'flex', flexDirection: 'column', gap: 16, marginBottom: 20 }}>
            <div
              className="signup-name-fields"
              style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}
            >
              <div>
                <label htmlFor="signup-first-name" style={lbl}>
                  First name <span aria-hidden="true">*</span>
                </label>
                <input
                  id="signup-first-name"
                  autoComplete="given-name"
                  placeholder="Agnes"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  disabled={isLoading}
                  required
                  style={inp}
                />
              </div>
              <div>
                <label htmlFor="signup-last-name" style={lbl}>
                  Last name <span aria-hidden="true">*</span>
                </label>
                <input
                  id="signup-last-name"
                  autoComplete="family-name"
                  placeholder="Chen"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  disabled={isLoading}
                  required
                  style={inp}
                />
              </div>
            </div>

            <div>
              <label htmlFor="signup-email" style={lbl}>
                Email <span aria-hidden="true">*</span>
              </label>
              <input
                id="signup-email"
                type="email"
                autoComplete="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isLoading}
                required
                style={inp}
              />
            </div>

            <div>
              <label htmlFor="signup-password" style={lbl}>
                Password <span aria-hidden="true">*</span>
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  id="signup-password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="new-password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => handlePasswordChange(e.target.value)}
                  disabled={isLoading}
                  required
                  aria-invalid={Boolean(passwordError)}
                  aria-describedby={passwordError ? 'signup-password-error' : undefined}
                  style={{
                    ...inp,
                    paddingRight: 110,
                    borderColor: passwordError ? '#dc2626' : undefined,
                  }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  disabled={isLoading}
                  style={{
                    position: 'absolute',
                    right: 12,
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    fontSize: 11,
                    color: 'var(--color-slate)',
                    fontWeight: 700,
                    fontFamily: 'Inter, sans-serif',
                    padding: 0,
                  }}
                >
                  {showPassword ? 'Hide password' : 'Show password'}
                </button>
              </div>
              {passwordError && (
                <p
                  id="signup-password-error"
                  style={{ color: '#dc2626', fontSize: 11, marginTop: 6, fontWeight: 500 }}
                >
                  {passwordError}
                </p>
              )}
            </div>

            <div
              className="signup-details-fields"
              style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 12 }}
            >
              <div>
                <label htmlFor="signup-dob" style={lbl}>
                  Date of birth <span aria-hidden="true">*</span>
                </label>
                <input
                  id="signup-dob"
                  type="date"
                  autoComplete="bday"
                  value={dateOfBirth}
                  max={todayIso()}
                  onChange={(e) => {
                    setDateOfBirth(e.target.value);
                    setDateOfBirthError('');
                  }}
                  disabled={isLoading}
                  aria-describedby={dateOfBirthError ? 'date-of-birth-error' : undefined}
                  aria-invalid={Boolean(dateOfBirthError)}
                  required
                  style={{ ...inp, color: 'var(--color-slate)' }}
                />
                {dateOfBirthError && (
                  <p
                    id="date-of-birth-error"
                    style={{ color: 'var(--color-brand-red)', fontSize: 11, marginTop: 6 }}
                  >
                    {dateOfBirthError}
                  </p>
                )}
              </div>
            </div>
          </div>

          {needsGuardian && (
            <section className="inline-guardian-section" aria-labelledby="guardian-details-title">
              <div className="inline-guardian-heading">
                <h2 id="guardian-details-title">Parent or guardian details</h2>
                <span>
                  As the test taker is a minor, parent or guardian details are required to complete
                  the sign up.
                </span>
              </div>

              <div className="guardian-field-grid">
                <div>
                  <label htmlFor="guardian-first-name">
                    First name <span aria-hidden="true">*</span>
                  </label>
                  <input
                    id="guardian-first-name"
                    name="guardianFirstName"
                    autoComplete="off"
                    value={guardianFirstName}
                    onChange={(e) => setGuardianFirstName(e.target.value)}
                    disabled={isLoading}
                    required
                  />
                </div>
                <div>
                  <label htmlFor="guardian-last-name">
                    Last name <span aria-hidden="true">*</span>
                  </label>
                  <input
                    id="guardian-last-name"
                    name="guardianLastName"
                    autoComplete="off"
                    value={guardianLastName}
                    onChange={(e) => setGuardianLastName(e.target.value)}
                    disabled={isLoading}
                    required
                  />
                </div>
                <div>
                  <label htmlFor="guardian-country">
                    Country of residence <span aria-hidden="true">*</span>
                  </label>
                  <select
                    id="guardian-country"
                    name="guardianCountry"
                    value={guardianCountry}
                    onChange={(e) => setGuardianCountry(e.target.value)}
                    disabled={isLoading}
                    required
                  >
                    <option value="" disabled>
                      Select country
                    </option>
                    {GUARDIAN_COUNTRIES.map((country) => (
                      <option key={country} value={country}>
                        {country}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label htmlFor="guardian-relationship">
                    Relationship to test taker <span aria-hidden="true">*</span>
                  </label>
                  <select
                    id="guardian-relationship"
                    name="guardianRelationship"
                    value={guardianRelationship}
                    onChange={(e) => setGuardianRelationship(e.target.value)}
                    disabled={isLoading}
                    required
                  >
                    <option value="" disabled>
                      Select relationship
                    </option>
                    <option value="parent">Parent</option>
                    <option value="legal-guardian">Legal guardian</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                {guardianRelationship === 'other' && (
                  <div className="guardian-other-field">
                    <label htmlFor="guardian-relationship-details">
                      Please provide relationship details <span aria-hidden="true">*</span>
                    </label>
                    <input
                      id="guardian-relationship-details"
                      name="guardianRelationshipDetails"
                      placeholder="Describe your relationship to the test taker"
                      value={guardianRelationshipDetails}
                      onChange={(e) => setGuardianRelationshipDetails(e.target.value)}
                      disabled={isLoading}
                      required
                    />
                  </div>
                )}
                <div className="guardian-email-field">
                  <label htmlFor="guardian-email">
                    Email address of parent or guardian <span aria-hidden="true">*</span>
                  </label>
                  <input
                    id="guardian-email"
                    name="guardianEmail"
                    type="email"
                    autoComplete="off"
                    placeholder="guardian@example.com"
                    value={guardianEmail}
                    onChange={(e) => setGuardianEmail(e.target.value)}
                    disabled={isLoading}
                    required
                  />
                </div>
              </div>

              <div className="guardian-notice">
                <span aria-hidden="true">i</span>
                <p>
                  The parent or guardian may be contacted to confirm their details and provide
                  consent.
                </p>
              </div>

              <label className="guardian-consent">
                <input
                  type="checkbox"
                  name="guardianTermsConsent"
                  checked={guardianConsent}
                  onChange={(e) => setGuardianConsent(e.target.checked)}
                  disabled={isLoading}
                  required
                />
                <span>
                  I am the parent or legal guardian of this test taker and I agree to the{' '}
                  <strong>Terms of Service and Privacy Policy</strong> on their behalf.
                </span>
              </label>
            </section>
          )}

          {!needsGuardian && (
            <label
              className="flex items-start gap-2"
              style={{ marginBottom: 20, cursor: 'pointer' }}
            >
              <input
                type="checkbox"
                checked={termsAccepted}
                onChange={(e) => setTermsAccepted(e.target.checked)}
                disabled={isLoading}
                required
                style={{
                  accentColor: '#FF6A00',
                  width: 15,
                  height: 15,
                  marginTop: 2,
                  flexShrink: 0,
                }}
              />
              <span style={{ fontSize: 12, color: 'var(--color-slate)', lineHeight: 1.5 }}>
                I agree to the{' '}
                <span style={{ color: '#FF6A00', fontWeight: 700 }}>
                  Terms of Service and Privacy Policy
                </span>
              </span>
            </label>
          )}

          <button
            type="submit"
            disabled={isLoading}
            style={{
              width: '100%',
              display: 'block',
              textAlign: 'center',
              padding: '13px',
              borderRadius: 10,
              border: 'none',
              background: 'var(--color-action-primary)',
              color: 'white',
              fontSize: 14,
              fontWeight: 800,
              marginBottom: 16,
              cursor: isLoading ? 'not-allowed' : 'pointer',
              opacity: isLoading ? 0.6 : 1,
              fontFamily: 'Inter, sans-serif',
            }}
          >
            {isLoading ? 'Creating account...' : 'Create my account →'}
          </button>

          <div style={{ textAlign: 'center', marginBottom: 18 }}>
            <span style={{ fontSize: 12, color: 'var(--color-slate)' }}>
              Already have an account?{' '}
            </span>
            <button
              type="button"
              onClick={() => navigate('/signin')}
              style={{
                fontSize: 12,
                color: 'var(--color-action-primary)',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                fontWeight: 700,
                padding: 0,
              }}
            >
              Sign in
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default SignUp;

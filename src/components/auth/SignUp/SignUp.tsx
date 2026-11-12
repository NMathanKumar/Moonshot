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
    } catch (err) {
      const message = err instanceof Error ? err.message : 'An unknown error occurred';
      setError(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={`min-h-screen w-screen flex flex-col md:flex-row bg-[#f7f7f5] overflow-x-hidden${needsGuardian ? '' : ''}`}>
      {/* Left brand panel */}
      <div className="hidden md:flex md:w-1/2 flex-col justify-center items-center px-[60px] py-[60px] relative overflow-hidden bg-gradient-to-br from-[#f7f7f5] to-[#fff8f3]">
        <div className="absolute top-[-60px] left-[-60px] w-[280px] h-[280px] rounded-full bg-white/10" />
        <div className="absolute bottom-[-40px] right-[-40px] w-[200px] h-[200px] rounded-full bg-white/[0.08]" />
        <div className="w-full max-w-[430px] text-left">
          <img
            src={signupStudent}
            alt="Student preparing to study"
            className="w-full max-w-[480px] h-auto object-contain block mb-[34px]"
          />
          <h2 className="text-[clamp(15px,1.6vw,23px)] font-black leading-[1.2] mb-3 text-[#232d3f] tracking-[-0.02em]">One account for your English test journey</h2>
          <div className="flex flex-col gap-4 mb-8">
            {BENEFITS.map((benefit) => (
              <div key={benefit} className="flex items-start gap-2.5">
                <span aria-hidden="true" className="text-[16px] font-black text-[#eb7900] flex-shrink-0">✓</span>
                <p className="text-[13px] leading-[1.55] text-[#55657b] m-0">{benefit}</p>
              </div>
            ))}
          </div>
          <p className="text-[12px] text-[#55657b] leading-[1.55] m-0">
            <strong className="text-[#232d3f]">Clear and simple.</strong> Your account keeps your preparation, purchases, and
            results together.
          </p>
        </div>
      </div>

      {/* Right form panel */}
      <div className="w-full md:w-1/2 flex flex-col justify-center items-center p-3 sm:p-4 md:p-9 bg-[#f7f7f5] min-h-screen md:min-h-auto">
        <form className="w-full max-w-[620px] px-4 sm:px-5 md:px-[38px] py-6 sm:py-7 md:py-[32px] rounded-lg md:rounded-[20px] bg-white border border-[#e0e0e0] md:border-[1.5px] md:border-[#dde2e7] shadow-[0_16px_45px_rgba(35,45,63,0.12)]" onSubmit={handleSubmit}>
          <div className="mb-6 sm:mb-7">
            <h1 className="text-xl sm:text-2xl md:text-[24px] font-black text-[#232d3f] mb-1.5 sm:mb-2 text-center leading-tight">
              Create your IDP English Test Account
            </h1>
            <p className="text-[10px] sm:text-[11px] md:text-[11px] text-[#55657b] text-center leading-relaxed">
              <span aria-hidden="true">*</span> Mandatory fields
            </p>
          </div>

          {error && (
            <div
              role="alert"
              className="mb-4 sm:mb-5 p-3 sm:p-3.5 rounded-lg bg-[#fef2f2] border border-[#fecaca] text-[#dc2626] text-xs sm:text-[13px] leading-relaxed"
            >
              {error}
            </div>
          )}

          <div className="flex flex-col gap-3 sm:gap-4 mb-5 sm:mb-6">
            <div
              className="grid gap-3 md:gap-0 md:grid-cols-2 w-full"
            >
              <div>
                <label htmlFor="signup-first-name" className="block text-[11px] font-bold text-[#55657b] uppercase tracking-[0.06em] mb-1.5">
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
                  className="w-full px-3.5 py-2.75 text-[13px] border border-[#dde2e7] rounded-lg bg-white text-[#232d3f] outline-none font-sans disabled:bg-gray-100 disabled:cursor-not-allowed disabled:text-gray-600"
                />
              </div>
              <div>
                <label htmlFor="signup-last-name" className="block text-[11px] font-bold text-[#55657b] uppercase tracking-[0.06em] mb-1.5">
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
                  className="w-full px-3.5 py-2.75 text-[13px] border border-[#dde2e7] rounded-lg bg-white text-[#232d3f] outline-none font-sans disabled:bg-gray-100 disabled:cursor-not-allowed disabled:text-gray-600"
                />
              </div>
            </div>

            <div>
              <label htmlFor="signup-email" className="block text-[11px] font-bold text-[#55657b] uppercase tracking-[0.06em] mb-1.5">
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
                className="w-full px-3.5 py-2.75 text-[13px] border border-[#dde2e7] rounded-lg bg-white text-[#232d3f] outline-none font-sans disabled:bg-gray-100 disabled:cursor-not-allowed disabled:text-gray-600"
              />
            </div>

            <div>
              <label htmlFor="signup-password" className="block text-[11px] font-bold text-[#55657b] uppercase tracking-[0.06em] mb-1.5">
                Password <span aria-hidden="true">*</span>
              </label>
              <div className="relative">
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
                  className={`w-full px-3.5 py-2.75 text-[13px] border rounded-lg bg-white text-[#232d3f] outline-none font-sans pr-[110px] disabled:bg-gray-100 disabled:cursor-not-allowed disabled:text-gray-600 ${
                    passwordError ? 'border-[#dc2626]' : 'border-[#dde2e7]'
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  disabled={isLoading}
                  className="absolute right-3 top-1/2 -translate-y-1/2 bg-none border-none cursor-pointer text-[11px] text-[#55657b] font-bold font-sans p-0 disabled:cursor-not-allowed"
                >
                  {showPassword ? 'Hide password' : 'Show password'}
                </button>
              </div>
              {passwordError && (
                <p
                  id="signup-password-error"
                  className="text-[#dc2626] text-[11px] mt-1.5 font-medium"
                >
                  {passwordError}
                </p>
              )}
            </div>

            <div className="w-full">
              <div>
                <label htmlFor="signup-dob" className="block text-[11px] font-bold text-[#55657b] uppercase tracking-[0.06em] mb-1.5">
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
                  className="w-full px-3.5 py-2.75 text-[13px] border border-[#dde2e7] rounded-lg bg-white text-[#55657b] outline-none font-sans disabled:bg-gray-100 disabled:cursor-not-allowed disabled:text-gray-600"
                />
                {dateOfBirthError && (
                  <p
                    id="date-of-birth-error"
                    className="text-[#e01f26] text-[11px] mt-1.5"
                  >
                    {dateOfBirthError}
                  </p>
                )}
              </div>
            </div>
          </div>

          {needsGuardian && (
            <section className="w-full mb-6 pt-6 border-t border-[#dde2e7]" aria-labelledby="guardian-details-title">
              <div className="mb-5">
                <h2 id="guardian-details-title" className="mb-1.5 text-[#232d3f] text-base">Parent or guardian details</h2>
                <span className="block text-[#55657b] text-3 leading-[1.55]">
                  As the test taker is a minor, parent or guardian details are required to complete
                  the sign up.
                </span>
              </div>

              <div className="grid gap-4 mb-6 md:grid-cols-2 w-full">
                <div>
                  <label htmlFor="guardian-first-name" className="block mb-1.75 text-[#55657b] text-[11px] font-bold uppercase tracking-[0.06em]">
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
                    className="w-full px-3.5 py-3 border border-[#dde2e7] rounded-lg bg-white text-[#232d3f] text-[13px] font-sans outline-none disabled:bg-gray-100 disabled:cursor-not-allowed disabled:text-gray-600"
                  />
                </div>
                <div>
                  <label htmlFor="guardian-last-name" className="block mb-1.75 text-[#55657b] text-[11px] font-bold uppercase tracking-[0.06em]">
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
                    className="w-full px-3.5 py-3 border border-[#dde2e7] rounded-lg bg-white text-[#232d3f] text-[13px] font-sans outline-none disabled:bg-gray-100 disabled:cursor-not-allowed disabled:text-gray-600"
                  />
                </div>
                <div>
                  <label htmlFor="guardian-country" className="block mb-1.75 text-[#55657b] text-[11px] font-bold uppercase tracking-[0.06em]">
                    Country of residence <span aria-hidden="true">*</span>
                  </label>
                  <select
                    id="guardian-country"
                    name="guardianCountry"
                    value={guardianCountry}
                    onChange={(e) => setGuardianCountry(e.target.value)}
                    disabled={isLoading}
                    required
                    className="w-full px-3.5 py-3 border border-[#dde2e7] rounded-lg bg-white text-[#232d3f] text-[13px] font-sans outline-none disabled:bg-gray-100 disabled:cursor-not-allowed disabled:text-gray-600"
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
                  <label htmlFor="guardian-relationship" className="block mb-1.75 text-[#55657b] text-[11px] font-bold uppercase tracking-[0.06em]">
                    Relationship to test taker <span aria-hidden="true">*</span>
                  </label>
                  <select
                    id="guardian-relationship"
                    name="guardianRelationship"
                    value={guardianRelationship}
                    onChange={(e) => setGuardianRelationship(e.target.value)}
                    disabled={isLoading}
                    required
                    className="w-full px-3.5 py-3 border border-[#dde2e7] rounded-lg bg-white text-[#232d3f] text-[13px] font-sans outline-none disabled:bg-gray-100 disabled:cursor-not-allowed disabled:text-gray-600"
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
                  <div className="md:col-span-2 w-full">
                    <label htmlFor="guardian-relationship-details" className="block mb-1.75 text-[#55657b] text-[11px] font-bold uppercase tracking-[0.06em]">
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
                      className="w-full px-3.5 py-3 border border-[#dde2e7] rounded-lg bg-white text-[#232d3f] text-[13px] font-sans outline-none disabled:bg-gray-100 disabled:cursor-not-allowed disabled:text-gray-600"
                    />
                  </div>
                )}
                <div className="md:col-span-2 w-full">
                  <label htmlFor="guardian-email" className="block mb-1.75 text-[#55657b] text-[11px] font-bold uppercase tracking-[0.06em]">
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
                    className="w-full px-3.5 py-3 border border-[#dde2e7] rounded-lg bg-white text-[#232d3f] text-[13px] font-sans outline-none disabled:bg-gray-100 disabled:cursor-not-allowed disabled:text-gray-600"
                  />
                </div>
              </div>

              <div className="flex items-start gap-2.5 mb-7 px-3.5 py-3 border border-[#FF6A0030] rounded-2xl bg-[#fff3ea]">
                <span aria-hidden="true" className="text-[#232d3f] flex items-center justify-center w-[18px] h-[18px] flex-shrink-0 rounded-full bg-[#eb7900] text-white text-[11px] font-bold">i</span>
                <p className="text-[#55657b] text-3 leading-[1.55] m-0">
                  The parent or guardian may be contacted to confirm their details and provide
                  consent.
                </p>
              </div>

              <label className="flex items-start gap-2.5 text-[#55657b] cursor-pointer text-[13px] leading-[1.5]">
                <input
                  type="checkbox"
                  name="guardianTermsConsent"
                  checked={guardianConsent}
                  onChange={(e) => setGuardianConsent(e.target.checked)}
                  disabled={isLoading}
                  required
                  className="w-[18px] h-[18px] mt-0.5 flex-shrink-0 accent-[#6b7280] cursor-pointer"
                />
                <span>
                  I am the parent or legal guardian of this test taker and I agree to the{' '}
                  <strong className="text-[#eb7900] font-bold">Terms of Service and Privacy Policy</strong> on their behalf.
                </span>
              </label>
            </section>
          )}

          {!needsGuardian && (
            <label className="flex items-start gap-2 mb-5 cursor-pointer">
              <input
                type="checkbox"
                checked={termsAccepted}
                onChange={(e) => setTermsAccepted(e.target.checked)}
                disabled={isLoading}
                required
                className="w-[15px] h-[15px] mt-0.5 flex-shrink-0 accent-[#FF6A00]"
              />
              <span className="text-[12px] text-[#55657b] leading-[1.5]">
                I agree to the{' '}
                <span className="text-[#FF6A00] font-bold">
                  Terms of Service and Privacy Policy
                </span>
              </span>
            </label>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full text-center py-3.25 rounded-2xl border-none bg-[#eb7900] text-white text-[14px] font-black mb-4 cursor-pointer disabled:cursor-not-allowed disabled:opacity-60 font-sans"
          >
            {isLoading ? 'Creating account...' : 'Create my account →'}
          </button>

          <div className="text-center mb-4.5">
            <span className="text-[12px] text-[#55657b]">
              Already have an account?{' '}
            </span>
            <button
              type="button"
              onClick={() => navigate('/signin')}
              className="text-[12px] text-[#eb7900] bg-none border-none cursor-pointer font-bold p-0 disabled:cursor-not-allowed"
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

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import signupStudent from '@assets/idp-signup-student.png';

export interface SignUpCredentials {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  gender: string;
}

export interface SignUpProps {
  onSubmit?: (credentials: SignUpCredentials) => Promise<void>;
}

function isUnder18(dateOfBirth: string) {
  const birthDate = new Date(`${dateOfBirth}T00:00:00`);
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

export function SignUp({ onSubmit }: SignUpProps) {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [gender, setGender] = useState('');
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [passwordError, setPasswordError] = useState<string | null>(null);

  const handleNavigateToSignIn = () => {
    navigate('/signin');
  };

  const handlePasswordChange = (value: string) => {
    setPassword(value);
    if (value) {
      setPasswordError(validatePassword(value));
    } else {
      setPasswordError(null);
    }
  };

  const needsGuardian = Boolean(dateOfBirth) && isUnder18(dateOfBirth);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      console.log('[SignUp] Form submitted');
      if (needsGuardian) {
        setError('You must be 18 or older to create an account. Please contact us for parental consent.');
        setIsLoading(false);
        return;
      }
      if (onSubmit) {
        await onSubmit({ email, password, firstName, lastName, dateOfBirth, gender });
        console.log('[SignUp] Submission successful - account created');
        // AppRoutes will handle navigation to /confirm-signup with email in state
      } else {
        console.warn('[SignUp] No onSubmit handler provided');
        setError('Sign up handler not configured');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred';
      console.error('[SignUp] Submission error:', errorMessage);
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 min-h-screen bg-[#f7f7f5]">
      {/* LEFT PANEL - Student image with decorative circles */}
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
            Create your IDP account
          </h2>
          <p className="text-[14px] font-normal text-[#55657b] leading-[23px] mb-8">
            One account for your English test journey. Sign up today.
          </p>
          <ul className="space-y-4">
            <li className="flex gap-2.5">
              <span className="text-[#ff6a00] font-extrabold text-base flex-shrink-0">✓</span>
              <p className="text-[13px] font-normal text-[#55657b] leading-[20px]">
                Access your personalised dashboard and results.
              </p>
            </li>
            <li className="flex gap-2.5">
              <span className="text-[#ff6a00] font-extrabold text-base flex-shrink-0">✓</span>
              <p className="text-[13px] font-normal text-[#55657b] leading-[20px]">
                Practise all four skills at your own pace.
              </p>
            </li>
            <li className="flex gap-2.5">
              <span className="text-[#ff6a00] font-extrabold text-base flex-shrink-0">✓</span>
              <p className="text-[13px] font-normal text-[#55657b] leading-[20px]">
                Manage your tests and certificates in one place.
              </p>
            </li>
          </ul>
          <p className="text-[12px] mt-6">
            <span className="font-bold text-[#232d3f]">Clear and simple.</span>
            <span className="font-normal text-[#55657b] ml-1">Your account keeps your preparation, purchases, and results together.</span>
          </p>
        </div>
      </div>

      {/* RIGHT PANEL - Sign Up Form */}
      <div className="flex items-center justify-center p-6 md:p-9 bg-[#f7f7f5]">
        <div className="w-full max-w-[620px] bg-white rounded-[20px] border border-[#e0e0e0] shadow-[0px_16px_22.5px_rgba(35,45,63,0.12)] px-9 py-8">
          {/* HEADER */}
          <div className="text-center mb-7">
            <h1 className="text-[26px] font-bold text-[#232d3f] leading-[39px] tracking-[-0.39px]">
              Create your account
            </h1>
          </div>

          {error && (
            <div className="w-full mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* First and Last Name */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-bold text-[#55657b] uppercase tracking-[0.66px] pb-1.5">
                  First name
                </label>
                <input
                  type="text"
                  placeholder="Agnes"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  disabled={isLoading}
                  required
                  className="w-full h-11 px-3.5 py-2.75 bg-white border border-[#e0e0e0] rounded-lg text-[13px] text-[#111827] font-medium placeholder-[#9CA3AF] focus:outline-none focus:border-[#FF6A00] focus:ring-1 focus:ring-[rgba(255,106,0,0.1)] disabled:opacity-60 autofill:text-[#111827] autofill:font-medium"
                  style={{
                    WebkitTextFillColor: firstName ? '#111827' : undefined,
                  }}
                />
              </div>
              <div>
                <label className="block text-[11px] font-bold text-[#55657b] uppercase tracking-[0.66px] pb-1.5">
                  Last name
                </label>
                <input
                  type="text"
                  placeholder="Chen"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  disabled={isLoading}
                  required
                  className="w-full h-11 px-3.5 py-2.75 bg-white border border-[#e0e0e0] rounded-lg text-[13px] text-[#111827] font-medium placeholder-[#9CA3AF] focus:outline-none focus:border-[#FF6A00] focus:ring-1 focus:ring-[rgba(255,106,0,0.1)] disabled:opacity-60 autofill:text-[#111827] autofill:font-medium"
                  style={{
                    WebkitTextFillColor: lastName ? '#111827' : undefined,
                  }}
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="block text-[11px] font-bold text-[#55657b] uppercase tracking-[0.66px] pb-1.5">
                Email
              </label>
              <input
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isLoading}
                required
                className="w-full h-11 px-3.5 py-2.75 bg-white border border-[#e0e0e0] rounded-lg text-[13px] text-[#111827] font-medium placeholder-[#9CA3AF] focus:outline-none focus:border-[#FF6A00] focus:ring-1 focus:ring-[rgba(255,106,0,0.1)] disabled:opacity-60 autofill:text-[#111827] autofill:font-medium"
                style={{
                  WebkitTextFillColor: email ? '#111827' : undefined,
                }}
              />
            </div>

            {/* Password */}
            <div>
              <label className="block text-[11px] font-bold text-[#55657b] uppercase tracking-[0.66px] pb-1.5">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => handlePasswordChange(e.target.value)}
                  disabled={isLoading}
                  required
                  className="w-full h-11 px-3.5 py-2.75 bg-white border border-[#e0e0e0] rounded-lg text-[13px] text-[#111827] font-medium placeholder-[#9CA3AF] focus:outline-none focus:border-[#FF6A00] focus:ring-1 focus:ring-[rgba(255,106,0,0.1)] disabled:opacity-60 autofill:text-[#111827] autofill:font-medium"
                  style={{
                    WebkitTextFillColor: password ? '#111827' : undefined,
                    borderColor: passwordError ? '#dc2626' : undefined,
                  }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  disabled={isLoading}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[11px] font-bold text-[#55657b] hover:text-[#232d3f] focus:outline-none"
                >
                  {showPassword ? 'Hide' : 'Show'}
                </button>
              </div>
              {passwordError && (
                <p className="text-[11px] text-red-600 mt-1.5 font-medium">{passwordError}</p>
              )}
            </div>

            {/* Date of Birth and Gender */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-bold text-[#55657b] uppercase tracking-[0.66px] pb-1.5">
                  Date of birth
                </label>
                <input
                  type="date"
                  value={dateOfBirth}
                  onChange={(e) => setDateOfBirth(e.target.value)}
                  disabled={isLoading}
                  required
                  className="w-full h-11 px-3.5 py-2.75 bg-white border border-[#e0e0e0] rounded-lg text-[13px] text-[#111827] font-medium focus:outline-none focus:border-[#FF6A00] focus:ring-1 focus:ring-[rgba(255,106,0,0.1)] disabled:opacity-60 autofill:text-[#111827] autofill:font-medium"
                  style={{
                    WebkitTextFillColor: dateOfBirth ? '#111827' : undefined,
                  }}
                />
              </div>
              <div>
                <label className="block text-[11px] font-bold text-[#55657b] uppercase tracking-[0.66px] pb-1.5">
                  Gender
                </label>
                <select
                  value={gender}
                  onChange={(e) => setGender(e.target.value)}
                  disabled={isLoading}
                  required
                  className="w-full h-11 px-3.5 py-2.75 bg-white border border-[#e0e0e0] rounded-lg text-[13px] text-[#111827] font-medium focus:outline-none focus:border-[#FF6A00] focus:ring-1 focus:ring-[rgba(255,106,0,0.1)] disabled:opacity-60"
                >
                  <option value="" className="text-[#9CA3AF]">Select gender</option>
                  <option value="FEMALE">Female</option>
                  <option value="MALE">Male</option>
                  <option value="OTHER">Other</option>
                  <option value="PREFER_NOT_TO_SAY">Prefer not to say</option>
                </select>
              </div>
            </div>

            {/* Terms Checkbox */}
            {!needsGuardian && (
              <div className="flex gap-2 items-start pt-2">
                <input
                  type="checkbox"
                  id="terms"
                  checked={termsAccepted}
                  onChange={(e) => setTermsAccepted(e.target.checked)}
                  disabled={isLoading}
                  required
                  className="bg-white border border-[#767676] rounded-sm w-3.75 h-3.75 mt-0.5 cursor-pointer accent-[#ff6a00]"
                />
                <label htmlFor="terms" className="text-[12px] font-normal text-[#55657b]">
                  I agree to the{' '}
                  <span className="font-bold text-[#ff6a00]">Terms of Service and Privacy Policy</span>
                </label>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading || (!needsGuardian && !termsAccepted) || !firstName || !lastName || !!passwordError}
              className="w-full py-3 px-4 bg-gradient-to-r from-[#FFC01E] via-[#FF6A00] to-[#E01F26] rounded-[10px] text-white font-extrabold text-[14px] leading-[21px] hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0 active:shadow-md transition-all disabled:opacity-60 disabled:cursor-not-allowed mt-2"
            >
              {isLoading ? 'Creating account...' : 'Create my account →'}
            </button>

            {/* Sign In Link */}
            <div className="text-center pt-4 border-t border-gray-100">
              <p className="text-[12px] text-[#55657b]">
                Already have an account?{' '}
                <button
                  type="button"
                  onClick={handleNavigateToSignIn}
                  className="font-bold text-[#ff6a00] hover:underline focus:outline-none"
                >
                  Sign in
                </button>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default SignUp;

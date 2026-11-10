import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import signupStudent from '@assets/idp-signup-student.png';
import { Button } from '@components/common/Button';
import { Input } from '@components/common/Input';
import { Alert } from '@components/common/Alert';

export interface SignUpCredentials {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  dateOfBirth: string;
}

export interface SignUpProps {
  onSubmit?: (credentials: { email: string; password: string; firstName: string; lastName: string; dateOfBirth: string }) => Promise<void>;
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

  const handleNavigateToSignIn = () => {
    navigate('/signin');
  };

  const needsGuardian = Boolean(dateOfBirth) && isUnder18(dateOfBirth);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      console.log('SignUp: Form submitted');
      if (needsGuardian) {
        setError('You must be 18 or older to create an account. Please contact us for parental consent.');
        setIsLoading(false);
        return;
      }
      if (onSubmit) {
        await onSubmit({ email, password, firstName, lastName, dateOfBirth });
        console.log('SignUp: Submission successful');
      } else {
        console.warn('SignUp: No onSubmit handler provided');
        setError('Sign up handler not configured');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred';
      console.error('SignUp: Submission error:', errorMessage);
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-[#f7f7f5] grid grid-cols-1 md:grid-cols-2 min-h-screen">
      {/* LEFT PANEL */}
      <div className="hidden md:flex flex-col items-end justify-center p-[60px] relative overflow-hidden">
        {/* Background elements */}
        <div className="absolute left-[-60px] top-[-60px] w-[280px] h-[280px] bg-[rgba(255,255,255,0.06)] rounded-full z-0" />
        <div className="absolute left-[384px] top-[920px] w-[200px] h-[200px] bg-[rgba(255,255,255,0.08)] rounded-full z-0" />

        {/* Content */}
        <div className="flex flex-col items-start max-w-[430px] relative w-[424px]">
          <div className="h-[314.458px] max-w-[480px] relative w-full">
            <img
              src={signupStudent}
              alt="Student"
              className="absolute inset-0 max-w-none object-cover pointer-events-none size-full"
            />
          </div>
          <h2 className="font-bold text-[26px] text-[#232d3f] mt-[34px] leading-[39px] tracking-[-0.39px]" style={{ fontFamily: "'Farro Bold', sans-serif" }}>
            Begin your journey
          </h2>
          <p className="font-normal text-[#55657b] text-[14px] mt-[32px] mb-6 leading-[21px]" style={{ fontFamily: "'Inter', sans-serif" }}>
            Create your account to start preparing for the IDP English Test
          </p>
          <ul className="list-none p-0 m-0 flex flex-col gap-[16px]" style={{ fontFamily: "'Inter', sans-serif" }}>
            <li className="flex gap-[10px] items-start w-full">
              <span className="font-bold text-[#ff6a00] text-[14px] flex-shrink-0">✓</span>
              <p className="m-0 font-normal text-[#55657b] text-[14px] leading-[21px]">Access personalized learning materials</p>
            </li>
            <li className="flex gap-[10px] items-start w-full">
              <span className="font-bold text-[#ff6a00] text-[14px] flex-shrink-0">✓</span>
              <p className="m-0 font-normal text-[#55657b] text-[14px] leading-[21px]">Save your progress and results</p>
            </li>
            <li className="flex gap-[10px] items-start w-full">
              <span className="font-bold text-[#ff6a00] text-[14px] flex-shrink-0">✓</span>
              <p className="m-0 font-normal text-[#55657b] text-[14px] leading-[21px]">Get certified by IDP</p>
            </li>
          </ul>
        </div>
      </div>

      {/* RIGHT PANEL */}
      <div className="flex flex-col items-center justify-center min-h-screen md:min-h-auto px-[36px] py-[24px] bg-[#f7f7f5]">
        <div className="bg-white border-[#e0e0e0] border-[1.333px] border-solid drop-shadow-[0px_16px_22.5px_rgba(35,45,63,0.12)] max-w-[620px] px-[38px] py-[32px] rounded-[20px] w-full">
          {/* HEADER */}
          <div className="flex flex-col items-center w-full mb-[28px]">
            <h1 className="font-bold text-[26px] text-[#232d3f] w-full text-center tracking-[-0.39px] leading-[39px]" style={{ fontFamily: "'Farro Bold', sans-serif" }}>
              Create your account
            </h1>
            <p className="font-normal text-[#55657b] text-[14px] w-[541.333px] text-center leading-[21px] mb-0" style={{ fontFamily: "'Inter', sans-serif" }}>
              Start your IDP English Test journey
            </p>
          </div>

          {/* Error Alert */}
          {error && (
            <Alert
              variant="error"
              title="Account creation failed"
              className="mb-[28px]"
            >
              {error}
            </Alert>
          )}

          {/* FORM */}
          <form onSubmit={handleSubmit} className="flex flex-col gap-[16px]">
            {/* NAME FIELDS */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-[12px] gap-y-[12px]" style={{ fontFamily: "'Inter', sans-serif" }}>
              <div>
                <label className="font-bold text-[#55657b] text-[14px]" style={{ fontFamily: "'Inter', sans-serif" }}>
                  First name <span className="text-[#eb7900]">*</span>
                </label>
                <Input
                  type="text"
                  name="firstName"
                  label="First name"
                  placeholder="Sarah"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  disabled={isLoading}
                  required
                  className="h-[44.167px] !rounded-[8px] !border-[#e0e0e0]"
                />
              </div>
              <div>
                <label className="font-bold text-[#55657b] text-[14px]" style={{ fontFamily: "'Inter', sans-serif" }}>
                  Last name <span className="text-[#eb7900]">*</span>
                </label>
                <Input
                  type="text"
                  name="lastName"
                  label="Last name"
                  placeholder="Chen"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  disabled={isLoading}
                  required
                  className="h-[44.167px] !rounded-[8px] !border-[#e0e0e0]"
                />
              </div>
            </div>

            {/* EMAIL FIELD */}
            <div style={{ fontFamily: "'Inter', sans-serif" }}>
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
                disabled={isLoading}
                required
                className="h-[44.167px] !rounded-[8px] !border-[#e0e0e0]"
              />
            </div>

            {/* PASSWORD FIELD */}
            <div style={{ fontFamily: "'Inter', sans-serif" }}>
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
                  disabled={isLoading}
                  required
                  className="h-full !rounded-[8px] !border-[#e0e0e0] pr-[44px] pl-[14px]"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  disabled={isLoading}
                  className="absolute left-[444.11px] top-[13.58px] font-bold text-[#55657b] text-[14px] focus:outline-none"
                  style={{ width: '88.729px', fontFamily: "'Inter', sans-serif" }}
                >
                  {showPassword ? 'Hide password' : 'Show password'}
                </button>
              </div>
            </div>

            {/* DATE OF BIRTH FIELD */}
            <div style={{ fontFamily: "'Inter', sans-serif" }}>
              <label className="font-bold text-[#55657b] text-[14px]" style={{ fontFamily: "'Inter', sans-serif" }}>
                Date of birth <span className="text-[#eb7900]">*</span>
              </label>
              <Input
                type="date"
                name="dateOfBirth"
                label="Date of birth"
                value={dateOfBirth}
                onChange={(e) => setDateOfBirth(e.target.value)}
                disabled={isLoading}
                required
                className="h-[44.167px] !rounded-[8px] !border-[#e0e0e0]"
              />
            </div>

            {/* GENDER FIELD */}
            <div style={{ fontFamily: "'Inter', sans-serif" }}>
              <label className="font-bold text-[#55657b] text-[14px]" style={{ fontFamily: "'Inter', sans-serif" }}>
                Gender <span className="text-[#eb7900]">*</span>
              </label>
              <select
                name="gender"
                value={gender}
                onChange={(e) => setGender(e.target.value)}
                disabled={isLoading}
                className="w-full h-[44.167px] px-[14px] py-[11px] rounded-[8px] border-[#e0e0e0] border-[1.333px] border-solid font-normal text-[#232d3f] text-[14px] bg-white focus:outline-none focus:border-[#ff6a00]"
                style={{ appearance: 'none', backgroundImage: 'none', fontFamily: "'Inter', sans-serif" }}
              >
                <option value="">Select gender</option>
                <option>Female</option>
                <option>Male</option>
                <option>Non-binary</option>
                <option>Prefer not to say</option>
              </select>
            </div>

            {/* TERMS CHECKBOX */}
            {!needsGuardian && (
              <div className="flex gap-[8px] items-start mt-[20px]" style={{ fontFamily: "'Inter', sans-serif" }}>
                <input
                  type="checkbox"
                  id="terms"
                  checked={termsAccepted}
                  onChange={(e) => setTermsAccepted(e.target.checked)}
                  disabled={isLoading}
                  required
                  className="bg-white border border-[#767676] rounded-[2px] size-[15px] mt-[2px] cursor-pointer accent-[#ff6a00]"
                />
                <label htmlFor="terms" className="font-normal text-[#55657b] text-[14px]">
                  I agree to the{' '}
                  <span className="font-bold text-[#ff6a00]">Terms of Service and Privacy Policy</span>
                </label>
              </div>
            )}

            {/* SUBMIT BUTTON */}
            <div className="mt-[20px]" style={{ fontFamily: "'Inter', sans-serif" }}>
              <Button
                type="submit"
                variant="primary"
                size="medium"
                disabled={isLoading || (!needsGuardian && !termsAccepted)}
                fullWidth
                className="!bg-[#eb7900] !rounded-[10px] !py-[13px] !w-[541.333px]"
              >
                {isLoading ? 'Creating account...' : 'Create my account →'}
              </Button>
            </div>

            {/* SIGN IN LINK */}
            <div className="flex flex-col items-center pb-[18px] pt-[16px] mt-4" style={{ fontFamily: "'Inter', sans-serif" }}>
              <p className="text-[#55657b] text-[14px] text-center mb-0">
                Already have an account?
                <button
                  type="button"
                  onClick={handleNavigateToSignIn}
                  disabled={isLoading}
                  className="font-bold text-[#eb7900] text-[14px] ml-1 hover:underline disabled:opacity-60 disabled:cursor-not-allowed focus:outline-none"
                  style={{ fontFamily: "'Inter', sans-serif" }}
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

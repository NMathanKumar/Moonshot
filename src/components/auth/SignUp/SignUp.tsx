import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import signupStudent from '@assets/idp-signup-student.png';

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
    <div className="grid grid-cols-1 md:grid-cols-2 min-h-screen bg-[#f7f7f5]">
      {/* LEFT PANEL */}
      <div className="hidden md:flex items-center justify-center p-[60px] relative overflow-hidden bg-[#f7f7f5]">
        {/* Orange circle background */}
        <div className="absolute w-[280px] h-[280px] bg-white/6 rounded-full -top-[60px] -left-[60px] z-[1]"></div>
        {/* Green leaf */}
        <div className="absolute w-[200px] h-[200px] bg-white/8 rounded-full -bottom-[80px] -right-[80px] z-[1]"></div>

        {/* Content */}
        <div className="relative z-10 text-center max-w-[424px]">
          <img src={signupStudent} alt="Student" className="w-full max-w-[424px] mb-8 block rounded-lg h-[314.458px] object-cover" />
          <h2 className="font-['Farro'] text-[20.48px] font-bold text-ink mb-8 leading-[1.2] w-[424px] m-0">
            Begin your journey
          </h2>
          <p className="font-['Inter'] text-xs text-slate mb-6 leading-[1.65] font-normal m-0">
            Create your account to start preparing for the IDP English Test
          </p>
          <ul className="list-none p-0 m-0 text-sm text-left">
            <li className="flex gap-2.5 mb-4 items-start">
              <span className="text-brand font-black flex-shrink-0 text-base">✓</span>
              <p className="m-0 font-['Inter'] text-sm text-slate leading-[1.55]">Access personalized learning materials</p>
            </li>
            <li className="flex gap-2.5 mb-4 items-start">
              <span className="text-brand font-black flex-shrink-0 text-base">✓</span>
              <p className="m-0 font-['Inter'] text-sm text-slate leading-[1.55]">Save your progress and results</p>
            </li>
            <li className="flex gap-2.5 mb-4 items-start">
              <span className="text-brand font-black flex-shrink-0 text-base">✓</span>
              <p className="m-0 font-['Inter'] text-sm text-slate leading-[1.55]">Get certified by IDP</p>
            </li>
          </ul>
        </div>
      </div>

      {/* RIGHT PANEL */}
      <div className="flex items-center justify-center p-6 md:p-9 min-h-screen md:min-h-auto relative overflow-hidden bg-[#f7f7f5] md:bg-[#f7f7f5]">
        <div className="w-full max-w-[620px] bg-white rounded-[20px] border-[1.333px] border-[#e0e0e0] p-16 md:p-9 shadow-lg">
          {/* HEADER */}
          <div className="text-center mb-7">
            <h1 className="font-['Farro'] text-2xl font-bold text-ink m-0 mb-2 leading-[1.5]">
              Create your account
            </h1>
            <p className="font-['Inter'] text-xs text-slate m-0 leading-[1.5] font-normal">
              Start your IDP English Test journey
            </p>
          </div>

          {/* Error Alert */}
          {error && (
            <div className="mb-4 p-3 rounded-lg bg-[#fff5f0] border border-[#ffb399]">
              <p className="m-0 text-sm text-[#d97f60] font-['Inter']">
                {error}
              </p>
            </div>
          )}

          {/* FORM */}
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            {/* NAME FIELDS */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="flex flex-col gap-1.5">
                <label className="font-['Inter'] text-xs font-bold uppercase tracking-[0.66px] text-slate">
                  First name
                </label>
                <input
                  type="text"
                  placeholder="Sarah"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  disabled={isLoading}
                  required
                  className="px-3.5 py-2.75 border-[1.333px] border-[#e0e0e0] rounded-lg font-['Inter'] text-sm text-ink bg-white transition-all focus:outline-none"
                  style={{ opacity: isLoading ? 0.6 : 1, cursor: isLoading ? 'not-allowed' : 'text' }}
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="font-['Inter'] text-xs font-bold uppercase tracking-[0.66px] text-slate">
                  Last name
                </label>
                <input
                  type="text"
                  placeholder="Chen"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  disabled={isLoading}
                  required
                  className="px-3.5 py-2.75 border-[1.333px] border-[#e0e0e0] rounded-lg font-['Inter'] text-sm text-ink bg-white transition-all focus:outline-none"
                  style={{ opacity: isLoading ? 0.6 : 1, cursor: isLoading ? 'not-allowed' : 'text' }}
                />
              </div>
            </div>

            {/* EMAIL FIELD */}
            <div className="flex flex-col gap-1.5">
              <label className="font-['Inter'] text-xs font-bold uppercase tracking-[0.66px] text-slate">
                Email
              </label>
              <input
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isLoading}
                required
                className="px-3.5 py-2.75 border-[1.333px] border-[#e0e0e0] rounded-lg font-['Inter'] text-sm text-ink bg-white transition-all focus:outline-none"
                style={{ opacity: isLoading ? 0.6 : 1, cursor: isLoading ? 'not-allowed' : 'text' }}
              />
            </div>

            {/* PASSWORD FIELD */}
            <div className="flex flex-col gap-1.5">
              <label className="font-['Inter'] text-xs font-bold uppercase tracking-[0.66px] text-slate">
                Password
              </label>
              <div className="flex items-center border-[1.333px] border-[#e0e0e0] rounded-lg bg-white transition-all">
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={isLoading}
                  required
                  className="flex-1 border-0 bg-transparent px-3.5 py-2.75 font-['Inter'] text-sm text-ink focus:outline-none w-full"
                  style={{ opacity: isLoading ? 0.6 : 1, cursor: isLoading ? 'not-allowed' : 'text' }}
                />
                <button
                  type="button"
                  className="px-3.5 bg-none border-0 text-slate text-xs font-bold font-['Inter'] cursor-pointer whitespace-nowrap"
                  onClick={() => setShowPassword(!showPassword)}
                  disabled={isLoading}
                  style={{ opacity: isLoading ? 0.6 : 1, cursor: isLoading ? 'not-allowed' : 'pointer' }}
                >
                  {showPassword ? 'Hide' : 'Show'}
                </button>
              </div>
            </div>

            {/* DATE OF BIRTH FIELD */}
            <div className="flex flex-col gap-1.5">
              <label className="font-['Inter'] text-xs font-bold uppercase tracking-[0.66px] text-slate">
                Date of birth
              </label>
              <input
                type="date"
                value={dateOfBirth}
                onChange={(e) => setDateOfBirth(e.target.value)}
                disabled={isLoading}
                required
                className="px-3.5 py-2.75 border-[1.333px] border-[#e0e0e0] rounded-lg font-['Inter'] text-sm text-ink bg-white transition-all focus:outline-none"
                style={{ opacity: isLoading ? 0.6 : 1, cursor: isLoading ? 'not-allowed' : 'text' }}
              />
            </div>

            {/* GENDER FIELD */}
            <div className="flex flex-col gap-1.5">
              <label className="font-['Inter'] text-xs font-bold uppercase tracking-[0.66px] text-slate">
                Gender
              </label>
              <select 
                value={gender} 
                onChange={(e) => setGender(e.target.value)}
                disabled={isLoading}
                className="px-3.5 py-2.75 border-[1.333px] border-[#e0e0e0] rounded-lg font-['Inter'] text-sm text-ink bg-white transition-all focus:outline-none"
                style={{ opacity: isLoading ? 0.6 : 1, cursor: isLoading ? 'not-allowed' : 'pointer' }}
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
              <div className="flex items-start gap-2 my-3 mb-4">
                <input
                  type="checkbox"
                  id="terms"
                  checked={termsAccepted}
                  onChange={(e) => setTermsAccepted(e.target.checked)}
                  disabled={isLoading}
                  required
                  className="w-[15px] h-[15px] cursor-pointer accent-brand flex-shrink-0 border border-[#767676] mt-0.5"
                />
                <label htmlFor="terms" className="font-['Inter'] text-xs text-slate cursor-pointer leading-[1.5]">
                  I agree to the <span className="text-brand font-bold">Terms of Service and Privacy Policy</span>
                </label>
              </div>
            )}

            {/* SUBMIT BUTTON */}
            <button 
              type="submit" 
              className="px-5 py-3 bg-brand text-white border-0 rounded-[10px] font-['Inter'] text-base font-black cursor-pointer transition-all mt-5 w-full hover:opacity-90 active:translate-y-0 disabled:opacity-70 disabled:cursor-not-allowed"
              disabled={isLoading || (!needsGuardian && !termsAccepted)}
              style={{ opacity: isLoading || (!needsGuardian && !termsAccepted) ? 0.7 : 1, cursor: isLoading ? 'not-allowed' : 'pointer' }}
            >
              {isLoading ? 'Creating account...' : 'Create my account →'}
            </button>
          </form>

          {/* SIGN IN LINK */}
          <div className="text-center font-['Inter'] text-xs text-slate mt-4 flex flex-col gap-3">
            <p className="m-0">Already have an account?</p>
            <button 
              type="button" 
              onClick={(e) => {
                e.preventDefault();
                handleNavigateToSignIn();
              }}
              disabled={isLoading}
              className="bg-none border-0 text-brand font-bold cursor-pointer text-xs font-['Inter'] hover:underline disabled:opacity-60 disabled:cursor-not-allowed"
              style={{ 
                opacity: isLoading ? 0.6 : 1,
              }}
            >
              Sign in
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SignUp;

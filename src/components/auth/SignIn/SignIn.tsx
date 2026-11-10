import { useState } from 'react';
import signupStudent from '@assets/idp-signup-student.png';
import signinStudent from '@assets/idp-signin-student.png';
import styles from './SignIn.module.css';

export interface SignInCredentials {
  email: string;
  password: string;
}

export interface SignInProps {
  onSubmit?: (credentials: SignInCredentials) => Promise<void>;
  onSignUp?: (credentials: { email: string; password: string; firstName: string; lastName: string }) => Promise<void>;
  onVerifyEmail?: (email: string, code: string) => Promise<void>;
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

export function SignIn() {
  const [tab, setTab] = useState<'login' | 'signup'>('login');
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [gender, setGender] = useState('');

  const needsGuardian = tab === 'signup' && Boolean(dateOfBirth) && isUnder18(dateOfBirth);

  return (
    <div className={styles.container}>
      {/* LEFT PANEL */}
      <div className={styles.leftPanel}>
        {/* Orange circle background */}
        <div className={styles.orangeCircle}></div>
        {/* Green leaf */}
        <div className={styles.greenLeaf}></div>
        {/* Blue circle background */}
        <div className={styles.blueCircle}></div>

        {/* Content */}
        <div className={styles.leftContent}>
          {tab === 'login' ? (
            <img src={signinStudent} alt="Professional woman" className={styles.image} />
          ) : (
            <>
              <img src={signupStudent} alt="Student" className={styles.image} />
              <h2 className={styles.leftHeading}>Create your IDP account</h2>
              <p className={styles.leftDescription}>One account for your English test journey. Sign up today.</p>
              <ul className={styles.benefits}>
                <li>
                  <span>✓</span>
                  <p>Access your personalised dashboard and results.</p>
                </li>
                <li>
                  <span>✓</span>
                  <p>Practise all four skills at your own pace.</p>
                </li>
                <li>
                  <span>✓</span>
                  <p>Manage your tests and certificates in one place.</p>
                </li>
                <li>
                  <span>✓</span>
                  <div>
                    <strong>Clear and simple.</strong>
                    <p>Your account keeps your preparation, purchases, and results together.</p>
                  </div>
                </li>
              </ul>
            </>
          )}
        </div>
      </div>

      {/* RIGHT PANEL */}
      <div className={styles.rightPanel}>
        <div className={styles.card}>
          {/* HEADER */}
          {tab === 'login' && (
            <div className={styles.header}>
              <h1>Welcome back</h1>
              <p>Sign in to your IDP account</p>
            </div>
          )}

          {tab === 'signup' && (
            <div className={styles.header}>
              <h1>Create your account</h1>
              <p>Start your IDP English Test journey</p>
            </div>
          )}

          {/* TAB TOGGLE */}
          <div className={styles.tabs}>
            <button
              className={`${styles.tab} ${tab === 'login' ? styles.active : ''}`}
              onClick={() => setTab('login')}
            >
              Sign In
            </button>
            <button
              className={`${styles.tab} ${tab === 'signup' ? styles.active : ''}`}
              onClick={() => setTab('signup')}
            >
              Sign Up
            </button>
          </div>

          {/* FORM */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
            }}
          >
            {/* NAME FIELDS - Only for signup */}
            {tab === 'signup' && (
              <div className={styles.row}>
                <div className={styles.field}>
                  <label>FIRST NAME</label>
                  <input
                    type="text"
                    placeholder="Sarah"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                  />
                </div>
                <div className={styles.field}>
                  <label>LAST NAME</label>
                  <input
                    type="text"
                    placeholder="Chen"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                  />
                </div>
              </div>
            )}

            {/* EMAIL FIELD */}
            <div className={styles.field}>
              <label>EMAIL</label>
              <input
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            {/* PASSWORD FIELD */}
            <div className={styles.field}>
              <label>PASSWORD</label>
              <div className={styles.passwordContainer}>
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button
                  type="button"
                  className={styles.showButton}
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? 'Hide' : 'Show'} password
                </button>
              </div>
            </div>

            {/* DOB & GENDER - Only for signup */}
            {tab === 'signup' && (
              <div className={styles.row}>
                <div className={styles.field}>
                  <label>DATE OF BIRTH</label>
                  <input
                    type="date"
                    value={dateOfBirth}
                    onChange={(e) => setDateOfBirth(e.target.value)}
                  />
                </div>
                <div className={styles.field}>
                  <label>GENDER</label>
                  <select value={gender} onChange={(e) => setGender(e.target.value)}>
                    <option value="">Select gender</option>
                    <option>Female</option>
                    <option>Male</option>
                    <option>Non-binary</option>
                    <option>Prefer not to say</option>
                  </select>
                </div>
              </div>
            )}

            {/* TERMS CHECKBOX - Only for signup */}
            {tab === 'signup' && !needsGuardian && (
              <div className={styles.checkbox}>
                <input type="checkbox" id="terms" />
                <label htmlFor="terms">
                  I agree to the <span className={styles.highlight}>Terms of Service and Privacy Policy</span>
                </label>
              </div>
            )}

            {/* SUBMIT BUTTON */}
            <button type="submit" className={styles.submitButton}>
              {tab === 'login' ? 'Sign in →' : 'Create my account →'}
            </button>
          </form>

          {/* SIGN UP LINK - Only for login */}
          {tab === 'login' && (
            <div className={styles.signupLink}>
              Don't have an account?{' '}
              <button type="button" onClick={() => setTab('signup')}>
                Sign up
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

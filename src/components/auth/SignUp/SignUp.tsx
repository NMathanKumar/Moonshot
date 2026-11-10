import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import signupStudent from '@assets/idp-signup-student.png';
import styles from './SignUp.module.css';

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

  const handleNavigateToSignIn = () => {
    navigate('/signin');
  };

  const needsGuardian = Boolean(dateOfBirth) && isUnder18(dateOfBirth);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (needsGuardian) {
      // Handle guardian consent flow
      return;
    }
    if (onSubmit) {
      onSubmit({ email, password, firstName, lastName, dateOfBirth });
    }
  };

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
          <img src={signupStudent} alt="Student" className={styles.image} />
          <h2 className={styles.leftHeading}>One account for your English test journey</h2>
          <p className={styles.leftDescription}>Clear and simple. Your account keeps your preparation, purchases, and results together.</p>
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
          </ul>
        </div>
      </div>

      {/* RIGHT PANEL */}
      <div className={styles.rightPanel}>
        <div className={styles.card}>
          {/* HEADER */}
          <div className={styles.header}>
            <h1>Create your IDP English Test Account</h1>
            <p>* Mandatory fields</p>
          </div>

          {/* FORM */}
          <form onSubmit={handleSubmit}>
            {/* NAME FIELDS */}
            <div className={styles.row}>
              <div className={styles.field}>
                <label>
                  First name <span className={styles.required}>*</span>
                </label>
                <input
                  type="text"
                  placeholder="Agnes"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  required
                />
              </div>
              <div className={styles.field}>
                <label>
                  Last name <span className={styles.required}>*</span>
                </label>
                <input
                  type="text"
                  placeholder="Chen"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  required
                />
              </div>
            </div>

            {/* EMAIL FIELD */}
            <div className={styles.field}>
              <label>
                Email <span className={styles.required}>*</span>
              </label>
              <input
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            {/* PASSWORD FIELD */}
            <div className={styles.field}>
              <label>
                Password <span className={styles.required}>*</span>
              </label>
              <div className={styles.passwordContainer}>
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  className={styles.showButton}
                  onClick={() => setShowPassword(!showPassword)}
                >
                  Show password
                </button>
              </div>
            </div>

            {/* DATE OF BIRTH FIELD */}
            <div className={styles.field}>
              <label>
                Date of birth <span className={styles.required}>*</span>
              </label>
              <input
                type="date"
                value={dateOfBirth}
                onChange={(e) => setDateOfBirth(e.target.value)}
                required
              />
            </div>

            {/* GENDER FIELD */}
            <div className={styles.field}>
              <label>Gender</label>
              <select value={gender} onChange={(e) => setGender(e.target.value)}>
                <option value="">Select gender</option>
                <option>Female</option>
                <option>Male</option>
                <option>Non-binary</option>
                <option>Prefer not to say</option>
              </select>
            </div>

            {/* TERMS CHECKBOX */}
            <div className={styles.checkbox}>
              <input
                type="checkbox"
                id="terms"
                checked={termsAccepted}
                onChange={(e) => setTermsAccepted(e.target.checked)}
                required
              />
              <label htmlFor="terms">
                I agree to the <span className={styles.highlight}>Terms of Service and Privacy Policy</span>
              </label>
            </div>

            {/* SUBMIT BUTTON */}
            <button type="submit" className={styles.submitButton} disabled={needsGuardian}>
              Create my account →
            </button>
          </form>

          {/* SIGN IN LINK */}
          <div className={styles.signInLink}>
            <p>Already have an account? </p>
            <button type="button" onClick={handleNavigateToSignIn} style={{ background: 'none', border: 'none', color: '#eb7900', fontWeight: 700, cursor: 'pointer', fontSize: '12px' }}>
              Sign in
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SignUp;

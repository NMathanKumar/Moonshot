import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './SignIn.module.css';
import signinStudent from '@assets/idp-signin-student.png';

export interface SignInCredentials {
  email: string;
  password: string;
}

export interface SignInProps {
  onSubmit?: (credentials: SignInCredentials) => Promise<void>;
}

export function SignIn() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleNavigateToSignUp = () => {
    navigate('/signup');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSubmit) {
      onSubmit({ email, password });
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
          <img src={signinStudent} alt="Professional woman" className={styles.image} />
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
            <h1>Welcome back</h1>
            <p>Sign in to your IDP account</p>
          </div>

          {/* FORM */}
          <form onSubmit={handleSubmit}>
            {/* EMAIL FIELD */}
            <div className={styles.field}>
              <label>Email</label>
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
              <label>Password</label>
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
                  {showPassword ? 'Hide' : 'Show'} password
                </button>
              </div>
            </div>

            {/* SUBMIT BUTTON */}
            <button type="submit" className={styles.submitButton}>
              Sign in →
            </button>
          </form>

          {/* SIGN UP LINK */}
          <div className={styles.signupLink}>
            Don't have an account?{' '}
            <button type="button" onClick={handleNavigateToSignUp} style={{ background: 'none', border: 'none', color: '#FF6A00', fontWeight: 700, cursor: 'pointer', fontSize: '12px' }}>
              Sign up
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SignIn;

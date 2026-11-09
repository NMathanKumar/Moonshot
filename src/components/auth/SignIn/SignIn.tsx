import { useId, useState, type FormEvent, type ChangeEvent } from 'react';
import { Button } from '@components/common/Button';
import styles from './SignIn.module.css';
import signinStudent from '@assets/idp-signin-student.png';
import '@styles/index.css';

/**
 * Credentials captured by the Sign In form.
 */
export interface SignInCredentials {
  email: string;
  password: string;
}

/**
 * Props for the {@link SignIn} screen.
 *
 * The screen is presentational: it owns its own form state and UI concerns
 * (show/hide password, validation, loading, error display) but delegates the
 * actual authentication call to the parent via `onSubmit`, and the secondary
 * navigation (sign up, forgot password) via optional callbacks. This keeps the
 * component decoupled from the typed API client and router that arrive with a
 * later journey.
 */
export interface SignInProps {
  /**
   * Called when the user submits valid credentials. Should return a promise
   * that resolves on success and rejects on failure. A rejected promise with
   * a message is surfaced to the user as an error; the submit button returns
   * to its idle state so the user can retry.
   */
  onSubmit?: (credentials: SignInCredentials) => Promise<void>;
  /** Invoked when the user activates the "Forgot password?" link. */
  onForgotPassword?: () => void;
  /** Invoked when the user activates the "Sign up" link. */
  onSignUp?: () => void;
}

/** Minimal email shape check — the server remains the source of truth. */
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * Sign In screen for the Test Taker Portal.
 *
 * Two-panel IDP-branded layout matching the approved design: a brand
 * illustration panel on the left and a sign-in card on the right with email,
 * password (show/hide toggle), a forgot-password link, a gradient submit
 * button with loading state, inline validation, and submission error handling.
 *
 * Styling uses CSS Modules and Moonshot design tokens.
 */
export function SignIn({ onSubmit, onForgotPassword, onSignUp }: SignInProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Partial<SignInCredentials>>({});

  const emailId = useId();
  const passwordId = useId();
  const formErrorId = useId();

  /** Validates the current field values, returning per-field error messages. */
  function validate(): Partial<SignInCredentials> {
    const errors: Partial<SignInCredentials> = {};

    if (!email.trim()) {
      errors.email = 'Enter your email address.';
    } else if (!EMAIL_PATTERN.test(email.trim())) {
      errors.email = 'Enter a valid email address.';
    }

    if (!password) {
      errors.password = 'Enter your password.';
    }

    return errors;
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setFormError(null);

    const errors = validate();
    setFieldErrors(errors);
    if (Object.keys(errors).length > 0) {
      return;
    }

    setIsSubmitting(true);
    try {
      await onSubmit?.({ email: email.trim(), password });
    } catch (error) {
      setFormError(
        error instanceof Error && error.message
          ? error.message
          : 'We could not sign you in. Please check your details and try again.',
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className={styles.signInLayout}>
      <div className={styles.signInBrandPanel}>
        <div className={styles.signInBrandMedia}>
          <img src={signinStudent} alt="" />
        </div>
      </div>

      <div className={styles.signInFormPanel}>
        <section className={styles.signInFormCard} aria-labelledby="signin-heading">
          <header className={styles.signInCardHeader}>
            <h1 id="signin-heading" className={styles.signInCardTitle}>
              Sign in
            </h1>
            <p className={styles.signInCardSubtitle}>
              Welcome back! Please enter your details.
            </p>
          </header>

          <form className={styles.signInForm} onSubmit={handleSubmit} noValidate>
            {formError && (
              <div id={formErrorId} className={styles.signInFormError} role="alert">
                {formError}
              </div>
            )}

            <div className={styles.signInField}>
              <label className={styles.signInLabel} htmlFor={emailId}>
                Email
              </label>
              <input
                id={emailId}
                type="email"
                name="email"
                className={styles.signInInput}
                value={email}
                placeholder="you@example.com"
                disabled={isSubmitting}
                aria-invalid={fieldErrors.email ? 'true' : undefined}
                aria-describedby={fieldErrors.email ? `${emailId}-error` : undefined}
                onChange={(event: ChangeEvent<HTMLInputElement>) => setEmail(event.target.value)}
              />
              {fieldErrors.email && (
                <span id={`${emailId}-error`} className={styles.signInFieldError}>
                  {fieldErrors.email}
                </span>
              )}
            </div>

            <div className={styles.signInField}>
              <div className={styles.signInLabelRow}>
                <label className={styles.signInLabel} htmlFor={passwordId}>
                  Password
                </label>
                <button
                  type="button"
                  className={styles.signInForgot}
                  onClick={onForgotPassword}
                  disabled={isSubmitting}
                >
                  Forgot password?
                </button>
              </div>
              <div className={styles.passwordContainer}>
                <input
                  id={passwordId}
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  className={styles.passwordInput}
                  value={password}
                  placeholder="Enter your password"
                  disabled={isSubmitting}
                  aria-invalid={fieldErrors.password ? 'true' : undefined}
                  aria-describedby={fieldErrors.password ? `${passwordId}-error` : undefined}
                  onChange={(event: ChangeEvent<HTMLInputElement>) => setPassword(event.target.value)}
                />
                <button
                  type="button"
                  className={styles.passwordToggle}
                  onClick={() => setShowPassword((visible) => !visible)}
                  disabled={isSubmitting}
                  aria-pressed={showPassword}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? 'Hide password' : 'Show password'}
                </button>
              </div>
              {fieldErrors.password && (
                <span id={`${passwordId}-error`} className={styles.signInFieldError}>
                  {fieldErrors.password}
                </span>
              )}
            </div>

            <Button
              type="submit"
              className={styles.signInSubmit}
              disabled={isSubmitting}
              isLoading={isSubmitting}
            >
              Sign in
            </Button>
          </form>

          <p className={styles.signInFooter}>
            Don&apos;t have an account?{' '}
            <button type="button" onClick={onSignUp} disabled={isSubmitting}>
              Sign up
            </button>
          </p>
        </section>
      </div>
    </div>
  );
}

export default SignIn;

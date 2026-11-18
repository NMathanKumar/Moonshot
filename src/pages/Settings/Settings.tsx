import { useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { useAuth } from '@hooks/useAuth';
import { EnrolmentService } from '@services';
import { changePassword } from '@services/auth';
import { useUserProfileContext } from '@context/UserProfileContext';
import type { TestTakerResponse } from '@services/enrolment';
import AppShell from '../../layouts/AppShell';

const tabs = ['Profile', 'Password', 'Notifications', 'Account'] as const;
type Tab = (typeof tabs)[number];

const SUPPORT_EMAIL = 'support@idpenglishtest.com';

const FALLBACK_PROFILE = {
  firstName: '',
  lastName: '',
  email: '',
  dateOfBirth: '',
};

/** Password policy: at least 12 chars, 1 uppercase, 1 lowercase, 1 number */
const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{12,}$/;

function isPasswordValid(password: string): boolean {
  return PASSWORD_REGEX.test(password);
}

/** "1992-05-12" -> "12 May 1992" */
function formatDateOfBirth(value?: string): string | undefined {
  if (!value) return undefined;
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);
  if (!match) return value;
  const [, year, month, day] = match;
  const date = new Date(Date.UTC(Number(year), Number(month) - 1, Number(day)));
  return date.toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    timeZone: 'UTC',
  });
}

function ReadOnlyField({ id, label, value }: { id: string; label: string; value: string }) {
  return (
    <div className="flex flex-col">
      <label
        htmlFor={id}
        className="block text-[11px] font-bold text-[#55657b] uppercase tracking-[0.06em] mb-1.5"
      >
        {label}
      </label>
      <input
        id={id}
        value={value ?? ''}
        type="text"
        readOnly
        disabled
        aria-readonly="true"
        className="w-full px-3.5 py-2.5 rounded-lg border-[1.5px] font-sans text-[13px] outline-none border-[#e0e0e0] bg-[#f5f5f5] text-[#8899aa] cursor-not-allowed"
      />
    </div>
  );
}

function PasswordField({
  id,
  label,
  value,
  onChange,
  autoComplete,
  error,
  helperText,
  onFocus,
}: {
  id: string;
  label: string;
  value: string;
  onChange: (v: string) => void;
  autoComplete: string;
  error?: string;
  helperText?: string;
  onFocus?: () => void;
}) {
  const [show, setShow] = useState(false);
  return (
    <div className="flex flex-col gap-1">
      <label
        htmlFor={id}
        className="block text-[11px] font-bold text-[#55657b] uppercase tracking-[0.06em]"
      >
        {label} <span aria-hidden="true">*</span>
      </label>
      <div className="relative">
        <input
          id={id}
          type={show ? 'text' : 'password'}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={onFocus}
          autoComplete={autoComplete}
          required
          aria-required="true"
          aria-invalid={error ? 'true' : undefined}
          aria-describedby={error ? `${id}-error` : helperText ? `${id}-hint` : undefined}
          className={`w-full px-3.5 py-2.5 pr-10 rounded-lg border-[1.5px] font-sans text-[13px] outline-none bg-white text-[#232d3f] transition-colors ${
            error ? 'border-red-500 focus:border-red-500' : 'border-[#e0e0e0] focus:border-[#EB7900]'
          }`}
        />
        <button
          type="button"
          onClick={() => setShow((s) => !s)}
          aria-label={show ? 'Hide password' : 'Show password'}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-[#55657b] bg-transparent border-none cursor-pointer p-0 text-[11px] font-bold focus:outline-none focus:outline-offset-2 focus:outline-[#EB7900] rounded"
        >
          {show ? 'Hide' : 'Show'}
        </button>
      </div>
      {error && (
        <span id={`${id}-error`} role="alert" className="text-[11px] text-red-600">
          {error}
        </span>
      )}
      {helperText && !error && (
        <p id={`${id}-hint`} className="text-[11px] text-[#55657b]">
          {helperText}
        </p>
      )}
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-white rounded-[16px] border-[1.5px] border-[#e0e0e0] overflow-hidden mb-4">
      <div className="px-6 py-4 border-b-[1.5px] border-[#e0e0e0]">
        <h2 className="text-[15px] font-black text-[#232d3f]">{title}</h2>
      </div>
      <div className="px-6 py-6">{children}</div>
    </div>
  );
}

type PasswordFormStatus = { type: 'error' | 'success'; message: string } | null;

export default function Settings() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, isLoading: authLoading } = useAuth();
  const { profile: userProfile } = useUserProfileContext();
  const [profile, setProfile] = useState<TestTakerResponse | null>(null);

  // Get tab from URL query parameter or default to 'Profile'
  const getTabFromUrl = (): Tab => {
    const params = new URLSearchParams(location.search);
    const tabParam = params.get('tab') as Tab;
    if (tabs.includes(tabParam)) {
      return tabParam;
    }
    return 'Profile';
  };

  // Initialize tab from URL on first render only
  const [tab, setTab] = useState<Tab>(getTabFromUrl);

  // Password form state
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordStatus, setPasswordStatus] = useState<PasswordFormStatus>(null);
  const [passwordSubmitting, setPasswordSubmitting] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const submittingRef = useRef(false);

  // Clear field errors when user starts typing
  const handleCurrentPasswordChange = (value: string) => {
    setCurrentPassword(value);
    if (fieldErrors['current-password']) {
      setFieldErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors['current-password'];
        return newErrors;
      });
    }
    if (passwordStatus) {
      setPasswordStatus(null);
    }
  };

  const handleNewPasswordChange = (value: string) => {
    setNewPassword(value);
    if (fieldErrors['new-password']) {
      setFieldErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors['new-password'];
        return newErrors;
      });
    }
    if (passwordStatus) {
      setPasswordStatus(null);
    }
  };

  const handleConfirmPasswordChange = (value: string) => {
    setConfirmPassword(value);
    if (fieldErrors['confirm-password']) {
      setFieldErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors['confirm-password'];
        return newErrors;
      });
    }
    if (passwordStatus) {
      setPasswordStatus(null);
    }
  };

  // Clear password status messages when user starts typing
  const handlePasswordInputFocus = () => {
    if (passwordStatus) {
      setPasswordStatus(null);
    }
  };

  // Sync tab with URL when tab changes
  useEffect(() => {
    // Update URL to match current tab
    const params = new URLSearchParams(location.search);
    if (params.get('tab') !== tab) {
      params.set('tab', tab);
      navigate({ search: params.toString() }, { replace: true });
    }
  }, [tab, location.search, navigate]);

  useEffect(() => {
    if (!user || authLoading) return;
    let cancelled = false;
    EnrolmentService.getTestTaker()
      .then((result) => {
        if (!cancelled && result) setProfile(result);
      })
      .catch((error: unknown) => {
        console.error('Settings: Failed to load test taker profile:', error);
      });
    return () => {
      cancelled = true;
    };
  }, [user, authLoading]);

  const details = {
    firstName: profile?.givenName || userProfile.firstName,
    lastName: profile?.familyName || userProfile.lastName,
    email: (profile?.contactEmail || userProfile.email) as string,
    dateOfBirth: formatDateOfBirth(profile?.dateOfBirth) || FALLBACK_PROFILE.dateOfBirth,
  };

  function validatePasswordForm(): boolean {
    const errors: Record<string, string> = {};

    // Required field validation
    if (!currentPassword) {
      errors['current-password'] = 'Current password is required.';
    }
    if (!newPassword) {
      errors['new-password'] = 'New password is required.';
    }
    if (!confirmPassword) {
      errors['confirm-password'] = 'Please confirm your new password.';
    }

    // Password policy validation (client-side)
    if (newPassword && !isPasswordValid(newPassword)) {
      errors['new-password'] = 'Password must be at least 12 characters with 1 uppercase, 1 lowercase, and 1 number.';
    }

    // Password match validation
    if (newPassword && confirmPassword && newPassword !== confirmPassword) {
      errors['confirm-password'] = 'Passwords do not match.';
    }

    // Current and new password must be different
    if (currentPassword && newPassword && currentPassword === newPassword) {
      errors['new-password'] = 'New password must be different from your current password.';
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  }

  async function handlePasswordSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (submittingRef.current) return;

    // Validate form before submitting
    if (!validatePasswordForm()) return;

    submittingRef.current = true;
    setPasswordSubmitting(true);
    try {
      await changePassword(currentPassword, newPassword);
      setPasswordStatus({ type: 'success', message: 'Password updated successfully.' });
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setFieldErrors({});
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Password change failed. Please try again.';
      setPasswordStatus({ type: 'error', message });
    } finally {
      setPasswordSubmitting(false);
      submittingRef.current = false;
    }
  }

  return (
    <AppShell>
      <div className="max-w-[760px] mx-auto pb-12 px-4 sm:px-6 md:px-4">
        <div className="mb-7">
          <Link to="/dashboard" className="text-[13px] text-[#55657b] no-underline font-semibold">
            ← Dashboard
          </Link>
          <h1 className="text-[24px] font-black text-[#232d3f] mt-2">Settings</h1>
        </div>

        <div className="flex gap-6 lg:flex-row flex-col">
          {/* Tab sidebar */}
          <div
            className="lg:w-40 flex-shrink-0 flex lg:flex-col gap-0 overflow-x-auto lg:overflow-x-visible w-full"
            role="tablist"
            aria-label="Settings sections"
          >
            {tabs.map((t) => {
              const isActive = tab === t;
              return (
                <button
                  key={t}
                  type="button"
                  role="tab"
                  id={`settings-tab-${t}`}
                  aria-selected={isActive}
                  aria-controls="settings-panel"
                  onClick={() => setTab(t)}
                  className={`block min-w-max lg:w-full text-left px-3.5 py-2.5 rounded-lg border-none cursor-pointer text-[13px] font-bold font-sans transition-all duration-150 mb-0.5 ${
                    isActive
                      ? 'bg-[#fff8f1] text-[#EB7900] border-l-4 border-[#EB7900]'
                      : 'bg-transparent text-[#55657b] border-l-4 border-transparent'
                  }`}
                >
                  {t}
                </button>
              );
            })}
          </div>

          {/* Content */}
          <div
            id="settings-panel"
            role="tabpanel"
            aria-labelledby={`settings-tab-${tab}`}
            className="flex-1 min-w-0"
          >
            {/* ── Profile ── */}
            {tab === 'Profile' && (
              <>
                <Section title="Personal Information">
                  <div className="flex flex-col gap-4">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-3.5">
                      <ReadOnlyField id="first-name" label="First Name" value={details.firstName} />
                      <ReadOnlyField id="last-name" label="Last Name" value={details.lastName} />
                    </div>
                    <ReadOnlyField id="email" label="Email" value={details.email} />
                    <ReadOnlyField id="date-of-birth" label="Date of Birth" value={details.dateOfBirth} />
                  </div>
                </Section>
                <p className="mx-0 my-0 mb-5 text-[12px] text-[#55657b]">
                  To make changes, please contact{' '}
                  <a href={`mailto:${SUPPORT_EMAIL}`} className="text-[#EB7900] font-bold no-underline">
                    {SUPPORT_EMAIL}
                  </a>
                </p>
              </>
            )}

            {/* ── Password ── */}
            {tab === 'Password' && (
              <>
                <Section title="Change Password">
                  <form
                    id="change-password-form"
                    onSubmit={handlePasswordSubmit}
                    noValidate
                    className="flex flex-col gap-3.5"
                  >
                    {passwordStatus && (
                      <div
                        role={passwordStatus.type === 'success' ? 'status' : 'alert'}
                        aria-live="polite"
                        className="p-3 rounded-lg border-l-4 bg-white"
                        style={{
                          backgroundColor: passwordStatus.type === 'success' ? '#e8f5e9' : '#fef2f2',
                          borderColor: passwordStatus.type === 'success' ? '#c8e6c9' : '#fecaca',
                          color: passwordStatus.type === 'success' ? '#2e7d32' : '#dc2626',
                        }}
                      >
                        <p className="text-[13px] leading-relaxed">{passwordStatus.message}</p>
                      </div>
                    )}
                    <PasswordField
                      id="current-password"
                      label="Current Password"
                      value={currentPassword}
                      onChange={handleCurrentPasswordChange}
                      autoComplete="current-password"
                      error={fieldErrors['current-password']}
                      onFocus={handlePasswordInputFocus}
                    />
                    <PasswordField
                      id="new-password"
                      label="New Password"
                      value={newPassword}
                      onChange={handleNewPasswordChange}
                      autoComplete="new-password"
                      error={fieldErrors['new-password']}
                      helperText="Password must be at least 12 characters with 1 uppercase, 1 lowercase, and 1 number"
                      onFocus={handlePasswordInputFocus}
                    />
                    <PasswordField
                      id="confirm-password"
                      label="Confirm New Password"
                      value={confirmPassword}
                      onChange={handleConfirmPasswordChange}
                      autoComplete="new-password"
                      error={fieldErrors['confirm-password']}
                      onFocus={handlePasswordInputFocus}
                    />
                  </form>
                </Section>
                <div className="flex justify-end">
                  <button
                    type="submit"
                    form="change-password-form"
                    disabled={passwordSubmitting}
                    aria-disabled={passwordSubmitting}
                    className="px-5 py-2.5 rounded-lg border-none bg-[#EB7900] text-white text-[13px] font-bold cursor-pointer font-sans hover:opacity-90 transition-opacity disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    {passwordSubmitting ? 'Updating…' : 'Change password'}
                  </button>
                </div>
              </>
            )}

            {/* ── Notifications ── MSP-2713: MVP display-only state */}
            {tab === 'Notifications' && (
              <Section title="Notification preferences">
                {details.email && (
                  <p className="text-[13px] text-[#55657b] mb-4 -mt-2">
                    Emails go to{' '}
                    <span className="font-bold text-[#232d3f]">{details.email}</span>
                  </p>
                )}
                <div className="flex flex-col gap-0">
                  {/* Account and results emails toggle */}
                  <div className="flex items-center justify-between py-4 border-b-[1.5px] border-[#e0e0e0]">
                    <div>
                      <div className="text-[13px] font-bold text-[#232d3f]">Account and results emails</div>
                      <div className="text-[12px] text-[#55657b] mt-0.5">
                        Verification codes, receipts, test reminders, results ready.
                      </div>
                    </div>
                    <button
                      type="button"
                      role="switch"
                      aria-checked={true}
                      aria-label="Account and results emails"
                      className="w-10 h-[22px] rounded-[11px] border-none relative p-0 flex-shrink-0 bg-[#EB7900] transition-colors duration-200 focus:outline-none focus:outline-offset-2 focus:outline-[#EB7900]"
                    >
                      <span className="absolute top-[3px] right-[3px] w-4 h-4 rounded-full bg-white shadow-[0_1px_3px_rgba(0,0,0,0.2)] transition-transform duration-200" />
                    </button>
                  </div>
                  {/* Practice reminders toggle */}
                  <div className="flex items-center justify-between py-4 border-b-[1.5px] border-[#e0e0e0]">
                    <div>
                     <div className="flex items-center gap-2">
  <span className="text-[13px] font-bold text-[#232d3f]">Practice reminders</span>
  <ComingSoonBadge />
</div>
                      <div className="text-[12px] text-[#55657b] mt-0.5">
                        Scheduled practice session reminders.
                      </div>
                    </div>
                    <button
                      type="button"
                      role="switch"
                      aria-checked={false}
                      aria-label="Practice reminders"
                      tabIndex={-1}
                      disabled
                      className="w-10 h-[22px] rounded-[11px] border-none relative p-0 flex-shrink-0 bg-[#e0e0e0] opacity-40 cursor-not-allowed pointer-events-none"
                    >
                      <span className="absolute top-[3px] left-[3px] w-4 h-4 rounded-full bg-white shadow-[0_1px_3px_rgba(0,0,0,0.2)]" />
                    </button>
                  </div>
                  {/* Study tips toggle */}
                  <div className="flex items-center justify-between py-4 border-b-[1.5px] border-[#e0e0e0]">
                    <div>
                      <div className="flex items-center gap-2">
  <span className="text-[13px] font-bold text-[#232d3f]">Study tips</span>
  <ComingSoonBadge />
</div>
                      <div className="text-[12px] text-[#55657b] mt-0.5">
                        Tips to help you prepare for the test.
                      </div>
                    </div>
                    <button
                      type="button"
                      role="switch"
                      aria-checked={false}
                      aria-label="Study tips"
                      tabIndex={-1}
                      disabled
                      className="w-10 h-[22px] rounded-[11px] border-none relative p-0 flex-shrink-0 bg-[#e0e0e0] opacity-40 cursor-not-allowed pointer-events-none"
                    >
                      <span className="absolute top-[3px] left-[3px] w-4 h-4 rounded-full bg-white shadow-[0_1px_3px_rgba(0,0,0,0.2)]" />
                    </button>
                  </div>
                  {/* Platform updates toggle */}
                  <div className="flex items-center justify-between py-4">
                    <div>
                     <div className="flex items-center gap-2">
  <span className="text-[13px] font-bold text-[#232d3f]">Platform updates</span>
  <ComingSoonBadge />
</div>
                      <div className="text-[12px] text-[#55657b] mt-0.5">
                        Important platform news and feature announcements.
                      </div>
                    </div>
                    <button
                      type="button"
                      role="switch"
                      aria-checked={false}
                      aria-label="Platform updates"
                      tabIndex={-1}
                      disabled
                      className="w-10 h-[22px] rounded-[11px] border-none relative p-0 flex-shrink-0 bg-[#e0e0e0] opacity-40 cursor-not-allowed pointer-events-none"
                    >
                      <span className="absolute top-[3px] left-[3px] w-4 h-4 rounded-full bg-white shadow-[0_1px_3px_rgba(0,0,0,0.2)]" />
                    </button>
                  </div>
                </div>
              </Section>
            )}

            {/* ── Account ──
                NOTE: Account deletion UI is present but the button is intentionally
                disabled. No backend deletion endpoint exists yet (MSP-323 pending).
                Deletion must be requested via IDP Admin support. */}
            {tab === 'Account' && (
              <>
                <Section title="Test Access">
                  <div className="flex flex-col gap-3">
                    <div className="px-4 py-3.5 rounded-[10px] bg-[#fff8f1] border-[1.5px] border-[#EB79000025] flex items-center justify-between">
                      <div>
                        <div className="text-[13px] font-bold text-[#232d3f]">
                          Envoy High-Stakes Test
                        </div>
                        <div className="text-[11px] text-[#55657b] mt-0.5">
                          Taken 2 Jul 2026 · Access until 2 Jul 2027
                        </div>
                      </div>
                      <span className="text-[11px] font-bold text-[#2e7d32] bg-[#e8f5e9] px-2.5 py-1 rounded-full whitespace-nowrap">
                        ✓ Completed
                      </span>
                    </div>
                    <Link
                      to="/book"
                      className="block px-4 py-3 rounded-[10px] border-[1.5px] border-dashed border-[#e0e0e0] text-center text-[13px] font-bold text-[#EB7900] no-underline hover:bg-[#fff8f1] transition-colors"
                    >
                      + Purchase another test
                    </Link>
                  </div>
                </Section>
                <Section title="Danger Zone">
                  <div className="px-4 py-3.5 rounded-[10px] bg-[#f5f5f5] border-[1.5px] border-[#e0e0e0]">
                    <div className="text-[13px] font-bold text-[#8899aa] mb-1">Delete account</div>
                    <div className="text-[12px] text-[#8899aa] mb-3">
                      This will permanently delete your account and all associated results and
                      certificates. To delete your account, contact IDP Admin support.
                    </div>
                    <button
                      type="button"
                      disabled
                      aria-disabled="true"
                      className="px-4 py-2 rounded-lg border-[1.5px] border-[#e0e0e0] bg-[#f5f5f5] text-[#8899aa] text-[12px] font-bold cursor-not-allowed font-sans opacity-70"
                    >
                      Delete my account
                    </button>
                  </div>
                </Section>
                <p className="mt-5 text-[12px] text-[#55657b]">
                  To delete your account, please contact{' '}
                  <a href={`mailto:${SUPPORT_EMAIL}`} className="text-[#EB7900] font-bold no-underline">
                    {SUPPORT_EMAIL}
                  </a>
                </p>
              </>
            )}
          </div>
        </div>
      </div>
    </AppShell>
  );
}
function ComingSoonBadge() {
  return (
    <span className="text-[10px] font-bold text-[#55657b] bg-[#ebe9e4] px-2 py-0.5 rounded-full whitespace-nowrap">
      Coming soon
    </span>
  );
}
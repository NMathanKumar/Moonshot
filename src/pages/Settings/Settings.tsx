import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@hooks/useAuth';
import { EnrolmentService } from '@services';
import type { TestTakerResponse } from '@services/enrolment';
import AppShell from '../../layouts/AppShell';

const tabs = ['Profile', 'Password', 'Notifications', 'Account'] as const;
type Tab = (typeof tabs)[number];

const SUPPORT_EMAIL = 'support@idpenglishtest.com';

/** Design fallback values, used until (or if) the real profile is unavailable */
const FALLBACK_PROFILE = {
  firstName: 'Agnes',
  lastName: 'Chen',
  email: 'a.lee@email.com',
  dateOfBirth: '12 May 1992',
  gender: 'Female',
};

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

/** "PREFER_NOT_TO_SAY" -> "Prefer not to say" */
function formatGender(value?: string): string | undefined {
  if (!value) return undefined;
  const text = value.replace(/_/g, ' ').toLowerCase();
  return text.charAt(0).toUpperCase() + text.slice(1);
}

function Field({
  id,
  label,
  value,
  type = 'text',
  disabled = false,
  required = false,
  autoComplete,
}: {
  id: string;
  label: string;
  value: string;
  type?: string;
  disabled?: boolean;
  required?: boolean;
  autoComplete?: string;
}) {
  return (
    <div className="flex flex-col">
      <label
        htmlFor={id}
        className="block text-[11px] font-bold text-[#55657b] uppercase tracking-[0.06em] mb-1.5"
      >
        {label}
        {required && <span aria-hidden="true"> *</span>}
      </label>
      <input
        id={id}
        key={value}
        defaultValue={value}
        type={type}
        disabled={disabled}
        required={required}
        aria-required={required}
        autoComplete={autoComplete}
        className={`w-full px-3.5 py-2.5 rounded-lg border-[1.5px] font-sans text-[13px] outline-none ${
          disabled
            ? 'border-[#e0e0e0] bg-[#f5f5f5] text-[#8899aa] cursor-not-allowed'
            : 'border-[#e0e0e0] bg-white text-[#232d3f]'
        }`}
      />
    </div>
  );
}

function Toggle({
  on,
  onChange,
  label,
}: {
  on: boolean;
  onChange: (v: boolean) => void;
  label: string;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={on}
      aria-label={label}
      onClick={() => onChange(!on)}
      className={`w-10 h-[22px] rounded-[11px] border-none cursor-pointer relative p-0 flex-shrink-0 transition-colors duration-200 ${
        on ? 'bg-[#FF6A00]' : 'bg-[#e0e0e0]'
      }`}
    >
      <span
        className={`absolute top-0.75 w-4 h-4 rounded-full bg-white shadow-[0_1px_3px_rgba(0,0,0,0.2)] transition-all duration-200 ${
          on ? 'left-5.25' : 'left-0.75'
        }`}
      />
    </button>
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

const NOTIFICATION_OPTIONS = [
  { key: 'results' as const, label: 'Results ready', desc: 'When your test results are available' },
  { key: 'practice' as const, label: 'Practice reminders', desc: 'Weekly nudges to keep you on track' },
  { key: 'tips' as const, label: 'Study tips', desc: 'Personalised guidance from Copilot' },
  { key: 'news' as const, label: 'Platform updates', desc: 'News about new features and institutions' },
];

export default function Settings() {
  const { user, isLoading } = useAuth();
  const [tab, setTab] = useState<Tab>('Profile');
  const [notifs, setNotifs] = useState({ results: true, practice: true, news: false, tips: true });
  const [profile, setProfile] = useState<TestTakerResponse | null>(null);

  // Load the real profile; fall back to design values if unavailable
  useEffect(() => {
    if (!user || isLoading) return;
    let cancelled = false;
    EnrolmentService.getTestTaker()
      .then((result) => {
        if (!cancelled && result) setProfile(result);
      })
      .catch((error) => {
        console.error('Settings: Failed to load test taker profile:', error);
      });
    return () => {
      cancelled = true;
    };
  }, [user, isLoading]);

  const email = (user as any)?.signInDetails?.loginId || FALLBACK_PROFILE.email;
  const details = {
    firstName: profile?.givenName || FALLBACK_PROFILE.firstName,
    lastName: profile?.familyName || FALLBACK_PROFILE.lastName,
    email,
    dateOfBirth: formatDateOfBirth(profile?.dateOfBirth) || FALLBACK_PROFILE.dateOfBirth,
    gender: formatGender(profile?.gender) || FALLBACK_PROFILE.gender,
  };
  const displayName = profile?.givenName
    ? [profile.givenName, profile.familyName].filter(Boolean).join(' ')
    : 'Agnes Lee';

  return (
    <AppShell displayName={displayName} email={email}>
      <div className="max-w-[760px] mx-auto pb-12 px-4 sm:px-6 md:px-4">
        <div className="mb-7">
          <Link
            to="/dashboard"
            className="text-[13px] text-[#55657b] no-underline font-semibold"
          >
            ← Dashboard
          </Link>
          <h1 className="text-[24px] font-black text-[#232d3f] mt-2">
            Settings
          </h1>
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
                      ? 'bg-[#fff8f1] text-[#FF6A00] border-l-4 border-[#FF6A00]'
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
            {tab === 'Profile' && (
              <>
                <Section title="Personal Information">
                  <div className="flex flex-col gap-4">
                    <div
                      className="grid grid-cols-1 lg:grid-cols-2 gap-3.5"
                    >
                      <Field id="first-name" label="First Name" value={details.firstName} disabled required />
                      <Field id="last-name" label="Last Name" value={details.lastName} disabled required />
                    </div>
                    <Field id="email" label="Email" value={details.email} type="email" disabled required />
                    <div
                      className="grid grid-cols-1 lg:grid-cols-2 gap-3.5"
                    >
                      <Field id="date-of-birth" label="Date of Birth" value={details.dateOfBirth} disabled required />
                      <Field id="gender" label="Gender" value={details.gender} disabled required />
                    </div>
                  </div>
                </Section>
                <p className="mx-0 my-0 mb-5 text-[12px] text-[#55657b]">
                  To make changes, please contact{' '}
                  <a href={`mailto:${SUPPORT_EMAIL}`} className="text-[#FF6A00] font-bold no-underline">
                    {SUPPORT_EMAIL}
                  </a>
                </p>
              </>
            )}

            {tab === 'Password' && (
              <>
                <Section title="Change Password">
                  <div className="flex flex-col gap-3.5">
                    <Field id="current-password" label="Current Password" value="" type="password" autoComplete="current-password" />
                    <Field id="new-password" label="New Password" value="" type="password" autoComplete="new-password" />
                    <Field id="confirm-password" label="Confirm New Password" value="" type="password" autoComplete="new-password" />
                  </div>
                </Section>
                <div className="flex justify-end">
                  <button
                    type="button"
                    className="px-5 py-2.5 rounded-lg border-none bg-[#FF6A00] text-white text-[13px] font-bold cursor-pointer font-sans hover:opacity-90 transition-opacity"
                  >
                    Change password
                  </button>
                </div>
              </>
            )}

            {tab === 'Notifications' && (
              <Section title="Notification Preferences">
                <div className="flex flex-col gap-0">
                  {NOTIFICATION_OPTIONS.map(({ key, label, desc }) => (
                    <div
                      key={key}
                      className="flex items-center justify-between py-4 border-b-[1.5px] border-[#e0e0e0]"
                    >
                      <div>
                        <div className="text-[13px] font-bold text-[#232d3f]">
                          {label}
                        </div>
                        <div className="text-[12px] text-[#55657b] mt-0.5">
                          {desc}
                        </div>
                      </div>
                      <Toggle
                        label={label}
                        on={notifs[key]}
                        onChange={(v) => setNotifs((p) => ({ ...p, [key]: v }))}
                      />
                    </div>
                  ))}
                </div>
              </Section>
            )}

            {tab === 'Account' && (
              <>
                <Section title="Test Access">
                  <div className="flex flex-col gap-3">
                    <div
                      className="px-4 py-3.5 rounded-[10px] bg-[#fff8f1] border-[1.5px] border-[#FF6A0025] flex items-center justify-between"
                    >
                      <div>
                        <div className="text-[13px] font-bold text-[#232d3f]">
                          Envoy High-Stakes Test
                        </div>
                        <div className="text-[11px] text-[#55657b] mt-0.5">
                          Taken 2 Jul 2026 · Access until 2 Jul 2027
                        </div>
                      </div>
                      <span
                        className="text-[11px] font-bold text-[#2e7d32] bg-[#e8f5e9] px-2.5 py-1 rounded-full whitespace-nowrap"
                      >
                        ✓ Completed
                      </span>
                    </div>
                    <Link
                      to="/book"
                      className="block px-4 py-3 rounded-[10px] border-[1.5px] border-dashed border-[#e0e0e0] text-center text-[13px] font-bold text-[#FF6A00] no-underline hover:bg-[#fff8f1] transition-colors"
                    >
                      + Purchase another test
                    </Link>
                  </div>
                </Section>
                <Section title="Danger Zone">
                  <div
                    className="px-4 py-3.5 rounded-[10px] bg-[#f5f5f5] border-[1.5px] border-[#e0e0e0]"
                  >
                    <div
                      className="text-[13px] font-bold text-[#8899aa] mb-1"
                    >
                      Delete account
                    </div>
                    <div
                      className="text-[12px] text-[#8899aa] mb-3"
                    >
                      This will permanently delete your account and all associated results and
                      certificates.
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
                  <a href={`mailto:${SUPPORT_EMAIL}`} className="text-[#FF6A00] font-bold no-underline">
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

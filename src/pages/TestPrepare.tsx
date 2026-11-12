import { useState } from 'react';
import { Link } from 'react-router-dom';
import AppIcon from '@components/AppIcon';
import { useAuth } from '@hooks/useAuth';
import AppShell from '../layouts/AppShell';

type CheckStatus = 'ok' | 'warn' | 'pending';

const checklist: { id: string; label: string; detail: string; status: CheckStatus }[] = [
  { id: 'browser', label: 'Browser & permissions', detail: 'Chrome or Edge recommended. Microphone and camera access required.', status: 'ok' },
  { id: 'audio', label: 'Audio playback', detail: 'Play test sound to confirm you can hear the listening passages.', status: 'ok' },
  { id: 'mic', label: 'Microphone', detail: "Speak clearly into your microphone. We detected input — you're ready.", status: 'ok' },
  { id: 'internet', label: 'Stable internet connection', detail: 'Your connection speed is sufficient for the test.', status: 'ok' },
  { id: 'camera', label: 'Camera (proctoring)', detail: 'Ensure your face is well-lit and centred in the frame.', status: 'warn' },
  { id: 'noise', label: 'Quiet environment', detail: 'Find a quiet place. Background noise can affect your speaking score.', status: 'pending' },
];

const ENVIRONMENT_REMINDERS = [
  'You have your identity document on your desk',
  "You're in a quiet, private room with no interruptions",
  'Your desk is clear — no notes, phones, or other devices',
  'You have a stable internet connection for the full ~80 minutes',
];

// Status color and styling maps (using CSS variables)
const statusConfig = {
  ok: { color: 'var(--color-success)', bg: 'bg-green-100', border: 'border-green-300', borderLight: '#2e7d3230', label: 'Ready', symbol: '✓' },
  warn: { color: 'var(--color-warning)', bg: 'bg-yellow-50', border: 'border-yellow-300', borderLight: '#f9a82530', label: 'Warning', symbol: '!' },
  pending: { color: '#bdbdbd', bg: 'bg-gray-100', border: 'border-gray-300', borderLight: '#bdbdbd30', label: 'Not checked', symbol: '·' },
};

export default function TestPrepare() {
  const { user } = useAuth();
  const [agreedEnv, setAgreedEnv] = useState(false);
  const [agreedOnce, setAgreedOnce] = useState(false);
  const [playedAudio, setPlayedAudio] = useState(false);

  const allReady = agreedEnv && agreedOnce;

  const displayName = (user as any)?.given_name || 'Agnes Lee';
  const email = (user as any)?.signInDetails?.loginId || 'a.lee@email.com';

  return (
    <AppShell displayName={displayName} email={email}>
      <div className="mx-auto w-full max-w-[760px] pb-12 md:pb-12">
        {/* Back link */}
        <Link
          to="/practice"
          className="mb-6 block text-xs font-semibold no-underline text-[var(--color-slate)] md:mb-6"
        >
          ← Back to practice
        </Link>

        {/* Hero section */}
        <div className="mb-9 text-center md:mb-9">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-[var(--color-brand-orange)]">
            <AppIcon name="sparkle" size={25} />
          </div>
          <h1 className="mb-2 text-2xl font-black text-[var(--color-ink)] md:text-2xl">
            Before you start
          </h1>
          <p className="mx-auto max-w-[480px] text-sm text-[var(--color-slate)] md:text-sm">
            Review requirements, policies, and tips before your test. Make sure your device and
            connection are ready.
          </p>
        </div>

        {/* System check card */}
        <div className="mb-5 rounded-2xl border border-[color:var(--color-border)] bg-white p-7 md:p-7">
          <div className="mb-5 flex items-center justify-between">
            <h2 className="text-base font-black text-[var(--color-ink)] md:text-base">
              System &amp; equipment check
            </h2>
            <button
              type="button"
              className="rounded-lg border border-opacity-20 border-[color:var(--color-brand-orange)] bg-[var(--color-cream)] px-3.5 py-1.5 text-xs font-bold text-[var(--color-brand-orange)] hover:opacity-80"
            >
              Re-run all checks
            </button>
          </div>
          <ul className="flex flex-col gap-2.5">
            {checklist.map((item) => {
              const config = statusConfig[item.status];
              return (
                <li
                  key={item.id}
                  className={`flex flex-start gap-3.5 rounded-lg border border-opacity-20 p-4 ${config.bg}`}
                  style={{ borderColor: config.color }}
                >
                  <div
                    aria-hidden="true"
                    className="mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full text-xs font-black text-white"
                    style={{ backgroundColor: config.color }}
                  >
                    {config.symbol}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-bold text-[#232d3f]">
                        {item.label}
                      </span>
                      <span className="text-xs font-bold" style={{ color: config.color }}>
                        {config.label}
                      </span>
                    </div>
                    <p className="mt-0.75 text-xs leading-relaxed text-[var(--color-slate)]">
                      {item.detail}
                    </p>
                  </div>
                </li>
              );
            })}
          </ul>

          <button
            type="button"
            onClick={() => setPlayedAudio(true)}
            className={`mt-3.5 w-full rounded-lg border border-[1.5px] px-3 py-2.75 text-sm font-bold transition-colors ${
              playedAudio
                ? 'border-gray-300 bg-green-100 text-green-700'
                : 'border-[color:var(--color-border)] bg-[var(--color-muted)] text-[var(--color-slate)] font-bold'
            }`}
          >
            {playedAudio ? (
              '✓ Audio confirmed'
            ) : (
              <span className="flex items-center justify-center gap-2">
                <AppIcon name="headphones" size={16} />
                Play test sound — Click to play listening passage
              </span>
            )}
          </button>
        </div>

        {/* Environment reminders card */}
        <div className="mb-5 rounded-2xl border border-[color:var(--color-border)] bg-white p-7 md:p-7">
          <h2 className="mb-1 text-base font-black text-[var(--color-ink)] md:text-base">
            Environment reminders
          </h2>
          <p className="mb-4 text-xs font-normal text-[var(--color-slate)] md:text-xs">
            Confirm these conditions before your test:
          </p>
          <div className="mb-5 flex flex-col gap-2">
            {ENVIRONMENT_REMINDERS.map((r) => (
              <label
                key={r}
                className="flex cursor-pointer items-start gap-3 rounded-lg bg-[var(--color-muted)] px-3.5 py-2.5 text-xs text-[var(--color-slate)]"
              >
                <input
                  type="checkbox"
                  className="mt-0.5 h-4 w-4 flex-shrink-0 cursor-pointer accent-[var(--color-brand-orange)]"
                />
                {r}
              </label>
            ))}
          </div>
          <div className="rounded-lg border border-yellow-400 bg-yellow-50 px-4 py-3.5 text-xs leading-relaxed text-yellow-900">
            <strong>You can only take this test once.</strong> Once submitted, you cannot return to
            your answers. Make sure you're fully prepared before starting.
          </div>
        </div>

        {/* Consent card */}
        <div className="mb-6 rounded-2xl border border-[color:var(--color-border)] bg-white p-7 md:p-7">
          <div className="flex flex-col gap-3">
            <label className="flex cursor-pointer items-start gap-3">
              <input
                type="checkbox"
                checked={agreedEnv}
                onChange={(e) => setAgreedEnv(e.target.checked)}
                className="mt-0.5 h-4 w-4 flex-shrink-0 cursor-pointer accent-[var(--color-brand-orange)]"
              />
              <span className="text-xs leading-relaxed text-[var(--color-slate)]">
                I confirm my environment is ready and I meet the conditions above
              </span>
            </label>
            <label className="flex cursor-pointer items-start gap-3">
              <input
                type="checkbox"
                checked={agreedOnce}
                onChange={(e) => setAgreedOnce(e.target.checked)}
                className="mt-0.5 h-4 w-4 flex-shrink-0 cursor-pointer accent-[var(--color-brand-orange)]"
              />
              <span className="text-xs leading-relaxed text-[var(--color-slate)]">
                I understand this is a <strong>one-time test</strong> and I cannot retake it after
                submission
              </span>
            </label>
          </div>
        </div>

        {/* Action buttons */}
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-2">
          <Link
            to="/practice"
            className="flex items-center justify-center rounded-lg border border-[color:var(--color-border)] bg-white px-3.5 py-3.5 text-center text-sm font-bold no-underline text-[var(--color-ink)] transition-colors hover:bg-gray-50"
          >
            Back to practice
          </Link>
          <button
            type="button"
            disabled={!allReady}
            className={`rounded-lg border-0 px-3.5 py-3.5 text-sm font-black transition-all ${
              allReady
                ? 'cursor-pointer bg-[var(--color-brand-orange)] text-white hover:shadow-lg'
                : 'cursor-not-allowed bg-[#d1d5db] text-gray-500'
            }`}
          >
            {allReady ? 'Start test →' : 'Complete checklist to start'}
          </button>
        </div>
      </div>
    </AppShell>
  );
}

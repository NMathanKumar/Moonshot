import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '@hooks/useAuth';
import { useEffect, useState } from 'react';
import { isCheckInComplete } from '@utils/checkIn';
import { EnrolmentService } from '@services';
import type { TestTakerResponse } from '@services/enrolment';
import AppIcon, { type AppIconName } from '@components/AppIcon';
import AppShell from '../layouts/AppShell';

const SKILL_SCORES = [
  { skill: 'Listening', score: 64, cefr: 'B2' },
  { skill: 'Reading', score: 86, cefr: 'C1' },
  { skill: 'Speaking', score: 72, cefr: 'B2' },
  { skill: 'Writing', score: 74, cefr: 'B2' },
];

const NEXT_STEPS: { icon: AppIconName; label: string; sub: string; to: string }[] = [
  { icon: 'download', label: 'Download official certificate', sub: 'PDF · ready now', to: '/results' },
  { icon: 'edit', label: 'Request Score Review', sub: 'Submit a score review', to: '/results' },
  { icon: 'target', label: 'Practice to improve', sub: 'Free sessions available', to: '/practice' },
  { icon: 'institution', label: 'Search accepting institutions', sub: '2,000+ worldwide', to: '/book' },
];

export default function Dashboard() {
  const { user, isLoading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const completionState = (location.state as { checkInComplete?: boolean } | null)
    ?.checkInComplete;
  const [checkInComplete] = useState(() => Boolean(completionState) || isCheckInComplete());
  const [profile, setProfile] = useState<TestTakerResponse | null>(null);
  const [_profileLoading, _setProfileLoading] = useState(false);
  const [_profileError, _setProfileError] = useState<string | null>(null);

  useEffect(() => {
    if (!isLoading && !user) {
      navigate('/signin', { replace: true });
    }
  }, [user, isLoading, navigate]);

  useEffect(() => {
    const loadProfile = async () => {
      if (!user || isLoading) {
        return;
      }

      _setProfileLoading(true);
      _setProfileError(null);

      try {
        const testTakerProfile = await EnrolmentService.getTestTaker();

        if (testTakerProfile) {
          setProfile(testTakerProfile);
        } else {
          setProfile(null);
        }
      } catch (error) {
        console.error('Dashboard: Failed to load test taker profile:', error);
        _setProfileError(error instanceof Error ? error.message : 'Failed to load profile');
      } finally {
        _setProfileLoading(false);
      }
    };

    loadProfile();
  }, [user, isLoading]);

  // Show loading state while AuthProvider initializes
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <div className="inline-flex items-center justify-center">
            <div className="w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
          <p className="mt-4 text-gray-600 font-medium">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  // Don't render if no user (will redirect via effect)
  if (!user) {
    return null;
  }

  // Extract first name from user object
  const firstName = profile?.givenName || (user as any)?.given_name || 'Agnes';
  const fullName = [firstName, profile?.familyName].filter(Boolean).join(' ') || firstName;
  const email = (user as any)?.email || (user as any)?.signInDetails?.loginId || 'a.lee@email.com';

  return (
    <AppShell displayName={fullName} email={email}>
      <div className="max-w-[900px] mx-auto pb-12">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-[26px] font-black text-[#232d3f] mb-1 leading-tight">
            Welcome back, {firstName}
          </h1>
          <p className="text-[14px] text-[#55657b] m-0">
            Here's an overview of your IDP English Test journey.
          </p>
        </div>

        {/* Purchased Tests Section */}
        <div className="flex flex-col gap-3 mb-5">
          {/* State 1: Not taken, window open */}
          <div className="bg-white rounded-2xl border-2 border-[#FF6A0030] p-5 md:p-7 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 md:gap-6">
            <div className="flex items-start gap-4 flex-1 w-full">
              <div className="w-11 h-11 rounded-xl bg-[#fff3ea] border border-[#FF6A0030] flex items-center justify-center flex-shrink-0 text-[#232d3f]">
                <AppIcon name="ticket" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2 mb-0.5">
                  <span className="text-[15px] font-black text-[#232d3f]">IDP English Test</span>
                  <span className="text-[10px] font-bold px-2 rounded-full bg-[#fff8e1] text-[#f9a825] border border-[#ffd54f] w-fit">
                    TEST NOT TAKEN
                  </span>
                </div>
                <p className="text-[12px] text-[#55657b] mb-1.5">Purchased Sep 24, 2026 · ONE TIME TEST · UP TO 80 MINS</p>
                <span className="inline-flex items-center gap-1.25 text-[11px] font-semibold text-[#e65100] bg-[#fff3ea] border border-[#FF6A0040] px-2.5 py-0.75 rounded-full">
                  <AppIcon name="award" size={14} /> Take within 21 days of enrolment · 17 days
                  left (by Oct 15, 2026)
                </span>
                <div className={`flex flex-col sm:flex-row sm:items-center gap-1.5 w-fit mt-2 px-2.25 py-1.5 rounded-lg border border-[#c9e2fa] text-[11px] font-bold ${
                  checkInComplete
                    ? 'bg-[#e8f5e9] text-[#2e7d32]'
                    : 'bg-[#eaf4ff] text-[#0b5ead]'
                }`}>
                  <AppIcon name={checkInComplete ? 'identification' : 'user'} size={15} />
                  <span>
                    {checkInComplete
                      ? 'Check-in completed — you can now start your test.'
                      : 'Check-in is required before you can start this test.'}
                  </span>
                </div>
              </div>
            </div>
            {checkInComplete ? (
              <Link
                className="w-full sm:w-auto px-6 py-2.5 rounded-2xl bg-[#eb7900] text-white text-[13px] font-black no-underline whitespace-nowrap flex-shrink-0 text-center"
                to="/test-prepare"
              >
                Start test →
              </Link>
            ) : (
              <Link
                className="w-full sm:w-auto px-6 py-2.5 rounded-2xl bg-[#eb7900] text-white text-[13px] font-black no-underline whitespace-nowrap flex-shrink-0 text-center"
                to="/check-in/about"
              >
                Check-in →
              </Link>
            )}
          </div>

          {/* State 2: Not taken, window closed */}
          <div className="bg-white rounded-2xl border-2 border-[#e0e0e0] p-5 md:p-7 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 md:gap-6">
            <div className="flex items-start gap-4 flex-1 w-full">
              <div className="w-11 h-11 rounded-xl bg-[#f5f5f5] border border-[#e0e0e0] flex items-center justify-center flex-shrink-0 text-[#232d3f]">
                <AppIcon name="ticket" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2 mb-0.5">
                  <span className="text-[15px] font-black text-[#232d3f]">IDP English Test</span>
                  <span className="text-[10px] font-bold px-2 rounded-full bg-[#fff8e1] text-[#f9a825] border border-[#ffd54f] w-fit">
                    TEST NOT TAKEN
                  </span>
                </div>
                <p className="text-[12px] text-[#55657b] mb-1.5">Purchased 5 Aug 2026 · ONE TIME TEST · UP TO 80 MINS</p>
                <span className="inline-flex flex-wrap items-center gap-1.25 text-[11px] font-semibold text-[#c62828] bg-[#fce4ec] border border-[#ef9a9a] px-2.5 py-0.75 rounded-full w-fit">
                  <AppIcon name="clock" size={14} /> Test window closed — was due by Aug 26, 2026
                </span>
              </div>
            </div>
            <button
              className="w-full sm:w-auto px-6 py-2.5 rounded-2xl bg-[#eb7900] text-white text-[13px] font-black no-underline whitespace-nowrap flex-shrink-0 text-center opacity-40 cursor-not-allowed disabled:opacity-40 disabled:cursor-not-allowed"
              disabled
            >
              Start test →
            </button>
          </div>

          {/* State 3: Enrolment in progress */}
          <div className="bg-white rounded-2xl border-2 border-[#e0e0e0] p-5 md:p-7 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 md:gap-6">
            <div className="flex items-start gap-4 flex-1 w-full">
              <div className="w-11 h-11 rounded-xl bg-[#f5f5f5] border border-[#e0e0e0] flex items-center justify-center flex-shrink-0 text-[#232d3f]">
                <AppIcon name="ticket" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2 mb-0.5">
                  <span className="text-[15px] font-black text-[#232d3f]">IDP English Test</span>
                  <span className="text-[10px] font-bold px-2 rounded-full bg-[#e3f2fd] text-[#1565c0] border border-[#90caf9] w-fit">
                    ENROLMENT IN PROGRESS
                  </span>
                </div>
                <p className="text-[12px] text-[#55657b]">
                  Purchased 4 Aug 2026 · ONE TIME TEST · UP TO 80 MINS
                </p>
              </div>
            </div>
            <Link
              className="w-full sm:w-auto px-6 py-2.5 rounded-2xl bg-[#eb7900] text-white text-[13px] font-black no-underline whitespace-nowrap flex-shrink-0 text-center"
              to="/book"
            >
              Make payment →
            </Link>
          </div>
        </div>

        {/* Overall Score Card */}
        <div className="mb-5">
          <div className="bg-[#fff3ea] rounded-2xl px-5 md:px-8 py-5 md:py-7 text-[#232d3f] relative overflow-hidden border border-[#FFC89F] shadow-[0_1px_2px_rgba(35,45,63,0.04),0_8px_24px_rgba(35,45,63,0.06)]">
            <div className="relative">
              <p className="text-[13px] font-black text-[#232d3f] uppercase tracking-[0.08em] mb-3">
                Overall Score · Latest test
              </p>
              <div className="flex flex-col md:flex-row items-start md:items-flex-end justify-between gap-4 md:gap-6 mb-6">
                <div className="w-full md:w-auto">
                  <div className="flex items-end gap-2 md:gap-3 mb-3">
                    <span className="text-5xl sm:text-6xl md:text-[64px] font-black leading-none text-[#ff8300]">
                      78
                    </span>
                    <span className="text-lg md:text-[20px] font-semibold text-[#55657b] pb-1 md:pb-2">
                      /120
                    </span>
                  </div>
                  <p className="text-[14px] font-medium text-[#44546a] m-0">
                    Test taken 2 Jul 2026
                  </p>
                </div>
                <div className="flex flex-col items-start md:items-end gap-2 md:gap-2 md:text-right w-full md:w-auto">
                  <span className="text-3xl md:text-[24px] font-black text-[#232d3f]">B2</span>
                  <p className="text-[14px] font-semibold text-[#44546a] m-0">Upper Intermediate</p>
                </div>
              </div>

              {/* Skill Cards Grid */}
              <div className="grid gap-2 md:gap-3 grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 md:grid-cols-4 mb-6">
                {SKILL_SCORES.map((s) => (
                  <article
                    className="min-w-0 p-3 md:p-3.5 border border-[#ffc89f] rounded-md bg-white shadow-[0_3px_10px_rgba(35,45,63,0.05)]"
                    key={s.skill}
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 sm:gap-2 mb-2 md:mb-3.5">
                      <span className="text-[13px] font-black text-[#232d3f] truncate">{s.skill}</span>
                      <span className="text-[11px] font-black px-1.75 rounded-full text-[#eb7900] border border-[#ffc89f] w-fit">
                        {s.cefr}
                      </span>
                    </div>
                    <div className="flex items-baseline gap-0.75">
                      <strong className="text-3xl md:text-[30px] font-black text-[#ff8300] leading-none">
                        {s.score}
                      </strong>
                      <span className="text-[11px] font-semibold text-[#55657b]">/120</span>
                    </div>
                  </article>
                ))}
              </div>

              <Link
                to="/results"
                className="inline-block text-[14px] font-black text-[#ff6a00] no-underline bg-white px-4 md:px-[18px] py-2 rounded-lg border border-[#FFC89F]"
              >
                View full results →
              </Link>
            </div>
          </div>
        </div>

        {/* What's Next Section */}
        <div className="bg-white rounded-2xl px-7 py-6 border border-[#dde2e7]">
          <h2 className="text-[16px] font-black text-[#232d3f] mb-4 leading-tight">
            What's next?
          </h2>
          <div className="flex flex-col gap-3">
            {NEXT_STEPS.map((item) => (
              <Link
                key={item.label}
                to={item.to}
                className="flex items-center gap-3 px-3.5 py-3 rounded-2xl bg-[#f5f5f5] no-underline border border-transparent transition-all duration-150 hover:border-[#FF6A0040] hover:bg-[#fff3ea]"
              >
                <span className="inline-flex items-center justify-center w-8.5 h-8.5 flex-shrink-0 rounded-lg bg-white text-[#ff6a00] shadow-[0_1px_4px_rgba(35,45,63,0.08)]">
                  <AppIcon name={item.icon} size={19} />
                </span>
                <div className="flex-1">
                  <div className="text-[13px] font-bold text-[#232d3f]">
                    {item.label}
                  </div>
                  <div className="text-[11px] text-[#55657b]">{item.sub}</div>
                </div>
                <span className="text-[14px] text-[#55657b] flex-shrink-0">
                  ›
                </span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </AppShell>
  );
}

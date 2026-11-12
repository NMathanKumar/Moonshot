import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '@hooks/useAuth';
import { useEffect, useState } from 'react';
import { isCheckInComplete } from '@utils/checkIn';
import { EnrolmentService } from '@services';
import type { TestTakerResponse } from '@services/enrolment';
import AppIcon, { type AppIconName } from '@components/AppIcon';
import AppShell from '../../layouts/AppShell';

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

const actionButtonStyle: React.CSSProperties = {
  padding: '11px 24px',
  borderRadius: 10,
  border: 'none',
  background: 'var(--color-action-primary)',
  color: 'white',
  fontSize: 13,
  fontWeight: 800,
  textDecoration: 'none',
  whiteSpace: 'nowrap',
  flexShrink: 0,
  minWidth: 148,
  textAlign: 'center',
};

const iconBoxStyle = (active: boolean): React.CSSProperties => ({
  width: 44,
  height: 44,
  borderRadius: 12,
  background: active ? 'var(--color-cream)' : '#f5f5f5',
  border: `1.5px solid ${active ? '#FF6A0030' : '#e0e0e0'}`,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  flexShrink: 0,
  color: 'var(--color-ink)',
});

const cardStyle = (borderColor: string): React.CSSProperties => ({
  background: 'white',
  borderRadius: 16,
  border: `2px solid ${borderColor}`,
  padding: '22px 28px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: 24,
});

const titleStyle: React.CSSProperties = {
  fontSize: 15,
  fontWeight: 800,
  color: 'var(--color-ink)',
};

const statusBadgeStyle = (bg: string, color: string, border: string): React.CSSProperties => ({
  fontSize: 10,
  fontWeight: 700,
  padding: '2px 8px',
  borderRadius: 20,
  background: bg,
  color,
  border: `1px solid ${border}`,
});

const metaStyle: React.CSSProperties = {
  fontSize: 12,
  color: 'var(--color-slate)',
  marginBottom: 6,
};

const pillStyle = (color: string, bg: string, border: string): React.CSSProperties => ({
  display: 'inline-flex',
  alignItems: 'center',
  gap: 5,
  fontSize: 11,
  fontWeight: 600,
  color,
  background: bg,
  border: `1px solid ${border}`,
  padding: '3px 10px',
  borderRadius: 20,
});

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
    // Redirect if authentication loading is complete and no user found
    // This handles session expiry or invalid tokens
    if (!isLoading && !user) {
      console.log('Dashboard: Auth complete, no user found - redirecting to signin');
      navigate('/signin', { replace: true });
    }
  }, [user, isLoading, navigate]);

  // Load test taker profile from Enrolment Service after user is authenticated
  useEffect(() => {
    const loadProfile = async () => {
      if (!user || isLoading) {
        return;
      }

      _setProfileLoading(true);
      _setProfileError(null);

      try {
        console.log('Dashboard: Fetching test taker profile from Enrolment Service');
        const testTakerProfile = await EnrolmentService.getTestTaker();

        if (testTakerProfile) {
          console.log('Dashboard: Test taker profile loaded:', testTakerProfile);
          setProfile(testTakerProfile);
        } else {
          // Profile may not exist yet (e.g., sign-up confirmation failed)
          console.log('Dashboard: No test taker profile found');
          setProfile(null);
        }
      } catch (error) {
        // Log error but don't block dashboard rendering
        // User can continue using the app even if profile fetch fails
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

  // Extract first name from user object (Cognito stores it as 'given_name') or profile
  const firstName = profile?.givenName || (user as any)?.given_name || 'Agnes';
  const fullName = [firstName, profile?.familyName].filter(Boolean).join(' ') || firstName;
  const email = (user as any)?.email || (user as any)?.signInDetails?.loginId || 'a.lee@email.com';

  return (
    <AppShell displayName={fullName} email={email}>
      <div style={{ maxWidth: 900, margin: '0 auto', paddingBottom: 48 }}>
        {/* Welcome */}
        <div style={{ marginBottom: 32 }}>
          <h1
            style={{
              fontSize: 26,
              fontWeight: 800,
              color: 'var(--color-ink)',
              marginBottom: 4,
              lineHeight: 1.2,
            }}
          >
            Welcome back, {firstName}
          </h1>
          <p style={{ fontSize: 14, color: 'var(--color-slate)', marginBottom: 0 }}>
            Here's an overview of your IDP English Test journey.
          </p>
        </div>

        {/* Purchased tests */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 20 }}>
          {/* State 1: Not taken, window open */}
          <div className="ds-action-card" style={cardStyle('#FF6A0030')}>
            <div className="flex items-center gap-4">
              <div style={iconBoxStyle(true)}>
                <AppIcon name="ticket" />
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span style={titleStyle}>IDP English Test</span>
                  <span style={statusBadgeStyle('#fff8e1', '#f9a825', '#ffd54f')}>
                    TEST NOT TAKEN
                  </span>
                </div>
                <p style={metaStyle}>Purchased Sep 24, 2026 · ONE TIME TEST · UP TO 80 MINS</p>
                <span style={pillStyle('#e65100', 'var(--color-cream)', '#FF6A0040')}>
                  <AppIcon name="award" size={14} /> Take within 21 days of enrolment · 17 days
                  left (by Oct 15, 2026)
                </span>
                <div className={`test-checkin-message${checkInComplete ? ' complete' : ''}`}>
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
                className="dashboard-action-button"
                to="/test-prepare"
                style={actionButtonStyle}
              >
                Start test →
              </Link>
            ) : (
              <Link
                className="dashboard-action-button"
                to="/check-in/about"
                style={actionButtonStyle}
              >
                Check-in →
              </Link>
            )}
          </div>

          {/* State 2: Not taken, window closed */}
          <div className="ds-action-card" style={cardStyle('#e0e0e0')}>
            <div className="flex items-center gap-4">
              <div style={iconBoxStyle(false)}>
                <AppIcon name="ticket" />
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span style={titleStyle}>IDP English Test</span>
                  <span style={statusBadgeStyle('#fff8e1', '#f9a825', '#ffd54f')}>
                    TEST NOT TAKEN
                  </span>
                </div>
                <p style={metaStyle}>Purchased 5 Aug 2026 · ONE TIME TEST · UP TO 80 MINS</p>
                <span style={pillStyle('#c62828', '#fce4ec', '#ef9a9a')}>
                  <AppIcon name="clock" size={14} /> Test window closed — was due by Aug 26, 2026
                </span>
              </div>
            </div>
            <button
              className="dashboard-action-button"
              disabled
              style={{ ...actionButtonStyle, opacity: 0.4, cursor: 'not-allowed' }}
            >
              Start test →
            </button>
          </div>

          {/* State 3: Enrolment in progress */}
          <div className="ds-action-card" style={cardStyle('#e0e0e0')}>
            <div className="flex items-center gap-4">
              <div style={iconBoxStyle(false)}>
                <AppIcon name="ticket" />
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span style={titleStyle}>IDP English Test</span>
                  <span style={statusBadgeStyle('#e3f2fd', '#1565c0', '#90caf9')}>
                    ENROLMENT IN PROGRESS
                  </span>
                </div>
                <p style={{ ...metaStyle, marginBottom: 0 }}>
                  Purchased 4 Aug 2026 · ONE TIME TEST · UP TO 80 MINS
                </p>
              </div>
            </div>
            <Link className="dashboard-action-button" to="/book" style={actionButtonStyle}>
              Make payment →
            </Link>
          </div>
        </div>

        {/* Overall score card */}
        <div style={{ marginBottom: 20 }}>
          <div
            style={{
              background: 'var(--color-cream)',
              borderRadius: 16,
              padding: '28px 32px',
              color: 'var(--color-ink)',
              position: 'relative',
              overflow: 'hidden',
              border: '1.5px solid #FFC89F',
              boxShadow: 'var(--shadow-card)',
            }}
          >
            <div style={{ position: 'relative' }}>
              <p
                style={{
                  fontSize: 13,
                  fontWeight: 800,
                  color: 'var(--color-ink)',
                  textTransform: 'uppercase',
                  letterSpacing: '0.08em',
                  marginBottom: 12,
                }}
              >
                Overall Score · Latest test
              </p>
              <div className="dashboard-overall-summary">
                <div>
                  <div className="flex items-end gap-3 mb-3">
                    <span
                      style={{
                        fontSize: 64,
                        fontWeight: 900,
                        lineHeight: 1,
                        color: 'var(--color-score-highlight)',
                      }}
                    >
                      78
                    </span>
                    <span
                      style={{
                        fontSize: 20,
                        fontWeight: 600,
                        color: 'var(--color-slate)',
                        paddingBottom: 8,
                      }}
                    >
                      /120
                    </span>
                  </div>
                  <p style={{ fontSize: 14, fontWeight: 500, color: '#44546A', marginBottom: 0 }}>
                    Test taken 2 Jul 2026
                  </p>
                </div>
                <div className="dashboard-overall-level">
                  <span>B2</span>
                  <p>Upper Intermediate</p>
                </div>
              </div>

              <div className="dashboard-skill-cards">
                {SKILL_SCORES.map((s) => (
                  <article className="dashboard-skill-card" key={s.skill}>
                    <div className="dashboard-skill-card-header">
                      <span>{s.skill}</span>
                      <span>{s.cefr}</span>
                    </div>
                    <div className="dashboard-skill-value">
                      <strong>{s.score}</strong>
                      <span>/120</span>
                    </div>
                  </article>
                ))}
              </div>

              <Link
                to="/results"
                style={{
                  display: 'inline-block',
                  fontSize: 14,
                  fontWeight: 800,
                  color: 'var(--color-brand-orange)',
                  textDecoration: 'none',
                  background: 'white',
                  padding: '8px 18px',
                  borderRadius: 8,
                  border: '1.5px solid #FFC89F',
                }}
              >
                View full results →
              </Link>
            </div>
          </div>
        </div>

        {/* What's next */}
        <div
          style={{
            background: 'white',
            borderRadius: 16,
            padding: '24px 28px',
            border: '1.5px solid var(--border)',
          }}
        >
          <h2
            style={{
              fontSize: 16,
              fontWeight: 800,
              color: 'var(--color-ink)',
              marginBottom: 16,
              lineHeight: 1.2,
            }}
          >
            What's next?
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {NEXT_STEPS.map((item) => (
              <Link
                key={item.label}
                to={item.to}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 12,
                  padding: '12px 14px',
                  borderRadius: 10,
                  background: 'var(--muted)',
                  textDecoration: 'none',
                  border: '1.5px solid transparent',
                  transition: 'all 0.15s',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = '#FF6A0040';
                  e.currentTarget.style.background = 'var(--color-cream)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = 'transparent';
                  e.currentTarget.style.background = 'var(--muted)';
                }}
              >
                <span className="ds-icon-tile">
                  <AppIcon name={item.icon} size={19} />
                </span>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--color-ink)' }}>
                    {item.label}
                  </div>
                  <div style={{ fontSize: 11, color: 'var(--color-slate)' }}>{item.sub}</div>
                </div>
                <span style={{ marginLeft: 'auto', color: 'var(--color-slate)', fontSize: 14 }}>
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

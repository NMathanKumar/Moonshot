import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@hooks/useAuth';
import { useEffect, useState } from 'react';
import { EnrolmentService } from '@services';
import type { TestTakerResponse } from '@services/enrolment';

export default function Dashboard() {
  const { user, isLoading } = useAuth();
  const navigate = useNavigate();
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
  const firstName = profile?.givenName || (user as any)?.given_name || 'Test Taker';

  return (
    <div style={{ maxWidth: 900, margin: '0 auto', paddingBottom: 48 }}>
      {/* Welcome */}
      <div style={{ marginBottom: 32 }}>
        <h1 style={{ fontSize: 26, fontWeight: 800, color: 'var(--color-ink)', marginBottom: 4 }}>
          Welcome back, {firstName}
        </h1>
        <p style={{ fontSize: 14, color: 'var(--color-slate)' }}>
          Here's an overview of your IDP English Test journey.
        </p>
      </div>

      {/* Purchased tests */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 20 }}>
        {/* State 1: Not taken, window open */}
        <div
          style={{
            background: 'white',
            borderRadius: 16,
            border: '2px solid #FF6A0030',
            padding: '22px 28px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 24,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <div
              style={{
                width: 44,
                height: 44,
                borderRadius: 12,
                background: 'var(--color-cream)',
                border: '1.5px solid #FF6A0030',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 22,
                flexShrink: 0,
              }}
            >
              🎫
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                <span style={{ fontSize: 15, fontWeight: 800, color: 'var(--color-ink)' }}>
                  IDP English Test
                </span>
                <span
                  style={{
                    fontSize: 10,
                    fontWeight: 700,
                    padding: '2px 8px',
                    borderRadius: 20,
                    background: '#fff8e1',
                    color: '#f9a825',
                    border: '1px solid #ffd54f',
                  }}
                >
                  TEST NOT TAKEN
                </span>
              </div>
              <p style={{ fontSize: 12, color: 'var(--color-slate)', marginBottom: 6 }}>
                Purchased Sep 24, 2026 · ONE TIME TEST · UP TO 80 MINS
              </p>
              <span
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 5,
                  fontSize: 11,
                  fontWeight: 600,
                  color: '#e65100',
                  background: 'var(--color-cream)',
                  border: '1px solid #FF6A0040',
                  padding: '3px 10px',
                  borderRadius: 20,
                }}
              >
                🏆 Take within 21 days of enrolment · 17 days left (by Oct 15, 2026)
              </span>
            </div>
          </div>
          <Link
            to="/test-prepare"
            style={{
              padding: '11px 24px',
              borderRadius: 10,
              border: 'none',
              background: 'var(--gradient-brand)',
              color: 'white',
              fontSize: 13,
              fontWeight: 800,
              textDecoration: 'none',
              whiteSpace: 'nowrap',
              flexShrink: 0,
              minWidth: 148,
              textAlign: 'center',
              cursor: 'pointer',
            }}
          >
            Start test →
          </Link>
        </div>

        {/* State 2: Not taken, window closed */}
        <div
          style={{
            background: 'white',
            borderRadius: 16,
            border: '2px solid #e0e0e0',
            padding: '22px 28px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 24,
            opacity: 0.6,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <div
              style={{
                width: 44,
                height: 44,
                borderRadius: 12,
                background: '#f5f5f5',
                border: '1.5px solid #e0e0e0',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 22,
                flexShrink: 0,
              }}
            >
              🎫
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                <span style={{ fontSize: 15, fontWeight: 800, color: 'var(--color-ink)' }}>
                  IDP English Test
                </span>
                <span
                  style={{
                    fontSize: 10,
                    fontWeight: 700,
                    padding: '2px 8px',
                    borderRadius: 20,
                    background: '#fff8e1',
                    color: '#f9a825',
                    border: '1px solid #ffd54f',
                  }}
                >
                  TEST NOT TAKEN
                </span>
              </div>
              <p style={{ fontSize: 12, color: 'var(--color-slate)', marginBottom: 6 }}>
                Purchased 5 Aug 2026 · ONE TIME TEST · UP TO 80 MINS
              </p>
              <span
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 5,
                  fontSize: 11,
                  fontWeight: 600,
                  color: '#c62828',
                  background: '#fce4ec',
                  border: '1px solid #ef9a9a',
                  padding: '3px 10px',
                  borderRadius: 20,
                }}
              >
                ⏰ Test window closed — was due by Aug 26, 2026
              </span>
            </div>
          </div>
          <button
            disabled
            style={{
              padding: '11px 24px',
              borderRadius: 10,
              border: 'none',
              background: 'var(--gradient-brand)',
              color: 'white',
              fontSize: 13,
              fontWeight: 800,
              whiteSpace: 'nowrap',
              flexShrink: 0,
              minWidth: 148,
              textAlign: 'center',
              opacity: 0.4,
              cursor: 'not-allowed',
            }}
          >
            Start test →
          </button>
        </div>

        {/* State 3: Enrolment in progress */}
        <div
          style={{
            background: 'white',
            borderRadius: 16,
            border: '2px solid #e0e0e0',
            padding: '22px 28px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 24,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <div
              style={{
                width: 44,
                height: 44,
                borderRadius: 12,
                background: '#f5f5f5',
                border: '1.5px solid #e0e0e0',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 22,
                flexShrink: 0,
              }}
            >
              🎫
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                <span style={{ fontSize: 15, fontWeight: 800, color: 'var(--color-ink)' }}>
                  IDP English Test
                </span>
                <span
                  style={{
                    fontSize: 10,
                    fontWeight: 700,
                    padding: '2px 8px',
                    borderRadius: 20,
                    background: '#e3f2fd',
                    color: '#1565c0',
                    border: '1px solid #90caf9',
                  }}
                >
                  ENROLMENT IN PROGRESS
                </span>
              </div>
              <p style={{ fontSize: 12, color: 'var(--color-slate)' }}>
                Purchased 4 Aug 2026 · ONE TIME TEST · UP TO 80 MINS
              </p>
            </div>
          </div>
          <Link
            to="/book"
            style={{
              padding: '11px 24px',
              borderRadius: 10,
              border: 'none',
              background: 'var(--gradient-brand)',
              color: 'white',
              fontSize: 13,
              fontWeight: 800,
              textDecoration: 'none',
              whiteSpace: 'nowrap',
              flexShrink: 0,
              minWidth: 148,
              textAlign: 'center',
              cursor: 'pointer',
            }}
          >
            Make payment →
          </Link>
        </div>
      </div>

      {/* Overall score card */}
      <div style={{ marginBottom: 20 }}>
        <div
          style={{
            background: 'var(--gradient-brand)',
            borderRadius: 16,
            padding: '28px 32px',
            color: 'white',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          <div
            style={{
              position: 'absolute',
              top: -40,
              right: -40,
              width: 180,
              height: 180,
              borderRadius: '50%',
              background: 'rgba(255,255,255,0.07)',
            }}
          />
          <div
            style={{
              position: 'absolute',
              bottom: -20,
              right: 60,
              width: 110,
              height: 110,
              borderRadius: '50%',
              background: 'rgba(255,255,255,0.05)',
            }}
          />
          <div style={{ position: 'relative' }}>
            <p
              style={{
                fontSize: 12,
                fontWeight: 700,
                opacity: 0.85,
                textTransform: 'uppercase',
                letterSpacing: '0.08em',
                marginBottom: 12,
                marginTop: 0,
              }}
            >
              Overall Score · Latest test
            </p>

            <div style={{ display: 'flex', alignItems: 'flex-end', gap: 12, marginBottom: 12 }}>
              <span style={{ fontSize: 64, fontWeight: 900, lineHeight: 1 }}>78</span>
              <span style={{ fontSize: 20, fontWeight: 600, opacity: 0.75, paddingBottom: 8 }}>
                /120
              </span>
              <span
                style={{
                  fontSize: 24,
                  fontWeight: 800,
                  background: 'rgba(255,255,255,0.2)',
                  padding: '4px 16px',
                  borderRadius: 30,
                  marginBottom: 6,
                }}
              >
                B2
              </span>
            </div>

            <p style={{ fontSize: 12, opacity: 0.7, marginBottom: 20 }}>
              Test taken 2 Jul 2026 · Upper Intermediate
            </p>

            {/* Skill bars */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 20 }}>
              {[
                { skill: 'Reading', score: 86, cefr: 'C1' },
                { skill: 'Listening', score: 64, cefr: 'B2' },
                { skill: 'Writing', score: 74, cefr: 'B2' },
                { skill: 'Speaking', score: 72, cefr: 'B2' },
              ].map((s) => (
                <div key={s.skill}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
                    <span style={{ fontSize: 12, fontWeight: 600, opacity: 0.85 }}>{s.skill}</span>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <span style={{ fontSize: 12, opacity: 0.75 }}>{s.score}/120</span>
                      <span
                        style={{
                          fontSize: 10,
                          fontWeight: 700,
                          background: 'rgba(255,255,255,0.2)',
                          padding: '1px 7px',
                          borderRadius: 20,
                        }}
                      >
                        {s.cefr}
                      </span>
                    </div>
                  </div>
                  <div style={{ height: 5, borderRadius: 5, background: 'rgba(255,255,255,0.2)' }}>
                    <div
                      style={{
                        height: '100%',
                        borderRadius: 5,
                        width: `${(s.score / 120) * 100}%`,
                        background: 'rgba(255,255,255,0.7)',
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>

            <Link
              to="/results"
              style={{
                display: 'inline-block',
                fontSize: 13,
                fontWeight: 700,
                color: 'white',
                textDecoration: 'none',
                background: 'rgba(255,255,255,0.2)',
                padding: '8px 18px',
                borderRadius: 8,
                border: '1.5px solid rgba(255,255,255,0.35)',
                backdropFilter: 'blur(4px)',
              }}
            >
              View full results →
            </Link>
          </div>
        </div>
      </div>

      {/* What's next section */}
      <div style={{ background: 'white', borderRadius: 16, padding: '24px 28px', border: '1.5px solid var(--border)' }}>
        <h2 style={{ fontSize: 16, fontWeight: 800, color: 'var(--color-ink)', marginBottom: 16 }}>
          What's next?
        </h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {[
            { icon: '📥', label: 'Download official certificate', sub: 'PDF · ready now', to: '/results' },
            { icon: '✏️', label: 'Request Score Review', sub: 'Submit a score review', to: '/results' },
            { icon: '🎯', label: 'Practice to improve', sub: 'Free sessions available', to: '/practice' },
            { icon: '🏫', label: 'Search accepting institutions', sub: '2,000+ worldwide', to: '/book' },
          ].map((item, i) => (
            <Link
              key={i}
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
                const el = e.currentTarget as HTMLElement;
                el.style.borderColor = '#FF6A0040';
                el.style.background = 'var(--color-cream)';
              }}
              onMouseLeave={(e) => {
                const el = e.currentTarget as HTMLElement;
                el.style.borderColor = 'transparent';
                el.style.background = 'var(--muted)';
              }}
            >
              <span style={{ fontSize: 19, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {item.icon}
              </span>
              <div>
                <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--color-ink)' }}>
                  {item.label}
                </div>
                <div style={{ fontSize: 11, color: 'var(--color-slate)' }}>{item.sub}</div>
              </div>
              <span style={{ marginLeft: 'auto', color: 'var(--color-slate)', fontSize: 14 }}>›</span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

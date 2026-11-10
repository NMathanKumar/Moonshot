import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@hooks/useAuth';
import { useEffect, useState } from 'react';
import { EnrolmentService } from '@services';
import type { TestTakerResponse } from '@services/enrolment';
import idpLogo from '@assets/idp-logo-transparent.png';

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
  const firstName = profile?.givenName || (user as any)?.given_name || 'Agnes';

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex h-screen overflow-hidden">
        {/* Sidebar */}
        <div className="w-44 bg-white border-r border-gray-200 flex flex-col">
          {/* Logo */}
          <div className="p-6 border-b border-gray-100">
            <img src={idpLogo} alt="IDP" className="h-8 w-auto" />
            <p className="text-xs text-gray-600 font-medium mt-3">English Test</p>
          </div>

          {/* Overall Score */}
          <div className="px-6 py-5 border-b border-gray-100">
            <p className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-3">Overall Score</p>
            <div className="flex items-baseline gap-1 mb-3">
              <span className="text-3xl font-black text-gray-900">78</span>
              <span className="text-sm text-gray-600">/120</span>
            </div>
            <span className="inline-flex items-center justify-center px-3 py-1 bg-orange-50 text-orange-700 text-xs font-bold rounded-full border border-orange-200">
              B2 Upper Intermediate
            </span>
          </div>

          {/* Menu */}
          <nav className="flex-1 px-4 py-6">
            <p className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-4">Menu</p>
            <div className="space-y-2">
              <div className="flex items-center gap-3 px-3 py-2.5 bg-orange-50 text-orange-700 rounded-lg font-semibold text-sm">
                <span className="text-lg">📊</span>
                Dashboard
              </div>
              <Link to="/results" className="flex items-center gap-3 px-3 py-2.5 text-gray-700 hover:bg-gray-50 rounded-lg font-medium text-sm transition-colors">
                <span className="text-lg">📈</span>
                My Results
              </Link>
              <Link to="/practice" className="flex items-center gap-3 px-3 py-2.5 text-gray-700 hover:bg-gray-50 rounded-lg font-medium text-sm transition-colors">
                <span className="text-lg">✍️</span>
                Practice
              </Link>
              <Link to="/book" className="flex items-center gap-3 px-3 py-2.5 text-gray-700 hover:bg-gray-50 rounded-lg font-medium text-sm transition-colors">
                <span className="text-lg">🎫</span>
                Purchase Test
              </Link>
              <Link to="/settings" className="flex items-center gap-3 px-3 py-2.5 text-gray-700 hover:bg-gray-50 rounded-lg font-medium text-sm transition-colors">
                <span className="text-lg">⚙️</span>
                Settings
              </Link>
            </div>
          </nav>

          {/* User Profile */}
          <div className="px-4 py-6 border-t border-gray-100">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-orange-400 to-red-500 flex items-center justify-center text-white font-bold text-sm">
                {firstName.charAt(0)}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-gray-900 truncate">{firstName}</p>
                <p className="text-xs text-gray-500 truncate">{(user as any)?.email || 'student@example.com'}</p>
              </div>
            </div>
            <button className="w-full text-left text-xs font-semibold text-orange-600 hover:text-orange-700 py-2">
              Sign out
            </button>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Header */}
          <div className="bg-white border-b border-gray-200 px-8 py-6 flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">My Dashboard</h1>
            </div>
            <div className="flex items-center gap-4">
              <span className="inline-flex items-center px-3 py-2 bg-orange-50 text-orange-700 text-sm font-bold rounded-lg border border-orange-200">
                Test taken 2 Jul 2026
              </span>
              <button className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 text-white font-bold text-sm rounded-lg hover:shadow-lg transition-shadow">
                Purchase a Test →
              </button>
            </div>
          </div>

          {/* Scrollable Content */}
          <div className="flex-1 overflow-auto">
            <div className="px-8 py-8">
              {/* Welcome Section */}
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Welcome back, {firstName}</h2>
                <p className="text-gray-600">Here's an overview of your IDP English Test journey.</p>
              </div>

              {/* Test Cards */}
              <div className="space-y-4 mb-8">
                {/* Card 1: Not taken, window open */}
                <div className="bg-white rounded-xl border-2 border-orange-100 p-6 flex items-center justify-between hover:shadow-md transition-shadow">
                  <div className="flex items-center gap-4">
                    <div className="w-11 h-11 rounded-lg bg-orange-50 border border-orange-200 flex items-center justify-center text-xl">
                      🎫
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-bold text-gray-900">IDP English Test</span>
                        <span className="inline-flex items-center px-2 py-1 bg-yellow-100 text-yellow-700 text-xs font-bold rounded-full border border-yellow-300">
                          TEST NOT TAKEN
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mb-2">Purchased Sep 24, 2026 · ONE TIME TEST · UP TO 80 MINS</p>
                      <div className="inline-flex items-center gap-2 px-3 py-2 bg-orange-50 text-orange-700 text-xs font-bold rounded-full border border-orange-200">
                        🏆 Take within 21 days of enrolment · 17 days left (by Oct 15, 2026)
                      </div>
                    </div>
                  </div>
                  <Link to="/test-prepare" className="inline-flex items-center px-6 py-2 bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 text-white font-bold text-sm rounded-lg hover:shadow-lg transition-shadow flex-shrink-0">
                    Start test →
                  </Link>
                </div>

                {/* Card 2: Not taken, window closed */}
                <div className="bg-white rounded-xl border-2 border-gray-200 p-6 flex items-center justify-between opacity-60">
                  <div className="flex items-center gap-4">
                    <div className="w-11 h-11 rounded-lg bg-gray-100 border border-gray-300 flex items-center justify-center text-xl">
                      🎫
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-bold text-gray-900">IDP English Test</span>
                        <span className="inline-flex items-center px-2 py-1 bg-yellow-100 text-yellow-700 text-xs font-bold rounded-full border border-yellow-300">
                          TEST NOT TAKEN
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mb-2">Purchased 5 Aug 2026 · ONE TIME TEST · UP TO 80 MINS</p>
                      <div className="inline-flex items-center gap-2 px-3 py-2 bg-red-50 text-red-700 text-xs font-bold rounded-full border border-red-300">
                        ⏰ Test window closed — was due by Aug 26, 2026
                      </div>
                    </div>
                  </div>
                  <button disabled className="inline-flex items-center px-6 py-2 bg-gray-300 text-white font-bold text-sm rounded-lg flex-shrink-0 cursor-not-allowed">
                    Start test →
                  </button>
                </div>

                {/* Card 3: Enrolment in progress */}
                <div className="bg-white rounded-xl border-2 border-gray-200 p-6 flex items-center justify-between hover:shadow-md transition-shadow">
                  <div className="flex items-center gap-4">
                    <div className="w-11 h-11 rounded-lg bg-gray-100 border border-gray-300 flex items-center justify-center text-xl">
                      🎫
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-bold text-gray-900">IDP English Test</span>
                        <span className="inline-flex items-center px-2 py-1 bg-blue-100 text-blue-700 text-xs font-bold rounded-full border border-blue-300">
                          ENROLMENT IN PROGRESS
                        </span>
                      </div>
                      <p className="text-sm text-gray-600">Purchased 4 Aug 2026 · ONE TIME TEST · UP TO 80 MINS</p>
                    </div>
                  </div>
                  <Link to="/book" className="inline-flex items-center px-6 py-2 bg-orange-400 text-white font-bold text-sm rounded-lg hover:shadow-lg transition-shadow flex-shrink-0">
                    Make payment →
                  </Link>
                </div>
              </div>

              {/* Overall Score Card */}
              <div className="bg-gradient-to-br from-yellow-400 via-orange-500 to-red-500 rounded-xl p-8 text-white mb-8 relative overflow-hidden">
                <div className="absolute -top-20 -right-20 w-48 h-48 bg-white/10 rounded-full blur-3xl"></div>
                <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-white/5 rounded-full blur-3xl"></div>
                <div className="relative z-10">
                  <p className="text-xs font-bold uppercase tracking-widest opacity-90 mb-4">Overall Score - Latest Test</p>
                  
                  <div className="flex items-baseline gap-3 mb-6">
                    <span className="text-6xl font-black">78</span>
                    <span className="text-2xl font-bold opacity-90">/120</span>
                    <span className="text-2xl font-bold bg-white/20 px-4 py-1 rounded-full">B2</span>
                  </div>

                  <p className="text-sm opacity-90 mb-6">Test taken 2 Jul 2026 · Upper Intermediate</p>

                  {/* Skill Bars */}
                  <div className="space-y-4 mb-8">
                    {[
                      { skill: 'Reading', score: 86, cefr: 'C1' },
                      { skill: 'Listening', score: 64, cefr: 'B2' },
                      { skill: 'Writing', score: 74, cefr: 'B2' },
                      { skill: 'Speaking', score: 72, cefr: 'B2' },
                    ].map((s) => (
                      <div key={s.skill}>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-semibold opacity-90">{s.skill}</span>
                          <div className="flex items-center gap-3">
                            <span className="text-sm opacity-90">{s.score}/120</span>
                            <span className="text-xs font-bold bg-white/20 px-2 py-0.5 rounded-full">{s.cefr}</span>
                          </div>
                        </div>
                        <div className="h-1 bg-white/20 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-white/70 rounded-full"
                            style={{ width: `${(s.score / 120) * 100}%` }}
                          ></div>
                        </div>
                      </div>
                    ))}
                  </div>

                  <Link to="/results" className="inline-flex items-center px-4 py-2 bg-white/20 text-white font-bold text-sm rounded-lg border border-white/30 hover:bg-white/30 transition-colors">
                    View full results →
                  </Link>
                </div>
              </div>

              {/* What's Next Section */}
              <div className="bg-white rounded-xl border border-gray-200 p-8">
                <h3 className="text-lg font-bold text-gray-900 mb-6">What's next?</h3>
                <div className="space-y-3">
                  {[
                    { icon: '📥', label: 'Download official certificate', sub: 'PDF · ready now', to: '/results' },
                    { icon: '✏️', label: 'Request Score Review', sub: 'Submit a score review', to: '/results' },
                    { icon: '🎯', label: 'Practice to improve', sub: 'Free sessions available', to: '/practice' },
                    { icon: '🏫', label: 'Search accepting institutions', sub: '2,000+ worldwide', to: '/book' },
                  ].map((item, i) => (
                    <Link
                      key={i}
                      to={item.to}
                      className="flex items-center gap-4 px-4 py-3 bg-gray-50 rounded-lg hover:bg-orange-50 border border-transparent hover:border-orange-200 transition-all group"
                    >
                      <span className="text-xl">{item.icon}</span>
                      <div className="flex-1">
                        <div className="font-semibold text-gray-900">{item.label}</div>
                        <div className="text-xs text-gray-600">{item.sub}</div>
                      </div>
                      <span className="text-gray-400 group-hover:text-gray-600">›</span>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

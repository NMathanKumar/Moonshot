import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@hooks/useAuth';

interface TestEnrolment {
  id: string;
  status: 'not-taken' | 'expired' | 'in-progress' | 'completed';
  purchaseDate: string;
  daysRemaining: number;
  expiryDate: string;
  action: {
    label: string;
    link: string;
    disabled?: boolean;
  };
}

interface SkillScore {
  skill: string;
  score: number;
  cefr: string;
}

interface OverallScore {
  score: number;
  maxScore: number;
  cefr: string;
  testDate: string;
  skills: SkillScore[];
}

export default function DashboardPage() {
  const { user, isLoading } = useAuth();
  const navigate = useNavigate();
  const [overallScore, setOverallScore] = useState<OverallScore | null>(null);
  const [testEnrolments, setTestEnrolments] = useState<TestEnrolment[]>([]);

  useEffect(() => {
    // Redirect if authentication loading is complete and no user found
    if (!isLoading && !user) {
      console.log('[Dashboard] Auth complete, no user found - redirecting to signin');
      navigate('/signin', { replace: true });
    }
  }, [user, isLoading, navigate]);

  // Mock data - replace with API call
  useEffect(() => {
    if (user) {
      // Mock test enrolments
      setTestEnrolments([
        {
          id: '1',
          status: 'not-taken',
          purchaseDate: 'Sep 24, 2026',
          daysRemaining: 17,
          expiryDate: 'Oct 15, 2026',
          action: { label: 'Start test →', link: '/test-prepare' },
        },
        {
          id: '2',
          status: 'expired',
          purchaseDate: 'Aug 5, 2026',
          daysRemaining: 0,
          expiryDate: 'Aug 26, 2026',
          action: { label: 'Start test →', link: '/test-prepare', disabled: true },
        },
        {
          id: '3',
          status: 'in-progress',
          purchaseDate: 'Aug 4, 2026',
          daysRemaining: 21,
          expiryDate: '',
          action: { label: 'Make payment →', link: '/book' },
        },
      ]);

      // Mock overall score
      setOverallScore({
        score: 78,
        maxScore: 120,
        cefr: 'B2',
        testDate: '2 Jul 2026',
        skills: [
          { skill: 'Reading', score: 86, cefr: 'C1' },
          { skill: 'Listening', score: 64, cefr: 'B2' },
          { skill: 'Writing', score: 74, cefr: 'B2' },
          { skill: 'Speaking', score: 72, cefr: 'B2' },
        ],
      });
    }
  }, [user]);

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

  if (!user) {
    return null;
  }

  const firstName = (user as any)?.given_name || 'Test Taker';

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-6 py-6 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-[#232d3f]">My Dashboard</h1>
          <div className="flex items-center gap-3">
            <span className="text-sm text-[#55657b] bg-orange-50 px-3 py-1.5 rounded-lg border border-orange-200">
              Test taken 2 Jul 2026
            </span>
            <Link
              to="/book"
              className="px-4 py-2 bg-gradient-to-r from-[#FFC01E] via-[#FF6A00] to-[#E01F26] text-white font-bold text-sm rounded-lg hover:shadow-lg transition-shadow"
            >
              Purchase a Test →
            </Link>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-6 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-[#232d3f] mb-2">Welcome back, {firstName}</h2>
          <p className="text-[14px] text-[#55657b]">Here's an overview of your IDP English Test journey.</p>
        </div>

        {/* Test Enrolments */}
        <div className="space-y-4 mb-8">
          {testEnrolments.map((test, idx) => (
            <div
              key={test.id}
              className={`bg-white rounded-xl border-2 p-6 flex items-center justify-between ${
                test.status === 'not-taken' && idx === 0
                  ? 'border-[#FF6A0030]'
                  : test.status === 'expired'
                  ? 'border-gray-200 opacity-60'
                  : 'border-gray-200'
              }`}
            >
              {/* Left Content */}
              <div className="flex items-center gap-4 flex-1">
                <div
                  className={`w-11 h-11 rounded-xl flex items-center justify-center text-2xl flex-shrink-0 ${
                    test.status === 'not-taken' && idx === 0
                      ? 'bg-[#FFF3EA] border border-[#FF6A0030]'
                      : 'bg-gray-100 border border-gray-200'
                  }`}
                >
                  🎫
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[15px] font-bold text-[#232d3f]">IDP English Test</span>
                    <span
                      className={`text-[10px] font-bold px-2 py-1 rounded-full ${
                        test.status === 'not-taken'
                          ? 'bg-yellow-100 text-yellow-700 border border-yellow-200'
                          : test.status === 'expired'
                          ? 'bg-red-100 text-red-700 border border-red-200'
                          : 'bg-blue-100 text-blue-700 border border-blue-200'
                      }`}
                    >
                      {test.status === 'not-taken' && 'TEST NOT TAKEN'}
                      {test.status === 'expired' && 'TEST NOT TAKEN'}
                      {test.status === 'in-progress' && 'ENROLMENT IN PROGRESS'}
                    </span>
                  </div>
                  <p className="text-xs text-[#55657b] mb-2">
                    Purchased {test.purchaseDate} · ONE TIME TEST · UP TO 80 MINS
                  </p>
                  {test.status === 'not-taken' && test.daysRemaining > 0 && (
                    <span className="inline-flex items-center gap-1 text-xs font-semibold text-[#e65100] bg-[#FFF3EA] border border-[#FF6A0040] px-2.5 py-1 rounded-full">
                      🏆 Take within 21 days of enrolment · {test.daysRemaining} days left (by {test.expiryDate})
                    </span>
                  )}
                  {test.status === 'expired' && (
                    <span className="inline-flex items-center gap-1 text-xs font-semibold text-red-600 bg-red-50 border border-red-200 px-2.5 py-1 rounded-full">
                      ⏰ Test window closed — was due by {test.expiryDate}
                    </span>
                  )}
                </div>
              </div>

              {/* Action Button */}
              {test.action.disabled ? (
                <button
                  disabled
                  className="px-6 py-2.5 bg-gradient-to-r from-[#FFC01E] via-[#FF6A00] to-[#E01F26] text-white font-bold text-sm rounded-lg opacity-40 cursor-not-allowed flex-shrink-0"
                >
                  {test.action.label}
                </button>
              ) : (
                <Link
                  to={test.action.link}
                  className={`px-6 py-2.5 text-white font-bold text-sm rounded-lg flex-shrink-0 transition-all ${
                    test.status === 'expired'
                      ? 'bg-gray-300 cursor-not-allowed'
                      : 'bg-gradient-to-r from-[#FFC01E] via-[#FF6A00] to-[#E01F26] hover:shadow-lg'
                  }`}
                >
                  {test.action.label}
                </Link>
              )}
            </div>
          ))}
        </div>

        {/* Overall Score Card */}
        {overallScore && (
          <div className="mb-8 bg-gradient-to-br from-[#FFC01E] via-[#FF6A00] to-[#E01F26] rounded-2xl p-8 text-white relative overflow-hidden">
            <div className="absolute -top-20 -right-20 w-40 h-40 bg-white/10 rounded-full blur-3xl" />
            <div className="absolute -bottom-10 right-20 w-32 h-32 bg-white/5 rounded-full blur-3xl" />

            <div className="relative z-10">
              <p className="text-xs font-bold uppercase opacity-85 mb-3 tracking-wider">
                Overall Score · Latest test
              </p>

              <div className="flex items-end gap-3 mb-4">
                <span className="text-7xl font-black leading-none">{overallScore.score}</span>
                <span className="text-xl font-semibold opacity-75 mb-2">/{overallScore.maxScore}</span>
                <span className="text-2xl font-bold bg-white/20 px-4 py-2 rounded-full mb-1">
                  {overallScore.cefr}
                </span>
              </div>

              <p className="text-xs opacity-70 mb-6">Test taken {overallScore.testDate} · Upper Intermediate</p>

              {/* Skill Bars */}
              <div className="space-y-3 mb-6">
                {overallScore.skills.map((skill) => (
                  <div key={skill.skill}>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-semibold opacity-85">{skill.skill}</span>
                      <div className="flex items-center gap-2">
                        <span className="text-xs opacity-75">{skill.score}/120</span>
                        <span className="text-[10px] font-bold bg-white/20 px-2 py-0.5 rounded-full">
                          {skill.cefr}
                        </span>
                      </div>
                    </div>
                    <div className="h-1 bg-white/20 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-white/70 rounded-full transition-all"
                        style={{ width: `${(skill.score / 120) * 100}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>

              <Link
                to="/results"
                className="inline-block text-xs font-bold text-white bg-white/20 px-4 py-2 rounded-lg border border-white/35 hover:bg-white/30 transition-colors"
              >
                View full results →
              </Link>
            </div>
          </div>
        )}

        {/* What's Next Section */}
        <div className="bg-white rounded-2xl border border-gray-200 p-8">
          <h3 className="text-lg font-bold text-[#232d3f] mb-6">What's next?</h3>

          <div className="space-y-3">
            {[
              { icon: '📥', label: 'Download official certificate', sub: 'PDF · ready now', to: '/results' },
              { icon: '✏️', label: 'Request Score Review', sub: 'Submit a score review', to: '/results' },
              { icon: '🎯', label: 'Practice to improve', sub: 'Free sessions available', to: '/practice' },
              { icon: '🏫', label: 'Search accepting institutions', sub: '2,000+ worldwide', to: '/book' },
            ].map((item, idx) => (
              <Link
                key={idx}
                to={item.to}
                className="flex items-center gap-3 p-3 rounded-lg bg-gray-50 hover:bg-[#FFF3EA] hover:border-[#FF6A0040] border border-transparent transition-all group"
              >
                <span className="text-2xl flex items-center justify-center">{item.icon}</span>
                <div className="flex-1">
                  <div className="text-sm font-bold text-[#232d3f]">{item.label}</div>
                  <div className="text-xs text-[#55657b]">{item.sub}</div>
                </div>
                <span className="text-gray-400 group-hover:text-[#FF6A00] transition-colors">›</span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

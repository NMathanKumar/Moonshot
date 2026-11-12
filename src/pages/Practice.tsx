import { useState } from 'react';
import { Link } from 'react-router-dom';
import AppIcon from '@components/AppIcon';
import { useAuth } from '@hooks/useAuth';
import AppShell from '../layouts/AppShell';

type Skill = 'Reading' | 'Listening' | 'Writing' | 'Speaking';

const skills = ['All skills', 'Listening', 'Reading', 'Speaking', 'Writing'] as const;
type SkillFilter = (typeof skills)[number];

interface PracticeSession {
  id: number;
  type: Skill;
  title: string;
  duration: string;
  difficulty: string;
  done: boolean;
  score: number | null;
}

const sessions: PracticeSession[] = [
  { id: 1, type: 'Reading', title: 'Email sorting', duration: '12 min', difficulty: 'B2', done: true, score: 82 },
  { id: 2, type: 'Listening', title: 'Follow Instructions', duration: '10 min', difficulty: 'B2', done: true, score: 68 },
  { id: 3, type: 'Writing', title: 'Social Media', duration: '25 min', difficulty: 'C1', done: false, score: null },
  { id: 7, type: 'Writing', title: 'Report Writing', duration: '25 min', difficulty: 'B2', done: false, score: null },
  { id: 4, type: 'Speaking', title: 'Give advice', duration: '5 min', difficulty: 'B2', done: false, score: null },
  { id: 8, type: 'Speaking', title: 'Defend a position', duration: '5 min', difficulty: 'C1', done: false, score: null },
  { id: 9, type: 'Speaking', title: 'Oral presentation', duration: '5 min', difficulty: 'C1', done: false, score: null },
  { id: 5, type: 'Reading', title: 'Multiple texts', duration: '14 min', difficulty: 'C1', done: false, score: null },
  { id: 10, type: 'Reading', title: 'Academic reading', duration: '14 min', difficulty: 'C1', done: false, score: null },
  { id: 6, type: 'Listening', title: 'Announcements', duration: '8 min', difficulty: 'B1', done: true, score: 75 },
  { id: 11, type: 'Listening', title: 'Conversation', duration: '10 min', difficulty: 'B2', done: false, score: null },
  { id: 12, type: 'Listening', title: 'Academic listening', duration: '12 min', difficulty: 'C1', done: false, score: null },
];

const typeColors: Record<Skill, string> = {
  Reading: '#2e7d32',
  Listening: '#1565c0',
  Writing: '#6a1599',
  Speaking: '#bf360c',
};

const typeBg: Record<Skill, string> = {
  Reading: '#e8f5e9',
  Listening: '#e3f2fd',
  Writing: '#f3e5f5',
  Speaking: '#fbe9e7',
};

export default function Practice() {
  const { user } = useAuth();
  const [activeSkill, setActiveSkill] = useState<SkillFilter>('All skills');
  const filtered =
    activeSkill === 'All skills' ? sessions : sessions.filter((s) => s.type === activeSkill);

  const displayName = (user as any)?.given_name || 'Agnes Lee';
  const email = (user as any)?.signInDetails?.loginId || 'a.lee@email.com';

  return (
    <AppShell displayName={displayName} email={email}>
      <div className="max-w-[900px] mx-auto pb-12">
        {/* Header Section */}
        <div className="mb-8">
          <Link
            to="/dashboard"
            className="text-[13px] text-[#55657b] no-underline font-semibold"
          >
            ← Dashboard
          </Link>
          <h1 className="text-[24px] font-black text-[#232d3f] mt-2">
            Practice
          </h1>
          <p className="text-[14px] text-[#55657b] mt-1">
            Build confidence and get test-ready with free practice activities.
          </p>
        </div>

        {/* Full-length practice card */}
        <div
          className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 md:gap-6 bg-[#fff3ea] border border-[#FF6A0030] rounded-[16px] px-7 py-5 mb-6"
        >
          <div>
            <p
              className="text-[12px] font-bold text-[#FF6A00] uppercase tracking-[0.08em] mb-1.5"
            >
              Four Skills Practice Test
            </p>
            <h3 className="text-[16px] font-black text-[#232d3f] mb-1">
              Try a short test
            </h3>
            <p className="text-[13px] text-[#55657b]">
              ~45 minutes · Reading · Listening · Writing · Speaking · An indicative score, for
              practice only
            </p>
          </div>
          <Link
            to="/test-prepare"
            className="px-5.5 py-2.75 rounded-[10px] bg-[#FF6A00] text-white text-[13px] font-bold no-underline whitespace-nowrap text-center md:w-auto w-full"
          >
            Coming soon
          </Link>
        </div>

        {/* Filter Section */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 md:gap-4 mb-4">
          <h2 className="text-[16px] font-black text-[#232d3f]">
            Skills Practice
          </h2>
          <div className="flex flex-wrap gap-2 justify-start md:justify-end" role="group" aria-label="Filter by skill">
            {skills.map((s) => {
              const isActive = activeSkill === s;
              return (
                <button
                  key={s}
                  type="button"
                  aria-pressed={isActive}
                  onClick={() => setActiveSkill(s)}
                  className={`px-3.5 py-1.5 rounded-full border-[1.5px] text-[12px] font-bold cursor-pointer transition-all ${
                    isActive
                      ? 'border-[#FF6A00] bg-[#fff3ea] text-[#FF6A00]'
                      : 'border-[#e0e0e0] bg-white text-[#55657b] hover:border-[#FF6A0050]'
                  }`}
                >
                  {s}
                </button>
              );
            })}
          </div>
        </div>

        {/* Practice Sessions Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
          {filtered.map((s) => (
            <Link
              key={s.id}
              to="/test-prepare"
              className="block bg-white border-[1.5px] border-[#e0e0e0] rounded-[14px] px-5 py-[18px] no-underline cursor-pointer transition-all hover:border-[#FF6A0050] hover:shadow-[0_4px_16px_rgba(255,106,0,0.08)]"
            >
              <div className="flex items-start justify-between mb-3">
                <span
                  className="text-[11px] font-bold px-2.5 py-0.75 rounded-full"
                  style={{
                    backgroundColor: typeBg[s.type],
                    color: typeColors[s.type],
                  }}
                >
                  {s.type}
                </span>
                {s.done && s.score !== null && (
                  <span
                    className="text-[12px] font-black px-2.5 py-0.75 rounded-full bg-[#fff3ea] text-[#FF6A00]"
                  >
                    {Math.round(s.score / 12)}/10
                  </span>
                )}
              </div>
              <h3
                className="text-[14px] font-bold text-[#232d3f] mb-2 leading-[1.4]"
              >
                {s.title}
              </h3>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span
                    className="text-[11px] text-[#55657b] inline-flex items-center gap-1.5"
                  >
                    <AppIcon name="clock" size={14} /> {s.duration}
                  </span>
                </div>
                <span
                  className={`text-[13px] font-bold ${
                    s.done ? 'text-[#2e7d32]' : 'text-[#FF6A00]'
                  }`}
                >
                  {s.done ? '✓ Done' : 'Start →'}
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </AppShell>
  );
}

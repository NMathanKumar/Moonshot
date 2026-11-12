import { useState } from 'react';
import { Link } from 'react-router-dom';
import { RadarChart, Radar, PolarGrid, PolarAngleAxis, ResponsiveContainer } from 'recharts';
import AppIcon from '@components/AppIcon';
import { useAuth } from '@hooks/useAuth';
import AppShell from '../../layouts/AppShell';

type SkillEntry = {
  skill: string;
  score: number;
  max: number;
  cefr: string;
  feedback: string;
  subskills: { name: string; score: number }[];
};
type ScoreChange = { from: number; to: number };
type Report = {
  name: string;
  date: string;
  certId: string;
  overall: number;
  cefr: string;
  skills: SkillEntry[];
  cancelled?: boolean;
  cancelReason?: string;
  scoreChanges?: {
    updatedOn?: string;
    overall?: ScoreChange;
    skills?: { skill: string; from: number; to: number }[];
  };
};

const CANCELLED_FEEDBACK = 'This test was cancelled. No results are available.';

const reports: Report[] = [
  {
    name: 'Agnes Lee',
    date: 'Sep 24, 2026',
    certId: 'IDP-ENG-7K2M-9X4P',
    overall: 78,
    cefr: 'B2',
    skills: [
      { skill: 'Reading', score: 86, max: 120, cefr: 'C1', feedback: 'Excellent comprehension and inference skills. You consistently identified main ideas and implicit meaning. Your ability to interpret complex academic texts places you firmly at C1 level, with particular strength in understanding authorial intent and nuanced vocabulary.', subskills: [{ name: 'Main idea', score: 92 }, { name: 'Detail recognition', score: 88 }, { name: 'Vocabulary in context', score: 80 }, { name: 'Inference', score: 85 }] },
      { skill: 'Listening', score: 64, max: 120, cefr: 'B2', feedback: 'Good understanding of general content. Work on picking up specific details and discourse markers in faster speech. Practising with authentic audio — lectures, podcasts, and interviews — will help you build tolerance for varied accents and natural speech patterns.', subskills: [{ name: 'Gist understanding', score: 72 }, { name: 'Specific detail', score: 58 }, { name: 'Speaker attitude', score: 64 }, { name: 'Cohesion', score: 60 }] },
      { skill: 'Writing', score: 74, max: 120, cefr: 'B2', feedback: 'Clear task achievement with good range of vocabulary. Focus on grammatical accuracy and complex sentence structures. To move to C1, aim to vary your paragraph structure, use more precise academic vocabulary, and reduce reliance on simple connectives.', subskills: [{ name: 'Task achievement', score: 80 }, { name: 'Coherence', score: 76 }, { name: 'Lexical range', score: 72 }, { name: 'Grammar', score: 68 }] },
      { skill: 'Speaking', score: 72, max: 120, cefr: 'B2', feedback: 'Fluent with some hesitation. Expand your use of complex vocabulary and longer, more structured responses. Recording yourself and reviewing your responses will help identify filler words and areas where extending your answers with examples would strengthen your score.', subskills: [{ name: 'Fluency', score: 70 }, { name: 'Pronunciation', score: 78 }, { name: 'Lexical range', score: 68 }, { name: 'Coherence', score: 74 }] },
    ],
  },
  {
    name: 'Agnes Lee',
    date: 'Aug 5, 2026',
    certId: 'IDP-ENG-3PQ2-5R8W',
    overall: 70,
    cefr: 'B1',
    scoreChanges: {
      updatedOn: '28 Aug, 2026',
      overall: { from: 68, to: 70 },
      skills: [{ skill: 'Listening', from: 58, to: 62 }],
    },
    skills: [
      { skill: 'Reading', score: 74, max: 120, cefr: 'B2', feedback: 'Good comprehension of main ideas and supporting details. You showed solid understanding of text structure, though inference questions proved more challenging. Practising longer academic passages will help consolidate your reading speed and accuracy.', subskills: [{ name: 'Main idea', score: 80 }, { name: 'Detail recognition', score: 76 }, { name: 'Vocabulary in context', score: 70 }, { name: 'Inference', score: 68 }] },
      { skill: 'Listening', score: 62, max: 120, cefr: 'B2', feedback: 'You followed straightforward dialogues well but struggled with longer, faster recordings. Focus on listening to a wider variety of spoken English — news, lectures, and podcasts — to improve your ability to track complex arguments across extended listening tasks.', subskills: [{ name: 'Gist understanding', score: 66 }, { name: 'Specific detail', score: 52 }, { name: 'Speaker attitude', score: 58 }, { name: 'Cohesion', score: 54 }] },
      { skill: 'Writing', score: 66, max: 120, cefr: 'B1', feedback: 'Your writing communicated the key message clearly, though sentence structures were sometimes repetitive. Developing a wider range of linking expressions and practising paragraph organisation will help you move to a B2 writing level.', subskills: [{ name: 'Task achievement', score: 72 }, { name: 'Coherence', score: 68 }, { name: 'Lexical range', score: 62 }, { name: 'Grammar', score: 60 }] },
      { skill: 'Speaking', score: 62, max: 120, cefr: 'B1', feedback: 'You communicated your ideas adequately with reasonable fluency. Longer pauses and some repetition limited your score. Try shadowing native speakers and practising extended responses to build both fluency and the use of more varied vocabulary.', subskills: [{ name: 'Fluency', score: 60 }, { name: 'Pronunciation', score: 68 }, { name: 'Lexical range', score: 58 }, { name: 'Coherence', score: 64 }] },
    ],
  },
  {
    name: 'Agnes Lee',
    date: 'Jun 12, 2026',
    certId: '—',
    overall: 0,
    cefr: '—',
    cancelled: true,
    cancelReason: 'Malpractice detected',
    skills: [
      { skill: 'Reading', score: 0, max: 120, cefr: '—', feedback: CANCELLED_FEEDBACK, subskills: [] },
      { skill: 'Listening', score: 0, max: 120, cefr: '—', feedback: CANCELLED_FEEDBACK, subskills: [] },
      { skill: 'Writing', score: 0, max: 120, cefr: '—', feedback: CANCELLED_FEEDBACK, subskills: [] },
      { skill: 'Speaking', score: 0, max: 120, cefr: '—', feedback: CANCELLED_FEEDBACK, subskills: [] },
    ],
  },
];

const CEFR_DESC: Record<string, string> = {
  A1: 'Beginner',
  A2: 'Elementary',
  B1: 'Intermediate',
  B2: 'Upper Intermediate',
  C1: 'Advanced',
  C2: 'Mastery',
};

function ScoreChangeChip({ label, from, to }: { label: string; from: number; to: number }) {
  return (
    <div className="flex items-center gap-1.75 px-[11px] py-1.5 rounded-lg bg-[#eef8ef] border border-[#a9d5ad]">
      <span className="text-[12px] font-black text-[#232d3f]">{label}</span>
      <span className="text-[13px] font-black text-[#55657b]">{from}</span>
      <span className="text-[12px] text-[#55657b]">→</span>
      <span className="text-[13px] font-black text-[#216B27]">{to}</span>
      <span className="text-[12px] font-black text-[#216B27]">+{to - from}</span>
    </div>
  );
}

function SkillCard({
  skill,
  active,
  onClick,
  prevScore,
}: {
  skill: SkillEntry;
  active: boolean;
  onClick: () => void;
  prevScore?: number;
}) {
  const delta = prevScore !== undefined ? skill.score - prevScore : null;
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={`w-full text-left px-[18px] py-4 rounded-[12px] border-2 transition-all cursor-pointer ${
        active
          ? 'border-[#FF6A00] bg-[#fff3ea]'
          : 'border-[#dde2e7] bg-white hover:border-[#FF6A0050]'
      }`}
    >
      <div className="flex items-center justify-between mb-3">
        <span className="text-[14px] font-black text-[#232d3f]">
          {skill.skill}
        </span>
        <span
          className={`text-[12px] font-black px-[10px] py-1 rounded-full ${
            active
              ? 'bg-[#FF6A00] text-white'
              : 'bg-[#f5f5f5] text-[#232d3f]'
          }`}
        >
          {skill.cefr}
        </span>
      </div>
      <div className="flex items-end gap-2 mb-3">
        <span className="text-[28px] font-black text-[#232d3f] leading-[1]">
          {skill.score}
        </span>
        <span className="text-[13px] text-[#55657b] pb-0.75">
          /{skill.max}
        </span>
      </div>
      {delta !== null && delta > 0 && prevScore !== undefined ? (
        <div className="flex items-center gap-1.75 mb-2.5 px-[9px] py-1.75 rounded-lg bg-[#eef8ef] border border-[#a9d5ad]">
          <span className="text-[12px] text-[#232d3f] font-black">
            Score updated
          </span>
          <span className="text-[13px] font-black text-[#55657b]">
            {prevScore}
          </span>
          <span className="text-[12px] text-[#55657b]">→</span>
          <span className="text-[13px] font-black text-[#216B27]">{skill.score}</span>
          <span className="ml-auto text-[12px] font-black text-[#216B27]">
            +{delta}
          </span>
        </div>
      ) : (
        <div className="mb-2" />
      )}
    </button>
  );
}

export default function Results() {
  const { user } = useAuth();
  const [activeReport, setActiveReport] = useState(0);
  const [active, setActive] = useState(0);
  const report = reports[activeReport];
  const skillData = report.skills;
  const sortedSkills = skillData
    .map((entry, index) => ({ entry, index }))
    .sort((a, b) => a.entry.skill.localeCompare(b.entry.skill));
  const radarData = skillData.map((s) => ({
    subject: s.skill,
    score: Math.round((s.score / s.max) * 100),
  }));
  const skill = skillData[active];

  const displayName = (user as any)?.given_name || report.name;
  const email = (user as any)?.signInDetails?.loginId || 'a.lee@email.com';

  const selectReport = (index: number) => {
    if (index !== activeReport) {
      setActiveReport(index);
      setActive(0);
    }
  };

  return (
    <AppShell displayName={displayName} email={email}>
      <div className="max-w-[920px] mx-auto pb-12">
        {/* My Results list */}
        <div className="mb-7">
          <Link
            to="/dashboard"
            className="text-[13px] text-[#55657b] no-underline font-semibold"
          >
            ← Back to Dashboard
          </Link>
          <h1 className="text-[22px] font-black text-[#232d3f] mt-3 mb-1">
            My Results
          </h1>
          <p className="text-[13px] text-[#55657b] mb-4">
            Your completed tests and their results.
          </p>
          <div className="flex flex-col gap-2.5">
            {reports.map((r, i) => {
              const isActive = i === activeReport;
              return (
                <div
                  key={`${r.date}-${r.certId}`}
                  role="button"
                  tabIndex={isActive ? -1 : 0}
                  aria-current={isActive ? 'true' : undefined}
                  onClick={() => selectReport(i)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      selectReport(i);
                    }
                  }}
                  className={`rounded-[14px] border-2 px-5 py-4 flex items-center justify-between cursor-pointer transition-all ${
                    isActive
                      ? 'bg-[#fff3ea] border-[#FF6A00]'
                      : 'bg-white border-[#dde2e7] hover:border-[#FF6A0050]'
                  }`}
                  onMouseEnter={(e) => {
                    if (!isActive) e.currentTarget.style.borderColor = '#FF6A0050';
                  }}
                  onMouseLeave={(e) => {
                    if (!isActive) e.currentTarget.style.borderColor = '#dde2e7';
                  }}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 border-[1.5px] ${
                        isActive
                          ? 'bg-white border-[#FF6A0030]'
                          : 'bg-[#f5f5f5] border-[#dde2e7]'
                      } text-[#FF6A00]`}
                    >
                      <AppIcon name="document" size={18} />
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-[15px] font-black text-[#232d3f]">
                          IDP English Test
                        </span>
                        {r.cancelled ? (
                          <span className="text-[11px] font-black px-2.25 py-0.75 rounded-full bg-[#fce4ec] text-[#a61f1f] border border-[#e58d8d]">
                            CANCELLED
                          </span>
                        ) : (
                          <span className="text-[11px] font-black px-2.25 py-0.75 rounded-full bg-[#e8f5e9] text-[#216B27] border border-[#8fc795]">
                            COMPLETED
                          </span>
                        )}
                      </div>
                      <p className="text-[13px] text-[#44546A] font-medium">
                        {r.name} · {r.date}
                      </p>
                      {r.cancelReason && (
                        <p className="text-[12px] text-[#c62828] font-semibold mt-0.75">
                          Reason(s): {r.cancelReason}
                        </p>
                      )}
                      {r.scoreChanges && (
                        <div className="mt-1.5 flex gap-2 flex-wrap items-center">
                          <span className="text-[12px] font-black px-3 py-1.5 rounded-full bg-[#216B27] text-white tracking-wider">
                            ✓ Score updated {r.scoreChanges.updatedOn}
                          </span>
                          {r.scoreChanges.overall && (
                            <ScoreChangeChip
                              label="Overall"
                              from={r.scoreChanges.overall.from}
                              to={r.scoreChanges.overall.to}
                            />
                          )}
                          {r.scoreChanges.skills?.map((sc) => (
                            <ScoreChangeChip
                              key={sc.skill}
                              label={sc.skill}
                              from={sc.from}
                              to={sc.to}
                            />
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                  <span
                    className={`text-[14px] font-black whitespace-nowrap ${
                      isActive ? 'text-[#216B27]' : 'text-[#FF6A00]'
                    }`}
                  >
                    {isActive ? '✓ Current report' : 'View report →'}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Report header */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between md:gap-6 mb-8">
          <div className="flex-1">
            <div className="flex flex-col md:flex-row items-start md:items-center gap-3 mt-2">
              <h1 className="text-[24px] font-black text-[#232d3f]">
                English Proficiency Report
              </h1>
              {report.scoreChanges && (
                <span className="text-[12px] font-black px-2.75 py-1.25 rounded-full bg-[#e8f5e9] text-[#216B27] border border-[#8fc795] whitespace-nowrap">
                  Score updated {report.scoreChanges.updatedOn}
                </span>
              )}
            </div>
            <p className="text-[14px] text-[#44546A] font-medium mt-1">
              {report.name} · Test Date: {report.date} · Assessment ID: {report.certId}
            </p>
          </div>
          <button
            type="button"
            disabled={!!report.cancelled}
            className="px-5 py-2.5 rounded-lg text-[13px] font-bold text-white whitespace-nowrap disabled:bg-[#e0e0e0] disabled:text-[#bdbdbd] disabled:cursor-not-allowed bg-[#EB7900]"
          >
            Download official certificate
          </button>
        </div>

        {/* Overall + Radar */}
        <div className="grid grid-cols-1 lg:grid-cols-[240px_1fr] gap-5 mb-5">
          <div
            className={`rounded-[20px] px-[26px] py-[30px] text-center ${
              report.cancelled
                ? 'bg-[#f5f5f5] border-[1.5px] border-[#e0e0e0] text-[#bdbdbd]'
                : 'bg-[#EB7900] text-white shadow-[0_14px_30px_rgba(35,45,63,0.14)]'
            }`}
          >
            <p className="text-[13px] font-black opacity-98 uppercase tracking-[0.13em] mb-3.5">
              Overall Score
            </p>
            {report.cancelled ? (
              <div className="text-[28px] font-black text-[#bdbdbd] mb-3">
                —
              </div>
            ) : (
              <>
                {report.scoreChanges?.overall && (
                  <div className="text-[12px] font-black px-3 py-1.5 rounded-full bg-[rgba(99,48,0,0.24)] border border-[rgba(255,255,255,0.6)] inline-block mb-4.5 tracking-[0.02em] whitespace-nowrap">
                    Score updated {report.scoreChanges.updatedOn}
                  </div>
                )}
                <div className="text-[76px] font-black leading-[0.95]">
                  {report.overall}
                </div>
                <div className="text-base opacity-96 mt-2 mb-5">/120</div>
                {report.scoreChanges?.overall && (
                  <div className="flex items-center justify-center gap-1.75 mb-5 px-3 py-2.25 rounded-lg bg-[rgba(99,48,0,0.28)] border border-[rgba(255,255,255,0.55)] whitespace-nowrap">
                    <span className="text-[12px] opacity-90">Before</span>
                    <span className="text-[15px] font-black">
                      {report.scoreChanges.overall.from}
                    </span>
                    <span className="text-[12px] opacity-80">→</span>
                    <span className="text-[12px] opacity-90">After</span>
                    <span className="text-[15px] font-black">
                      {report.scoreChanges.overall.to}
                    </span>
                    <span className="text-[12px] font-black">
                      +{report.scoreChanges.overall.to - report.scoreChanges.overall.from}
                    </span>
                  </div>
                )}
                <div className="text-[25px] font-black bg-[rgba(99,48,0,0.3)] rounded-full px-5.5 py-1.75 inline-block">
                  {report.cefr}
                </div>
                <div className="text-sm opacity-98 mt-2.5">
                  {CEFR_DESC[report.cefr]}
                </div>
              </>
            )}
            {report.cancelled && (
              <div className="mt-2.5">
                <div className="text-[12px] text-[#c62828] font-bold">Test cancelled</div>
                {report.cancelReason && (
                  <div className="text-[12px] text-[#a61f1f] mt-1">
                    Reason(s): {report.cancelReason}
                  </div>
                )}
              </div>
            )}
          </div>
          <div className="bg-white rounded-[16px] border-[1.5px] border-[#dde2e7] px-6 py-5 flex flex-col min-h-[410px] md:min-h-[330px]">
            <p className="text-[12px] font-bold text-[#55657b] uppercase tracking-[0.08em] mb-1">
              Skill Profile
            </p>
            <div className="flex-1 flex items-center justify-center min-h-[330px] md:min-h-[290px]">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart
                  data={radarData}
                  outerRadius="72%"
                  margin={{ top: 28, right: 60, bottom: 28, left: 60 }}
                >
                  <PolarGrid stroke="#e0e0e0" />
                  <PolarAngleAxis
                    dataKey="subject"
                    tick={{ fontSize: 13, fontFamily: 'Inter', fontWeight: 700, fill: '#44546A' }}
                  />
                  <Radar
                    dataKey="score"
                    stroke="#EB7900"
                    fill="#EB7900"
                    fillOpacity={0.15}
                    strokeWidth={2.5}
                  />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Skill selector */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-5">
          {sortedSkills.map(({ entry: s, index: i }) => {
            const change = report.scoreChanges?.skills?.find((sc) => sc.skill === s.skill);
            return (
              <SkillCard
                key={s.skill}
                skill={s}
                active={i === active}
                onClick={() => setActive(i)}
                prevScore={change?.from}
              />
            );
          })}
        </div>

        {/* Detail panel */}
        <div className="bg-white rounded-[16px] border-[1.5px] border-[#dde2e7] px-8 py-7 mb-5">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 mb-6">
            <h2 className="text-[18px] font-black text-[#232d3f]">
              {skill.skill}
            </h2>
            <span className="text-[13px] font-bold px-3 py-1 rounded-full bg-[#fff3ea] text-[#FF6A00] border-[1.5px] border-[#FF6A0040]">
              {skill.cefr} — {CEFR_DESC[skill.cefr] ?? 'Not available'}
            </span>
          </div>
          <div>
            <p className="text-[13px] font-bold text-[#55657b] uppercase tracking-[0.06em] mb-3">
              Feedback
            </p>
            <p className="text-[14px] text-[#55657b] leading-relaxed">
              {skill.feedback}
            </p>
          </div>
        </div>

        {/* Additional Results Service */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-6 px-6 py-5 rounded-[16px] bg-[#232d3f] text-white">
          <p className="text-[14px] font-bold">Additional Results Service</p>
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <button
              type="button"
              disabled={!!report.cancelled}
              className="px-5 py-2.5 rounded-lg border-none whitespace-nowrap text-[13px] font-bold text-white disabled:bg-[rgba(255,255,255,0.1)] disabled:text-[rgba(255,255,255,0.3)] disabled:cursor-not-allowed bg-[#EB7900] w-full sm:w-auto"
            >
              Request Score Review
            </button>
          </div>
        </div>
      </div>
    </AppShell>
  );
}

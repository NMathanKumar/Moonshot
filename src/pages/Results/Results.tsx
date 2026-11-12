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

const changeChipStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: 7,
  padding: '6px 11px',
  borderRadius: 8,
  background: '#eef8ef',
  border: '1px solid #a9d5ad',
};

function ScoreChangeChip({ label, from, to }: { label: string; from: number; to: number }) {
  return (
    <div style={changeChipStyle}>
      <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--color-ink)' }}>{label}</span>
      <span style={{ fontSize: 13, color: 'var(--color-slate)', fontWeight: 700 }}>{from}</span>
      <span style={{ fontSize: 12, color: 'var(--color-slate)' }}>→</span>
      <span style={{ fontSize: 13, fontWeight: 800, color: '#216B27' }}>{to}</span>
      <span style={{ fontSize: 12, fontWeight: 800, color: '#216B27' }}>+{to - from}</span>
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
      style={{
        textAlign: 'left',
        padding: '16px 18px',
        borderRadius: 12,
        border: active ? '2px solid var(--color-action-primary)' : '2px solid var(--border)',
        background: active ? 'var(--color-cream)' : 'white',
        cursor: 'pointer',
        transition: 'all 0.2s',
        width: '100%',
      }}
    >
      <div className="flex items-center justify-between mb-3">
        <span style={{ fontSize: 14, fontWeight: 800, color: 'var(--color-ink)' }}>
          {skill.skill}
        </span>
        <span
          style={{
            fontSize: 12,
            fontWeight: 800,
            padding: '4px 10px',
            borderRadius: 20,
            background: active ? 'var(--color-action-primary)' : 'var(--muted)',
            color: active ? 'white' : 'var(--color-ink)',
          }}
        >
          {skill.cefr}
        </span>
      </div>
      <div className="flex items-end gap-2 mb-3">
        <span style={{ fontSize: 28, fontWeight: 900, color: 'var(--color-ink)', lineHeight: 1 }}>
          {skill.score}
        </span>
        <span style={{ fontSize: 13, color: 'var(--color-slate)', paddingBottom: 3 }}>
          /{skill.max}
        </span>
      </div>
      {delta !== null && delta > 0 && prevScore !== undefined ? (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 7,
            marginBottom: 10,
            padding: '7px 9px',
            borderRadius: 8,
            background: '#eef8ef',
            border: '1px solid #a9d5ad',
          }}
        >
          <span style={{ fontSize: 12, color: 'var(--color-ink)', fontWeight: 700 }}>
            Score updated
          </span>
          <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--color-slate)' }}>
            {prevScore}
          </span>
          <span style={{ fontSize: 12, color: 'var(--color-slate)' }}>→</span>
          <span style={{ fontSize: 13, fontWeight: 800, color: '#216B27' }}>{skill.score}</span>
          <span style={{ marginLeft: 'auto', fontSize: 12, fontWeight: 800, color: '#216B27' }}>
            +{delta}
          </span>
        </div>
      ) : (
        <div style={{ marginBottom: 8 }} />
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
      <div style={{ maxWidth: 920, margin: '0 auto', paddingBottom: 48 }}>
        {/* My Results list */}
        <div style={{ marginBottom: 28 }}>
          <Link
            to="/dashboard"
            style={{
              fontSize: 13,
              color: 'var(--color-slate)',
              textDecoration: 'none',
              fontWeight: 600,
            }}
          >
            ← Back to Dashboard
          </Link>
          <h1
            style={{
              fontSize: 22,
              fontWeight: 900,
              color: 'var(--color-ink)',
              marginTop: 12,
              marginBottom: 4,
            }}
          >
            My Results
          </h1>
          <p style={{ fontSize: 13, color: 'var(--color-slate)', marginBottom: 16 }}>
            Your completed tests and their results.
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
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
                  style={{
                    background: isActive ? 'var(--color-cream)' : 'white',
                    borderRadius: 14,
                    border: isActive ? '2px solid #FF6A00' : '1.5px solid var(--border)',
                    padding: '16px 20px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    cursor: isActive ? 'default' : 'pointer',
                    transition: 'all 0.15s',
                  }}
                  onMouseEnter={(e) => {
                    if (!isActive) e.currentTarget.style.borderColor = '#FF6A0050';
                  }}
                  onMouseLeave={(e) => {
                    if (!isActive) e.currentTarget.style.borderColor = 'var(--border)';
                  }}
                >
                  <div className="flex items-center gap-3">
                    <div
                      style={{
                        width: 36,
                        height: 36,
                        borderRadius: 8,
                        background: isActive ? 'white' : 'var(--muted)',
                        border: `1.5px solid ${isActive ? '#FF6A0030' : 'var(--border)'}`,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0,
                        color: 'var(--color-brand-orange)',
                      }}
                    >
                      <AppIcon name="document" size={18} />
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span style={{ fontSize: 15, fontWeight: 800, color: 'var(--color-ink)' }}>
                          IDP English Test
                        </span>
                        {r.cancelled ? (
                          <span
                            style={{
                              fontSize: 11,
                              fontWeight: 800,
                              padding: '3px 9px',
                              borderRadius: 20,
                              background: '#fce4ec',
                              color: '#a61f1f',
                              border: '1px solid #e58d8d',
                            }}
                          >
                            CANCELLED
                          </span>
                        ) : (
                          <span
                            style={{
                              fontSize: 11,
                              fontWeight: 800,
                              padding: '3px 9px',
                              borderRadius: 20,
                              background: '#e8f5e9',
                              color: '#216B27',
                              border: '1px solid #8fc795',
                            }}
                          >
                            COMPLETED
                          </span>
                        )}
                      </div>
                      <p style={{ fontSize: 13, color: '#44546A', fontWeight: 500 }}>
                        {r.name} · {r.date}
                      </p>
                      {r.cancelReason && (
                        <p style={{ fontSize: 12, color: '#c62828', fontWeight: 600, marginTop: 3 }}>
                          Reason(s): {r.cancelReason}
                        </p>
                      )}
                      {r.scoreChanges && (
                        <div
                          style={{
                            marginTop: 6,
                            display: 'flex',
                            gap: 8,
                            flexWrap: 'wrap',
                            alignItems: 'center',
                          }}
                        >
                          <span
                            style={{
                              fontSize: 12,
                              fontWeight: 800,
                              padding: '6px 12px',
                              borderRadius: 20,
                              background: '#216B27',
                              color: 'white',
                              letterSpacing: '0.01em',
                            }}
                          >
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
                    style={{
                      fontSize: 14,
                      fontWeight: 800,
                      color: isActive ? '#216B27' : 'var(--color-action-primary)',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {isActive ? '✓ Current report' : 'View report →'}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Report header */}
        <div className="ds-page-header flex items-center justify-between mb-8">
          <div>
            <div className="flex items-center gap-3" style={{ marginTop: 8 }}>
              <h1 style={{ fontSize: 24, fontWeight: 900, color: 'var(--color-ink)' }}>
                English Proficiency Report
              </h1>
              {report.scoreChanges && (
                <span
                  style={{
                    fontSize: 12,
                    fontWeight: 800,
                    padding: '5px 11px',
                    borderRadius: 20,
                    background: '#e8f5e9',
                    color: '#216B27',
                    border: '1px solid #8fc795',
                    whiteSpace: 'nowrap',
                  }}
                >
                  Score updated {report.scoreChanges.updatedOn}
                </span>
              )}
            </div>
            <p style={{ fontSize: 14, color: '#44546A', fontWeight: 500, marginTop: 4 }}>
              {report.name} · Test Date: {report.date} · Assessment ID: {report.certId}
            </p>
          </div>
          <button
            type="button"
            disabled={!!report.cancelled}
            style={{
              padding: '10px 20px',
              borderRadius: 8,
              background: report.cancelled ? '#e0e0e0' : 'var(--color-action-primary)',
              border: 'none',
              color: report.cancelled ? '#bdbdbd' : 'white',
              fontSize: 13,
              fontWeight: 700,
              cursor: report.cancelled ? 'not-allowed' : 'pointer',
            }}
          >
            Download official certificate
          </button>
        </div>

        {/* Overall + Radar */}
        <div
          className="ds-grid-results"
          style={{ display: 'grid', gridTemplateColumns: 'auto 1fr', gap: 20, marginBottom: 20 }}
        >
          <div
            className="results-overall-card"
            style={{
              background: report.cancelled ? '#f5f5f5' : 'var(--color-action-primary)',
              borderRadius: 20,
              padding: '30px 26px',
              color: report.cancelled ? '#bdbdbd' : 'white',
              textAlign: 'center',
              width: 240,
              border: report.cancelled ? '1.5px solid #e0e0e0' : 'none',
              boxShadow: report.cancelled ? 'none' : '0 14px 30px rgba(35,45,63,0.14)',
            }}
          >
            <p
              style={{
                fontSize: 13,
                fontWeight: 800,
                opacity: 0.98,
                textTransform: 'uppercase',
                letterSpacing: '0.13em',
                marginBottom: 14,
              }}
            >
              Overall Score
            </p>
            {report.cancelled ? (
              <div style={{ fontSize: 28, fontWeight: 800, color: '#bdbdbd', marginBottom: 12 }}>
                —
              </div>
            ) : (
              <>
                {report.scoreChanges?.overall && (
                  <div
                    style={{
                      fontSize: 12,
                      fontWeight: 800,
                      padding: '6px 12px',
                      borderRadius: 20,
                      background: 'rgba(99,48,0,0.24)',
                      border: '1px solid rgba(255,255,255,0.6)',
                      display: 'inline-block',
                      marginBottom: 18,
                      letterSpacing: '0.02em',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    Score updated {report.scoreChanges.updatedOn}
                  </div>
                )}
                <div style={{ fontSize: 76, fontWeight: 900, lineHeight: 0.95 }}>
                  {report.overall}
                </div>
                <div style={{ fontSize: 16, opacity: 0.96, marginTop: 8, marginBottom: 20 }}>/120</div>
                {report.scoreChanges?.overall && (
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: 7,
                      marginBottom: 20,
                      padding: '9px 12px',
                      borderRadius: 12,
                      background: 'rgba(99,48,0,0.28)',
                      border: '1px solid rgba(255,255,255,0.55)',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    <span style={{ fontSize: 12, opacity: 0.9 }}>Before</span>
                    <span style={{ fontSize: 15, fontWeight: 800 }}>
                      {report.scoreChanges.overall.from}
                    </span>
                    <span style={{ fontSize: 12, opacity: 0.8 }}>→</span>
                    <span style={{ fontSize: 12, opacity: 0.9 }}>After</span>
                    <span style={{ fontSize: 15, fontWeight: 800 }}>
                      {report.scoreChanges.overall.to}
                    </span>
                    <span style={{ fontSize: 12, fontWeight: 800 }}>
                      +{report.scoreChanges.overall.to - report.scoreChanges.overall.from}
                    </span>
                  </div>
                )}
                <div
                  style={{
                    fontSize: 25,
                    fontWeight: 800,
                    background: 'rgba(99,48,0,0.3)',
                    borderRadius: 30,
                    padding: '7px 22px',
                    display: 'inline-block',
                  }}
                >
                  {report.cefr}
                </div>
                <div style={{ fontSize: 14, opacity: 0.98, marginTop: 10 }}>
                  {CEFR_DESC[report.cefr]}
                </div>
              </>
            )}
            {report.cancelled && (
              <div style={{ marginTop: 10 }}>
                <div style={{ fontSize: 12, color: '#c62828', fontWeight: 700 }}>Test cancelled</div>
                {report.cancelReason && (
                  <div style={{ fontSize: 12, color: '#a61f1f', marginTop: 4 }}>
                    Reason(s): {report.cancelReason}
                  </div>
                )}
              </div>
            )}
          </div>
          <div
            className="results-skill-profile-card"
            style={{
              background: 'white',
              borderRadius: 16,
              border: '1.5px solid var(--border)',
              padding: '20px 24px',
            }}
          >
            <p
              style={{
                fontSize: 12,
                fontWeight: 700,
                color: 'var(--color-slate)',
                textTransform: 'uppercase',
                letterSpacing: '0.08em',
                marginBottom: 4,
              }}
            >
              Skill Profile
            </p>
            <div className="results-radar-wrap">
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
        <div
          className="ds-grid-4"
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            gap: 12,
            marginBottom: 20,
          }}
        >
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
        <div
          style={{
            background: 'white',
            borderRadius: 16,
            border: '1.5px solid var(--border)',
            padding: '28px 32px',
          }}
        >
          <div className="flex items-center gap-3 mb-6">
            <h2 style={{ fontSize: 18, fontWeight: 900, color: 'var(--color-ink)' }}>
              {skill.skill}
            </h2>
            <span
              style={{
                fontSize: 13,
                fontWeight: 700,
                padding: '4px 12px',
                borderRadius: 20,
                background: 'var(--color-cream)',
                color: '#FF6A00',
                border: '1.5px solid #FF6A0040',
              }}
            >
              {skill.cefr} — {CEFR_DESC[skill.cefr] ?? 'Not available'}
            </span>
          </div>
          <div>
            <p
              style={{
                fontSize: 13,
                fontWeight: 700,
                color: 'var(--color-slate)',
                textTransform: 'uppercase',
                letterSpacing: '0.06em',
                marginBottom: 12,
              }}
            >
              Feedback
            </p>
            <p style={{ fontSize: 14, color: 'var(--color-slate)', lineHeight: 1.7 }}>
              {skill.feedback}
            </p>
          </div>
        </div>

        {/* Additional Results Service */}
        <div
          className="ds-service-row"
          style={{
            marginTop: 20,
            padding: '20px 24px',
            borderRadius: 16,
            background: 'var(--color-ink)',
            color: 'white',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <p style={{ fontSize: 14, fontWeight: 700 }}>Additional Results Service</p>
          <div className="flex items-center gap-3">
            <button
              type="button"
              disabled={!!report.cancelled}
              style={{
                padding: '10px 20px',
                borderRadius: 8,
                border: 'none',
                whiteSpace: 'nowrap',
                fontSize: 13,
                fontWeight: 700,
                background: report.cancelled
                  ? 'rgba(255,255,255,0.1)'
                  : 'var(--color-action-primary)',
                color: report.cancelled ? 'rgba(255,255,255,0.3)' : 'white',
                cursor: report.cancelled ? 'not-allowed' : 'pointer',
              }}
            >
              Request Score Review
            </button>
          </div>
        </div>
      </div>
    </AppShell>
  );
}

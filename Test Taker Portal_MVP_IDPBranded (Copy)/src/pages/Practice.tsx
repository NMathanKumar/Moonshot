import { useState } from "react";
import { Link } from "react-router-dom";
import AppIcon from "@/components/AppIcon";

const skills = ["All skills", "Listening", "Reading", "Speaking", "Writing"];

const sessions = [
  { id: 1, type: "Reading", title: "Email sorting", duration: "12 min", difficulty: "B2", done: true, score: 82 },
  { id: 2, type: "Listening", title: "Follow Instructions", duration: "10 min", difficulty: "B2", done: true, score: 68 },
  { id: 3, type: "Writing", title: "Social Media", duration: "25 min", difficulty: "C1", done: false, score: null },
  { id: 7, type: "Writing", title: "Report Writing", duration: "25 min", difficulty: "B2", done: false, score: null },
  { id: 4, type: "Speaking", title: "Give advice", duration: "5 min", difficulty: "B2", done: false, score: null },
  { id: 8, type: "Speaking", title: "Defend a position", duration: "5 min", difficulty: "C1", done: false, score: null },
  { id: 9, type: "Speaking", title: "Oral presentation", duration: "5 min", difficulty: "C1", done: false, score: null },
  { id: 5, type: "Reading", title: "Multiple texts", duration: "14 min", difficulty: "C1", done: false, score: null },
  { id: 10, type: "Reading", title: "Academic reading", duration: "14 min", difficulty: "C1", done: false, score: null },
  { id: 6, type: "Listening", title: "Announcements", duration: "8 min", difficulty: "B1", done: true, score: 75 },
  { id: 11, type: "Listening", title: "Conversation", duration: "10 min", difficulty: "B2", done: false, score: null },
  { id: 12, type: "Listening", title: "Academic listening", duration: "12 min", difficulty: "C1", done: false, score: null },
];

const typeColors: Record<string, string> = {
  Reading: "#2e7d32",
  Listening: "#1565c0",
  Writing: "#6a1599",
  Speaking: "#bf360c",
};
const typeBg: Record<string, string> = {
  Reading: "#e8f5e9",
  Listening: "#e3f2fd",
  Writing: "#f3e5f5",
  Speaking: "#fbe9e7",
};


export default function Practice() {
  const [activeSkill, setActiveSkill] = useState("All skills");
  const filtered = activeSkill === "All skills" ? sessions : sessions.filter(s => s.type === activeSkill);

  return (
    <div style={{ maxWidth: 900, margin: "0 auto", paddingBottom: 48 }}>
      <div style={{ marginBottom: 32 }}>
        <Link to="/dashboard" style={{ fontSize: 13, color: "var(--color-slate)", textDecoration: "none", fontWeight: 600 }}>← Dashboard</Link>
        <h1 style={{ fontSize: 24, fontWeight: 900, color: "var(--color-ink)", marginTop: 8 }}>Practice</h1>
        <p style={{ fontSize: 14, color: "var(--color-slate)", marginTop: 4 }}>Build confidence and get test-ready with free practice activities.</p>
      </div>

      {/* Full-length practice */}
      <div className="ds-feature-row" style={{
        background: "var(--color-cream)", borderRadius: 16, padding: "20px 28px",
        border: "1.5px solid #FF6A0030", marginBottom: 24,
        display: "flex", alignItems: "center", justifyContent: "space-between",
      }}>
        <div>
          <p style={{ fontSize: 12, fontWeight: 700, color: "#FF6A00", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 6 }}>Four Skills Practice Test</p>
          <h3 style={{ fontSize: 16, fontWeight: 800, color: "var(--color-ink)", marginBottom: 4 }}>Try a short test</h3>
          <p style={{ fontSize: 13, color: "var(--color-slate)" }}>~45 minutes · Reading · Listening · Writing · Speaking · An indicative score, for practice only</p>
        </div>
        <Link to="/test-prepare" style={{
          padding: "11px 22px", borderRadius: 10, background: "var(--color-action-primary)",
          color: "white", fontSize: 13, fontWeight: 700, textDecoration: "none", whiteSpace: "nowrap",
        }}>Coming soon</Link>
      </div>

      {/* Filter */}
      <div className="ds-filter-row flex items-center justify-between mb-4">
        <h2 style={{ fontSize: 16, fontWeight: 800, color: "var(--color-ink)" }}>Skills Practice</h2>
        <div className="ds-filter-tabs flex gap-2">
          {skills.map(s => (
            <button key={s} onClick={() => setActiveSkill(s)} style={{
              padding: "6px 14px", borderRadius: 20, border: "1.5px solid",
              borderColor: activeSkill === s ? "#FF6A00" : "var(--border)",
              background: activeSkill === s ? "var(--color-cream)" : "white",
              color: activeSkill === s ? "#FF6A00" : "var(--color-slate)",
              fontSize: 12, fontWeight: 700, cursor: "pointer", transition: "all 0.15s",
            }}>{s}</button>
          ))}
        </div>
      </div>

      <div className="ds-grid-2" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
        {filtered.map(s => (
          <Link key={s.id} to="/test-prepare" style={{
            display: "block", background: "white", borderRadius: 14, padding: "18px 20px",
            border: "1.5px solid var(--border)", textDecoration: "none",
            transition: "all 0.15s", cursor: "pointer",
          }}
            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = "#FF6A0050"; (e.currentTarget as HTMLElement).style.boxShadow = "0 4px 16px rgba(255,106,0,0.08)"; }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = "var(--border)"; (e.currentTarget as HTMLElement).style.boxShadow = "none"; }}
          >
            <div className="flex items-start justify-between mb-3">
              <span style={{
                fontSize: 11, fontWeight: 700, padding: "3px 10px", borderRadius: 20,
                background: typeBg[s.type], color: typeColors[s.type],
              }}>{s.type}</span>
              {s.done && s.score !== null && (
                <span style={{
                  fontSize: 12, fontWeight: 800, color: "#FF6A00",
                  background: "var(--color-cream)", padding: "3px 10px", borderRadius: 20,
                }}>{Math.round(s.score / 12)}/10</span>
              )}
            </div>
            <h3 style={{ fontSize: 14, fontWeight: 700, color: "var(--color-ink)", marginBottom: 8, lineHeight: 1.4 }}>{s.title}</h3>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="ds-meta-icon" style={{ fontSize: 11, color: "var(--color-slate)" }}><AppIcon name="clock" size={14} /> {s.duration}</span>
              </div>
              <span style={{ fontSize: 13, color: s.done ? "#2e7d32" : "var(--primary)", fontWeight: 700 }}>
                {s.done ? "✓ Done" : "Start →"}
              </span>
            </div>
          </Link>
        ))}
      </div>

    </div>
  );
}

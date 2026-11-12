import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import AppIcon, { type AppIconName } from "@/components/AppIcon";
import { isCheckInComplete } from "@/lib/checkIn";

export default function Dashboard() {
  const location = useLocation();
  const completionState = (location.state as { checkInComplete?: boolean } | null)?.checkInComplete;
  const [checkInComplete] = useState(() => Boolean(completionState) || isCheckInComplete());

  return (
    <div style={{ maxWidth: 900, margin: "0 auto", paddingBottom: 48 }}>
      {/* Welcome */}
      <div style={{ marginBottom: 32 }}>
        <h1 style={{ fontSize: 26, fontWeight: 800, color: "var(--color-ink)", marginBottom: 4 }}>
          Welcome back, Agnes
        </h1>
        <p style={{ fontSize: 14, color: "var(--color-slate)" }}>
          Here's an overview of your IDP English Test journey.
        </p>
      </div>

      {/* Purchased tests */}
      <div style={{ display: "flex", flexDirection: "column", gap: 12, marginBottom: 20 }}>

        {/* State 1: Not taken, window open */}
        <div className="ds-action-card" style={{
          background: "white", borderRadius: 16, border: "2px solid #FF6A0030",
          padding: "22px 28px",
          display: "flex", alignItems: "center", justifyContent: "space-between", gap: 24,
        }}>
          <div className="flex items-center gap-4">
            <div style={{
              width: 44, height: 44, borderRadius: 12, background: "var(--color-cream)",
              border: "1.5px solid #FF6A0030", display: "flex", alignItems: "center",
              justifyContent: "center", fontSize: 22, flexShrink: 0,
            }}><AppIcon name="ticket" /></div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span style={{ fontSize: 15, fontWeight: 800, color: "var(--color-ink)" }}>IDP English Test</span>
                <span style={{
                  fontSize: 10, fontWeight: 700, padding: "2px 8px", borderRadius: 20,
                  background: "#fff8e1", color: "#f9a825", border: "1px solid #ffd54f",
                }}>TEST NOT TAKEN</span>
              </div>
              <p style={{ fontSize: 12, color: "var(--color-slate)", marginBottom: 6 }}>
                Purchased Sep 24, 2026 · ONE TIME TEST · UP TO 80 MINS
              </p>
              <span style={{
                display: "inline-flex", alignItems: "center", gap: 5,
                fontSize: 11, fontWeight: 600, color: "#e65100",
                background: "var(--color-cream)", border: "1px solid #FF6A0040",
                padding: "3px 10px", borderRadius: 20,
              }}><AppIcon name="award" size={14} /> Take within 21 days of enrolment · 17 days left (by Oct 15, 2026)</span>
              <div className={`test-checkin-message${checkInComplete ? " complete" : ""}`}>
                <AppIcon name={checkInComplete ? "identification" : "user"} size={15} />
                <span>
                  {checkInComplete
                    ? "Check-in completed — you can now start your test."
                    : "Check-in is required before you can start this test."}
                </span>
              </div>
            </div>
          </div>
          {checkInComplete ? (
            <Link className="dashboard-action-button" to="/test-prepare" style={{
              padding: "11px 24px", borderRadius: 10, border: "none",
              background: "var(--color-action-primary)", color: "white",
              fontSize: 13, fontWeight: 800, textDecoration: "none", whiteSpace: "nowrap", flexShrink: 0, minWidth: 148, textAlign: "center",
            }}>Start test →</Link>
          ) : (
            <Link className="dashboard-action-button" to="/check-in/about" style={{
              padding: "11px 24px", borderRadius: 10, border: "none",
              background: "var(--color-action-primary)", color: "white",
              fontSize: 13, fontWeight: 800, textDecoration: "none", whiteSpace: "nowrap",
              flexShrink: 0, minWidth: 148, textAlign: "center",
            }}>Check-in →</Link>
          )}
        </div>

        {/* State 2: Not taken, window closed */}
        <div className="ds-action-card" style={{
          background: "white", borderRadius: 16, border: "2px solid #e0e0e0",
          padding: "22px 28px",
          display: "flex", alignItems: "center", justifyContent: "space-between", gap: 24,
        }}>
          <div className="flex items-center gap-4">
            <div style={{
              width: 44, height: 44, borderRadius: 12, background: "#f5f5f5",
              border: "1.5px solid #e0e0e0", display: "flex", alignItems: "center",
              justifyContent: "center", fontSize: 22, flexShrink: 0,
            }}><AppIcon name="ticket" /></div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span style={{ fontSize: 15, fontWeight: 800, color: "var(--color-ink)" }}>IDP English Test</span>
                <span style={{
                  fontSize: 10, fontWeight: 700, padding: "2px 8px", borderRadius: 20,
                  background: "#fff8e1", color: "#f9a825", border: "1px solid #ffd54f",
                }}>TEST NOT TAKEN</span>
              </div>
              <p style={{ fontSize: 12, color: "var(--color-slate)", marginBottom: 6 }}>
                Purchased 5 Aug 2026 · ONE TIME TEST · UP TO 80 MINS
              </p>
              <span style={{
                display: "inline-flex", alignItems: "center", gap: 5,
                fontSize: 11, fontWeight: 600, color: "#c62828",
                background: "#fce4ec", border: "1px solid #ef9a9a",
                padding: "3px 10px", borderRadius: 20,
              }}><AppIcon name="clock" size={14} /> Test window closed — was due by Aug 26, 2026</span>
            </div>
          </div>
          <button className="dashboard-action-button" disabled style={{
            padding: "11px 24px", borderRadius: 10, border: "none",
            background: "var(--color-action-primary)", color: "white",
            fontSize: 13, fontWeight: 800, whiteSpace: "nowrap", flexShrink: 0,
            opacity: 0.4, cursor: "not-allowed", minWidth: 148, textAlign: "center",
          }}>Start test →</button>
        </div>

        {/* State 3: Enrolment in progress */}
        <div className="ds-action-card" style={{
          background: "white", borderRadius: 16, border: "2px solid #e0e0e0",
          padding: "22px 28px",
          display: "flex", alignItems: "center", justifyContent: "space-between", gap: 24,
        }}>
          <div className="flex items-center gap-4">
            <div style={{
              width: 44, height: 44, borderRadius: 12, background: "#f5f5f5",
              border: "1.5px solid #e0e0e0", display: "flex", alignItems: "center",
              justifyContent: "center", fontSize: 22, flexShrink: 0,
            }}><AppIcon name="ticket" /></div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span style={{ fontSize: 15, fontWeight: 800, color: "var(--color-ink)" }}>IDP English Test</span>
                <span style={{
                  fontSize: 10, fontWeight: 700, padding: "2px 8px", borderRadius: 20,
                  background: "#e3f2fd", color: "#1565c0", border: "1px solid #90caf9",
                }}>ENROLMENT IN PROGRESS</span>
              </div>
              <p style={{ fontSize: 12, color: "var(--color-slate)" }}>
                Purchased 4 Aug 2026 · ONE TIME TEST · UP TO 80 MINS
              </p>
            </div>
          </div>
          <Link className="dashboard-action-button" to="/book" style={{
            padding: "11px 24px", borderRadius: 10, border: "none",
            background: "var(--color-action-primary)", color: "white",
            fontSize: 13, fontWeight: 800, textDecoration: "none", whiteSpace: "nowrap", flexShrink: 0, minWidth: 148, textAlign: "center",
          }}>Make payment →</Link>
        </div>

      </div>

      {/* Overall score card */}
      <div style={{ marginBottom: 20 }}>
        <div style={{
          background: "var(--color-cream)",
          borderRadius: 16, padding: "28px 32px",
          color: "var(--color-ink)", position: "relative", overflow: "hidden",
          border: "1.5px solid #FFC89F",
          boxShadow: "var(--shadow-card)",
        }}>
          <div style={{ position: "relative" }}>
            <p style={{ fontSize: 13, fontWeight: 800, color: "var(--color-ink)", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 12 }}>Overall Score · Latest test</p>
            <div className="dashboard-overall-summary">
              <div>
                <div className="flex items-end gap-3 mb-3">
                  <span style={{ fontSize: 64, fontWeight: 900, lineHeight: 1, color: "var(--color-score-highlight)" }}>78</span>
                  <span style={{ fontSize: 20, fontWeight: 600, color: "var(--color-slate)", paddingBottom: 8 }}>/120</span>
                </div>
                <p style={{ fontSize: 14, fontWeight: 500, color: "#44546A" }}>Test taken 2 Jul 2026</p>
              </div>
              <div className="dashboard-overall-level">
                <span>B2</span>
                <p>Upper Intermediate</p>
              </div>
            </div>

            {/* Skill scores */}
            <div className="dashboard-skill-cards">
              {[
                { skill: "Listening", score: 64, cefr: "B2" },
                { skill: "Reading", score: 86, cefr: "C1" },
                { skill: "Speaking", score: 72, cefr: "B2" },
                { skill: "Writing", score: 74, cefr: "B2" },
              ].map(s => (
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

            <Link to="/results" style={{
              display: "inline-block", fontSize: 14, fontWeight: 800,
              color: "var(--color-brand-orange)", textDecoration: "none",
              background: "white", padding: "8px 18px",
              borderRadius: 8, border: "1.5px solid #FFC89F",
            }}>View full results →</Link>
          </div>
        </div>
      </div>

      <div>
        {/* Next steps */}
        <div style={{ background: "white", borderRadius: 16, padding: "24px 28px", border: "1.5px solid var(--border)" }}>
          <h2 style={{ fontSize: 16, fontWeight: 800, color: "var(--color-ink)", marginBottom: 16 }}>What's next?</h2>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {[
              { icon: "download" as AppIconName, label: "Download official certificate", sub: "PDF · ready now", to: "/results" },
              { icon: "edit" as AppIconName, label: "Request Score Review", sub: "Submit a score review", to: "/results" },
              { icon: "target" as AppIconName, label: "Practice to improve", sub: "Free sessions available", to: "/practice" },
              { icon: "institution" as AppIconName, label: "Search accepting institutions", sub: "2,000+ worldwide", to: "/book" },
            ].map((item, i) => (
              <Link key={i} to={item.to} style={{
                display: "flex", alignItems: "center", gap: 12, padding: "12px 14px",
                borderRadius: 10, background: "var(--muted)", textDecoration: "none",
                border: "1.5px solid transparent", transition: "all 0.15s",
              }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = "#FF6A0040"; (e.currentTarget as HTMLElement).style.background = "var(--color-cream)"; }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = "transparent"; (e.currentTarget as HTMLElement).style.background = "var(--muted)"; }}
              >
                <span className="ds-icon-tile"><AppIcon name={item.icon} size={19} /></span>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 700, color: "var(--color-ink)" }}>{item.label}</div>
                  <div style={{ fontSize: 11, color: "var(--color-slate)" }}>{item.sub}</div>
                </div>
                <span style={{ marginLeft: "auto", color: "var(--color-slate)", fontSize: 14 }}>›</span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

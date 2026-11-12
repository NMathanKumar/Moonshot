import { useState } from "react";
import { Link } from "react-router-dom";
import AppIcon from "@/components/AppIcon";

const checklist = [
  { id: "browser", label: "Browser & permissions", detail: "Chrome or Edge recommended. Microphone and camera access required.", status: "ok" },
  { id: "audio", label: "Audio playback", detail: "Play test sound to confirm you can hear the listening passages.", status: "ok" },
  { id: "mic", label: "Microphone", detail: "Speak clearly into your microphone. We detected input — you're ready.", status: "ok" },
  { id: "internet", label: "Stable internet connection", detail: "Your connection speed is sufficient for the test.", status: "ok" },
  { id: "camera", label: "Camera (proctoring)", detail: "Ensure your face is well-lit and centred in the frame.", status: "warn" },
  { id: "noise", label: "Quiet environment", detail: "Find a quiet place. Background noise can affect your speaking score.", status: "pending" },
];

const statusColor = { ok: "#2e7d32", warn: "#f9a825", pending: "#bdbdbd" };
const statusBg = { ok: "#e8f5e9", warn: "#fff8e1", pending: "#f5f5f5" };
const statusLabel = { ok: "Ready", warn: "Warning", pending: "Not checked" };

export default function TestPrepare() {
  const [agreedEnv, setAgreedEnv] = useState(false);
  const [agreedOnce, setAgreedOnce] = useState(false);
  const [playedAudio, setPlayedAudio] = useState(false);

  const allReady = agreedEnv && agreedOnce;

  return (
    <div style={{ maxWidth: 760, margin: "0 auto", paddingBottom: 48 }}>
      <Link to="/practice" style={{ fontSize: 13, color: "var(--color-slate)", textDecoration: "none", fontWeight: 600, display: "block", marginBottom: 24 }}>← Back to practice</Link>

      <div style={{ textAlign: "center", marginBottom: 36 }}>
        <div style={{
          width: 56, height: 56, borderRadius: "50%", background: "var(--color-action-primary)",
          margin: "0 auto 16px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24,
        }}><AppIcon name="sparkle" size={25} /></div>
        <h1 style={{ fontSize: 26, fontWeight: 900, color: "var(--color-ink)", marginBottom: 8 }}>Before you start</h1>
        <p style={{ fontSize: 14, color: "var(--color-slate)", maxWidth: 480, margin: "0 auto" }}>
          Review requirements, policies, and tips before your test. Make sure your device and connection are ready.
        </p>
      </div>

      {/* System check */}
      <div style={{ background: "white", borderRadius: 16, border: "1.5px solid var(--border)", padding: "24px 28px", marginBottom: 20 }}>
        <div className="flex items-center justify-between mb-5">
          <h2 style={{ fontSize: 16, fontWeight: 800, color: "var(--color-ink)" }}>System & equipment check</h2>
          <button style={{
            fontSize: 12, fontWeight: 700, color: "#FF6A00", background: "var(--color-cream)",
            border: "1.5px solid #FF6A0030", borderRadius: 8, padding: "6px 14px", cursor: "pointer",
          }}>Re-run all checks</button>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {checklist.map(item => (
            <div key={item.id} style={{
              display: "flex", alignItems: "flex-start", gap: 14,
              padding: "14px 16px", borderRadius: 10,
              background: statusBg[item.status as keyof typeof statusBg],
              border: `1.5px solid ${statusColor[item.status as keyof typeof statusColor]}30`,
            }}>
              <div style={{
                width: 20, height: 20, borderRadius: "50%", flexShrink: 0, marginTop: 1,
                background: statusColor[item.status as keyof typeof statusColor],
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 10, color: "white", fontWeight: 900,
              }}>
                {item.status === "ok" ? "✓" : item.status === "warn" ? "!" : "·"}
              </div>
              <div style={{ flex: 1 }}>
                <div className="flex items-center justify-between">
                  <span style={{ fontSize: 13, fontWeight: 700, color: "var(--color-ink)" }}>{item.label}</span>
                  <span style={{ fontSize: 11, fontWeight: 700, color: statusColor[item.status as keyof typeof statusColor] }}>
                    {statusLabel[item.status as keyof typeof statusLabel]}
                  </span>
                </div>
                <p style={{ fontSize: 12, color: "var(--color-slate)", marginTop: 3, lineHeight: 1.5 }}>{item.detail}</p>
              </div>
            </div>
          ))}
        </div>

        <button onClick={() => setPlayedAudio(true)} style={{
          marginTop: 14, width: "100%", padding: "11px", borderRadius: 10,
          border: `1.5px solid ${playedAudio ? "#2e7d3240" : "var(--border)"}`,
          background: playedAudio ? "#e8f5e9" : "var(--muted)",
          color: playedAudio ? "#2e7d32" : "var(--color-slate)",
          fontSize: 13, fontWeight: 700, cursor: "pointer",
        }}>
          {playedAudio ? (
            "✓ Audio confirmed"
          ) : (
            <span className="ds-button-content">
              <AppIcon name="headphones" size={16} />
              Play test sound — Click to play listening passage
            </span>
          )}
        </button>
      </div>

      {/* Environment reminders */}
      <div style={{ background: "white", borderRadius: 16, border: "1.5px solid var(--border)", padding: "24px 28px", marginBottom: 20 }}>
        <h2 style={{ fontSize: 16, fontWeight: 800, color: "var(--color-ink)", marginBottom: 4 }}>Environment reminders</h2>
        <p style={{ fontSize: 13, color: "var(--color-slate)", marginBottom: 16 }}>Confirm these conditions before your test:</p>
        <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 20 }}>
          {[
            "You have your identity document on your desk",
            "You're in a quiet, private room with no interruptions",
            "Your desk is clear — no notes, phones, or other devices",
            "You have a stable internet connection for the full ~80 minutes",
          ].map((r, i) => (
            <label key={i} className="flex items-start gap-3" style={{ padding: "10px 14px", borderRadius: 8, background: "var(--muted)", fontSize: 13, color: "var(--color-slate)", cursor: "pointer" }}>
              <input type="checkbox" style={{ accentColor: "#FF6A00", width: 16, height: 16, marginTop: 1, flexShrink: 0 }} />
              {r}
            </label>
          ))}
        </div>
        <div style={{ padding: "14px 16px", borderRadius: 10, background: "#fff8e1", border: "1.5px solid #ffd54f", fontSize: 12, color: "#5d4037", lineHeight: 1.6 }}>
          <strong>You can only take this test once.</strong> Once submitted, you cannot return to your answers. Make sure you're fully prepared before starting.
        </div>
      </div>

      {/* Consent */}
      <div style={{ background: "white", borderRadius: 16, border: "1.5px solid var(--border)", padding: "20px 28px", marginBottom: 24 }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <label className="flex items-start gap-3" style={{ cursor: "pointer" }}>
            <input type="checkbox" checked={agreedEnv} onChange={e => setAgreedEnv(e.target.checked)} style={{ accentColor: "#FF6A00", width: 16, height: 16, marginTop: 1, flexShrink: 0 }} />
            <span style={{ fontSize: 13, color: "var(--color-slate)", lineHeight: 1.5 }}>
              I confirm my environment is ready and I meet the conditions above
            </span>
          </label>
          <label className="flex items-start gap-3" style={{ cursor: "pointer" }}>
            <input type="checkbox" checked={agreedOnce} onChange={e => setAgreedOnce(e.target.checked)} style={{ accentColor: "#FF6A00", width: 16, height: 16, marginTop: 1, flexShrink: 0 }} />
            <span style={{ fontSize: 13, color: "var(--color-slate)", lineHeight: 1.5 }}>
              I understand this is a <strong>one-time test</strong> and I cannot retake it after submission
            </span>
          </label>
        </div>
      </div>

      <div className="ds-grid-2" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
        <Link to="/practice" style={{
          display: "block", textAlign: "center", padding: "14px",
          borderRadius: 10, border: "1.5px solid var(--border)",
          background: "white", color: "var(--color-ink)", fontSize: 14, fontWeight: 700, textDecoration: "none",
        }}>Back to practice</Link>
        <button disabled={!allReady} style={{
          padding: "14px", borderRadius: 10, border: "none",
          background: allReady ? "var(--color-action-primary)" : "#e0e0e0",
          color: allReady ? "white" : "#bdbdbd",
          fontSize: 14, fontWeight: 800, cursor: allReady ? "pointer" : "not-allowed",
          transition: "all 0.2s",
        }}>
          {allReady ? "Start test →" : "Complete checklist to start"}
        </button>
      </div>
    </div>
  );
}

import { useState } from "react";
import { Link } from "react-router-dom";

const tabs = ["Profile", "Password", "Notifications", "Account"];

function Field({
  label,
  value,
  type = "text",
  disabled = false,
  required = false,
}: {
  label: string;
  value: string;
  type?: string;
  disabled?: boolean;
  required?: boolean;
}) {
  return (
    <div style={{ display: "flex", flexDirection: "column" }}>
      <label style={{ display: "block", fontSize: 11, fontWeight: 700, color: "var(--color-slate)", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 6 }}>
        {label}{required && <span aria-hidden="true"> *</span>}
      </label>
      <input defaultValue={value} type={type} disabled={disabled} required={required} aria-required={required} style={{
        width: "100%", padding: "10px 14px", borderRadius: 8,
        border: "1.5px solid var(--border)", background: disabled ? "var(--muted)" : "white",
        fontSize: 13, color: disabled ? "var(--muted-foreground)" : "var(--color-ink)", outline: "none",
        fontFamily: "Inter, sans-serif",
        cursor: disabled ? "not-allowed" : "text",
      }} onFocus={e => { if (!disabled) (e.target as HTMLInputElement).style.borderColor = "#FF6A00"; }}
        onBlur={e => { if (!disabled) (e.target as HTMLInputElement).style.borderColor = "var(--border)"; }}
      />
    </div>
  );
}

function Toggle({ on, onChange }: { on: boolean; onChange: (v: boolean) => void }) {
  return (
    <button onClick={() => onChange(!on)} style={{
      width: 40, height: 22, borderRadius: 11,
      background: on ? "var(--color-action-primary)" : "#e0e0e0",
      border: "none", cursor: "pointer", position: "relative", padding: 0, flexShrink: 0,
      transition: "background 0.2s",
    }}>
      <span style={{
        position: "absolute", top: 3, left: on ? 21 : 3,
        width: 16, height: 16, borderRadius: "50%", background: "white",
        transition: "left 0.2s", boxShadow: "0 1px 3px rgba(0,0,0,0.2)",
      }} />
    </button>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div style={{ background: "white", borderRadius: 16, border: "1.5px solid var(--border)", overflow: "hidden", marginBottom: 16 }}>
      <div style={{ padding: "16px 24px", borderBottom: "1.5px solid var(--border)" }}>
        <h2 style={{ fontSize: 15, fontWeight: 800, color: "var(--color-ink)" }}>{title}</h2>
      </div>
      <div style={{ padding: "24px" }}>{children}</div>
    </div>
  );
}

export default function Settings() {
  const [tab, setTab] = useState("Profile");
  const [notifs, setNotifs] = useState({ results: true, practice: true, news: false, tips: true });

  return (
    <div style={{ maxWidth: 760, margin: "0 auto", paddingBottom: 48 }}>
      <div style={{ marginBottom: 28 }}>
        <Link to="/dashboard" style={{ fontSize: 13, color: "var(--color-slate)", textDecoration: "none", fontWeight: 600 }}>← Dashboard</Link>
        <h1 style={{ fontSize: 24, fontWeight: 900, color: "var(--color-ink)", marginTop: 8 }}>Settings</h1>
      </div>

      <div className="settings-layout" style={{ display: "flex", gap: 24 }}>
        {/* Tab sidebar */}
        <div className="settings-tabs" style={{ width: 160, flexShrink: 0 }}>
          {tabs.map(t => (
            <button key={t} onClick={() => setTab(t)} style={{
              display: "block", width: "100%", textAlign: "left",
              padding: "10px 14px", borderRadius: 8, border: "none", cursor: "pointer",
              fontSize: 13, fontWeight: 700, fontFamily: "Inter, sans-serif",
              background: tab === t ? "var(--color-cream)" : "transparent",
              color: tab === t ? "#FF6A00" : "var(--color-slate)",
              borderLeft: tab === t ? "3px solid #FF6A00" : "3px solid transparent",
              transition: "all 0.15s", marginBottom: 2,
            }}>{t}</button>
          ))}
        </div>

        {/* Content */}
        <div style={{ flex: 1 }}>
          {tab === "Profile" && (
            <>
              <Section title="Personal Information">
                <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                  <div className="ds-grid-2" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
                    <Field label="First Name" value="Agnes" disabled required />
                    <Field label="Last Name" value="Chen" disabled required />
                  </div>
                  <Field label="Email" value="a.lee@email.com" type="email" disabled required />
                  <div className="ds-grid-2" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
                    <Field label="Date of Birth" value="12 May 1992" disabled required />
                    <Field label="Gender" value="Female" disabled required />
                  </div>
                </div>
              </Section>
              <p style={{ margin: "-4px 0 20px", fontSize: 12, color: "var(--color-slate)" }}>
                To make changes, please contact <a href="mailto:support@idpenglishtest.com" style={{ color: "#FF6A00", fontWeight: 700, textDecoration: "none" }}>support@idpenglishtest.com</a>
              </p>
            </>
          )}

          {tab === "Password" && (
            <>
              <Section title="Change Password">
                <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                  <Field label="Current Password" value="" type="password" />
                  <Field label="New Password" value="" type="password" />
                  <Field label="Confirm New Password" value="" type="password" />
                </div>
              </Section>
              <div className="flex justify-end">
                <button style={{ padding: "10px 20px", borderRadius: 8, border: "none", background: "var(--color-action-primary)", color: "white", fontSize: 13, fontWeight: 700, cursor: "pointer", fontFamily: "Inter, sans-serif" }}>Change password</button>
              </div>
            </>
          )}

          {tab === "Notifications" && (
            <Section title="Notification Preferences">
              <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
                {[
                  { key: "results" as const, label: "Results ready", desc: "When your test results are available" },
                  { key: "practice" as const, label: "Practice reminders", desc: "Weekly nudges to keep you on track" },
                  { key: "tips" as const, label: "Study tips", desc: "Personalised guidance from Copilot" },
                  { key: "news" as const, label: "Platform updates", desc: "News about new features and institutions" },
                ].map(({ key, label, desc }) => (
                  <div key={key} className="flex items-center justify-between" style={{ padding: "16px 0", borderBottom: "1.5px solid var(--border)" }}>
                    <div>
                      <div style={{ fontSize: 13, fontWeight: 700, color: "var(--color-ink)" }}>{label}</div>
                      <div style={{ fontSize: 12, color: "var(--color-slate)", marginTop: 2 }}>{desc}</div>
                    </div>
                    <Toggle on={notifs[key]} onChange={v => setNotifs(p => ({ ...p, [key]: v }))} />
                  </div>
                ))}
              </div>
            </Section>
          )}

          {tab === "Account" && (
            <>
              <Section title="Test Access">
                <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                  <div style={{ padding: "14px 16px", borderRadius: 10, background: "var(--color-cream)", border: "1.5px solid #FF6A0025", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <div>
                      <div style={{ fontSize: 13, fontWeight: 700, color: "var(--color-ink)" }}>Envoy High-Stakes Test</div>
                      <div style={{ fontSize: 11, color: "var(--color-slate)", marginTop: 2 }}>Taken 2 Jul 2026 · Access until 2 Jul 2027</div>
                    </div>
                    <span style={{ fontSize: 11, fontWeight: 700, color: "#2e7d32", background: "#e8f5e9", padding: "4px 10px", borderRadius: 20 }}>✓ Completed</span>
                  </div>
                  <Link to="/book" style={{ display: "block", padding: "12px 16px", borderRadius: 10, border: "1.5px dashed var(--border)", textAlign: "center", fontSize: 13, fontWeight: 700, color: "#FF6A00", textDecoration: "none" }}>
                    + Purchase another test
                  </Link>
                </div>
              </Section>
              <Section title="Danger Zone">
                <div style={{ padding: "14px 16px", borderRadius: 10, background: "var(--muted)", border: "1.5px solid var(--border)" }}>
                  <div style={{ fontSize: 13, fontWeight: 700, color: "var(--muted-foreground)", marginBottom: 4 }}>Delete account</div>
                  <div style={{ fontSize: 12, color: "var(--muted-foreground)", marginBottom: 12 }}>This will permanently delete your account and all associated results and certificates.</div>
                  <button disabled aria-disabled="true" style={{ padding: "8px 16px", borderRadius: 8, border: "1.5px solid var(--border)", background: "var(--muted)", color: "var(--muted-foreground)", fontSize: 12, fontWeight: 700, cursor: "not-allowed", fontFamily: "Inter, sans-serif", opacity: 0.7 }}>
                    Delete my account
                  </button>
                </div>
              </Section>
              <p style={{ marginTop: 20, fontSize: 12, color: "var(--color-slate)" }}>
                To delete your account, please contact <a href="mailto:support@idpenglishtest.com" style={{ color: "#FF6A00", fontWeight: 700, textDecoration: "none" }}>support@idpenglishtest.com</a>
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

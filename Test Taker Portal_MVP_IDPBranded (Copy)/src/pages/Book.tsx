import { useState } from "react";
import { Link } from "react-router-dom";
import AppIcon from "@/components/AppIcon";

const institutions = [
  { name: "University of Melbourne", country: "Australia", type: "University", flag: "🇦🇺", code: "AU004827" },
  { name: "University of Sydney", country: "Australia", type: "University", flag: "🇦🇺", code: "AU004828" },
  { name: "University of Auckland", country: "New Zealand", type: "University", flag: "🇳🇿", code: "NZ004829" },
  { name: "University of Toronto", country: "Canada", type: "University", flag: "🇨🇦", code: "CA004830" },
  { name: "Imperial College London", country: "United Kingdom", type: "University", flag: "🇬🇧", code: "GB004831" },
  { name: "NUS Singapore", country: "Singapore", type: "University", flag: "🇸🇬", code: "SG004832" },
];

const faqs = [
  { q: "How long is the test?", a: "~80 minutes, uninterrupted. Four skills: Reading, Listening, Writing, and Speaking in one sitting." },
  { q: "When do I get my results?", a: "Results are ready within 48 hours, reviewed by certified human assessors." },
  { q: "How many times can I take the test?", a: "You can only take this test once per purchase. Practice tests are available for free." },
  { q: "Where is the test accepted?", a: "Over 2,000 institutions and organisations worldwide. Use the search above to find yours." },
];

export default function Book() {
  const [search, setSearch] = useState("");
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [step, setStep] = useState<"info" | "checkout">("info");

  const filtered = institutions.filter(i =>
    i.name.toLowerCase().includes(search.toLowerCase()) ||
    i.country.toLowerCase().includes(search.toLowerCase())
  );

  if (step === "checkout") {
    return (
      <div style={{ maxWidth: 520, margin: "0 auto", paddingBottom: 48 }}>
        <button onClick={() => setStep("info")} style={{ background: "none", border: "none", fontSize: 13, fontWeight: 600, color: "var(--color-slate)", cursor: "pointer", marginBottom: 24 }}>← Back</button>
        <h1 style={{ fontSize: 22, fontWeight: 900, color: "var(--color-ink)", marginBottom: 4 }}>Checkout</h1>
        <p style={{ fontSize: 13, color: "var(--color-slate)", marginBottom: 28 }}>IDP English Test · One-time access</p>

        <div style={{ background: "var(--color-cream)", borderRadius: 14, padding: "20px 22px", border: "1.5px solid #FF6A0025", marginBottom: 24 }}>
          <div className="flex items-center justify-between mb-2">
            <span style={{ fontSize: 14, fontWeight: 700, color: "var(--color-ink)" }}>IDP English Test</span>
            <span style={{ fontSize: 16, fontWeight: 900, color: "var(--color-ink)" }}>$89 AUD</span>
          </div>
          <div style={{ fontSize: 12, color: "var(--color-slate)" }}>ONE TIME TEST · UP TO 80 MINS · Results in 48 hours</div>
          <div style={{ marginTop: 12, paddingTop: 12, borderTop: "1px solid #FF6A0020" }}>
            <div style={{ fontSize: 11, color: "var(--color-slate)", display: "flex", flexDirection: "column", gap: 4 }}>
              {["A clear score, mapped to CEFR", "Reviewed by certified assessors", "Accepted by institutions around the globe", "Certified in days"].map((f, i) => (
                <div key={i} className="flex items-center gap-2"><span style={{ color: "#FF6A00" }}>✓</span> {f}</div>
              ))}
            </div>
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 14, marginBottom: 24 }}>
          <div style={{ borderTop: "1.5px solid var(--border)", paddingTop: 20, marginTop: 6 }}>
            <h2 style={{ fontSize: 15, fontWeight: 800, color: "var(--color-ink)" }}>Payment information</h2>
          </div>
          <div>
            <label style={{ fontSize: 11, fontWeight: 700, color: "var(--color-slate)", textTransform: "uppercase", letterSpacing: "0.06em", display: "block", marginBottom: 6 }}>Card Number</label>
            <input placeholder="1234 5678 9012 3456" style={inputStyle} />
          </div>
          <div className="ds-grid-2" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <div>
              <label style={labelStyle}>Expiry</label>
              <input placeholder="MM / YY" style={inputStyle} />
            </div>
            <div>
              <label style={labelStyle}>CVV</label>
              <input placeholder="•••" style={inputStyle} />
            </div>
          </div>
          <div>
            <label style={labelStyle}>Name on card</label>
            <input placeholder="Agnes Lee" style={inputStyle} />
          </div>
        </div>

        <div className="flex items-center gap-2" style={{ marginBottom: 20 }}>
          <input type="checkbox" id="terms" style={{ accentColor: "#FF6A00", width: 16, height: 16 }} />
          <label htmlFor="terms" style={{ fontSize: 12, color: "var(--color-slate)" }}>
            I agree to the <span style={{ color: "#FF6A00", fontWeight: 700 }}>Terms of Service and Privacy Policy</span>
          </label>
        </div>

        <button style={{
          width: "100%", padding: "14px", borderRadius: 10, border: "none",
          background: "var(--color-action-primary)", color: "white", fontSize: 15, fontWeight: 800, cursor: "pointer",
        }}>Pay $89 AUD</button>
        <p style={{ fontSize: 11, color: "var(--color-slate)", textAlign: "center", marginTop: 12 }}>CONDITIONS APPLY · Secure payment</p>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 900, margin: "0 auto", paddingBottom: 48 }}>
      <div className="flex items-center justify-between mb-8">
        <div>
          <Link to="/dashboard" style={{ fontSize: 13, color: "var(--color-slate)", textDecoration: "none", fontWeight: 600 }}>← Dashboard</Link>
          <h1 style={{ fontSize: 24, fontWeight: 900, color: "var(--color-ink)", marginTop: 8 }}>Purchase Test</h1>
          <p style={{ fontSize: 14, color: "var(--color-slate)", marginTop: 4 }}>Prove your English. Open your future.</p>
        </div>
      </div>

      {/* Hero pricing */}
      <div className="ds-grid-2" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 28 }}>
        <div style={{ background: "var(--color-cream)", borderRadius: 16, padding: "28px 32px", color: "var(--color-ink)", border: "1.5px solid #FFC89F", boxShadow: "var(--shadow-card)", display: "flex", flexDirection: "column" }}>
          <p style={{ fontSize: 11, fontWeight: 700, color: "var(--color-ink)", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 12 }}>IDP English Test</p>
          <div className="flex items-end gap-2 mb-4">
            <span style={{ fontSize: 48, fontWeight: 900, lineHeight: 1, color: "var(--color-action-primary)" }}>$89</span>
            <span style={{ fontSize: 16, color: "var(--color-slate)", paddingBottom: 6 }}>AUD</span>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 24, flex: 1 }}>
            {["Four skills, one sitting", "Results in 48 hours", "Certified in days", "Recognised worldwide"].map((f, i) => (
              <div key={i} className="flex items-center gap-2" style={{ fontSize: 13, color: "var(--color-slate)" }}>
                <span style={{ color: "var(--color-action-primary)", fontWeight: 800 }}>✓</span> {f}
              </div>
            ))}
          </div>
          <button onClick={() => setStep("checkout")} style={{
            width: "100%", padding: "12px", borderRadius: 10, border: "none",
            background: "var(--color-action-primary)", color: "white", fontSize: 14, fontWeight: 800, cursor: "pointer",
          }}>Purchase Test →</button>
        </div>

        <div style={{ background: "var(--muted)", borderRadius: 16, padding: "28px 32px", border: "1.5px solid var(--border)", display: "flex", flexDirection: "column" }}>
          <p style={{ fontSize: 22, fontWeight: 900, color: "var(--color-ink)", marginBottom: 4 }}>Practice for free</p>
          <p style={{ fontSize: 13, color: "var(--color-slate)", marginBottom: 20, lineHeight: 1.6 }}>See what the test is like before test day. Take a full practice test, receive an estimated score, and go at your own pace.</p>
          <p style={{ fontSize: 11, fontWeight: 700, color: "var(--color-ink)", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 10 }}>What's included</p>
          <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 24, flex: 1 }}>
            {["Practise all four skills", "Get an estimated score", "Complete the test in your own time", "Feel more confident on test day"].map((f, i) => (
              <div key={i} className="flex items-center gap-2" style={{ fontSize: 12, color: "var(--color-slate)" }}>
                <span style={{ color: "#FF6A00" }}>→</span> {f}
              </div>
            ))}
          </div>
          <Link to="/practice" style={{
            display: "block", textAlign: "center", padding: "12px", borderRadius: 10,
            border: "1.5px solid var(--border)", background: "white",
            color: "var(--color-ink)", fontSize: 14, fontWeight: 700, textDecoration: "none",
          }}>Start free practice →</Link>
        </div>
      </div>

      {/* Institutions */}
      <div style={{ background: "white", borderRadius: 16, border: "1.5px solid var(--border)", padding: "24px 28px", marginBottom: 24 }}>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 style={{ fontSize: 16, fontWeight: 800, color: "var(--color-ink)" }}>WHERE IDP ENGLISH TEST IS ACCEPTED</h2>
            <p style={{ fontSize: 13, color: "var(--color-slate)", marginTop: 2 }}>2,000+ institutions and organizations worldwide</p>
          </div>
        </div>
        <div className="ds-search-row flex gap-3 mb-4">
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search institutions…"
            style={{ ...inputStyle, flex: 1 }}
          />
          <select style={{ ...inputStyle, width: "auto" }}>
            <option>All types</option>
            <option>University</option>
            <option>College</option>
            <option>Government</option>
          </select>
          <select style={{ ...inputStyle, width: "auto" }}>
            <option>All regions</option>
            <option>Asia Pacific</option>
            <option>North America</option>
            <option>Europe</option>
          </select>
        </div>
        <div className="ds-grid-3" style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10 }}>
          {filtered.map((inst, i) => (
            <div key={i} style={{ padding: "14px 16px", borderRadius: 10, border: "1.5px solid var(--border)", background: "var(--muted)" }}>
              <div className="flex items-center gap-3">
                <span style={{ fontSize: 22 }}>{inst.flag}</span>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 700, color: "var(--color-ink)", lineHeight: 1.3 }}>{inst.name}</div>
                  <div style={{ fontSize: 11, color: "var(--color-slate)", marginTop: 2 }}>{inst.country} · {inst.type}</div>
                  <div style={{ fontSize: 10, fontWeight: 700, color: "var(--color-slate)", marginTop: 4, letterSpacing: "0.04em" }}>Code: {inst.code}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
        {filtered.length === 0 && (
          <div style={{ textAlign: "center", padding: "32px", color: "var(--color-slate)" }}>
            <div className="ds-empty-icon"><AppIcon name="search" size={24} /></div>
            <p style={{ fontSize: 13, fontWeight: 600, marginBottom: 4 }}>Try a different institution name, country, or clear your filters.</p>
            <button onClick={() => setSearch("")} style={{ fontSize: 12, color: "#FF6A00", background: "none", border: "none", cursor: "pointer", fontWeight: 700 }}>Clear filters</button>
          </div>
        )}
        <div style={{ marginTop: 16, textAlign: "center" }}>
          <p style={{ fontSize: 12, color: "var(--color-slate)", marginBottom: 8 }}>Don't see your institution?</p>
          <button style={{ fontSize: 13, fontWeight: 700, color: "#FF6A00", background: "none", border: "none", cursor: "pointer" }}>Submit a nomination →</button>
        </div>
      </div>

      {/* FAQ */}
      <div style={{ background: "white", borderRadius: 16, border: "1.5px solid var(--border)", padding: "24px 28px" }}>
        <h2 style={{ fontSize: 16, fontWeight: 800, color: "var(--color-ink)", marginBottom: 16 }}>Frequently asked questions</h2>
        <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
          {faqs.map((faq, i) => (
            <div key={i} style={{ borderBottom: i < faqs.length - 1 ? "1px solid var(--border)" : "none" }}>
              <button onClick={() => setOpenFaq(openFaq === i ? null : i)} style={{
                width: "100%", textAlign: "left", padding: "16px 0", background: "none", border: "none",
                fontSize: 14, fontWeight: 700, color: "var(--color-ink)", cursor: "pointer",
                display: "flex", alignItems: "center", justifyContent: "space-between",
              }}>
                {faq.q}
                <span style={{ color: "var(--color-slate)", fontSize: 16 }}>{openFaq === i ? "−" : "+"}</span>
              </button>
              {openFaq === i && (
                <p style={{ fontSize: 13, color: "var(--color-slate)", lineHeight: 1.7, paddingBottom: 16 }}>{faq.a}</p>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

const inputStyle: React.CSSProperties = {
  padding: "10px 14px",
  borderRadius: 8,
  border: "1.5px solid var(--border)",
  background: "white",
  fontSize: 13,
  color: "var(--color-ink)",
  outline: "none",
  fontFamily: "Inter, sans-serif",
  width: "100%",
};
const labelStyle: React.CSSProperties = {
  fontSize: 11, fontWeight: 700, color: "var(--color-slate)",
  textTransform: "uppercase", letterSpacing: "0.06em",
  display: "block", marginBottom: 6,
};

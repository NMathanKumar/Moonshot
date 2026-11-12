import { useState } from "react";
import { useNavigate } from "react-router-dom";
import signupStudent from "@/assets/idp-signup-student.png";
import signinStudent from "@/assets/idp-signin-student.png";

function isUnder18(dateOfBirth: string) {
  const birthDate = new Date(`${dateOfBirth}T00:00:00`);
  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const birthdayHasPassed =
    today.getMonth() > birthDate.getMonth() ||
    (today.getMonth() === birthDate.getMonth() && today.getDate() >= birthDate.getDate());

  if (!birthdayHasPassed) age -= 1;
  return age < 18;
}

export default function Login() {
  const navigate = useNavigate();
  const [show, setShow] = useState(false);
  const [tab, setTab] = useState<"login" | "signup">("login");
  const [email, setEmail] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [dateOfBirthError, setDateOfBirthError] = useState("");
  const [guardianRelationship, setGuardianRelationship] = useState("");
  const needsGuardian = tab === "signup" && Boolean(dateOfBirth) && isUnder18(dateOfBirth);

  const continueFromAccount = () => {
    if (tab === "login") {
      navigate("/dashboard");
      return;
    }

    if (!dateOfBirth) {
      setDateOfBirthError("Enter your date of birth to continue.");
      return;
    }

    navigate("/verify-email", { state: { email } });
  };

  return (
    <div className={`login-grid ${tab === "signup" ? "signup-layout" : "signin-layout"}${needsGuardian ? " guardian-inline-layout" : ""}`}>
      {/* Left brand panel */}
      <div className="login-brand-panel" style={{
        background: "var(--color-action-primary)",
        flexDirection: "column", justifyContent: "center", alignItems: "center",
        padding: 60, color: "white", position: "relative", overflow: "hidden",
      }}>
        <div style={{ position: "absolute", top: -60, left: -60, width: 280, height: 280, borderRadius: "50%", background: "rgba(255,255,255,0.06)" }} />
        <div style={{ position: "absolute", bottom: -40, right: -40, width: 200, height: 200, borderRadius: "50%", background: "rgba(255,255,255,0.08)" }} />
        {tab === "login" ? (
          <img src={signinStudent} alt="Student holding a tablet" className="signin-illustration" />
        ) : (
          <div className="signup-intro">
            <img src={signupStudent} alt="Student preparing to study" className="signup-illustration" />
            <h2>One account for your English test journey</h2>
            <div className="signup-benefits">
              {[
                "Access your personalised dashboard and results.",
                "Practise all four skills at your own pace.",
                "Manage your tests and certificates in one place.",
              ].map(benefit => (
                <div key={benefit}>
                  <span aria-hidden="true">✓</span>
                  <p>{benefit}</p>
                </div>
              ))}
            </div>
            <p className="signup-note"><strong>Clear and simple.</strong> Your account keeps your preparation, purchases, and results together.</p>
          </div>
        )}
      </div>

      {/* Right form panel */}
      <div className="login-form-panel">
        <form
          className="login-form-card"
          onSubmit={(event) => {
            event.preventDefault();
            continueFromAccount();
          }}
        >
          {tab === "login" && <div style={{ marginBottom: 36 }}>
            <h1 style={{ fontSize: 26, fontWeight: 900, color: "var(--color-ink)", marginBottom: 8, textAlign: "center" }}>
              Sign in
            </h1>
            <p style={{ fontSize: 14, color: "var(--color-slate)", textAlign: "center" }}>
              Welcome back! Please enter your details.
            </p>
          </div>}

          {tab === "signup" && (
            <div style={{ marginBottom: 28 }}>
              <h1 style={{ fontSize: 24, fontWeight: 900, color: "var(--color-ink)", marginBottom: 8, textAlign: "center" }}>
                Create your IDP English Test Account
              </h1>
              <p style={{ fontSize: 11, color: "var(--color-slate)", textAlign: "center" }}>
                <span aria-hidden="true">*</span> Mandatory fields
              </p>
            </div>
          )}

          <div style={{ display: "flex", flexDirection: "column", gap: 16, marginBottom: 20 }}>
            {tab === "signup" && (
              <div className="signup-name-fields" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                <div>
                  <label style={lbl}>First name <span aria-hidden="true">*</span></label>
                  <input placeholder="Agnes" required style={inp} />
                </div>
                <div>
                  <label style={lbl}>Last name <span aria-hidden="true">*</span></label>
                  <input placeholder="Chen" required style={inp} />
                </div>
              </div>
            )}
            <div>
              <label style={lbl}>Email {tab === "signup" && <span aria-hidden="true">*</span>}</label>
              <input
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="you@example.com"
                required
                style={inp}
              />
            </div>
            <div>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, marginBottom: 6 }}>
                <label style={{ ...lbl, marginBottom: 0 }}>Password {tab === "signup" && <span aria-hidden="true">*</span>}</label>
                {tab === "login" && (
                  <button type="button" style={{ fontSize: 12, color: "#FF6A00", background: "none", border: "none", cursor: "pointer", fontWeight: 700, padding: 0 }}>
                    Forgot password?
                  </button>
                )}
              </div>
              <div style={{ position: "relative" }}>
                <input type={show ? "text" : "password"} placeholder="••••••••" required style={{ ...inp, paddingRight: 44 }} />
                <button type="button" onClick={() => setShow(!show)} style={{
                  position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)",
                  background: "none", border: "none", cursor: "pointer", fontSize: 11,
                  color: "var(--color-slate)", fontWeight: 700, fontFamily: "Inter, sans-serif",
                }}>{show ? "Hide password" : "Show password"}</button>
              </div>
            </div>
            {tab === "signup" && (
              <div className="signup-details-fields" style={{ display: "grid", gridTemplateColumns: "1fr", gap: 12 }}>
                <div>
                  <label style={lbl}>Date of birth <span aria-hidden="true">*</span></label>
                  <input
                    type="date"
                    value={dateOfBirth}
                    max={new Date().toISOString().split("T")[0]}
                    onChange={(event) => {
                      setDateOfBirth(event.target.value);
                      setDateOfBirthError("");
                    }}
                    aria-describedby={dateOfBirthError ? "date-of-birth-error" : undefined}
                    aria-invalid={Boolean(dateOfBirthError)}
                    required
                    style={{ ...inp, color: "var(--color-slate)" }}
                  />
                  {dateOfBirthError && (
                    <p id="date-of-birth-error" style={{ color: "var(--color-brand-red)", fontSize: 11, marginTop: 6 }}>
                      {dateOfBirthError}
                    </p>
                  )}
                </div>
              </div>
            )}
          </div>

          {needsGuardian && (
            <section className="inline-guardian-section" aria-labelledby="guardian-details-title">
              <div className="inline-guardian-heading">
                <h2 id="guardian-details-title">Parent or guardian details</h2>
                <span>
                  As the test taker is a minor, parent or guardian details are required to complete
                  the sign up.
                </span>
              </div>

              <div className="guardian-field-grid">
                <div>
                  <label htmlFor="guardian-first-name">First name <span aria-hidden="true">*</span></label>
                  <input id="guardian-first-name" name="guardianFirstName" autoComplete="given-name" required />
                </div>
                <div>
                  <label htmlFor="guardian-last-name">Last name <span aria-hidden="true">*</span></label>
                  <input id="guardian-last-name" name="guardianLastName" autoComplete="family-name" required />
                </div>
                <div>
                  <label htmlFor="guardian-country">Country of residence <span aria-hidden="true">*</span></label>
                  <select id="guardian-country" name="guardianCountry" defaultValue="" required>
                    <option value="" disabled>Select country</option>
                    <option value="Australia">Australia</option>
                    <option value="New Zealand">New Zealand</option>
                    <option value="Canada">Canada</option>
                    <option value="United Kingdom">United Kingdom</option>
                    <option value="United States">United States</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div>
                  <label htmlFor="guardian-relationship">Relationship to test taker <span aria-hidden="true">*</span></label>
                  <select
                    id="guardian-relationship"
                    name="guardianRelationship"
                    value={guardianRelationship}
                    onChange={(event) => setGuardianRelationship(event.target.value)}
                    required
                  >
                    <option value="" disabled>Select relationship</option>
                    <option value="parent">Parent</option>
                    <option value="legal-guardian">Legal guardian</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                {guardianRelationship === "other" && (
                  <div className="guardian-other-field">
                    <label htmlFor="guardian-relationship-details">Please provide relationship details <span aria-hidden="true">*</span></label>
                    <input
                      id="guardian-relationship-details"
                      name="guardianRelationshipDetails"
                      placeholder="Describe your relationship to the test taker"
                      required
                    />
                  </div>
                )}
                <div className="guardian-email-field">
                  <label htmlFor="guardian-email">Email address of parent or guardian <span aria-hidden="true">*</span></label>
                  <input
                    id="guardian-email"
                    name="guardianEmail"
                    type="email"
                    autoComplete="email"
                    placeholder="guardian@example.com"
                    required
                  />
                </div>
              </div>

              <div className="guardian-notice">
                <span aria-hidden="true">i</span>
                <p>The parent or guardian may be contacted to confirm their details and provide consent.</p>
              </div>

              <label className="guardian-consent">
                <input type="checkbox" name="guardianTermsConsent" required />
                <span>
                  I am the parent or legal guardian of this test taker and I agree to the{" "}
                  <strong>Terms of Service and Privacy Policy</strong> on their behalf.
                </span>
              </label>
            </section>
          )}

          {tab === "signup" && !needsGuardian && (
            <label className="flex items-start gap-2" style={{ marginBottom: 20, cursor: "pointer" }}>
              <input type="checkbox" required style={{ accentColor: "#FF6A00", width: 15, height: 15, marginTop: 2, flexShrink: 0 }} />
              <span style={{ fontSize: 12, color: "var(--color-slate)", lineHeight: 1.5 }}>
                I agree to the <span style={{ color: "#FF6A00", fontWeight: 700 }}>Terms of Service and Privacy Policy</span>
              </span>
            </label>
          )}

          <button type="submit" style={{
            width: "100%",
            display: "block", textAlign: "center",
            padding: "13px", borderRadius: 10, border: "none",
            background: "var(--color-action-primary)", color: "white",
            fontSize: 14, fontWeight: 800, textDecoration: "none", marginBottom: 16,
            cursor: "pointer", fontFamily: "Inter, sans-serif",
          }}>
            {tab === "login" ? "Sign in" : "Create my account →"}
          </button>

          {tab === "signup" && (
            <div style={{ textAlign: "center", marginBottom: 18 }}>
              <span style={{ fontSize: 12, color: "var(--color-slate)" }}>Already have an account? </span>
              <button type="button" onClick={() => setTab("login")} style={{ fontSize: 12, color: "var(--color-action-primary)", background: "none", border: "none", cursor: "pointer", fontWeight: 700 }}>
                Sign in
              </button>
            </div>
          )}

          {tab === "login" && (
            <div style={{ textAlign: "center", marginBottom: 18 }}>
              <span style={{ fontSize: 12, color: "var(--color-slate)" }}>Don't have an account? </span>
              <button type="button" onClick={() => setTab("signup")} style={{ fontSize: 12, color: "var(--color-action-primary)", background: "none", border: "none", cursor: "pointer", fontWeight: 700 }}>
                Sign up
              </button>
            </div>
          )}

        </form>
      </div>
    </div>
  );
}

const inp: React.CSSProperties = {
  width: "100%", padding: "11px 14px", borderRadius: 8,
  border: "1.5px solid var(--border)", background: "white",
  fontSize: 13, color: "var(--color-ink)", outline: "none",
  fontFamily: "Inter, sans-serif",
};
const lbl: React.CSSProperties = {
  display: "block", fontSize: 11, fontWeight: 700,
  color: "var(--color-slate)", textTransform: "uppercase",
  letterSpacing: "0.06em", marginBottom: 6,
};

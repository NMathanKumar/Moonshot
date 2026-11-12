import { BrowserRouter, Routes, Route, NavLink, useLocation, Link } from "react-router-dom";
import idpEnglishTestLogo from "@/assets/idp-english-test-logo.png";
import Dashboard from "./pages/Dashboard";
import Results from "./pages/Results";
import Practice from "./pages/Practice";
import Book from "./pages/Book";
import TestPrepare from "./pages/TestPrepare";
import Login from "./pages/Login";
import Settings from "./pages/Settings";
import VerifyEmail from "./pages/VerifyEmail";
import CheckInAbout from "./pages/CheckInAbout";
import CheckInIdentity from "./pages/CheckInIdentity";
import AppIcon, { type AppIconName } from "./components/AppIcon";

const NAV_ITEMS: { to: string; label: string; icon: AppIconName }[] = [
  { to: "/dashboard", label: "Dashboard", icon: "dashboard" },
  { to: "/results", label: "My Results", icon: "results" },
  { to: "/practice", label: "Practice", icon: "practice" },
  { to: "/book", label: "Purchase Test", icon: "purchase" },
  { to: "/settings", label: "Settings", icon: "settings" },
];

function AppShell({ children }: { children: React.ReactNode }) {
  const loc = useLocation();
  const isFullscreen =
    loc.pathname === "/" || loc.pathname === "/login" || loc.pathname === "/verify-email";
  if (isFullscreen) return <>{children}</>;

  return (
    <div className="app-shell">
      {/* Sidebar — desktop only */}
      <aside className="app-sidebar">
        {/* Logo */}
        <div style={{ padding: "28px 18px", borderBottom: "1.5px solid var(--border)" }}>
          <Link to="/dashboard" style={{ textDecoration: "none" }}>
            <img
              src={idpEnglishTestLogo}
              alt="IDP English Test"
              style={{ width: "100%", height: "auto", objectFit: "contain", display: "block" }}
            />
          </Link>
        </div>

        {/* Score badge */}
        <div style={{ margin: "16px 14px", background: "var(--color-cream)", borderRadius: 12, padding: "14px 16px", border: "1.5px solid #FF6A0025" }}>
          <p style={{ fontSize: 10, fontWeight: 700, color: "var(--color-slate)", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 6 }}>Overall Score</p>
          <div className="flex items-end gap-1 mb-1">
            <span style={{ fontSize: 28, fontWeight: 900, color: "var(--color-ink)", lineHeight: 1 }}>78</span>
            <span style={{ fontSize: 12, color: "var(--color-slate)", paddingBottom: 3 }}>/120</span>
          </div>
          <span style={{
            fontSize: 11, fontWeight: 700, padding: "3px 10px", borderRadius: 20,
            background: "var(--color-action-primary)", color: "white",
          }}>B2 Upper Intermediate</span>
        </div>

        {/* Nav */}
        <nav style={{ padding: "8px 10px", flex: 1 }}>
          <p style={{ fontSize: 10, fontWeight: 700, color: "var(--color-slate)", textTransform: "uppercase", letterSpacing: "0.1em", padding: "0 8px 8px" }}>Menu</p>
          {NAV_ITEMS.map(({ to, label, icon }) => (
            <NavLink key={to} to={to} style={({ isActive }) => ({
              display: "flex", alignItems: "center", gap: 10,
              padding: "10px 12px", borderRadius: 8, textDecoration: "none",
              fontSize: 13, fontWeight: 700, marginBottom: 2,
              background: isActive ? "var(--color-cream)" : "transparent",
              color: isActive ? "#FF6A00" : "var(--color-slate)",
              borderLeft: isActive ? "3px solid #FF6A00" : "3px solid transparent",
              transition: "all 0.15s",
            })}>
              <span className="app-nav-icon"><AppIcon name={icon} size={18} /></span>
              {label}
            </NavLink>
          ))}
        </nav>

        {/* User */}
        <div style={{ padding: "14px 16px", borderTop: "1.5px solid var(--border)", display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{
            width: 32, height: 32, borderRadius: "50%",
            background: "var(--color-action-primary)",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 12, fontWeight: 800, color: "white", flexShrink: 0,
          }}>AL</div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: "var(--color-ink)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>Agnes Lee</div>
            <div style={{ fontSize: 10, color: "var(--color-slate)" }}>a.lee@email.com</div>
          </div>
          <Link to="/" style={{ fontSize: 10, color: "var(--color-slate)", textDecoration: "none", fontWeight: 600 }}>Sign out</Link>
        </div>
      </aside>

      {/* Main */}
      <main className="app-main">
        {/* Top bar */}
        <div className="app-topbar flex items-center justify-between mb-8">
          <div>
            <PageTitle />
          </div>
          <div className="flex items-center gap-3" style={{ flexWrap: "wrap", justifyContent: "flex-end" }}>
            <div style={{
              fontSize: 11, fontWeight: 700, padding: "5px 12px", borderRadius: 20,
              background: "var(--color-cream)", color: "#FF6A00", border: "1.5px solid #FF6A0030",
            }}>Latest test taken on 2 Jul 2026</div>
            <Link to="/book" style={{
              padding: "8px 16px", borderRadius: 8,
              background: "var(--color-action-primary)", color: "white",
              fontSize: 12, fontWeight: 800, textDecoration: "none",
            }}>Purchase a Test →</Link>
          </div>
        </div>
        {children}
      </main>

      {/* Bottom nav — mobile only */}
      <nav className="app-bottom-nav">
        {NAV_ITEMS.map(({ to, label, icon }) => (
          <NavLink key={to} to={to} style={({ isActive }) => ({
            display: "flex", flexDirection: "column", alignItems: "center", gap: 3,
            textDecoration: "none", padding: "6px 4px",
            color: isActive ? "#FF6A00" : "var(--color-slate)",
            flex: 1,
          })}>
            <span className="app-nav-icon"><AppIcon name={icon} size={20} /></span>
            <span style={{ fontSize: 9, fontWeight: 700 }}>{label}</span>
          </NavLink>
        ))}
      </nav>
    </div>
  );
}

function PageTitle() {
  const loc = useLocation();
  const titles: Record<string, string> = {
    "/dashboard": "My Dashboard",
    "/results": "My Results",
    "/practice": "Practice",
    "/book": "Purchase Test",
    "/test-prepare": "Before You Start",
    "/check-in/about": "Test Check-in",
    "/check-in/identity": "Test Check-in",
    "/settings": "Settings",
  };
  return (
    <h1 style={{ fontSize: 20, fontWeight: 900, color: "var(--color-ink)" }}>
      {titles[loc.pathname] ?? "IDP"}
    </h1>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AppShell>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/login" element={<Login />} />
          <Route path="/verify-email" element={<VerifyEmail />} />
          <Route path="/check-in/about" element={<CheckInAbout />} />
          <Route path="/check-in/identity" element={<CheckInIdentity />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/results" element={<Results />} />
          <Route path="/practice" element={<Practice />} />
          <Route path="/book" element={<Book />} />
          <Route path="/test-prepare" element={<TestPrepare />} />
          <Route path="/settings" element={<Settings />} />
        </Routes>
      </AppShell>
    </BrowserRouter>
  );
}

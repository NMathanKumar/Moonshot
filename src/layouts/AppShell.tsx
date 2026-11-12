/**
 * AppShell - authenticated layout (sidebar, top bar, mobile bottom nav)
 */

import type { ReactNode } from 'react';
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '@hooks/useAuth';
import AppIcon, { type AppIconName } from '@components/AppIcon';
import idpEnglishTestLogo from '@assets/idp-english-test-logo.png';

const NAV_ITEMS: { to: string; label: string; icon: AppIconName }[] = [
  { to: '/dashboard', label: 'Dashboard', icon: 'dashboard' },
  { to: '/results', label: 'My Results', icon: 'results' },
  { to: '/practice', label: 'Practice', icon: 'practice' },
  { to: '/book', label: 'Purchase Test', icon: 'purchase' },
  { to: '/settings', label: 'Settings', icon: 'settings' },
];

const TITLES: Record<string, string> = {
  '/dashboard': 'My Dashboard',
  '/results': 'My Results',
  '/practice': 'Practice',
  '/test-prepare': 'Before You Start',
  '/check-in/about': 'Test Check-in',
  '/check-in/identity': 'Test Check-in',
  '/book': 'Purchase Test',
  '/settings': 'Settings',
};

interface AppShellProps {
  children: ReactNode;
  displayName?: string;
  email?: string;
}

function getInitials(name: string): string {
  return (
    name
      .split(/\s+/)
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part.charAt(0).toUpperCase())
      .join('') || 'U'
  );
}

export default function AppShell({
  children,
  displayName = 'Agnes Lee',
  email = 'a.lee@email.com',
}: AppShellProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const { signOut } = useAuth();

  return (
    <div className="app-shell">
      <aside className="app-sidebar">
        <div style={{ padding: '28px 18px', borderBottom: '1.5px solid var(--border)' }}>
          <Link to="/dashboard" style={{ textDecoration: 'none' }}>
            <img
              src={idpEnglishTestLogo}
              alt="IDP English Test"
              style={{ width: '100%', height: 'auto', objectFit: 'contain', display: 'block' }}
            />
          </Link>
        </div>

        <div
          style={{
            margin: '16px 14px',
            background: 'var(--color-cream)',
            borderRadius: 12,
            padding: '14px 16px',
            border: '1.5px solid #FF6A0025',
          }}
        >
          <p
            style={{
              fontSize: 10,
              fontWeight: 700,
              color: 'var(--color-slate)',
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
              marginBottom: 6,
            }}
          >
            Overall Score
          </p>
          <div className="flex items-end gap-1 mb-1">
            <span
              style={{ fontSize: 28, fontWeight: 900, color: 'var(--color-ink)', lineHeight: 1 }}
            >
              78
            </span>
            <span style={{ fontSize: 12, color: 'var(--color-slate)', paddingBottom: 3 }}>
              /120
            </span>
          </div>
          <span
            style={{
              fontSize: 11,
              fontWeight: 700,
              padding: '3px 10px',
              borderRadius: 20,
              background: 'var(--color-action-primary)',
              color: 'white',
              display: 'inline-block',
            }}
          >
            B2 Upper Intermediate
          </span>
        </div>

        <nav style={{ padding: '8px 10px', flex: 1 }}>
          <p
            style={{
              fontSize: 10,
              fontWeight: 700,
              color: 'var(--color-slate)',
              textTransform: 'uppercase',
              letterSpacing: '0.1em',
              padding: '0 8px 8px',
              marginBottom: 0,
            }}
          >
            Menu
          </p>
          {NAV_ITEMS.map(({ to, label, icon }) => (
            <NavLink
              key={to}
              to={to}
              style={({ isActive }) => ({
                display: 'flex',
                alignItems: 'center',
                gap: 10,
                padding: '10px 12px',
                borderRadius: 8,
                textDecoration: 'none',
                fontSize: 13,
                fontWeight: 700,
                marginBottom: 2,
                background: isActive ? 'var(--color-cream)' : 'transparent',
                color: isActive ? '#FF6A00' : 'var(--color-slate)',
                borderLeft: isActive ? '3px solid #FF6A00' : '3px solid transparent',
                transition: 'all 0.15s',
              })}
            >
              <span className="app-nav-icon">
                <AppIcon name={icon} size={18} />
              </span>
              {label}
            </NavLink>
          ))}
        </nav>

        <div
          style={{
            padding: '14px 16px',
            borderTop: '1.5px solid var(--border)',
            display: 'flex',
            alignItems: 'center',
            gap: 10,
          }}
        >
          <div
            style={{
              width: 32,
              height: 32,
              borderRadius: '50%',
              background: 'var(--color-action-primary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 12,
              fontWeight: 800,
              color: 'white',
              flexShrink: 0,
            }}
          >
            {getInitials(displayName)}
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div
              style={{
                fontSize: 12,
                fontWeight: 700,
                color: 'var(--color-ink)',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
              }}
            >
              {displayName}
            </div>
            <div
              style={{
                fontSize: 10,
                color: 'var(--color-slate)',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
              }}
            >
              {email}
            </div>
          </div>
          <button
            type="button"
            onClick={async () => {
              await signOut();
              navigate('/signin', { replace: true });
            }}
            style={{
              fontSize: 10,
              color: 'var(--color-slate)',
              fontWeight: 600,
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              padding: 0,
              outline: 'none',
            }}
          >
            Sign out
          </button>
        </div>
      </aside>

      <main className="app-main">
        <div className="flex items-center justify-between mb-8">
          <h1
            style={{
              fontSize: 20,
              fontWeight: 900,
              color: 'var(--color-ink)',
              margin: 0,
              lineHeight: 1.2,
            }}
          >
            {TITLES[location.pathname] ?? 'IDP'}
          </h1>
          <div
            className="flex items-center gap-3"
            style={{ flexWrap: 'wrap', justifyContent: 'flex-end' }}
          >
            <div
              style={{
                fontSize: 11,
                fontWeight: 700,
                padding: '5px 12px',
                borderRadius: 20,
                background: 'var(--color-cream)',
                color: '#FF6A00',
                border: '1.5px solid #FF6A0030',
              }}
            >
              Latest test taken on 2 Jul 2026
            </div>
            <Link
              to="/book"
              style={{
                padding: '8px 16px',
                borderRadius: 8,
                background: 'var(--color-action-primary)',
                color: 'white',
                fontSize: 12,
                fontWeight: 800,
                textDecoration: 'none',
              }}
            >
              Purchase a Test →
            </Link>
          </div>
        </div>
        {children}
      </main>

      <nav className="app-bottom-nav">
        {NAV_ITEMS.map(({ to, label, icon }) => (
          <NavLink
            key={to}
            to={to}
            style={({ isActive }) => ({
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 3,
              textDecoration: 'none',
              padding: '6px 4px',
              color: isActive ? '#FF6A00' : 'var(--color-slate)',
              flex: 1,
            })}
          >
            <span className="app-nav-icon">
              <AppIcon name={icon} size={20} />
            </span>
            <span style={{ fontSize: 9, fontWeight: 700 }}>{label}</span>
          </NavLink>
        ))}
      </nav>
    </div>
  );
}

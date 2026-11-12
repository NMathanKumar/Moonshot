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
    <div className="flex min-h-screen bg-[rgb(247,249,250)] md:flex-row flex-col md:pb-0 pb-16">
      {/* Sidebar - hidden on mobile, visible on md+ */}
      <aside className="w-[248px] bg-white border-r border-[#e9edf0] flex flex-col flex-shrink-0 sticky top-0 h-screen hidden md:flex">
        {/* Logo */}
        <div className="px-[18px] py-7 border-b border-[#dde2e7]">
          <Link to="/dashboard" className="no-underline">
            <img
              src={idpEnglishTestLogo}
              alt="IDP English Test"
              className="w-full h-auto object-contain block"
            />
          </Link>
        </div>

        {/* Score Card */}
        <div className="mx-[14px] my-4 bg-[#fff3ea] rounded-[12px] p-4 border border-[#FF6A0025]">
          <p className="text-[10px] font-bold text-[#55657b] uppercase tracking-[0.08em] mb-1.5 m-0">
            Overall Score
          </p>
          <div className="flex items-end gap-0.5 mb-0.5">
            <span className="text-[28px] font-black text-[#232d3f] leading-none">78</span>
            <span className="text-[12px] text-[#55657b] pb-[3px]">/120</span>
          </div>
          <span className="text-[11px] font-bold px-2.5 rounded-full bg-[#eb7900] text-white inline-block">
            B2 Upper Intermediate
          </span>
        </div>

        {/* Navigation */}
        <nav className="px-2.5 py-2.5 flex-1">
          <p className="text-[10px] font-bold text-[#55657b] uppercase tracking-[0.1em] px-2 pb-2 m-0">
            Menu
          </p>
          {NAV_ITEMS.map(({ to, label, icon }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                `flex items-center gap-2.5 px-3 py-[10px] rounded-lg no-underline text-[13px] font-bold mb-0.5 transition-all duration-150 ${
                  isActive
                    ? 'bg-[#fff3ea] text-[#FF6A00] border-l-[3px] border-[#FF6A00]'
                    : 'text-[#55657b] border-l-[3px] border-transparent'
                }`
              }
            >
              <span className="inline-flex items-center justify-center w-[30px] h-[30px] flex-shrink-0 rounded-lg">
                <AppIcon name={icon} size={18} />
              </span>
              {label}
            </NavLink>
          ))}
        </nav>

        {/* User Profile */}
        <div className="px-4 py-3.5 border-t border-[#dde2e7] flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-full bg-[#eb7900] flex items-center justify-center text-[12px] font-black text-white flex-shrink-0">
            {getInitials(displayName)}
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-[12px] font-bold text-[#232d3f] whitespace-nowrap overflow-hidden text-ellipsis">
              {displayName}
            </div>
            <div className="text-[10px] text-[#55657b] whitespace-nowrap overflow-hidden text-ellipsis">
              {email}
            </div>
          </div>
          <button
            type="button"
            onClick={async () => {
              await signOut();
              navigate('/signin', { replace: true });
            }}
            className="text-[10px] text-[#55657b] font-semibold bg-transparent border-none cursor-pointer p-0 outline-none"
          >
            Sign out
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 md:px-[clamp(24px,4vw,56px)] md:py-9 px-4 py-6 overflow-auto min-w-0">
        <div className="flex items-center justify-between mb-8 flex-wrap gap-2.5 md:flex-nowrap">
          <h1 className="text-[20px] font-black text-[#232d3f] m-0 leading-tight">
            {TITLES[location.pathname] ?? 'IDP'}
          </h1>
          <div className="flex items-center gap-3 flex-wrap justify-end">
            <div className="text-[11px] font-bold px-3 rounded-full bg-[#fff3ea] text-[#FF6A00] border border-[#FF6A0030]">
              Latest test taken on 2 Jul 2026
            </div>
            <Link
              to="/book"
              className="px-4 py-2 rounded-lg bg-[#eb7900] text-white text-[12px] font-black no-underline whitespace-nowrap"
            >
              Purchase a Test →
            </Link>
          </div>
        </div>
        {children}
      </main>

      {/* Mobile Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-[#e9edf0] shadow-[0_-8px_24px_rgba(35,45,63,0.07)] z-[100] md:hidden flex flex-row px-0 py-[6px]">
        {NAV_ITEMS.map(({ to, label, icon }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `flex flex-col items-center gap-[3px] no-underline px-1 py-1.5 flex-1 ${
                isActive ? 'text-[#FF6A00]' : 'text-[#55657b]'
              }`
            }
          >
            <span className="inline-flex items-center justify-center w-[30px] h-[30px] flex-shrink-0 rounded-lg">
              <AppIcon name={icon} size={20} />
            </span>
            <span className="text-[9px] font-bold">{label}</span>
          </NavLink>
        ))}
      </nav>
    </div>
  );
}

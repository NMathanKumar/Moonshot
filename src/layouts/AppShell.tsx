/**
 * AppShell - authenticated layout (sidebar, top bar, mobile bottom nav)
 * Sidebar is now a separate reusable component
 */

import type { ReactNode } from 'react';
import { Link, NavLink } from 'react-router-dom';
import AppIcon, { type AppIconName } from '@components/AppIcon';
import { Sidebar } from '@components/Sidebar';

const NAV_ITEMS: { to: string; label: string; icon: AppIconName }[] = [
  { to: '/dashboard', label: 'Dashboard', icon: 'dashboard' },
  { to: '/results', label: 'My Results', icon: 'results' },
  { to: '/practice', label: 'Practice', icon: 'practice' },
  { to: '/book', label: 'Purchase Test', icon: 'purchase' },
  { to: '/settings', label: 'Settings', icon: 'settings' },
];

interface AppShellProps {
  children: ReactNode;
}

export default function AppShell({ children }: AppShellProps) {
  return (
    <div className="flex min-h-screen bg-[rgb(247,249,250)] md:flex-row flex-col md:pb-0 pb-16">
      {/* Sidebar Component */}
      <Sidebar />

      {/* Main Content */}
      <main className="flex-1 md:px-[clamp(24px,4vw,56px)] md:py-9 px-4 py-6 overflow-auto min-w-0">
        <div className="flex items-center justify-end mb-8 flex-wrap gap-2.5 md:flex-nowrap">
          <div className="flex items-center gap-3 flex-wrap justify-end">
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
                isActive ? 'text-[#EB7900]' : 'text-[#55657b]'
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

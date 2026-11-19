import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import AppShell from './AppShell';

vi.mock('@components/Sidebar', () => ({
  Sidebar: () => <aside data-testid="sidebar">Sidebar</aside>,
}));

function renderAppShell(path: string) {
  return render(
    <MemoryRouter initialEntries={[path]}>
      <AppShell>
        <div>Content</div>
      </AppShell>
    </MemoryRouter>
  );
}

describe('AppShell - Shared top bar (MSP-2715 extended)', () => {
  it('does not render any top-bar H1 on /settings', () => {
    renderAppShell('/settings');
    expect(screen.queryByRole('heading', { level: 1 })).not.toBeInTheDocument();
  });

  it('does not render any top-bar H1 on /dashboard', () => {
    renderAppShell('/dashboard');
    expect(screen.queryByRole('heading', { level: 1 })).not.toBeInTheDocument();
  });

  it('does not render any top-bar H1 on /practice', () => {
    renderAppShell('/practice');
    expect(screen.queryByRole('heading', { level: 1 })).not.toBeInTheDocument();
  });

  it('does not render any top-bar H1 on /results', () => {
    renderAppShell('/results');
    expect(screen.queryByRole('heading', { level: 1 })).not.toBeInTheDocument();
  });

  it('does not render any top-bar H1 on /book', () => {
    renderAppShell('/book');
    expect(screen.queryByRole('heading', { level: 1 })).not.toBeInTheDocument();
  });

  it('does not render any top-bar H1 on /test-prepare', () => {
    renderAppShell('/test-prepare');
    expect(screen.queryByRole('heading', { level: 1 })).not.toBeInTheDocument();
  });

  it('does not render any top-bar H1 on /check-in/about', () => {
    renderAppShell('/check-in/about');
    expect(screen.queryByRole('heading', { level: 1 })).not.toBeInTheDocument();
  });

  it('does not render any top-bar H1 on /check-in/identity', () => {
    renderAppShell('/check-in/identity');
    expect(screen.queryByRole('heading', { level: 1 })).not.toBeInTheDocument();
  });

  it('renders the Purchase a Test action link on every route', () => {
    const routes = [
      '/dashboard',
      '/practice',
      '/results',
      '/settings',
      '/book',
      '/test-prepare',
      '/check-in/about',
    ];
    for (const path of routes) {
      const { unmount } = renderAppShell(path);
      expect(
        screen.getByRole('link', { name: /purchase a test/i }),
        `Purchase a Test link missing on ${path}`
      ).toBeInTheDocument();
      unmount();
    }
  });
});

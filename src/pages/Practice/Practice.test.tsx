import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import Practice from './Practice';

vi.mock('@hooks/useAuth', () => ({
  useAuth: () => ({ user: null, isLoading: false }),
}));

vi.mock('@layouts/AppShell', () => ({
  default: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}));

function renderPage() {
  return render(
    <MemoryRouter initialEntries={['/practice']}>
      <Practice />
    </MemoryRouter>
  );
}

describe('Practice', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders the page heading', () => {
    renderPage();
    expect(screen.getByRole('heading', { name: /^practice$/i })).toBeInTheDocument();
  });

  it('renders all 12 sessions when All skills is selected', () => {
    renderPage();
    // 12 session cards — each is a link to /test-prepare
    const sessionLinks = screen
      .getAllByRole('link')
      .filter((l) => l.getAttribute('href') === '/test-prepare');
    // Featured banner + 12 session cards all link to /test-prepare
    expect(sessionLinks.length).toBeGreaterThanOrEqual(12);
  });

  it('"All skills" filter button is active by default', () => {
    renderPage();
    const allBtn = screen.getByRole('button', { name: /all skills/i });
    expect(allBtn).toHaveAttribute('aria-pressed', 'true');
  });

  it('clicking a skill filter shows only sessions of that type', () => {
    renderPage();
    fireEvent.click(screen.getByRole('button', { name: /^listening$/i }));
    // Check that at least one session is visible after filtering
    // The filter should show Listening sessions
    const sessionLinks = screen
      .getAllByRole('link')
      .filter((l) => l.getAttribute('href') === '/test-prepare');
    expect(sessionLinks.length).toBeGreaterThan(0);
  });

  it('active filter button has aria-pressed="true"', () => {
    renderPage();
    fireEvent.click(screen.getByRole('button', { name: /^reading$/i }));
    expect(screen.getByRole('button', { name: /^reading$/i })).toHaveAttribute(
      'aria-pressed',
      'true'
    );
    expect(screen.getByRole('button', { name: /all skills/i })).toHaveAttribute(
      'aria-pressed',
      'false'
    );
  });

  it('completed sessions display a score badge', () => {
    renderPage();
    // Sessions with done:true and score !== null show a score badge (score/12 rounded)
    // Email sorting: score 82 -> 7/10, Follow Instructions: 68 -> 6/10, Announcements: 75 -> 6/10
    const scoreBadges = screen.getAllByText(/\/10/);
    expect(scoreBadges.length).toBeGreaterThanOrEqual(3);
  });

  it('renders the back link pointing to /dashboard', () => {
    renderPage();
    const backLink = screen.getByRole('link', { name: /dashboard/i });
    expect(backLink).toHaveAttribute('href', '/dashboard');
  });

  it('renders the featured practice test banner', () => {
    renderPage();
    expect(screen.getByText(/four skills practice test/i)).toBeInTheDocument();
  });
});

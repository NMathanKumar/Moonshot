import { render, screen, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import Dashboard from './Dashboard';

const mockNavigate = vi.fn();

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
    useLocation: () => ({ state: null, pathname: '/dashboard' }),
  };
});

vi.mock('@layouts/AppShell', () => ({
  default: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}));

const mockGetTestTaker = vi.fn();
vi.mock('@services', () => ({
  EnrolmentService: { getTestTaker: () => mockGetTestTaker() },
}));

vi.mock('@utils/checkIn', () => ({
  isCheckInComplete: vi.fn(() => false),
}));

// Controlled auth mock — overridden per test
let mockAuthState = {
  user: null as null | { username: string; given_name?: string },
  isLoading: false,
};

vi.mock('@hooks/useAuth', () => ({
  useAuth: () => mockAuthState,
}));

function renderPage() {
  return render(
    <MemoryRouter initialEntries={['/dashboard']}>
      <Dashboard />
    </MemoryRouter>
  );
}

describe('Dashboard', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockGetTestTaker.mockResolvedValue(null);
    mockAuthState = { user: null, isLoading: false };
  });

  it('redirects to /signin when unauthenticated and not loading', async () => {
    mockAuthState = { user: null, isLoading: false };
    renderPage();
    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/signin', { replace: true });
    });
  });

  it('shows loading spinner while auth is initialising', () => {
    mockAuthState = { user: null, isLoading: true };
    renderPage();
    expect(screen.getByText(/loading your dashboard/i)).toBeInTheDocument();
  });

  it('renders welcome heading with user first name when authenticated', async () => {
    mockAuthState = { user: { username: 'test@example.com', given_name: 'Agnes' }, isLoading: false };
    renderPage();
    await waitFor(() => {
      expect(screen.getByRole('heading', { name: /welcome back, agnes/i })).toBeInTheDocument();
    });
  });

  it('calls EnrolmentService.getTestTaker once when authenticated', async () => {
    mockAuthState = { user: { username: 'test@example.com' }, isLoading: false };
    renderPage();
    await waitFor(() => {
      expect(mockGetTestTaker).toHaveBeenCalledTimes(1);
    });
  });

  it('does not call EnrolmentService.getTestTaker when loading', () => {
    mockAuthState = { user: null, isLoading: true };
    renderPage();
    expect(mockGetTestTaker).not.toHaveBeenCalled();
  });

  it('shows Check-in CTA when check-in is not complete', async () => {
    mockAuthState = { user: { username: 'test@example.com' }, isLoading: false };
    renderPage();
    await waitFor(() => {
      expect(screen.getByRole('link', { name: /check-in/i })).toBeInTheDocument();
    });
  });

  it('shows Start test CTA when check-in is complete', async () => {
    const { isCheckInComplete } = await import('@utils/checkIn');
    vi.mocked(isCheckInComplete).mockReturnValue(true);
    mockAuthState = { user: { username: 'test@example.com' }, isLoading: false };
    renderPage();
    await waitFor(() => {
      expect(screen.getByRole('link', { name: /start test/i })).toBeInTheDocument();
    }, { timeout: 10000 });
  });

  it('renders all four skill score cards', async () => {
    mockAuthState = { user: { username: 'test@example.com' }, isLoading: false };
    renderPage();
    await waitFor(() => {
      expect(screen.getByText('Listening')).toBeInTheDocument();
      expect(screen.getByText('Reading')).toBeInTheDocument();
      expect(screen.getByText('Speaking')).toBeInTheDocument();
      expect(screen.getByText('Writing')).toBeInTheDocument();
    });
  });

  it('renders View full results link pointing to /results', async () => {
    mockAuthState = { user: { username: 'test@example.com' }, isLoading: false };
    renderPage();
    await waitFor(() => {
      const link = screen.getByRole('link', { name: /view full results/i });
      expect(link).toHaveAttribute('href', '/results');
    });
  });

  it('does not crash when EnrolmentService.getTestTaker rejects', async () => {
    mockGetTestTaker.mockRejectedValue(new Error('Network error'));
    mockAuthState = { user: { username: 'test@example.com' }, isLoading: false };
    renderPage();
    await waitFor(() => {
      expect(screen.getByRole('heading', { name: /welcome back/i })).toBeInTheDocument();
    });
  });
});

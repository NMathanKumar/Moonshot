import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import Settings from './Settings';

const mockNavigate = vi.fn();
const mockGetTestTaker = vi.fn();

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

vi.mock('@hooks/useAuth', () => ({
  useAuth: () => ({
    user: { signInDetails: { loginId: 'test@example.com' } },
    isLoading: false,
  }),
}));

vi.mock('@layouts/AppShell', () => ({
  default: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}));

vi.mock('@services', () => ({
  EnrolmentService: { getTestTaker: () => mockGetTestTaker() },
}));

function renderPage() {
  return render(
    <MemoryRouter initialEntries={['/settings']}>
      <Settings />
    </MemoryRouter>
  );
}

describe('Settings', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockGetTestTaker.mockResolvedValue(null);
  });

  it('renders the page heading', () => {
    renderPage();
    expect(screen.getByRole('heading', { name: /settings/i })).toBeInTheDocument();
  });

  it('renders tab sidebar with Profile, Password, Notifications, Account', () => {
    renderPage();
    expect(screen.getByRole('tab', { name: 'Profile' })).toBeInTheDocument();
    expect(screen.getByRole('tab', { name: 'Password' })).toBeInTheDocument();
    expect(screen.getByRole('tab', { name: 'Notifications' })).toBeInTheDocument();
    expect(screen.getByRole('tab', { name: 'Account' })).toBeInTheDocument();
  });

  it('highlights active tab', () => {
    renderPage();
    const profileTab = screen.getByRole('tab', { name: 'Profile' });
    expect(profileTab).toHaveAttribute('aria-selected', 'true');
  });

  it('loads test taker profile from EnrolmentService', async () => {
    renderPage();
    await waitFor(() => {
      expect(mockGetTestTaker).toHaveBeenCalledTimes(1);
    });
  });

  it('shows profile section fields', async () => {
    renderPage();
    await waitFor(() => {
      expect(screen.getByLabelText(/first name/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/last name/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/date of birth/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/gender/i)).toBeInTheDocument();
    });
  });

  it('renders support email link', () => {
    renderPage();
    expect(screen.getByRole('link', { name: /support@idpenglishtest\.com/i })).toBeInTheDocument();
  });

  it('shows password tab fields when clicked', async () => {
    renderPage();
    fireEvent.click(screen.getByRole('tab', { name: 'Password' }));

    expect(screen.getByLabelText(/current password/i)).toBeInTheDocument();
    expect(screen.getAllByLabelText(/new password/i).length).toBeGreaterThan(0);
    expect(screen.getByLabelText(/confirm new password/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /change password/i })).toBeInTheDocument();
  });

  it('shows notifications tab with toggle switches', async () => {
    renderPage();
    fireEvent.click(screen.getByRole('tab', { name: 'Notifications' }));

    expect(screen.getByText(/results ready/i)).toBeInTheDocument();
    expect(screen.getByText(/practice reminders/i)).toBeInTheDocument();
    expect(screen.getByText(/study tips/i)).toBeInTheDocument();
    expect(screen.getByText(/platform updates/i)).toBeInTheDocument();

    // Should have 4 toggle switches
    const toggles = screen.getAllByRole('switch');
    expect(toggles.length).toBe(4);
  });

  it('toggles notification preferences', async () => {
    renderPage();
    fireEvent.click(screen.getByRole('tab', { name: 'Notifications' }));

    const resultsToggle = screen.getByRole('switch', { name: /results ready/i });
    expect(resultsToggle).toHaveAttribute('aria-checked', 'true');

    fireEvent.click(resultsToggle);
    expect(resultsToggle).toHaveAttribute('aria-checked', 'false');
  });

  it('shows test access section in account tab', async () => {
    renderPage();
    fireEvent.click(screen.getByRole('tab', { name: 'Account' }));

    expect(screen.getByText(/envoy high-stakes test/i)).toBeInTheDocument();
    expect(screen.getByText(/completed/i)).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /\+ purchase another test/i })).toBeInTheDocument();
  });

  it('shows danger zone in account tab', async () => {
    renderPage();
    fireEvent.click(screen.getByRole('tab', { name: 'Account' }));

    expect(screen.getByRole('button', { name: /delete my account/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /delete my account/i })).toBeDisabled();
  });

  it('renders back link to dashboard', () => {
    renderPage();
    expect(screen.getByRole('link', { name: '← Dashboard' })).toBeInTheDocument();
  });
});

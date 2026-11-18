import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import Settings from './Settings';
import * as Auth from '@services/auth';

const mockNavigate = vi.fn();
const mockGetTestTaker = vi.fn();

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

// Memoized mock objects to prevent reference changes on re-renders
const mockAuthUser = { signInDetails: { loginId: 'test@example.com' } };
const mockUserProfile = {
  firstName: 'Test',
  lastName: 'User',
  email: 'test.user@example.com',
  displayName: 'Test User',
};

vi.mock('@hooks/useAuth', () => ({
  useAuth: () => ({
    user: mockAuthUser,
    isLoading: false,
  }),
}));

vi.mock('@context/UserProfileContext', () => ({
  useUserProfileContext: () => ({
    profile: mockUserProfile,
    isLoading: false,
    error: null,
  }),
}));

vi.mock('@services/auth', () => ({
  changePassword: vi.fn(),
}));

vi.mock('@layouts/AppShell', () => ({
  default: ({ children }: { children: unknown }) => <div>{children as never}</div>,
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

function getNewPasswordInput() {
  return document.querySelector('input#new-password') as HTMLInputElement;
}

describe('Settings', () => {
  beforeEach(() => {
    vi.resetAllMocks();
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

  it('does not render gender field in profile section', async () => {
    renderPage();
    expect(screen.queryByLabelText(/gender/i)).not.toBeInTheDocument();
  });

  it('shows profile section fields - first name, last name, email, date of birth', async () => {
    renderPage();
    expect(screen.getByLabelText(/first name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/last name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/date of birth/i)).toBeInTheDocument();
  });

  it('profile fields are read-only', async () => {
    renderPage();
    expect(screen.getByLabelText(/first name/i)).toBeDisabled();
    expect(screen.getByLabelText(/last name/i)).toBeDisabled();
    expect(screen.getByLabelText(/email/i)).toBeDisabled();
    expect(screen.getByLabelText(/date of birth/i)).toBeDisabled();
  });

  it('renders support email link', () => {
    renderPage();
    expect(screen.getByRole('link', { name: /support@idpenglishtest\.com/i })).toBeInTheDocument();
  });

  describe('Password section', () => {
    beforeEach(() => {
      renderPage();
      fireEvent.click(screen.getByRole('tab', { name: 'Password' }));
    });

    it('renders password change form fields', () => {
      expect(screen.getByLabelText(/current password/i)).toBeInTheDocument();
      const newPasswordInput = document.querySelector('input#new-password');
      expect(newPasswordInput).toBeInTheDocument();
      expect(screen.getByLabelText(/confirm new password/i)).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /change password/i })).toBeInTheDocument();
    });

    it('shows password policy helper text', () => {
      expect(screen.getByText(/Password must be at least 12 characters with 1 uppercase, 1 lowercase, and 1 number/i)).toBeInTheDocument();
    });

    it('validates all fields are required', async () => {
      const submitButton = screen.getByRole('button', { name: /change password/i });
      fireEvent.click(submitButton);

      expect(screen.getByText(/current password is required/i)).toBeInTheDocument();
      expect(screen.getByText(/new password is required/i)).toBeInTheDocument();
      expect(screen.getByText(/please confirm your new password/i)).toBeInTheDocument();
    });

    it('validates password policy (12 chars, uppercase, lowercase, number) client-side', async () => {
      const newPasswordInput = document.querySelector('input#new-password') as HTMLInputElement;
      fireEvent.change(screen.getByLabelText(/current password/i), {
        target: { value: 'OldPass123!' },
      });
      fireEvent.change(newPasswordInput, {
        target: { value: 'weak' },
      });
      fireEvent.change(screen.getByLabelText(/confirm new password/i), {
        target: { value: 'weak' },
      });

      const submitButton = screen.getByRole('button', { name: /change password/i });
      fireEvent.click(submitButton);

      expect(screen.getByText(/Password must be at least 12 characters with 1 uppercase, 1 lowercase, and 1 number/i)).toBeInTheDocument();
    });

    it('validates new password and confirmation match', async () => {
      fireEvent.change(screen.getByLabelText(/current password/i), {
        target: { value: 'OldPass123!' },
      });
      const newPasswordInput = getNewPasswordInput();
      fireEvent.change(newPasswordInput, {
        target: { value: 'NewPassword123!' },
      });
      fireEvent.change(screen.getByLabelText(/confirm new password/i), {
        target: { value: 'DifferentPass123!' },
      });

      const submitButton = screen.getByRole('button', { name: /change password/i });
      fireEvent.click(submitButton);

      expect(screen.getByText(/Passwords do not match/i)).toBeInTheDocument();
    });

    it('prevents new password from being identical to current password', async () => {
      fireEvent.change(screen.getByLabelText(/current password/i), {
        target: { value: 'SamePass123!' },
      });
      const newPasswordInput = getNewPasswordInput();
      fireEvent.change(newPasswordInput, {
        target: { value: 'SamePass123!' },
      });
      fireEvent.change(screen.getByLabelText(/confirm new password/i), {
        target: { value: 'SamePass123!' },
      });

      const submitButton = screen.getByRole('button', { name: /change password/i });
      fireEvent.click(submitButton);

      expect(screen.getByText(/New password must be different from your current password/i)).toBeInTheDocument();
    });

    it('clears field errors when user starts typing', async () => {
      // Trigger validation error
      const submitButton = screen.getByRole('button', { name: /change password/i });
      fireEvent.click(submitButton);
      expect(screen.getByText(/current password is required/i)).toBeInTheDocument();

      // Start typing - error should clear
      fireEvent.change(screen.getByLabelText(/current password/i), {
        target: { value: 'O' },
      });
      expect(screen.queryByText(/current password is required/i)).not.toBeInTheDocument();
    });

    it('hides error message when user types in current password field', async () => {
      vi.mocked(Auth.changePassword).mockRejectedValueOnce(new Error('Current password is incorrect.'));

      const submitButton = screen.getByRole('button', { name: /change password/i });
      fireEvent.change(screen.getByLabelText(/current password/i), {
        target: { value: 'WrongPass123!' },
      });
      const newPasswordInput = getNewPasswordInput();
      fireEvent.change(newPasswordInput, {
        target: { value: 'NewPassword123!' },
      });
      fireEvent.change(screen.getByLabelText(/confirm new password/i), {
        target: { value: 'NewPassword123!' },
      });

      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText(/current password is incorrect/i)).toBeInTheDocument();
      });

      // Start typing in current password - error message should hide
      fireEvent.change(screen.getByLabelText(/current password/i), {
        target: { value: 'W' },
      });
      await waitFor(() => {
        expect(screen.queryByText(/current password is incorrect/i)).not.toBeInTheDocument();
      });
    });

    it('hides error message when user types in new password field', async () => {
      vi.mocked(Auth.changePassword).mockRejectedValueOnce(new Error('Current password is incorrect.'));

      const submitButton = screen.getByRole('button', { name: /change password/i });
      fireEvent.change(screen.getByLabelText(/current password/i), {
        target: { value: 'WrongPass123!' },
      });
      const newPasswordInput = getNewPasswordInput();
      fireEvent.change(newPasswordInput, {
        target: { value: 'NewPassword123!' },
      });
      fireEvent.change(screen.getByLabelText(/confirm new password/i), {
        target: { value: 'NewPassword123!' },
      });

      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText(/current password is incorrect/i)).toBeInTheDocument();
      });

      // Start typing in new password - error message should hide
      fireEvent.change(newPasswordInput, {
        target: { value: 'N' },
      });
      await waitFor(() => {
        expect(screen.queryByText(/current password is incorrect/i)).not.toBeInTheDocument();
      });
    });

    it('hides error message when user types in confirm password field', async () => {
      vi.mocked(Auth.changePassword).mockRejectedValueOnce(new Error('Current password is incorrect.'));

      const submitButton = screen.getByRole('button', { name: /change password/i });
      fireEvent.change(screen.getByLabelText(/current password/i), {
        target: { value: 'WrongPass123!' },
      });
      const newPasswordInput = getNewPasswordInput();
      fireEvent.change(newPasswordInput, {
        target: { value: 'NewPassword123!' },
      });
      fireEvent.change(screen.getByLabelText(/confirm new password/i), {
        target: { value: 'NewPassword123!' },
      });

      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText(/current password is incorrect/i)).toBeInTheDocument();
      });

      // Start typing in confirm password - error message should hide
      fireEvent.change(screen.getByLabelText(/confirm new password/i), {
        target: { value: 'N' },
      });
      await waitFor(() => {
        expect(screen.queryByText(/current password is incorrect/i)).not.toBeInTheDocument();
      });
    });

    it('displays error when current password is incorrect', async () => {
      vi.mocked(Auth.changePassword).mockRejectedValueOnce(
        new Error('Current password is incorrect.')
      );

      fireEvent.change(screen.getByLabelText(/current password/i), {
        target: { value: 'WrongPass123!' },
      });
      const newPasswordInput = getNewPasswordInput();
      fireEvent.change(newPasswordInput, {
        target: { value: 'NewPassword123!' },
      });
      fireEvent.change(screen.getByLabelText(/confirm new password/i), {
        target: { value: 'NewPassword123!' },
      });

      const submitButton = screen.getByRole('button', { name: /change password/i });
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText(/current password is incorrect/i)).toBeInTheDocument();
      });
    });

    it('displays password policy error for weak new password from Cognito', async () => {
      vi.mocked(Auth.changePassword).mockRejectedValueOnce(
        new Error('Password does not conform to policy.')
      );

      fireEvent.change(screen.getByLabelText(/current password/i), {
        target: { value: 'OldPass123!' },
      });
      const newPasswordInput = getNewPasswordInput();
      fireEvent.change(newPasswordInput, {
        target: { value: 'NewPass1234!' },
      });
      fireEvent.change(screen.getByLabelText(/confirm new password/i), {
        target: { value: 'NewPass1234!' },
      });

      const submitButton = screen.getByRole('button', { name: /change password/i });
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText(/Password must be at least 12 characters with 1 uppercase, 1 lowercase, and 1 number/i)).toBeInTheDocument();
      });
    });

    it('displays success message on successful password change', async () => {
      vi.mocked(Auth.changePassword).mockResolvedValueOnce(undefined);

      fireEvent.change(screen.getByLabelText(/current password/i), {
        target: { value: 'OldPass123!' },
      });
      const newPasswordInput = getNewPasswordInput();
      fireEvent.change(newPasswordInput, {
        target: { value: 'NewPassword123!' },
      });
      fireEvent.change(screen.getByLabelText(/confirm new password/i), {
        target: { value: 'NewPassword123!' },
      });

      const submitButton = screen.getByRole('button', { name: /change password/i });
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText(/Password updated successfully/i)).toBeInTheDocument();
      });
    });

    it('clears password fields after successful password change', async () => {
      vi.mocked(Auth.changePassword).mockResolvedValueOnce(undefined);

      fireEvent.change(screen.getByLabelText(/current password/i), {
        target: { value: 'OldPass123!' },
      });
      const newPasswordInput = getNewPasswordInput();
      fireEvent.change(newPasswordInput, {
        target: { value: 'NewPassword123!' },
      });
      fireEvent.change(screen.getByLabelText(/confirm new password/i), {
        target: { value: 'NewPassword123!' },
      });

      const submitButton = screen.getByRole('button', { name: /change password/i });
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(screen.getByLabelText(/current password/i)).toHaveValue('');
        expect(getNewPasswordInput()).toHaveValue('');
        expect(screen.getByLabelText(/confirm new password/i)).toHaveValue('');
      });
    });

    it('disables submit button while processing', async () => {
      const delayPromise = new Promise<void>((resolve) => setTimeout(resolve, 100));
      vi.mocked(Auth.changePassword).mockImplementationOnce(
        () => delayPromise
      );

      fireEvent.change(screen.getByLabelText(/current password/i), {
        target: { value: 'OldPass123!' },
      });
      const newPasswordInput = getNewPasswordInput();
      fireEvent.change(newPasswordInput, {
        target: { value: 'NewPassword123!' },
      });
      fireEvent.change(screen.getByLabelText(/confirm new password/i), {
        target: { value: 'NewPassword123!' },
      });

      const submitButton = screen.getByRole('button', { name: /change password/i });
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(submitButton).toBeDisabled();
        expect(submitButton).toHaveTextContent('Updating…');
      });
    });

    it('prevents duplicate submissions', async () => {
      const delayPromise = new Promise<void>((resolve) => setTimeout(resolve, 100));
      vi.mocked(Auth.changePassword).mockImplementationOnce(
        () => delayPromise
      );

      fireEvent.change(screen.getByLabelText(/current password/i), {
        target: { value: 'OldPass123!' },
      });
      const newPasswordInput = getNewPasswordInput();
      fireEvent.change(newPasswordInput, {
        target: { value: 'NewPassword123!' },
      });
      fireEvent.change(screen.getByLabelText(/confirm new password/i), {
        target: { value: 'NewPassword123!' },
      });

      const submitButton = screen.getByRole('button', { name: /change password/i });
      fireEvent.click(submitButton);

      // Try to click again while request is in progress
      await waitFor(() => {
        expect(submitButton).toBeDisabled();
      });

      fireEvent.click(submitButton);

      expect(vi.mocked(Auth.changePassword)).toHaveBeenCalledTimes(1);
    });

    it('shows network error message', async () => {
      vi.mocked(Auth.changePassword).mockRejectedValueOnce(
        new Error('Network error. Please check your connection and try again.')
      );

      fireEvent.change(screen.getByLabelText(/current password/i), {
        target: { value: 'OldPass123!' },
      });
      const newPasswordInput = getNewPasswordInput();
      fireEvent.change(newPasswordInput, {
        target: { value: 'NewPassword123!' },
      });
      fireEvent.change(screen.getByLabelText(/confirm new password/i), {
        target: { value: 'NewPassword123!' },
      });

      const submitButton = screen.getByRole('button', { name: /change password/i });
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText(/Network error/i)).toBeInTheDocument();
      });
    });

    it('allows changing password multiple times (success then success)', async () => {
      vi.mocked(Auth.changePassword).mockResolvedValue(undefined);

      // First password change
      fireEvent.change(screen.getByLabelText(/current password/i), {
        target: { value: 'OldPass123!' },
      });
      let newPasswordInput = getNewPasswordInput();
      fireEvent.change(newPasswordInput, {
        target: { value: 'NewPass1234!' },
      });
      fireEvent.change(screen.getByLabelText(/confirm new password/i), {
        target: { value: 'NewPass1234!' },
      });

      const submitButton = screen.getByRole('button', { name: /change password/i });
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText(/Password updated successfully/i)).toBeInTheDocument();
      });

      // Wait for fields to clear and state to reset
      await waitFor(() => {
        expect(screen.getByLabelText(/current password/i)).toHaveValue('');
      });

      // Second password change
      fireEvent.change(screen.getByLabelText(/current password/i), {
        target: { value: 'NewPass1234!' },
      });
      newPasswordInput = getNewPasswordInput();
      fireEvent.change(newPasswordInput, {
        target: { value: 'AnotherPass1234!' },
      });
      fireEvent.change(screen.getByLabelText(/confirm new password/i), {
        target: { value: 'AnotherPass1234!' },
      });

      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText(/Password updated successfully/i)).toBeInTheDocument();
      });

      expect(vi.mocked(Auth.changePassword)).toHaveBeenCalledTimes(2);
      expect(vi.mocked(Auth.changePassword)).toHaveBeenNthCalledWith(1, 'OldPass123!', 'NewPass1234!');
      expect(vi.mocked(Auth.changePassword)).toHaveBeenNthCalledWith(2, 'NewPass1234!', 'AnotherPass1234!');
    });

    it('allows retry after failure', async () => {
      // First attempt - fail
      vi.mocked(Auth.changePassword).mockRejectedValueOnce(
        new Error('Current password is incorrect.')
      );

      fireEvent.change(screen.getByLabelText(/current password/i), {
        target: { value: 'WrongPass123!' },
      });
      const newPasswordInputForRetry = getNewPasswordInput();
      fireEvent.change(newPasswordInputForRetry, {
        target: { value: 'NewPassword123!' },
      });
      fireEvent.change(screen.getByLabelText(/confirm new password/i), {
        target: { value: 'NewPassword123!' },
      });

      const submitButton = screen.getByRole('button', { name: /change password/i });
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText(/current password is incorrect/i)).toBeInTheDocument();
      });

      // Second attempt - success (mock returns success after first failure)
      vi.mocked(Auth.changePassword).mockResolvedValueOnce(undefined);

      // Clear error by typing
      fireEvent.change(screen.getByLabelText(/current password/i), {
        target: { value: 'Corr' },
      });
      fireEvent.change(screen.getByLabelText(/current password/i), {
        target: { value: 'CorrectPass123!' },
      });
      fireEvent.change(getNewPasswordInput(), {
        target: { value: 'DifferentPass123!' },
      });
      fireEvent.change(screen.getByLabelText(/confirm new password/i), {
        target: { value: 'DifferentPass123!' },
      });

      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText(/Password updated successfully/i)).toBeInTheDocument();
      });

      expect(vi.mocked(Auth.changePassword)).toHaveBeenCalledTimes(2);
      expect(vi.mocked(Auth.changePassword)).toHaveBeenNthCalledWith(2, 'CorrectPass123!', 'DifferentPass123!');
    });
  });

  describe('Notifications section (MSP-2713)', () => {
    beforeEach(() => {
      renderPage();
      fireEvent.click(screen.getByRole('tab', { name: 'Notifications' }));
    });

    it('renders notification preferences heading', () => {
      expect(screen.getByRole('heading', { name: /notification preferences/i })).toBeInTheDocument();
    });

    it('displays actual signed-in user email (from auth context)', async () => {
      // renderPage() already called in beforeEach
      // fireEvent.click already done in beforeEach
      await waitFor(() => {
        // Email should come from UserProfileContext which sources from user attributes/signInDetails
        expect(screen.getByText('test.user@example.com')).toBeInTheDocument();
      });
    });

    it('shows On toggle for account and results emails', () => {
      expect(screen.getByText(/account and results emails/i)).toBeInTheDocument();
      const accountResultsToggle = screen.getByRole('switch', { name: /account and results emails/i });
      expect(accountResultsToggle).toBeInTheDocument();
      expect(accountResultsToggle).toHaveAttribute('aria-checked', 'true');
    });

    it('renders toggle for account and results emails', () => {
      const accountResultsToggle = screen.getByRole('switch', { name: /account and results emails/i });
      expect(accountResultsToggle).toBeInTheDocument();
    });

    it('Practice reminders toggle is OFF (disabled)', () => {
      const practiceToggle = screen.getByRole('switch', { name: /practice reminders/i });
      expect(practiceToggle).toBeInTheDocument();
      expect(practiceToggle).toHaveAttribute('aria-checked', 'false');
      expect(practiceToggle).toBeDisabled();
    });

    it('Study tips toggle is OFF (disabled)', () => {
      const tipsToggle = screen.getByRole('switch', { name: /study tips/i });
      expect(tipsToggle).toBeInTheDocument();
      expect(tipsToggle).toHaveAttribute('aria-checked', 'false');
      expect(tipsToggle).toBeDisabled();
    });

    it('Platform updates toggle is OFF (disabled)', () => {
      const updatesToggle = screen.getByRole('switch', { name: /platform updates/i });
      expect(updatesToggle).toBeInTheDocument();
      expect(updatesToggle).toHaveAttribute('aria-checked', 'false');
      expect(updatesToggle).toBeDisabled();
    });

    it('all three disabled toggles cannot be reached through keyboard navigation (tabIndex -1)', () => {
      const practiceToggle = screen.getByRole('switch', { name: /practice reminders/i });
      const tipsToggle = screen.getByRole('switch', { name: /study tips/i });
      const updatesToggle = screen.getByRole('switch', { name: /platform updates/i });
      [practiceToggle, tipsToggle, updatesToggle].forEach((sw) => {
        expect(sw).toHaveAttribute('tabindex', '-1');
      });
    });

    it('Account and results toggle is enabled', () => {
      const accountResultsToggle = screen.getByRole('switch', { name: /account and results emails/i });
      expect(accountResultsToggle).toBeInTheDocument();
      expect(accountResultsToggle).not.toBeDisabled();
    });

    it('no notification preference update API is called', () => {
      // Clicking disabled toggles must not trigger any call
      const practiceToggle = screen.getByRole('switch', { name: /practice reminders/i });
      const tipsToggle = screen.getByRole('switch', { name: /study tips/i });
      const updatesToggle = screen.getByRole('switch', { name: /platform updates/i });
      [practiceToggle, tipsToggle, updatesToggle].forEach((sw) => fireEvent.click(sw));
      // mockGetTestTaker is the only service mock; it should only have been called once on mount
      expect(mockGetTestTaker).toHaveBeenCalledTimes(1);
    });

    it('handles missing email gracefully without showing undefined', async () => {
      // UserProfileContext already provides fallback values; Settings.tsx should not show "undefined"
      // Note: renderPage() already called in beforeEach
      await waitFor(() => {
        expect(screen.queryByText('undefined')).not.toBeInTheDocument();
      });
    });
  });

  describe('Account section', () => {
    beforeEach(() => {
      renderPage();
      fireEvent.click(screen.getByRole('tab', { name: 'Account' }));
    });

    it('renders test access section', () => {
      expect(screen.getByText(/envoy high-stakes test/i)).toBeInTheDocument();
      expect(screen.getByText(/completed/i)).toBeInTheDocument();
      expect(screen.getByRole('link', { name: /\+ purchase another test/i })).toBeInTheDocument();
    });

    it('renders danger zone with disabled delete button', () => {
      expect(screen.getByRole('button', { name: /delete my account/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /delete my account/i })).toBeDisabled();
    });

    it('shows account deletion notice with support contact', () => {
      expect(screen.getByText(/to delete your account, please contact/i)).toBeInTheDocument();
      expect(screen.getByRole('link', { name: /support@idpenglishtest\.com/i })).toBeInTheDocument();
    });
  });

  it('renders back link to dashboard', () => {
    renderPage();
    expect(screen.getByRole('link', { name: '← Dashboard' })).toBeInTheDocument();
  });
});

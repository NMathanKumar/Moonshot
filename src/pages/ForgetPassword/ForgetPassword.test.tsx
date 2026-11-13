import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import * as auth from '@services/auth';
import ForgetPassword from './ForgetPassword';

const mockNavigate = vi.fn();

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

vi.mock('@services/auth');

describe('ForgetPassword', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  function renderPage() {
    return render(
      <MemoryRouter initialEntries={['/forgot-password']}>
        <ForgetPassword />
      </MemoryRouter>
    );
  }

  it('renders the page heading', () => {
    renderPage();
    expect(screen.getByRole('heading', { name: /reset your password/i })).toBeInTheDocument();
  });

  it('renders email input field', () => {
    renderPage();
    const emailInput = screen.getByPlaceholderText(/you@example\.com/i);
    expect(emailInput).toBeInTheDocument();
    expect(emailInput).toHaveAttribute('type', 'email');
  });

  it('shows error for invalid email', async () => {
    renderPage();
    const emailInput = screen.getByPlaceholderText(/you@example\.com/i);
    fireEvent.change(emailInput, { target: { value: 'invalid-email' } });
    const form = emailInput.closest('form');
    await fireEvent.submit(form!);

    await waitFor(() => {
      const errorAlert = screen.getByRole('alert');
      expect(errorAlert).toHaveTextContent(/Please enter a valid email address/i);
    });
  });

  it('shows error for empty email', async () => {
    renderPage();
    const emailInput = screen.getByPlaceholderText(/you@example\.com/i);
    const form = emailInput.closest('form');
    await fireEvent.submit(form!);

    await waitFor(() => {
      const errorAlert = screen.getByRole('alert');
      expect(errorAlert).toHaveTextContent(/Please enter your email address/i);
    });
  });

  it('shows loading state when sending code', async () => {
    vi.mocked(auth.resetPassword).mockResolvedValue(undefined);
    renderPage();
    const emailInput = screen.getByPlaceholderText(/you@example\.com/i);
    const sendCodeBtn = screen.getByRole('button', { name: /send code/i });
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    await fireEvent.click(sendCodeBtn);

    await waitFor(() => {
      expect(sendCodeBtn).toBeDisabled();
    });
    expect(sendCodeBtn).toHaveTextContent(/sending code\.\.\./i);
  });

  it('shows success message when code is sent', async () => {
    vi.mocked(auth.resetPassword).mockResolvedValue(undefined);
    renderPage();
    const emailInput = screen.getByPlaceholderText(/you@example\.com/i);
    const sendCodeBtn = screen.getByRole('button', { name: /send code/i });
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    await fireEvent.click(sendCodeBtn);

    await waitFor(() => {
      expect(vi.mocked(auth.resetPassword)).toHaveBeenCalledWith('test@example.com');
    });
    await waitFor(() => {
      expect(screen.getByText(/We sent a 6-digit code to your email address/i)).toBeInTheDocument();
    });
  });

  it('displays generic confirmation message', async () => {
    vi.mocked(auth.resetPassword).mockResolvedValue(undefined);
    renderPage();
    const emailInput = screen.getByPlaceholderText(/you@example\.com/i);
    const sendCodeBtn = screen.getByRole('button', { name: /send code/i });
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    await fireEvent.click(sendCodeBtn);

    await waitFor(() => {
      expect(screen.getByText(/We sent a 6-digit code to your email address/i)).toBeInTheDocument();
    });
  });

  it('shows error for failed code request', async () => {
    const networkError = new Error('Network error. Please check your connection and try again.');
    vi.mocked(auth.resetPassword).mockRejectedValue(networkError);
    renderPage();
    const emailInput = screen.getByPlaceholderText(/you@example\.com/i);
    const sendCodeBtn = screen.getByRole('button', { name: /send code/i });
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    await fireEvent.click(sendCodeBtn);

    await waitFor(() => {
      const errorAlert = screen.getByRole('alert');
      expect(errorAlert).toHaveTextContent(/Network error/i);
    });
  });

  it('shows error when code field is empty', async () => {
    vi.mocked(auth.resetPassword).mockResolvedValue(undefined);
    renderPage();
    const emailInput = screen.getByPlaceholderText(/you@example\.com/i);
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    const emailForm = emailInput.closest('form');
    await fireEvent.submit(emailForm!);
    await waitFor(() => {
      expect(screen.getByText(/We sent a 6-digit code to your email address/i)).toBeInTheDocument();
    });

    const codeInput = screen.getByPlaceholderText(/Enter 6-digit code/i);
    const codeForm = codeInput.closest('form');
    await fireEvent.submit(codeForm!);

    await waitFor(() => {
      const errorAlert = screen.getByRole('alert');
      expect(errorAlert).toHaveTextContent(/Please enter the verification code/i);
    });
  });

  it('shows error for invalid confirmation code', async () => {
    vi.mocked(auth.resetPassword).mockResolvedValue(undefined);
    vi.mocked(auth.confirmResetPassword).mockRejectedValue(
      new Error('Invalid code. Please check and try again.')
    );
    renderPage();

    const emailInput = screen.getByPlaceholderText(/you@example\.com/i);
    const sendCodeBtn = screen.getByRole('button', { name: /send code/i });
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    await fireEvent.click(sendCodeBtn);

    await waitFor(() => {
      expect(screen.getByText(/We sent a 6-digit code to your email address/i)).toBeInTheDocument();
    });

    const codeInput = screen.getByPlaceholderText(/Enter 6-digit code/i);
    const newPasswordInput = screen.getByPlaceholderText(/Enter new password/i);
    const resetBtn = screen.getByRole('button', { name: /reset password/i });
    fireEvent.change(codeInput, { target: { value: '123456' } });
    fireEvent.change(newPasswordInput, { target: { value: 'Password12345' } });
    await fireEvent.click(resetBtn);

    await waitFor(() => {
      const errorAlert = screen.getByRole('alert');
      expect(errorAlert).toHaveTextContent(/Invalid code/i);
    });
  });

  it('shows password policy error for invalid password', async () => {
    vi.mocked(auth.resetPassword).mockResolvedValue(undefined);
    renderPage();

    const emailInput = screen.getByPlaceholderText(/you@example\.com/i);
    const sendCodeBtn = screen.getByRole('button', { name: /send code/i });
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    await fireEvent.click(sendCodeBtn);

    await waitFor(() => {
      expect(screen.getByText(/We sent a 6-digit code to your email address/i)).toBeInTheDocument();
    });

    const codeInput = screen.getByPlaceholderText(/Enter 6-digit code/i);
    const newPasswordInput = screen.getByPlaceholderText(/Enter new password/i);
    const resetBtn = screen.getByRole('button', { name: /reset password/i });
    fireEvent.change(codeInput, { target: { value: '123456' } });
    fireEvent.change(newPasswordInput, { target: { value: 'short' } });
    await fireEvent.click(resetBtn);

    await waitFor(() => {
      const errorAlert = screen.getByRole('alert');
      expect(errorAlert).toHaveTextContent(/Password must be at least 12 characters/i);
    });
  });

  it('toggles password visibility when show/hide button is clicked', async () => {
    vi.mocked(auth.resetPassword).mockResolvedValue(undefined);
    renderPage();

    const emailInput = screen.getByPlaceholderText(/you@example\.com/i);
    const sendCodeBtn = screen.getByRole('button', { name: /send code/i });
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    await fireEvent.click(sendCodeBtn);

    await waitFor(() => {
      expect(screen.getByText(/We sent a 6-digit code to your email address/i)).toBeInTheDocument();
    });

    const passwordInput = screen.getByPlaceholderText(/Enter new password/i) as HTMLInputElement;
    const showButton = screen.getByRole('button', { name: /Show password/i });

    expect(passwordInput.type).toBe('password');
    await fireEvent.click(showButton);
    expect(passwordInput.type).toBe('text');
    expect(showButton).toHaveTextContent('Hide');

    await fireEvent.click(showButton);
    expect(passwordInput.type).toBe('password');
    expect(showButton).toHaveTextContent('Show');
  });

  it('preserves password value when toggling visibility', async () => {
    vi.mocked(auth.resetPassword).mockResolvedValue(undefined);
    renderPage();

    const emailInput = screen.getByPlaceholderText(/you@example\.com/i);
    const sendCodeBtn = screen.getByRole('button', { name: /send code/i });
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    await fireEvent.click(sendCodeBtn);

    await waitFor(() => {
      expect(screen.getByText(/We sent a 6-digit code to your email address/i)).toBeInTheDocument();
    });

    const passwordInput = screen.getByPlaceholderText(/Enter new password/i) as HTMLInputElement;
    fireEvent.change(passwordInput, { target: { value: 'TestPassword123' } });
    expect(passwordInput.value).toBe('TestPassword123');

    const showButton = screen.getByRole('button', { name: /Show password/i });
    await fireEvent.click(showButton);
    expect(passwordInput.value).toBe('TestPassword123');

    await fireEvent.click(showButton);
    expect(passwordInput.value).toBe('TestPassword123');
  });

  it('shows success message on password reset', async () => {
    vi.mocked(auth.resetPassword).mockResolvedValue(undefined);
    vi.mocked(auth.confirmResetPassword).mockResolvedValue(undefined);
    renderPage();

    const emailInput = screen.getByPlaceholderText(/you@example\.com/i);
    const sendCodeBtn = screen.getByRole('button', { name: /send code/i });
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    await fireEvent.click(sendCodeBtn);

    await waitFor(() => {
      expect(screen.getByText(/We sent a 6-digit code to your email address/i)).toBeInTheDocument();
    });

    const codeInput = screen.getByPlaceholderText(/Enter 6-digit code/i);
    const newPasswordInput = screen.getByPlaceholderText(/Enter new password/i);
    const resetBtn = screen.getByRole('button', { name: /reset password/i });
    fireEvent.change(codeInput, { target: { value: '123456' } });
    fireEvent.change(newPasswordInput, { target: { value: 'Password12345' } });
    await fireEvent.click(resetBtn);

    await waitFor(() => {
      expect(vi.mocked(auth.confirmResetPassword)).toHaveBeenCalledWith('test@example.com', '123456', 'Password12345');
      expect(screen.getByText(/Your password has been reset successfully/i)).toBeInTheDocument();
    });
  });

  it('displays resend button next to verification code label', async () => {
    vi.mocked(auth.resetPassword).mockResolvedValue(undefined);
    renderPage();

    const emailInput = screen.getByPlaceholderText(/you@example\.com/i);
    const sendCodeBtn = screen.getByRole('button', { name: /send code/i });
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    await fireEvent.click(sendCodeBtn);

    await waitFor(() => {
      expect(screen.getByText(/We sent a 6-digit code to your email address/i)).toBeInTheDocument();
    });

    const resendBtn = screen.getByRole('button', { name: /Request code/ });
    expect(resendBtn).toBeInTheDocument();
  });

  it('disables resend button for 15 seconds after initial code send', async () => {
    vi.mocked(auth.resetPassword).mockResolvedValue(undefined);
    renderPage();

    const emailInput = screen.getByPlaceholderText(/you@example\.com/i);
    const sendCodeBtn = screen.getByRole('button', { name: /send code/i });
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    await fireEvent.click(sendCodeBtn);

    await waitFor(() => {
      expect(screen.getByText(/We sent a 6-digit code to your email address/i)).toBeInTheDocument();
    });

    const resendBtn = screen.getByRole('button', { name: /Request code \(\d+s\)/ });
    expect(resendBtn).toBeDisabled();
  });

  it('shows generic message for non-existent email', async () => {
    vi.mocked(auth.resetPassword).mockRejectedValue(
      new Error('We sent a 6-digit code to your email address.')
    );
    renderPage();

    const emailInput = screen.getByPlaceholderText(/you@example\.com/i);
    const sendCodeBtn = screen.getByRole('button', { name: /send code/i });
    fireEvent.change(emailInput, { target: { value: 'nonexistent@example.com' } });
    await fireEvent.click(sendCodeBtn);

    await waitFor(() => {
      const errorAlert = screen.getByRole('alert');
      expect(errorAlert).toHaveTextContent(/We sent a 6-digit code to your email address/i);
    });
  });

  it('navigates to sign in when back link is clicked', async () => {
    renderPage();
    const backLink = screen.getByRole('link', { name: /Back to sign in/i });
    expect(backLink).toHaveAttribute('href', '/signin');
  });

  it('has working link to go back to sign in', async () => {
    renderPage();
    expect(screen.getByRole('link', { name: /Back to sign in/i })).toBeInTheDocument();
  });

  it('redirects to sign in after successful password reset', async () => {
    vi.mocked(auth.resetPassword).mockResolvedValue(undefined);
    vi.mocked(auth.confirmResetPassword).mockResolvedValue(undefined);
    renderPage();

    const emailInput = screen.getByPlaceholderText(/you@example\.com/i);
    const sendCodeBtn = screen.getByRole('button', { name: /send code/i });
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    await fireEvent.click(sendCodeBtn);

    await waitFor(() => {
      expect(screen.getByText(/We sent a 6-digit code to your email address/i)).toBeInTheDocument();
    });

    const codeInput = screen.getByPlaceholderText(/Enter 6-digit code/i);
    const newPasswordInput = screen.getByPlaceholderText(/Enter new password/i);
    const resetBtn = screen.getByRole('button', { name: /reset password/i });
    fireEvent.change(codeInput, { target: { value: '123456' } });
    fireEvent.change(newPasswordInput, { target: { value: 'Password12345' } });
    await fireEvent.click(resetBtn);

    await waitFor(() => {
      expect(screen.getByText(/Your password has been reset successfully/i)).toBeInTheDocument();
    });

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/signin', { replace: true });
    }, { timeout: 3000 });
  });
});

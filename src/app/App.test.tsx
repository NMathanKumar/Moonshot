import { render, screen, waitFor } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import App from './App';

describe('App', () => {
  it('renders the Sign In page within AuthProvider', async () => {
    render(<App />);

    // Wait for AuthProvider to complete initialization (loading -> unauthenticated)
    await waitFor(
      () => {
        expect(screen.getByRole('heading', { level: 1, name: /sign in/i })).toBeInTheDocument();
      },
      { timeout: 3000 }
    );
  });

  it('displays the email input', async () => {
    render(<App />);
    await waitFor(() => {
      expect(screen.getByPlaceholderText(/you@example.com/i)).toBeInTheDocument();
    });
  });

  it('displays the password field and toggle', async () => {
    render(<App />);
    await waitFor(() => {
      expect(screen.getByPlaceholderText('••••••••')).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /show/i })).toBeInTheDocument();
    });
  });

  it('displays the Sign in button', async () => {
    render(<App />);
    await waitFor(() => {
      expect(screen.getByRole('button', { name: /sign in/i })).toBeInTheDocument();
    });
  });

  it('displays the sign up link', async () => {
    render(<App />);
    await waitFor(() => {
      expect(screen.getByRole('button', { name: /sign up/i })).toBeInTheDocument();
    });
  });
});

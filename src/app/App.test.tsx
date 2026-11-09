import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import App from './App';

// Mock the auth service to avoid actual Cognito calls
vi.mock('@services/auth', () => ({
  signIn: vi.fn(),
}));

describe('App', () => {
  it('renders the Sign In page', () => {
    render(<App />);
    expect(screen.getByRole('heading', { level: 1, name: /sign in/i })).toBeInTheDocument();
  });

  it('displays the email input', () => {
    render(<App />);
    expect(screen.getByPlaceholderText(/you@example.com/i)).toBeInTheDocument();
  });

  it('displays the password field and toggle', () => {
    render(<App />);
    expect(screen.getByPlaceholderText(/Enter your password/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /show password/i })).toBeInTheDocument();
  });

  it('displays the Sign in button', () => {
    render(<App />);
    expect(screen.getByRole('button', { name: /sign in/i })).toBeInTheDocument();
  });

  it('displays the sign up link', () => {
    render(<App />);
    expect(screen.getByRole('button', { name: /sign up/i })).toBeInTheDocument();
  });
});

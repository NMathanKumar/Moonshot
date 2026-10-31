import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import App from './App';

describe('App', () => {
  it('renders the skeleton heading', () => {
    render(<App />);
    expect(
      screen.getByRole('heading', { level: 1, name: /idp english test/i })
    ).toBeInTheDocument();
  });

  it('displays the running message', () => {
    render(<App />);
    expect(screen.getByText(/project skeleton is running/i)).toBeInTheDocument();
  });
});

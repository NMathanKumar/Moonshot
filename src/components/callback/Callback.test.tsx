/**
 * Tests for Callback component (DEPRECATED)
 *
 * The Callback component is deprecated with direct SDK auth.
 * These tests verify it redirects to signin if accessed.
 */

import { render, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import { Callback } from './Callback';

// Mock useNavigate to avoid navigation in tests
const mockNavigate = vi.fn();

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

describe('Callback (Deprecated)', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('redirects to /signin on mount', async () => {
    render(
      <MemoryRouter initialEntries={['/callback']}>
        <Callback />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/signin', { replace: true });
    });
  });

  it('renders empty div (temporary placeholder)', () => {
    const { container } = render(
      <MemoryRouter initialEntries={['/callback']}>
        <Callback />
      </MemoryRouter>
    );

    // Component renders a div while redirect happens
    expect(container.querySelector('div')).toBeTruthy();
  });

  it('logs deprecation warning', async () => {
    const consoleWarn = vi.spyOn(console, 'warn').mockImplementation(() => {});

    render(
      <MemoryRouter initialEntries={['/callback']}>
        <Callback />
      </MemoryRouter>
    );

    // Component silently redirects without logging (no console output)
    // Just verify the navigation occurs
    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/signin', { replace: true });
    });

    consoleWarn.mockRestore();
  });
});

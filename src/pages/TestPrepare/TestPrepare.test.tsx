import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import TestPrepare from './TestPrepare';

vi.mock('@hooks/useAuth', () => ({
  useAuth: () => ({ user: null, isLoading: false }),
}));

vi.mock('@layouts/AppShell', () => ({
  default: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}));

function renderPage() {
  return render(
    <MemoryRouter initialEntries={['/test-prepare']}>
      <TestPrepare />
    </MemoryRouter>
  );
}

describe('TestPrepare', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders the page heading', () => {
    renderPage();
    expect(screen.getByRole('heading', { name: /before you start/i })).toBeInTheDocument();
  });

  it('renders back link to practice', () => {
    renderPage();
    expect(screen.getByRole('link', { name: '← Back to practice' })).toBeInTheDocument();
  });

  it('renders system & equipment check section', () => {
    renderPage();
    expect(screen.getByRole('heading', { name: /system & equipment check/i })).toBeInTheDocument();
    expect(screen.getByText(/browser & permissions/i)).toBeInTheDocument();
    expect(screen.getByText(/audio playback/i)).toBeInTheDocument();
    // There are multiple elements with "microphone" text, use getAllByText
    const microphoneEls = screen.getAllByText(/microphone/i);
    expect(microphoneEls.length).toBeGreaterThan(0);
    expect(screen.getByText(/stable internet connection/i)).toBeInTheDocument();
    expect(screen.getByText(/camera \(proctoring\)/i)).toBeInTheDocument();
    expect(screen.getByText(/quiet environment/i)).toBeInTheDocument();
  });

  it('renders check items with status badges', () => {
    renderPage();
    // Multiple elements contain "ready", "warning", "not checked" - use getAllByText
    expect(screen.getAllByText(/ready/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/warning/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/not checked/i).length).toBeGreaterThan(0);
  });

  it('renders play test sound button', () => {
    renderPage();
    expect(screen.getByRole('button', { name: /play test sound/i })).toBeInTheDocument();
  });

  it('shows audio confirmed after clicking play button', async () => {
    renderPage();

    expect(screen.getByRole('button', { name: /play test sound/i })).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: /play test sound/i }));

    expect(screen.getByText(/audio confirmed/i)).toBeInTheDocument();
  });

  it('renders environment reminders section', () => {
    renderPage();
    expect(screen.getByRole('heading', { name: /environment reminders/i })).toBeInTheDocument();
    expect(screen.getByText(/identity document on your desk/i)).toBeInTheDocument();
    expect(screen.getByText(/quiet.*private room/i)).toBeInTheDocument();
    // "desk clear" appears in multiple places, use getAllByText
    expect(screen.getAllByText(/desk clear/i).length).toBeGreaterThan(0);
    expect(screen.getByText(/stable internet connection/i)).toBeInTheDocument();
  });

  it('renders environment confirmation checkboxes', () => {
    renderPage();
    const checkboxes = screen.getAllByRole('checkbox');
    expect(checkboxes.length).toBeGreaterThan(4); // 4 environment reminders + consent checkboxes
  });

  it('renders consent section', () => {
    renderPage();
    expect(screen.getByText(/environment is ready/i)).toBeInTheDocument();
    expect(screen.getByText(/one-time test/i)).toBeInTheDocument();
  });

  it('shows back to practice link', () => {
    renderPage();
    expect(screen.getByRole('link', { name: 'Back to practice' })).toBeInTheDocument();
  });

  it('disables start test button when consent not given', () => {
    renderPage();
    const startBtn = screen.getByRole('button', { name: /complete checklist to start/i });
    expect(startBtn).toBeDisabled();
  });

  it('enables start test button after both consents given', async () => {
    renderPage();

    const envCheckbox = screen.getByRole('checkbox', { name: /environment is ready/i });
    const onceCheckbox = screen.getByRole('checkbox', { name: /one-time test/i });

    fireEvent.click(envCheckbox);
    fireEvent.click(onceCheckbox);

    const startBtn = screen.getByRole('button', { name: /start test →/i });
    expect(startBtn).not.toBeDisabled();
  });

  it('shows re-run all checks button', () => {
    renderPage();
    expect(screen.getByRole('button', { name: /re-run all checks/i })).toBeInTheDocument();
  });
});

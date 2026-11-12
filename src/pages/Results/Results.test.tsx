import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import Results from './Results';

vi.mock('@hooks/useAuth', () => ({
  useAuth: () => ({ user: null, isLoading: false }),
}));

vi.mock('@layouts/AppShell', () => ({
  default: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}));

vi.mock('recharts', () => ({
  RadarChart: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="mock-radar-chart">{children}</div>
  ),
  Radar: () => <div data-testid="mock-radar" />,
  PolarGrid: () => <div data-testid="mock-polar-grid" />,
  PolarAngleAxis: () => <div data-testid="mock-polar-axis" />,
  ResponsiveContainer: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}));

function renderPage() {
  return render(
    <MemoryRouter initialEntries={['/results']}>
      <Results />
    </MemoryRouter>
  );
}

describe('Results', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders the page heading', () => {
    renderPage();
    expect(screen.getByRole('heading', { name: /my results/i })).toBeInTheDocument();
  });

  it('renders back link to dashboard', () => {
    renderPage();
    expect(screen.getByRole('link', { name: '← Back to Dashboard' })).toBeInTheDocument();
  });

  it('renders all test reports', async () => {
    renderPage();
    
    // First report (active by default) - check first certId
    await waitFor(() => {
      expect(screen.getByText(/IDP-ENG-7K2M-9X4P/i)).toBeInTheDocument();
    });
    
    // Click on the second report button to make it active
    const reportButtons = screen.getAllByRole('button');
    // Find the second report card by its position
    if (reportButtons.length > 1) {
      fireEvent.click(reportButtons[1]);
    }
    
    // Now check second certId (active report)
    await waitFor(() => {
      expect(screen.getByText(/IDP-ENG-3PQ2-5R8W/i)).toBeInTheDocument();
      expect(screen.getByText(/IDP-ENG-/)).toBeInTheDocument();
    });
  });

  it('shows completed and cancelled status badges', async () => {
    renderPage();
    await waitFor(() => {
      // Multiple "completed" and "cancelled" badges exist - use getAllByText
      expect(screen.getAllByText(/completed/i).length).toBeGreaterThan(0);
      expect(screen.getAllByText(/cancelled/i).length).toBeGreaterThan(0);
    });
  });

  it('shows overall score card', async () => {
    renderPage();
    await waitFor(() => {
      expect(screen.getByText(/overall score/i)).toBeInTheDocument();
      expect(screen.getByText(/78/i)).toBeInTheDocument();
      // "/120" may appear multiple times, use getAllByText
      expect(screen.getAllByText(/\/120/i).length).toBeGreaterThan(0);
      expect(screen.getAllByText(/B2/i).length).toBeGreaterThan(0);
    });
  });

  it('renders radar chart container', async () => {
    renderPage();
    await waitFor(() => {
      expect(screen.getByTestId('mock-radar-chart')).toBeInTheDocument();
    });
  });

  it('shows skill cards for all four skills', async () => {
    renderPage();
    await waitFor(() => {
      expect(screen.getAllByText(/reading/i).length).toBeGreaterThan(0);
      expect(screen.getAllByText(/listening/i).length).toBeGreaterThan(0);
      expect(screen.getAllByText(/writing/i).length).toBeGreaterThan(0);
      expect(screen.getAllByText(/speaking/i).length).toBeGreaterThan(0);
    });
  });

  it('shows CEFR level for each skill', async () => {
    renderPage();
    await waitFor(() => {
      expect(screen.getAllByText(/C1/i).length).toBeGreaterThan(0);
      expect(screen.getAllByText(/B2/i).length).toBeGreaterThan(0);
    });
  });

  it('displays skill feedback when selected', async () => {
    renderPage();
    await waitFor(() => {
      expect(screen.getByText(/Excellent comprehension/i)).toBeInTheDocument();
    });
  });

  it('downloads certificate button is disabled for cancelled test', async () => {
    renderPage();

    // Find and click on the cancelled report
    const cancelledReport = screen.getByText(/cancelled/i).closest('div[role="button"]');
    if (cancelledReport) {
      fireEvent.click(cancelledReport);
    }

    await waitFor(() => {
      const downloadBtn = screen.getByRole('button', { name: /download official certificate/i });
      expect(downloadBtn).toBeDisabled();
    });
  });

  it('shows score changes chip when present', async () => {
    renderPage();
    await waitFor(() => {
      expect(screen.getByText(/score updated/i)).toBeInTheDocument();
    });
  });

  it('shows additional results service section', async () => {
    renderPage();
    await waitFor(() => {
      expect(screen.getByText(/additional results service/i)).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /request score review/i })).toBeInTheDocument();
    });
  });

  it('disables score review button for cancelled test', async () => {
    renderPage();

    // Find and click on the cancelled report
    const cancelledReport = screen.getByText(/cancelled/i).closest('div[role="button"]');
    if (cancelledReport) {
      fireEvent.click(cancelledReport);
    }

    await waitFor(() => {
      const reviewBtn = screen.getByRole('button', { name: /request score review/i });
      expect(reviewBtn).toBeDisabled();
    });
  });
});

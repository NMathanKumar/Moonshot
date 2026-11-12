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
    // There are multiple buttons on the page, so we need to find the one for the second report
    const reportButtons = screen.getAllByRole('button');
    // The second report's button should have "IDP-ENG-3PQ2-5R8W" in its key
    // Since the certId is not visible in the report card, we need to find it another way
    // Let's click on the button that has "View report →" text and is not the first one
    
    // Actually, the certId is only visible in the report header when the report is active
    // So we need to find the second report card and click on it
    const reportCards = screen.getAllByRole('button');
    
    // Find the second report card by its position
    if (reportCards.length > 1) {
      fireEvent.click(reportCards[1]);
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
      expect(screen.getByText(/completed/i)).toBeInTheDocument();
      expect(screen.getByText(/cancelled/i)).toBeInTheDocument();
    });
  });

  it('shows overall score card', async () => {
    renderPage();
    await waitFor(() => {
      expect(screen.getByText(/overall score/i)).toBeInTheDocument();
      expect(screen.getByText(/78/i)).toBeInTheDocument();
      expect(screen.getByText(/\/120/i)).toBeInTheDocument();
      expect(screen.getByText(/B2/i)).toBeInTheDocument();
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
      expect(screen.getByText(/reading/i)).toBeInTheDocument();
      expect(screen.getByText(/listening/i)).toBeInTheDocument();
      expect(screen.getByText(/writing/i)).toBeInTheDocument();
      expect(screen.getByText(/speaking/i)).toBeInTheDocument();
    });
  });

  it('shows CEFR level for each skill', async () => {
    renderPage();
    await waitFor(() => {
      expect(screen.getByText(/C1/i)).toBeInTheDocument();
      expect(screen.getByText(/B2/i)).toBeInTheDocument();
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

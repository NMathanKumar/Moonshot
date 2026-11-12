import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import PurchaseTest from './PurchaseTest';

vi.mock('@hooks/useAuth', () => ({
  useAuth: () => ({ user: null, isLoading: false }),
}));

vi.mock('@layouts/AppShell', () => ({
  default: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}));

function renderPage() {
  return render(
    <MemoryRouter initialEntries={['/purchase']}>
      <PurchaseTest />
    </MemoryRouter>
  );
}

describe('PurchaseTest', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders the page heading', () => {
    renderPage();
    expect(screen.getByRole('heading', { name: /purchase test/i })).toBeInTheDocument();
  });

  it('renders back link to dashboard', () => {
    renderPage();
    expect(screen.getByRole('link', { name: '← Dashboard' })).toBeInTheDocument();
  });

  it('shows IDP English Test pricing card', () => {
    renderPage();
    expect(screen.getByText(/\$89/i)).toBeInTheDocument();
    expect(screen.getByText(/AUD/i)).toBeInTheDocument();
    // "one time test" is part of a longer string in the pricing card
    expect(screen.getByText(/one time test/i)).toBeInTheDocument();
    expect(screen.getByText(/results in 48 hours/i)).toBeInTheDocument();
  });

  it('shows four skills feature list', () => {
    renderPage();
    expect(screen.getByText(/four skills/i)).toBeInTheDocument();
    expect(screen.getByText(/results in 48 hours/i)).toBeInTheDocument();
    expect(screen.getByText(/certified in days/i)).toBeInTheDocument();
    expect(screen.getByText(/recognised worldwide/i)).toBeInTheDocument();
  });

  it('shows practice test pricing card', () => {
    renderPage();
    expect(screen.getByText(/practice for free/i)).toBeInTheDocument();
    expect(screen.getByText(/practise all four skills/i)).toBeInTheDocument();
  });

  it('shows institutions section', () => {
    renderPage();
    expect(screen.getByRole('heading', { name: /where idp english test is accepted/i })).toBeInTheDocument();
    expect(screen.getByText(/2,000\+ institutions/i)).toBeInTheDocument();
  });

  it('shows institution search and filters', () => {
    renderPage();
    expect(screen.getByPlaceholderText(/search institutions/i)).toBeInTheDocument();
    expect(screen.getByRole('combobox', { name: /institution type/i })).toBeInTheDocument();
    expect(screen.getByRole('combobox', { name: /region/i })).toBeInTheDocument();
  });

  it('shows filtered institutions grid', () => {
    renderPage();
    const institutionCards = screen.getAllByRole('group').filter((el) =>
      el.textContent?.includes('University')
    );
    expect(institutionCards.length).toBeGreaterThan(0);
  });

  it('shows empty state when no results match', async () => {
    renderPage();

    // Search for non-existent institution
    const searchInput = screen.getByPlaceholderText(/search institutions/i);
    fireEvent.change(searchInput, { target: { value: 'NonExistent Institution' } });

    expect(screen.getByText(/try a different institution name/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /clear filters/i })).toBeInTheDocument();
  });

  it('shows clear filters button', () => {
    renderPage();
    expect(screen.getByRole('button', { name: /clear filters/i })).toBeInTheDocument();
  });

  it('shows submit nomination link', () => {
    renderPage();
    expect(screen.getByRole('button', { name: /submit a nomination/i })).toBeInTheDocument();
  });

  it('shows FAQ section', () => {
    renderPage();
    expect(screen.getByRole('heading', { name: /frequently asked questions/i })).toBeInTheDocument();
    expect(screen.getByText(/how long is the test\?/i)).toBeInTheDocument();
    expect(screen.getByText(/when do i get my results\?/i)).toBeInTheDocument();
    expect(screen.getByText(/how many times can i take the test\?/i)).toBeInTheDocument();
    expect(screen.getByText(/where is the test accepted\?/i)).toBeInTheDocument();
  });

  it('shows Expandable FAQ answers', async () => {
    renderPage();

    const faqButtons = screen.getAllByRole('button', { name: /how long is the test/i });
    expect(faqButtons.length).toBeGreaterThan(0);

    const button = faqButtons[0];
    fireEvent.click(button);

    expect(screen.getByText(/~80 minutes/i)).toBeInTheDocument();
  });

  it('shows Purchase Test button in pricing card', () => {
    renderPage();
    expect(screen.getByRole('button', { name: /purchase test →/i })).toBeInTheDocument();
  });

  it('navigates to checkout when purchase button clicked', async () => {
    renderPage();

    fireEvent.click(screen.getByRole('button', { name: /purchase test →/i }));

    // Should show checkout form elements
    expect(screen.getByRole('heading', { name: /checkout/i })).toBeInTheDocument();
    expect(screen.getByText(/payment information/i)).toBeInTheDocument();
  });

  it('renders checkout form with payment fields', async () => {
    renderPage();

    fireEvent.click(screen.getByRole('button', { name: /purchase test →/i }));

    expect(screen.getByPlaceholderText(/1234 5678 9012 3456/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/mm \/ yy/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/•••/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/agnes lee/i)).toBeInTheDocument();
  });

  it('renders terms checkbox in checkout', async () => {
    renderPage();

    fireEvent.click(screen.getByRole('button', { name: /purchase test →/i }));

    expect(screen.getByRole('checkbox', { name: /terms of service/i })).toBeInTheDocument();
  });

  it('renders Pay button in checkout', async () => {
    renderPage();

    fireEvent.click(screen.getByRole('button', { name: /purchase test →/i }));

    expect(screen.getByRole('button', { name: /pay \$89 aud/i })).toBeInTheDocument();
  });
});

import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import Checkout from './Checkout';

vi.mock('@hooks/useAuth', () => ({
  useAuth: () => ({ 
    user: { 
      given_name: 'Test User',
      signInDetails: { loginId: 'test@example.com' }
    }, 
    isLoading: false 
  }),
}));

vi.mock('@layouts/AppShell', () => ({
  default: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}));

vi.mock('@components/common/Button', () => ({
  Button: ({ children, ...props }: any) => <button {...props}>{children}</button>,
}));

vi.mock('@components/common/Input', () => ({
  Input: ({ label, ...props }: any) => (
    <div>
      {label && <label>{label}</label>}
      <input {...props} />
    </div>
  ),
}));

vi.mock('@components/common/Card', () => ({
  Card: ({ children, ...props }: any) => <div {...props}>{children}</div>,
}));

function renderPage() {
  return render(
    <MemoryRouter initialEntries={['/checkout']}>
      <Checkout />
    </MemoryRouter>
  );
}

describe('Checkout Page', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders checkout heading', () => {
    renderPage();
    expect(screen.getByRole('heading', { name: /checkout/i })).toBeInTheDocument();
  });

  it('renders back button', () => {
    renderPage();
    expect(screen.getByRole('button', { name: /← back/i })).toBeInTheDocument();
  });

  it('shows checkout description', () => {
    renderPage();
    expect(screen.getByText(/idp english test · one-time access/i)).toBeInTheDocument();
  });

  it('displays order summary card', () => {
    renderPage();
    // "idp english test" and "$89 aud" may appear multiple times (card + button)
    expect(screen.getAllByText(/idp english test/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/\$89 aud/i).length).toBeGreaterThan(0);
    expect(screen.getByText(/one time test · up to 80 mins · results in 48 hours/i)).toBeInTheDocument();
  });

  it('shows checkout features list', () => {
    renderPage();
    expect(screen.getByText(/a clear score, mapped to cefr/i)).toBeInTheDocument();
    expect(screen.getByText(/reviewed by certified assessors/i)).toBeInTheDocument();
    expect(screen.getByText(/accepted by institutions around the globe/i)).toBeInTheDocument();
    expect(screen.getByText(/certified in days/i)).toBeInTheDocument();
  });

  it('displays payment information section', () => {
    renderPage();
    expect(screen.getByText(/payment information/i)).toBeInTheDocument();
  });

  it('has card number input field', () => {
    renderPage();
    const labels = screen.getAllByText('Card number');
    expect(labels.length).toBeGreaterThan(0);
  });

  it('has expiry input field', () => {
    renderPage();
    const labels = screen.getAllByText('Expiry');
    expect(labels.length).toBeGreaterThan(0);
  });

  it('has CVV input field', () => {
    renderPage();
    const labels = screen.getAllByText('CVV');
    expect(labels.length).toBeGreaterThan(0);
  });

  it('has name on card input field', () => {
    renderPage();
    const labels = screen.getAllByText('Name on card');
    expect(labels.length).toBeGreaterThan(0);
  });

  it('displays terms checkbox', () => {
    renderPage();
    expect(screen.getByRole('checkbox', { name: /i agree to the/i })).toBeInTheDocument();
  });

  it('shows terms of service link', () => {
    renderPage();
    expect(screen.getByText(/terms of service and privacy policy/i)).toBeInTheDocument();
  });

  it('displays pay button', () => {
    renderPage();
    expect(screen.getByRole('button', { name: /pay \$89 aud/i })).toBeInTheDocument();
  });

  it('shows payment security notice', () => {
    renderPage();
    expect(screen.getByText(/conditions apply · secure payment/i)).toBeInTheDocument();
  });

  it('uses responsive grid for form fields', () => {
    const { container } = renderPage();
    const gridContainer = container.querySelector('.grid');
    expect(gridContainer).toBeInTheDocument();
  });

  it('applies max-width to checkout container', () => {
    const { container } = renderPage();
    const maxWidthContainer = container.querySelector('.max-w-\\[600px\\]');
    expect(maxWidthContainer).toBeInTheDocument();
  });
});

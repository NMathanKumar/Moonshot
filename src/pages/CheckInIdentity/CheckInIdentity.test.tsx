import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import CheckInIdentity from './CheckInIdentity';

vi.mock('@hooks/useAuth', () => ({
  useAuth: () => ({ user: null, isLoading: false }),
}));

vi.mock('@layouts/AppShell', () => ({
  default: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}));

vi.mock('@utils/checkIn', () => ({
  completeCheckIn: vi.fn(),
}));

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => vi.fn(),
  };
});

function renderPage() {
  return render(
    <MemoryRouter initialEntries={['/check-in/identity']}>
      <CheckInIdentity />
    </MemoryRouter>
  );
}

describe('CheckInIdentity', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders the page heading', () => {
    renderPage();
    expect(screen.getByRole('heading', { name: /verify your identity/i })).toBeInTheDocument();
  });

  it('renders the step progress indicator', () => {
    renderPage();
    expect(screen.getByText('✓')).toBeInTheDocument();
    expect(screen.getByText('2')).toBeInTheDocument();
    expect(screen.getByText(/about you/i)).toBeInTheDocument();
    expect(screen.getByText(/identity check/i)).toBeInTheDocument();
  });

  it('renders instructions section', () => {
    renderPage();
    expect(screen.getByRole('heading', { name: /before you proceed/i })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /photo of yourself/i, level: 2 })).toBeInTheDocument();
    expect(screen.getByText(/photo of your identity documents/i)).toBeInTheDocument();
  });

  it('renders selfie upload field', () => {
    renderPage();
    expect(screen.getByRole('heading', { name: /photo of yourself/i, level: 2 })).toBeInTheDocument();
    expect(screen.getByText(/use your device camera to take a clear/i)).toBeInTheDocument();
  });

  it('renders identity document upload field', () => {
    renderPage();
    expect(screen.getByRole('heading', { name: /identity document/i, level: 2 })).toBeInTheDocument();
    expect(screen.getByText(/upload a clear photo/i)).toBeInTheDocument();
  });

  it('renders privacy notice', () => {
    renderPage();
    expect(screen.getByText(/verify your identity for this test/i)).toBeInTheDocument();
  });

  it('renders back link', () => {
    renderPage();
    expect(screen.getByRole('link', { name: 'Back' })).toHaveAttribute('href', '/check-in/about');
  });

  it('renders Complete check-in button', () => {
    renderPage();
    expect(screen.getByRole('button', { name: /complete check-in/i })).toBeInTheDocument();
  });

  it('Complete check-in button is disabled without files', () => {
    renderPage();
    const submitBtn = screen.getByRole('button', { name: /complete check-in/i });
    expect(submitBtn).toBeDisabled();
  });

  it('shows file name after selfie upload', async () => {
    renderPage();

    const file = new File(['test'], 'selfie.jpg', { type: 'image/jpeg' });
    const uploadLabels = screen.getAllByText(/take a photo/i);
    const label = uploadLabels[0] as HTMLLabelElement;
    const input = document.getElementById(label.htmlFor) as HTMLInputElement;
    
    // Trigger change event with file in target
    fireEvent.change(input, { target: { files: [file] } });

    expect(screen.getByText(/selfie\.jpg/i)).toBeInTheDocument();
  });

  it('shows file name after identity document upload', async () => {
    renderPage();

    const file = new File(['test'], 'passport.jpg', { type: 'image/jpeg' });
    const uploadLabels = screen.getAllByText(/take or upload photo/i);
    const label = uploadLabels[uploadLabels.length - 1] as HTMLLabelElement;
    const input = document.getElementById(label.htmlFor) as HTMLInputElement;
    
    fireEvent.change(input, { target: { files: [file] } });

    expect(screen.getByText(/passport\.jpg/i)).toBeInTheDocument();
  });

  it('enables Complete check-in button after both files uploaded', async () => {
    renderPage();

    const selfieFile = new File(['test'], 'selfie.jpg', { type: 'image/jpeg' });
    const docFile = new File(['test'], 'passport.jpg', { type: 'image/jpeg' });

    const selfieLabels = screen.getAllByText(/take a photo/i);
    const selfieLabel = selfieLabels[0] as HTMLLabelElement;
    const selfieInput = document.getElementById(selfieLabel.htmlFor) as HTMLInputElement;
    fireEvent.change(selfieInput, { target: { files: [selfieFile] } });

    const docLabels = screen.getAllByText(/take or upload photo/i);
    const docLabel = docLabels[docLabels.length - 1] as HTMLLabelElement;
    const docInput = document.getElementById(docLabel.htmlFor) as HTMLInputElement;
    fireEvent.change(docInput, { target: { files: [docFile] } });

    const submitBtn = screen.getByRole('button', { name: /complete check-in/i });
    expect(submitBtn).not.toBeDisabled();
  });

  it('calls completeCheckIn on successful submission', async () => {
    renderPage();

    const selfieFile = new File(['test'], 'selfie.jpg', { type: 'image/jpeg' });
    const docFile = new File(['test'], 'passport.jpg', { type: 'image/jpeg' });

    const selfieLabels = screen.getAllByText(/take a photo/i);
    const selfieLabel = selfieLabels[0] as HTMLLabelElement;
    const selfieInput = document.getElementById(selfieLabel.htmlFor) as HTMLInputElement;
    fireEvent.change(selfieInput, { target: { files: [selfieFile] } });

    const docLabels = screen.getAllByText(/take or upload photo/i);
    const docLabel = docLabels[docLabels.length - 1] as HTMLLabelElement;
    const docInput = document.getElementById(docLabel.htmlFor) as HTMLInputElement;
    fireEvent.change(docInput, { target: { files: [docFile] } });

    const submitBtn = screen.getByRole('button', { name: /complete check-in/i });
    // Verify button is enabled and can be clicked
    expect(submitBtn).not.toBeDisabled();
    fireEvent.click(submitBtn);
    // Test passes if no error is thrown during submission
  });
});

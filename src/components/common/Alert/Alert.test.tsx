import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { Alert } from './Alert';

describe('Alert', () => {
  it('renders message content', () => {
    render(<Alert>Alert message</Alert>);
    expect(screen.getByText('Alert message')).toBeInTheDocument();
  });

  it('renders title when provided', () => {
    render(<Alert title="Alert Title">Alert message</Alert>);
    expect(screen.getByText('Alert Title')).toBeInTheDocument();
    expect(screen.getByRole('heading', { level: 3 })).toHaveTextContent(
      'Alert Title'
    );
  });

  it('renders children as JSX nodes', () => {
    render(
      <Alert>
        <p>Paragraph content</p>
        <strong>Bold text</strong>
      </Alert>
    );
    expect(screen.getByText('Paragraph content')).toBeInTheDocument();
    expect(screen.getByText('Bold text')).toBeInTheDocument();
  });

  it('has role="alert" for error and warning variants', () => {
    const { rerender } = render(<Alert variant="error">Error</Alert>);
    expect(screen.getByTestId('alert-error')).toHaveAttribute('role', 'alert');

    rerender(<Alert variant="warning">Warning</Alert>);
    expect(screen.getByTestId('alert-warning')).toHaveAttribute('role', 'alert');
  });

  it('has role="status" for info and success variants', () => {
    const { rerender } = render(<Alert variant="info">Info</Alert>);
    expect(screen.getByTestId('alert-info')).toHaveAttribute('role', 'status');

    rerender(<Alert variant="success">Success</Alert>);
    expect(screen.getByTestId('alert-success')).toHaveAttribute('role', 'status');
  });

  it('renders close button by default', () => {
    render(<Alert>Alert</Alert>);
    expect(screen.getByLabelText('Close alert')).toBeInTheDocument();
  });

  it('hides close button when closeable={false}', () => {
    render(<Alert closeable={false}>Alert</Alert>);
    expect(screen.queryByLabelText('Close alert')).not.toBeInTheDocument();
  });

  it('calls onClose when close button is clicked', () => {
    const onClose = vi.fn();
    render(<Alert onClose={onClose}>Alert</Alert>);
    fireEvent.click(screen.getByLabelText('Close alert'));
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('applies variant-specific class names', () => {
    const { container: container1 } = render(<Alert variant="error">Error</Alert>);
    const errorEl = container1.querySelector('[class*="error"]');
    expect(errorEl).toBeInTheDocument();
    expect(errorEl?.classList.contains('icon')).toBe(false);

    const { container: container2 } = render(<Alert variant="success">Success</Alert>);
    const successEl = container2.querySelector('[class*="success"]');
    expect(successEl).toBeInTheDocument();
    expect(successEl?.classList.contains('icon')).toBe(false);
  });

  it('forwards extra className', () => {
    const { container } = render(
      <Alert className="custom-alert">Alert</Alert>
    );
    expect(container.firstChild as HTMLElement).toHaveClass('custom-alert');
  });

  it('renders with default info variant', () => {
    render(<Alert>Info alert</Alert>);
    expect(screen.getByTestId('alert-info')).toBeInTheDocument();
  });

  it('renders icon for each variant', () => {
    const { container } = render(
      <Alert variant="success" title="Success">
        Operation completed
      </Alert>
    );
    const icon = container.querySelector('[class*="icon"]');
    expect(icon).toBeInTheDocument();
    const svg = (icon as HTMLElement | null)?.querySelector('svg');
    expect(svg).toHaveAttribute('aria-hidden', 'true');
  });
});

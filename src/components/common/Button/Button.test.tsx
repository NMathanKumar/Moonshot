import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { Button } from './Button';

describe('Button', () => {
  it('renders its children', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByRole('button', { name: /click me/i })).toBeInTheDocument();
  });

  it('calls onClick when pressed', () => {
    const onClick = vi.fn();
    render(<Button onClick={onClick}>Go</Button>);
    fireEvent.click(screen.getByRole('button', { name: /go/i }));
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it('is disabled when disabled or isLoading', () => {
    const { rerender } = render(<Button disabled>X</Button>);
    expect(screen.getByRole('button')).toBeDisabled();
    rerender(<Button isLoading>X</Button>);
    expect(screen.getByRole('button')).toBeDisabled();
  });

  it('shows a loading label when isLoading', () => {
    render(<Button isLoading>Submit</Button>);
    expect(screen.getByText(/loading/i)).toBeInTheDocument();
  });

  it('defaults to type="button" and respects overrides', () => {
    const { rerender } = render(<Button>A</Button>);
    expect(screen.getByRole('button')).toHaveAttribute('type', 'button');
    rerender(<Button type="submit">A</Button>);
    expect(screen.getByRole('button')).toHaveAttribute('type', 'submit');
  });

  it('forwards extra props and className', () => {
    render(
      <Button className="extra" data-testid="btn" aria-label="save">
        S
      </Button>
    );
    const btn = screen.getByTestId('btn');
    expect(btn).toHaveClass('extra');
    expect(btn).toHaveAttribute('aria-label', 'save');
  });
});

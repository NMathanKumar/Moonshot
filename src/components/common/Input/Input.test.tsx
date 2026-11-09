import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { Input } from './Input.tsx';

describe('Input', () => {
  it('associates the label with the input via htmlFor/id', () => {
    render(<Input label="Email" name="email" />);
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
  });

  it('calls onChange when typing', () => {
    const onChange = vi.fn();
    render(<Input label="Name" name="name" value="" onChange={onChange} />);
    fireEvent.change(screen.getByLabelText(/name/i), { target: { value: 'a' } });
    expect(onChange).toHaveBeenCalled();
  });

  it('shows an error with role="alert" and sets aria-invalid + aria-describedby', () => {
    render(<Input label="Email" name="email" error="Required" />);
    const input = screen.getByLabelText(/email/i);
    expect(input).toHaveAttribute('aria-invalid', 'true');
    expect(input).toHaveAttribute('aria-describedby', 'email-error');
    expect(screen.getByRole('alert')).toHaveTextContent('Required');
  });

  it('shows helper text when there is no error and links it via aria-describedby', () => {
    render(<Input label="Email" name="email" helperText="We never share it" />);
    const input = screen.getByLabelText(/email/i);
    expect(input).toHaveAttribute('aria-describedby', 'email-helper');
    expect(screen.getByText(/never share/i)).toBeInTheDocument();
  });

  it('hides helper text when an error is present', () => {
    render(
      <Input label="Email" name="email" helperText="hint" error="bad" />
    );
    expect(screen.queryByText('hint')).not.toBeInTheDocument();
    expect(screen.getByRole('alert')).toHaveTextContent('bad');
  });

  it('marks required fields', () => {
    render(<Input label="Email" name="email" required />);
    expect(screen.getByLabelText(/email/i)).toBeRequired();
  });
});

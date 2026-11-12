import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { Dropdown } from './Dropdown';

describe('Dropdown', () => {
  const options = [
    { label: 'Option A', value: 'a' },
    { label: 'Option B', value: 'b' },
    { label: 'Option C', value: 'c' },
  ];

  it('renders a label when provided', () => {
    render(
      <Dropdown
        label="Choose one"
        name="test-select"
        options={options}
        value=""
        onChange={() => {}}
      />
    );
    expect(screen.getByLabelText(/choose one/i)).toBeInTheDocument();
  });

  it('renders all options', () => {
    render(<Dropdown name="test-select" options={options} value="a" onChange={() => {}} />);
    const select = screen.getByRole('combobox');
    expect(select).toBeInTheDocument();
    // Check that options exist in the select element
    const opts = select.querySelectorAll('option');
    expect(opts).toHaveLength(3);
    expect(opts[0].value).toBe('a');
    expect(opts[1].value).toBe('b');
    expect(opts[2].value).toBe('c');
  });

  it('calls onChange when selection changes', () => {
    const onChange = vi.fn();
    render(<Dropdown name="test-select" options={options} value="a" onChange={onChange} />);
    const select = screen.getByRole('combobox');
    fireEvent.change(select, { target: { value: 'b' } });
    expect(onChange).toHaveBeenCalledWith('b');
  });

  it('shows a placeholder when provided and no value is set', () => {
    render(
      <Dropdown
        name="test-select"
        options={options}
        value=""
        onChange={() => {}}
        placeholder="Select an option"
      />
    );
    const select = screen.getByRole('combobox');
    const placeholderOption = select.querySelector('option[value=""]');
    expect(placeholderOption).toHaveTextContent('Select an option');
  });

  it('displays error message and sets aria-invalid', () => {
    render(
      <Dropdown
        name="test-select"
        options={options}
        value=""
        onChange={() => {}}
        error="This field is required"
      />
    );
    const select = screen.getByRole('combobox');
    expect(select).toHaveAttribute('aria-invalid', 'true');
    expect(screen.getByText('This field is required')).toBeInTheDocument();
  });

  it('displays helper text when provided and no error', () => {
    render(
      <Dropdown
        name="test-select"
        options={options}
        value=""
        onChange={() => {}}
        helperText="Select your preference"
      />
    );
    expect(screen.getByText('Select your preference')).toBeInTheDocument();
  });

  it('hides helper text when error is present', () => {
    render(
      <Dropdown
        name="test-select"
        options={options}
        value=""
        onChange={() => {}}
        helperText="Helper text"
        error="Error message"
      />
    );
    expect(screen.queryByText('Helper text')).not.toBeInTheDocument();
    expect(screen.getByText('Error message')).toBeInTheDocument();
  });

  it('disables the select when disabled prop is true', () => {
    render(<Dropdown name="test-select" options={options} value="" onChange={() => {}} disabled />);
    expect(screen.getByRole('combobox')).toBeDisabled();
  });

  it('shows required indicator when required', () => {
    render(
      <Dropdown
        label="Required field"
        name="test-select"
        options={options}
        value=""
        onChange={() => {}}
        required
      />
    );
    expect(screen.getByText('*')).toBeInTheDocument();
  });

  it('forwards extra props and className', () => {
    render(
      <Dropdown
        name="test-select"
        options={options}
        value=""
        onChange={() => {}}
        className="custom-class"
        data-testid="custom-select"
      />
    );
    const select = screen.getByTestId('custom-select');
    expect(select).toHaveClass('custom-class');
  });

  it('sets aria-describedby when error and helper text are present', () => {
    const { rerender } = render(
      <Dropdown
        name="test-select"
        options={options}
        value=""
        onChange={() => {}}
        helperText="Helper"
      />
    );
    let select = screen.getByRole('combobox');
    expect(select).toHaveAttribute('aria-describedby', 'test-select-helper');

    rerender(
      <Dropdown
        name="test-select"
        options={options}
        value=""
        onChange={() => {}}
        helperText="Helper"
        error="Error"
      />
    );
    select = screen.getByRole('combobox');
    expect(select).toHaveAttribute('aria-describedby', 'test-select-error');
  });
});

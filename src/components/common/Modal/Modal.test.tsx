import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, afterEach } from 'vitest';
import { useState } from 'react';
import { Modal } from './Modal';
import { _getLockCount } from './scrollLock';

afterEach(() => {
  // Body overflow should always be released between tests.
  document.body.style.overflow = '';
});

describe('Modal', () => {
  it('does not render when closed', () => {
    render(
      <Modal isOpen={false} onClose={() => {}} title="Hi">
        body
      </Modal>
    );
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('renders as an accessible dialog with a labelled title', () => {
    render(
      <Modal isOpen onClose={() => {}} title="Confirm">
        body
      </Modal>
    );
    const dialog = screen.getByRole('dialog');
    expect(dialog).toHaveAttribute('aria-modal', 'true');
    expect(dialog).toHaveAccessibleName('Confirm');
  });

  it('closes on Escape, backdrop and close button', () => {
    const onClose = vi.fn();
    const { rerender } = render(
      <Modal isOpen onClose={onClose} title="T">
        body
      </Modal>
    );
    fireEvent.keyDown(screen.getByRole('dialog'), { key: 'Escape' });
    fireEvent.mouseDown(screen.getByTestId('modal-backdrop'));
    fireEvent.click(screen.getByRole('button', { name: /close dialog/i }));
    expect(onClose).toHaveBeenCalledTimes(3);
    rerender(
      <Modal isOpen onClose={onClose} title="T" closeOnBackdrop={false}>
        body
      </Modal>
    );
    fireEvent.mouseDown(screen.getByTestId('modal-backdrop'));
    expect(onClose).toHaveBeenCalledTimes(3); // unchanged
  });

  // --- focus trap ---

  it('moves focus into the dialog on open', () => {
    render(
      <Modal isOpen onClose={() => {}} title="T">
        <button type="button">Inside</button>
      </Modal>
    );
    // Close button is the first focusable in the header.
    expect(document.activeElement).toBe(screen.getByRole('button', { name: /close dialog/i }));
  });

  it('wraps focus forward (Tab on last -> first)', () => {
    render(
      <Modal isOpen onClose={() => {}} title="T">
        <button type="button">Last</button>
      </Modal>
    );
    const closeBtn = screen.getByRole('button', { name: /close dialog/i });
    const lastBtn = screen.getByRole('button', { name: 'Last' });
    lastBtn.focus();
    fireEvent.keyDown(screen.getByRole('dialog'), { key: 'Tab' });
    expect(document.activeElement).toBe(closeBtn);
  });

  it('wraps focus backward (Shift+Tab on first -> last)', () => {
    render(
      <Modal isOpen onClose={() => {}} title="T">
        <button type="button">Last</button>
      </Modal>
    );
    const closeBtn = screen.getByRole('button', { name: /close dialog/i });
    const lastBtn = screen.getByRole('button', { name: 'Last' });
    closeBtn.focus();
    fireEvent.keyDown(screen.getByRole('dialog'), { key: 'Tab', shiftKey: true });
    expect(document.activeElement).toBe(lastBtn);
  });

  it('pulls escaped focus back into the dialog on Tab', () => {
    render(
      <Modal isOpen onClose={() => {}} title="T">
        <button type="button">Inside</button>
      </Modal>
    );
    // Simulate focus escaping to the body.
    document.body.focus();
    fireEvent.keyDown(screen.getByRole('dialog'), { key: 'Tab' });
    const closeBtn = screen.getByRole('button', { name: /close dialog/i });
    expect(document.activeElement).toBe(closeBtn);
  });

  // --- focus restoration ---

  it('restores focus to the trigger when closed', () => {
    function Harness() {
      const [open, setOpen] = useState(false);
      return (
        <>
          <button type="button" onClick={() => setOpen(true)}>
            Open
          </button>
          <Modal isOpen={open} onClose={() => setOpen(false)} title="T">
            body
          </Modal>
        </>
      );
    }
    render(<Harness />);
    const opener = screen.getByRole('button', { name: 'Open' });
    opener.focus();
    fireEvent.click(opener);
    expect(screen.getByRole('dialog')).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: /close dialog/i }));
    expect(document.activeElement).toBe(opener);
  });

  // --- nested modal scroll lock ---

  it('keeps scroll locked until the LAST nested modal closes', () => {
    function Nested({ outer, inner }: { outer: boolean; inner: boolean }) {
      return (
        <>
          <Modal isOpen={outer} onClose={() => {}} title="Outer">
            outer
          </Modal>
          <Modal isOpen={inner} onClose={() => {}} title="Inner">
            inner
          </Modal>
        </>
      );
    }
    const { rerender } = render(<Nested outer inner={false} />);
    expect(_getLockCount()).toBe(1);
    expect(document.body.style.overflow).toBe('hidden');

    rerender(<Nested outer inner />); // open inner too
    expect(_getLockCount()).toBe(2);
    expect(document.body.style.overflow).toBe('hidden');

    rerender(<Nested outer inner={false} />); // close inner only
    expect(_getLockCount()).toBe(1);
    expect(document.body.style.overflow).toBe('hidden'); // STILL locked

    rerender(<Nested outer={false} inner={false} />); // close outer
    expect(_getLockCount()).toBe(0);
    expect(document.body.style.overflow).toBe('');
  });
});

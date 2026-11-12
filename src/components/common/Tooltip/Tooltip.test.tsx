import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { Tooltip } from './Tooltip';

describe('Tooltip', () => {
  it('is hidden by default', () => {
    render(
      <Tooltip content="More info">
        <button type="button">Help</button>
      </Tooltip>
    );
    expect(screen.queryByRole('tooltip')).not.toBeInTheDocument();
  });

  it('shows on hover and hides on leave', () => {
    render(
      <Tooltip content="More info">
        <button type="button">Help</button>
      </Tooltip>
    );
    const trigger = screen.getByRole('button', { name: /help/i });
    if (trigger.parentElement) {
      fireEvent.mouseEnter(trigger.parentElement);
      expect(screen.getByRole('tooltip')).toHaveTextContent('More info');
      fireEvent.mouseLeave(trigger.parentElement);
      expect(screen.queryByRole('tooltip')).not.toBeInTheDocument();
    }
  });

  it('shows on keyboard focus and links via aria-describedby', () => {
    render(
      <Tooltip content="More info">
        <button type="button">Help</button>
      </Tooltip>
    );
    const trigger = screen.getByRole('button', { name: /help/i });
    fireEvent.focus(trigger);
    const tip = screen.getByRole('tooltip');
    expect(trigger).toHaveAttribute('aria-describedby', tip.id);
  });

  it('dismisses on Escape', () => {
    render(
      <Tooltip content="More info">
        <button type="button">Help</button>
      </Tooltip>
    );
    const trigger = screen.getByRole('button', { name: /help/i });
    fireEvent.focus(trigger);
    expect(screen.getByRole('tooltip')).toBeInTheDocument();
    fireEvent.keyDown(trigger, { key: 'Escape' });
    expect(screen.queryByRole('tooltip')).not.toBeInTheDocument();
  });

  it('toggles on touch (tap to show, tap to hide)', () => {
    render(
      <Tooltip content="More info">
        <button type="button">Help</button>
      </Tooltip>
    );
    const wrapper = screen.getByRole('button', { name: /help/i }).parentElement;
    if (wrapper) {
      fireEvent.touchStart(wrapper);
      expect(screen.getByRole('tooltip')).toBeInTheDocument();
      fireEvent.touchStart(wrapper);
      expect(screen.queryByRole('tooltip')).not.toBeInTheDocument();
    }
  });
});

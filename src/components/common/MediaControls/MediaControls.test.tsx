import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { MediaControls } from './MediaControls';

describe('MediaControls', () => {
  it('renders the media player controls', () => {
    render(<MediaControls label="Audio player" duration={120} currentTime={30} />);
    expect(screen.getByLabelText('Audio player')).toBeInTheDocument();
  });

  it('displays current time and duration', () => {
    render(<MediaControls duration={180} currentTime={45} />);
    expect(screen.getByText(/00:45 \/ 03:00/)).toBeInTheDocument();
  });

  it('renders play and pause buttons', () => {
    render(<MediaControls duration={120} currentTime={0} isPlaying={false} />);
    expect(screen.getByLabelText('Play')).toBeInTheDocument();
    expect(screen.getByLabelText('Pause')).toBeInTheDocument();
  });

  it('disables play button when already playing', () => {
    render(<MediaControls duration={120} currentTime={30} isPlaying={true} />);
    expect(screen.getByLabelText('Play')).toBeDisabled();
    expect(screen.getByLabelText('Pause')).not.toBeDisabled();
  });

  it('disables pause button when not playing', () => {
    render(<MediaControls duration={120} currentTime={30} isPlaying={false} />);
    expect(screen.getByLabelText('Play')).not.toBeDisabled();
    expect(screen.getByLabelText('Pause')).toBeDisabled();
  });

  it('calls onPlay when play button is clicked', () => {
    const onPlay = vi.fn();
    render(<MediaControls duration={120} currentTime={0} isPlaying={false} onPlay={onPlay} />);
    fireEvent.click(screen.getByLabelText('Play'));
    expect(onPlay).toHaveBeenCalledTimes(1);
  });

  it('calls onPause when pause button is clicked', () => {
    const onPause = vi.fn();
    render(<MediaControls duration={120} currentTime={30} isPlaying={true} onPause={onPause} />);
    fireEvent.click(screen.getByLabelText('Pause'));
    expect(onPause).toHaveBeenCalledTimes(1);
  });

  it('shows volume control by default', () => {
    render(<MediaControls duration={120} currentTime={0} />);
    expect(screen.getByLabelText('Volume')).toBeInTheDocument();
  });

  it('hides volume control when showVolume={false}', () => {
    render(<MediaControls duration={120} currentTime={0} showVolume={false} />);
    expect(screen.queryByLabelText('Volume')).not.toBeInTheDocument();
  });

  it('calls onVolumeChange when volume slider changes', () => {
    const onVolumeChange = vi.fn();
    render(<MediaControls duration={120} currentTime={0} onVolumeChange={onVolumeChange} />);
    const volumeSlider = screen.getByLabelText('Volume');
    fireEvent.change(volumeSlider, { target: { value: '0.5' } });
    expect(onVolumeChange).toHaveBeenCalledWith(0.5);
  });

  it('formats time correctly', () => {
    const { rerender } = render(<MediaControls duration={3661} currentTime={605} />);
    // Check the time display element specifically
    const timeDisplayElements = screen.getAllByLabelText(/10:05 of 61:01/);
    expect(timeDisplayElements.length).toBeGreaterThan(0); // Both time display and seek button have this

    rerender(<MediaControls duration={45} currentTime={5} />);
    const newTimeDisplayElements = screen.getAllByLabelText(/00:05 of 00:45/);
    expect(newTimeDisplayElements.length).toBeGreaterThan(0);
  });

  it('calls onSeek when progress bar is clicked', () => {
    const onSeek = vi.fn();
    render(<MediaControls duration={100} currentTime={25} onSeek={onSeek} />);
    const progressButton = screen.getByLabelText(/Seek to position/);
    fireEvent.click(progressButton, { clientX: progressButton.getBoundingClientRect().left + 50 });
    expect(onSeek).toHaveBeenCalled();
  });

  it('sets progress slider aria attributes', () => {
    render(<MediaControls duration={120} currentTime={60} />);
    const slider = screen.getByLabelText(/Seek to position/);
    expect(slider).toHaveAttribute('aria-valuemin', '0');
    expect(slider).toHaveAttribute('aria-valuemax', '120');
    expect(slider).toHaveAttribute('aria-valuenow', '60');
  });

  it('forwards extra className', () => {
    const { container } = render(
      <MediaControls duration={120} currentTime={0} className="custom-controls" />
    );
    expect(container.firstChild).toHaveClass('custom-controls');
  });
});

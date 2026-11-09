/**
 * MediaControls Component
 * Accessible controls for audio/video playback (play, pause, progress, volume).
 * Component is controls-only; parent manages media element, state, and playback.
 * WCAG 2.1 AA.
 */

import styles from './MediaControls.module.css';

const formatTime = (seconds: number): string => {
  if (!Number.isFinite(seconds)) return '00:00';
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
};

export interface MediaControlsProps {
  label?: string;
  currentTime?: number;
  duration?: number;
  isPlaying?: boolean;
  onPlay?: () => void;
  onPause?: () => void;
  onSeek?: (time: number) => void;
  showVolume?: boolean;
  volume?: number;
  onVolumeChange?: (volume: number) => void;
  className?: string;
}

export const MediaControls: React.FC<MediaControlsProps> = ({
  label = 'Media player',
  currentTime = 0,
  duration = 0,
  isPlaying = false,
  onPlay,
  onPause,
  onSeek,
  showVolume = true,
  volume = 1,
  onVolumeChange,
  className = '',
}) => {
  const controlsClass = [styles.controls, className].filter(Boolean).join(' ');
  
  const progressPercent = duration > 0 ? (currentTime / duration) * 100 : 0;

  const handleProgressClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (!onSeek || duration === 0) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const percent = (e.clientX - rect.left) / rect.width;
    const newTime = Math.max(0, Math.min(percent * duration, duration));
    onSeek(newTime);
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!onVolumeChange) return;
    const newVolume = parseFloat(e.target.value);
    onVolumeChange(newVolume);
  };

  return (
    <div className={controlsClass} aria-label={label}>
      {/* Time display */}
      <div className={styles.display}>
        <span className={styles.displayLabel}>Time:</span>
        <span
          className={styles.timeDisplay}
          aria-label={`Current time: ${formatTime(currentTime)} of ${formatTime(duration)}`}
          aria-live="off"
        >
          {formatTime(currentTime)} / {formatTime(duration)}
        </span>
      </div>

      {/* Progress bar */}
      <div className={styles.progressContainer}>
        <div className={styles.progress}>
          <button
            type="button"
            className={styles.progressBar}
            onClick={handleProgressClick}
            aria-label={`Seek to position: ${formatTime(currentTime)} of ${formatTime(duration)}`}
            aria-valuemin={0}
            aria-valuemax={duration}
            aria-valuenow={currentTime}
            aria-valuetext={formatTime(currentTime)}
            role="slider"
          >
            <div
              className={styles.progressFill}
              style={{ width: `${progressPercent}%` }}
            />
          </button>
        </div>
        <span className={styles.progressTime}>{formatTime(duration)}</span>
      </div>

      {/* Control buttons */}
      <div className={styles.controlsRow}>
        <button
          type="button"
          className={[styles.button, !isPlaying ? styles.primary : ''].filter(Boolean).join(' ')}
          onClick={onPlay}
          disabled={isPlaying}
          aria-label="Play"
          aria-pressed={isPlaying}
        >
          <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
            <path d="M4 3v14l12-7L4 3z" />
          </svg>
        </button>
        <button
          type="button"
          className={[styles.button, isPlaying ? styles.primary : ''].filter(Boolean).join(' ')}
          onClick={onPause}
          disabled={!isPlaying}
          aria-label="Pause"
          aria-pressed={!isPlaying}
        >
          <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
            <path d="M6 4h2v12H6V4zm6 0h2v12h-2V4z" />
          </svg>
        </button>

        {/* Volume control */}
        {showVolume && (
          <div className={styles.volumeControl}>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
              <path d="M3.5 5a.5.5 0 0 1 .5-.5h2.793L10 2.207a.5.5 0 0 1 1 .293v11a.5.5 0 0 1-1 .293L6.793 11.5H4a.5.5 0 0 1-.5-.5v-5z" />
            </svg>
            <input
              type="range"
              min={0}
              max={1}
              step={0.1}
              value={volume}
              onChange={handleVolumeChange}
              className={styles.volumeSlider}
              aria-label="Volume"
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default MediaControls;

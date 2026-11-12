/**
 * MediaControls Component
 * Accessible controls for audio/video playback (play, pause, progress, volume).
 * Component is controls-only; parent manages media element, state, and playback.
 * WCAG 2.1 AA.
 */

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
  const controlsClass = [
    'flex flex-col gap-4 p-4 bg-white border border-[#DDE2E7] rounded-md',
    className,
  ]
    .filter(Boolean)
    .join(' ');

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
      <div className="flex items-center justify-between gap-4">
        <span className="text-xs text-[#55657B] flex-shrink-0">Time:</span>
        <span
          className="font-mono text-sm font-semibold text-[#232D3F]"
          aria-label={`Current time: ${formatTime(currentTime)} of ${formatTime(duration)}`}
          aria-live="off"
        >
          {formatTime(currentTime)} / {formatTime(duration)}
        </span>
      </div>

      {/* Progress bar */}
      <div className="flex items-center gap-2 flex-wrap">
        <div className="flex-1 min-w-[100px]">
          <button
            type="button"
            className="w-full h-1 bg-[#DDE2E7] rounded-full cursor-pointer relative overflow-hidden"
            onClick={handleProgressClick}
            aria-label={`Seek to position: ${formatTime(currentTime)} of ${formatTime(duration)}`}
            aria-valuemin={0}
            aria-valuemax={duration}
            aria-valuenow={currentTime}
            aria-valuetext={formatTime(currentTime)}
            role="slider"
          >
            <div
              className="h-full bg-[#FF6A00] rounded-full transition-all"
              style={{ width: `${progressPercent}%` }}
            />
          </button>
        </div>
        <span className="text-xs text-[#55657B] whitespace-nowrap flex-shrink-0">
          {formatTime(duration)}
        </span>
      </div>

      {/* Control buttons */}
      <div className="flex items-center justify-center gap-2">
        <button
          type="button"
          className={`inline-flex items-center justify-center w-10 h-10 border-none rounded text-[#232D3F] cursor-pointer transition-all p-0 ${
            !isPlaying
              ? 'bg-[#FF6A00] text-white hover:bg-[#E85A00]'
              : 'bg-[#efefef] hover:bg-[#ddd]'
          } focus-visible:outline-2 focus-visible:outline-[#FF6A00] focus-visible:outline-offset-2 disabled:opacity-50 disabled:cursor-not-allowed`}
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
          className={`inline-flex items-center justify-center w-10 h-10 border-none rounded text-[#232D3F] cursor-pointer transition-all p-0 ${
            isPlaying
              ? 'bg-[#FF6A00] text-white hover:bg-[#E85A00]'
              : 'bg-[#efefef] hover:bg-[#ddd]'
          } focus-visible:outline-2 focus-visible:outline-[#FF6A00] focus-visible:outline-offset-2 disabled:opacity-50 disabled:cursor-not-allowed`}
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
          <div className="flex items-center gap-2">
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
              className="w-20 h-1 cursor-pointer"
              aria-label="Volume"
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default MediaControls;

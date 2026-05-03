import { motion } from 'framer-motion'
import { formatTime } from '../utils'

// ── SVG Icons ─────────────────────────────────────────────────────────────────
const Icon = {
  Play: () => (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-7 h-7">
      <path d="M8 5v14l11-7z"/>
    </svg>
  ),
  Pause: () => (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-7 h-7">
      <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/>
    </svg>
  ),
  Next: () => (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
      <path d="M6 18l8.5-6L6 6v12zm2-8.14L11.03 12 8 14.14V9.86zM16 6h2v12h-2z"/>
    </svg>
  ),
  Prev: () => (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
      <path d="M6 6h2v12H6zm3.5 6 8.5 6V6z"/>
    </svg>
  ),
  Shuffle: () => (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
      <path d="M10.59 9.17 5.41 4 4 5.41l5.17 5.17 1.42-1.41zM14.5 4l2.04 2.04L4 18.59 5.41 20 17.96 7.46 20 9.5V4h-5.5zm.33 9.41-1.41 1.41 3.13 3.13L14.5 20H20v-5.5l-2.04 2.04-3.13-3.13z"/>
    </svg>
  ),
  RepeatAll: () => (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
      <path d="M7 7h10v3l4-4-4-4v3H5v6h2V7zm10 10H7v-3l-4 4 4 4v-3h12v-6h-2v4z"/>
    </svg>
  ),
  RepeatOne: () => (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
      <path d="M7 7h10v3l4-4-4-4v3H5v6h2V7zm10 10H7v-3l-4 4 4 4v-3h12v-6h-2v4zm-4-2V9h-1l-2 1v1h1.5v6H13z"/>
    </svg>
  ),
  Volume: ({ level }) => (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
      {level === 0
        ? <path d="M16.5 12A4.5 4.5 0 0 0 14 7.97v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51A8.796 8.796 0 0 0 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3 3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4 9.91 6.09 12 8.18V4z"/>
        : level < 0.5
        ? <path d="M18.5 12A4.5 4.5 0 0 0 16 7.97v8.05c1.48-.73 2.5-2.25 2.5-4.02zM5 9v6h4l5 5V4L9 9H5z"/>
        : <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3A4.5 4.5 0 0 0 14 7.97v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z"/>
      }
    </svg>
  ),
}

// ── Tap-friendly icon button ──────────────────────────────────────────────────
function IconBtn({ onClick, children, active, large, className = '' }) {
  return (
    <motion.button
      onClick={onClick}
      whileTap={{ scale: 0.82 }}
      whileHover={{ scale: 1.1 }}
      className={`flex items-center justify-center rounded-full transition-colors select-none
        ${large
          ? 'w-16 h-16 bg-white text-void shadow-aurora-btn'
          : 'w-11 h-11 text-text-dim hover:text-text'
        }
        ${active ? '!text-aurora' : ''}
        ${className}`}
    >
      {children}
    </motion.button>
  )
}

// ── Progress bar ──────────────────────────────────────────────────────────────
function ProgressBar({ currentTime, duration, onSeek }) {
  const pct = duration > 0 ? (currentTime / duration) * 100 : 0

  return (
    <div className="w-full space-y-1">
      <div className="relative group cursor-pointer" style={{ height: 20, display: 'flex', alignItems: 'center' }}>
        {/* Track background */}
        <div className="absolute w-full h-1 rounded-full bg-white/10" />
        {/* Filled portion */}
        <div
          className="absolute h-1 rounded-full transition-none"
          style={{
            width: `${pct}%`,
            background: 'linear-gradient(90deg, #7c6aff, #ff6ab0)'
          }}
        />
        <input
          type="range"
          min={0}
          max={duration || 100}
          value={currentTime}
          step={0.1}
          onChange={e => onSeek(parseFloat(e.target.value))}
          className="absolute w-full opacity-0 cursor-pointer h-5"
          style={{ zIndex: 2 }}
        />
        {/* Thumb dot visible */}
        <div
          className="absolute w-3 h-3 rounded-full bg-white shadow-glow-sm pointer-events-none"
          style={{ left: `calc(${pct}% - 6px)` }}
        />
      </div>
      <div className="flex justify-between text-xs font-body text-text-dim">
        <span>{formatTime(currentTime)}</span>
        <span>{formatTime(duration)}</span>
      </div>
    </div>
  )
}

// ── Volume slider ─────────────────────────────────────────────────────────────
function VolumeControl({ volume, setVolume }) {
  return (
    <div className="flex items-center gap-2">
      <Icon.Volume level={volume} />
      <div className="relative flex-1" style={{ height: 16, display: 'flex', alignItems: 'center' }}>
        <div className="absolute w-full h-0.5 rounded-full bg-white/10" />
        <div
          className="absolute h-0.5 rounded-full"
          style={{ width: `${volume * 100}%`, background: 'linear-gradient(90deg, #7c6aff, #ff6ab0)' }}
        />
        <input
          type="range" min={0} max={1} step={0.01}
          value={volume}
          onChange={e => setVolume(parseFloat(e.target.value))}
          className="absolute w-full opacity-0 cursor-pointer h-4"
        />
      </div>
    </div>
  )
}

// ── Main export ───────────────────────────────────────────────────────────────
export default function PlayerControls({
  currentTrack, isPlaying, duration, currentTime, volume,
  isShuffle, repeatMode,
  onPlay, onPrev, onNext, onSeek, onVolume, onShuffle, onRepeat,
}) {
  const RepeatIcon = repeatMode === 'one' ? Icon.RepeatOne : Icon.RepeatAll

  return (
    <div className="w-full space-y-5">
      {/* Track info */}
      <div className="text-center space-y-0.5 overflow-hidden">
        <motion.p
          key={currentTrack?.id}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="font-display font-semibold text-lg text-text truncate leading-tight"
        >
          {currentTrack?.name ?? 'No track loaded'}
        </motion.p>
        <p className="text-text-dim text-sm font-body">Local File</p>
      </div>

      {/* Progress */}
      <ProgressBar currentTime={currentTime} duration={duration} onSeek={onSeek} />

      {/* Controls row */}
      <div className="flex items-center justify-between px-2">
        <IconBtn onClick={onShuffle} active={isShuffle}>
          <Icon.Shuffle />
        </IconBtn>

        <IconBtn onClick={onPrev}>
          <Icon.Prev />
        </IconBtn>

        <IconBtn large onClick={onPlay}>
          {isPlaying ? <Icon.Pause /> : <Icon.Play />}
        </IconBtn>

        <IconBtn onClick={onNext}>
          <Icon.Next />
        </IconBtn>

        <IconBtn onClick={onRepeat} active={repeatMode !== 'none'}>
          <RepeatIcon />
        </IconBtn>
      </div>

      {/* Volume */}
      <VolumeControl volume={volume} setVolume={onVolume} />
    </div>
  )
}

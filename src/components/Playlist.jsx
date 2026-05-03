import { motion, AnimatePresence } from 'framer-motion'
import { formatTime } from '../utils'

function TrackRow({ track, index, isActive, onPlay }) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, x: -16 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 16 }}
      transition={{ delay: index * 0.03, duration: 0.25 }}
      onClick={() => onPlay(index)}
      className={`
        flex items-center gap-3 px-4 py-3 rounded-2xl cursor-pointer
        transition-all duration-200 select-none group
        ${isActive
          ? 'bg-white/8 border border-aurora/30'
          : 'hover:bg-white/5 border border-transparent'
        }
      `}
    >
      {/* Index / playing indicator */}
      <div className="w-7 h-7 flex-shrink-0 flex items-center justify-center">
        {isActive ? (
          <BarsIcon />
        ) : (
          <span className="text-xs text-text-dim font-body">{index + 1}</span>
        )}
      </div>

      {/* Track name */}
      <div className="flex-1 min-w-0">
        <p className={`text-sm font-body truncate ${isActive ? 'text-aurora font-medium' : 'text-text'}`}>
          {track.name}
        </p>
      </div>

      {/* Kebab / duration placeholder */}
      <div className="w-10 text-right">
        <span className="text-xs text-text-dim font-body tabular-nums">
          {track.formattedDuration ?? '—'}
        </span>
      </div>
    </motion.div>
  )
}

function BarsIcon() {
  return (
    <div className="flex items-end gap-0.5 h-4">
      {[1, 2, 3].map((i) => (
        <motion.div
          key={i}
          className="w-1 rounded-sm bg-aurora"
          animate={{ height: ['40%', '100%', '60%', '100%', '40%'] }}
          transition={{ duration: 1.2, repeat: Infinity, delay: i * 0.15, ease: 'easeInOut' }}
          style={{ minHeight: 2 }}
        />
      ))}
    </div>
  )
}

export default function Playlist({ playlist, currentIndex, onPlay, onLoadFiles }) {
  const handleFileInput = (e) => {
    if (e.target.files?.length) onLoadFiles(e.target.files)
  }

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 flex-shrink-0">
        <div>
          <h2 className="font-display font-semibold text-base text-text">Queue</h2>
          <p className="text-xs text-text-dim font-body">{playlist.length} tracks</p>
        </div>
        <label className="relative cursor-pointer">
          <input
            type="file"
            accept="audio/*"
            multiple
            onChange={handleFileInput}
            className="absolute inset-0 opacity-0 w-full h-full cursor-pointer"
          />
          <motion.div
            whileTap={{ scale: 0.92 }}
            whileHover={{ scale: 1.04 }}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-display font-semibold text-aurora border border-aurora/30 bg-aurora/5"
          >
            <svg viewBox="0 0 24 24" fill="currentColor" className="w-3.5 h-3.5">
              <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/>
            </svg>
            Add files
          </motion.div>
        </label>
      </div>

      {/* List */}
      <div className="flex-1 overflow-y-auto px-2 pb-4 space-y-0.5">
        {playlist.length === 0 ? (
          <EmptyState onLoadFiles={onLoadFiles} />
        ) : (
          <AnimatePresence initial={false}>
            {playlist.map((track, i) => (
              <TrackRow
                key={track.id}
                track={track}
                index={i}
                isActive={i === currentIndex}
                onPlay={onPlay}
              />
            ))}
          </AnimatePresence>
        )}
      </div>
    </div>
  )
}

function EmptyState({ onLoadFiles }) {
  return (
    <label className="flex flex-col items-center justify-center h-48 cursor-pointer group">
      <input
        type="file" accept="audio/*" multiple
        onChange={e => { if (e.target.files?.length) onLoadFiles(e.target.files) }}
        className="absolute opacity-0 w-0 h-0"
      />
      <motion.div
        animate={{ scale: [1, 1.05, 1] }}
        transition={{ duration: 2, repeat: Infinity }}
        className="w-14 h-14 rounded-full bg-aurora/10 border border-aurora/20 flex items-center justify-center mb-3"
      >
        <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 text-aurora/60">
          <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z"/>
        </svg>
      </motion.div>
      <p className="text-text-dim text-sm font-body text-center">Tap to load your music</p>
      <p className="text-text-dim/50 text-xs font-body text-center mt-1">MP3, WAV, FLAC, AAC & more</p>
    </label>
  )
}

import { useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useAudioPlayer } from './hooks/useAudioPlayer'
import PlayerControls from './components/PlayerControls'
import Playlist from './components/Playlist'
import VinylDisc from './components/VinylDisc'
import Visualizer from './components/Visualizer'
import AuroraBackground from './components/AuroraBackground'

const VIEWS = ['player', 'queue']

export default function App() {
  const [view, setView] = useState('player')

  const {
    playlist, currentTrack, currentIndex,
    isPlaying, duration, currentTime, volume,
    isShuffle, repeatMode, analyserBars,
    loadFiles, togglePlay, next, prev, seek,
    setVolume, setIsShuffle, cycleRepeat, playAt,
  } = useAudioPlayer()

  const handleFiles = useCallback((files) => {
    loadFiles(files)
    setView('player')
  }, [loadFiles])

  return (
    <div className="relative h-full flex flex-col items-center justify-center overflow-hidden bg-void">
      <AuroraBackground isPlaying={isPlaying} />

      {/* ── Mobile-first shell ──────────────────────────────────────── */}
      <div
        className="relative z-10 w-full max-w-sm flex flex-col h-full safe-top safe-bottom"
        style={{ maxHeight: '100dvh' }}
      >

        {/* ── Top bar ──────────────────────────────────────────────── */}
        <header className="flex items-center justify-between px-6 pt-2 pb-4 flex-shrink-0">
          <div>
            <h1 className="font-display font-extrabold text-2xl tracking-tight text-text">Aura</h1>
            <p className="text-text-dim text-xs font-body">Local Music Player</p>
          </div>

          {/* Load files button (top-right shortcut) */}
          <label className="relative cursor-pointer">
            <input
              type="file" accept="audio/*" multiple
              onChange={e => { if (e.target.files?.length) handleFiles(e.target.files) }}
              className="absolute inset-0 opacity-0 cursor-pointer"
            />
            <motion.div
              whileTap={{ scale: 0.9 }}
              className="w-10 h-10 rounded-full glass flex items-center justify-center border border-glass-border"
            >
              <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-text-dim">
                <path d="M20 6h-2.18c.07-.44.18-.88.18-1.3C18 2.12 15.88 0 13.3 0c-1.3 0-2.51.56-3.36 1.45L9 3 8.06 1.45C7.21.56 6 0 4.7 0 2.12 0 0 2.12 0 4.7c0 .42.07.86.18 1.3H0l-2 2v12a2 2 0 0 0 2 2h18a2 2 0 0 0 2-2V8l-2-2zm-2 14H2V9h16v11zm-1.03-14H3.03C2.4 5.75 2 5.25 2 4.7 2 3.21 3.21 2 4.7 2c.88 0 1.7.38 2.27.99L9 5.5l2.03-2.51C11.6 2.38 12.42 2 13.3 2 14.79 2 16 3.21 16 4.7c0 .55-.4 1.05-1.03 1.3z"/>
              </svg>
            </motion.div>
          </label>
        </header>

        {/* ── View tabs ─────────────────────────────────────────────── */}
        <div className="flex gap-1 mx-6 mb-4 glass rounded-2xl p-1 flex-shrink-0">
          {VIEWS.map(v => (
            <motion.button
              key={v}
              onClick={() => setView(v)}
              className={`flex-1 py-2 rounded-xl text-sm font-display font-semibold capitalize transition-colors ${
                view === v ? 'bg-white/10 text-text' : 'text-text-dim'
              }`}
              whileTap={{ scale: 0.96 }}
            >
              {v}
            </motion.button>
          ))}
        </div>

        {/* ── Main content area ────────────────────────────────────── */}
        <div className="flex-1 overflow-hidden relative">
          <AnimatePresence mode="wait">
            {view === 'player' ? (
              <motion.div
                key="player"
                initial={{ opacity: 0, x: -24 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 24 }}
                transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
                className="absolute inset-0 flex flex-col items-center px-6 pb-4 overflow-y-auto"
              >
                {/* Vinyl */}
                <div className="flex-shrink-0 mt-2 mb-6">
                  <VinylDisc track={currentTrack} isPlaying={isPlaying} />
                </div>

                {/* Visualizer */}
                <div className="w-full glass rounded-2xl overflow-hidden flex-shrink-0 mb-6"
                  style={{ height: 60 }}>
                  <Visualizer bars={analyserBars} isPlaying={isPlaying} />
                </div>

                {/* Controls card */}
                <div className="w-full glass rounded-3xl p-5 shadow-glass">
                  <PlayerControls
                    currentTrack={currentTrack}
                    isPlaying={isPlaying}
                    duration={duration}
                    currentTime={currentTime}
                    volume={volume}
                    isShuffle={isShuffle}
                    repeatMode={repeatMode}
                    onPlay={togglePlay}
                    onPrev={prev}
                    onNext={next}
                    onSeek={seek}
                    onVolume={setVolume}
                    onShuffle={() => setIsShuffle(s => !s)}
                    onRepeat={cycleRepeat}
                  />
                </div>

                {/* Empty state nudge */}
                {playlist.length === 0 && (
                  <motion.label
                    className="relative mt-4 cursor-pointer w-full"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                  >
                    <input
                      type="file" accept="audio/*" multiple
                      onChange={e => { if (e.target.files?.length) handleFiles(e.target.files) }}
                      className="absolute opacity-0 w-0 h-0"
                    />
                    <motion.div
                      whileTap={{ scale: 0.97 }}
                      className="glass border border-aurora/20 rounded-2xl p-4 flex items-center gap-3"
                    >
                      <div className="w-10 h-10 rounded-full bg-aurora/15 flex items-center justify-center flex-shrink-0">
                        <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-aurora">
                          <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z"/>
                        </svg>
                      </div>
                      <div>
                        <p className="text-text text-sm font-display font-semibold">Load your music</p>
                        <p className="text-text-dim text-xs font-body">Tap to select audio files</p>
                      </div>
                    </motion.div>
                  </motion.label>
                )}
              </motion.div>
            ) : (
              <motion.div
                key="queue"
                initial={{ opacity: 0, x: 24 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -24 }}
                transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
                className="absolute inset-0 glass rounded-3xl mx-2 overflow-hidden"
              >
                <Playlist
                  playlist={playlist}
                  currentIndex={currentIndex}
                  onPlay={playAt}
                  onLoadFiles={handleFiles}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* ── Mini-player strip (queue view only) ─────────────────── */}
        <AnimatePresence>
          {view === 'queue' && currentTrack && (
            <motion.div
              key="mini"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 16 }}
              className="flex-shrink-0 mx-4 mt-2 mb-2 glass rounded-2xl px-4 py-3 flex items-center gap-3 shadow-glass"
            >
              {/* Disc */}
              <div className="w-10 h-10 rounded-full flex-shrink-0 flex items-center justify-center"
                style={{ background: 'linear-gradient(135deg, #7c6aff, #ff6ab0)' }}>
                <span className="font-display font-bold text-white text-sm">
                  {currentTrack.name[0].toUpperCase()}
                </span>
              </div>

              <div className="flex-1 min-w-0">
                <p className="text-text text-sm font-display font-medium truncate">{currentTrack.name}</p>
                <div className="w-full h-0.5 bg-white/10 rounded-full mt-1.5 overflow-hidden">
                  <div
                    className="h-full rounded-full transition-none"
                    style={{
                      width: duration > 0 ? `${(currentTime / duration) * 100}%` : '0%',
                      background: 'linear-gradient(90deg, #7c6aff, #ff6ab0)'
                    }}
                  />
                </div>
              </div>

              <motion.button
                onClick={togglePlay}
                whileTap={{ scale: 0.85 }}
                className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center flex-shrink-0"
              >
                {isPlaying ? (
                  <svg viewBox="0 0 24 24" fill="white" className="w-4 h-4"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/></svg>
                ) : (
                  <svg viewBox="0 0 24 24" fill="white" className="w-4 h-4"><path d="M8 5v14l11-7z"/></svg>
                )}
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ── Desktop layout enhancement ───────────────────────────── */}
      {/* On larger screens, show side-by-side */}
      <style>{`
        @media (min-width: 768px) {
          .desktop-shell {
            display: grid !important;
            grid-template-columns: 360px 340px;
            gap: 0;
            height: auto !important;
            max-height: 90vh !important;
            max-width: 720px !important;
            border-radius: 32px;
            overflow: hidden;
            box-shadow: 0 40px 80px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.06);
            background: rgba(18,18,26,0.9);
            backdrop-filter: blur(40px);
            border: 1px solid rgba(255,255,255,0.08);
          }
        }
      `}</style>
    </div>
  )
}

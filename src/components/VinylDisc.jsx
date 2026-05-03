import { motion, AnimatePresence } from 'framer-motion'

export default function VinylDisc({ track, isPlaying }) {
  const initial = track?.name?.[0]?.toUpperCase() ?? '♪'

  return (
    <div className="relative flex items-center justify-center" style={{ width: 220, height: 220 }}>
      {/* Outer glow ring */}
      <motion.div
        className="absolute inset-0 rounded-full"
        style={{ background: 'radial-gradient(circle, rgba(124,106,255,0.15) 0%, transparent 70%)' }}
        animate={{ scale: isPlaying ? [1, 1.08, 1] : 1, opacity: isPlaying ? [0.6, 1, 0.6] : 0.3 }}
        transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
      />

      {/* Vinyl record */}
      <div
        className={`relative rounded-full overflow-hidden ${isPlaying ? 'vinyl-spin' : 'vinyl-paused'}`}
        style={{ width: 200, height: 200, transition: 'animation-play-state 0.3s' }}
      >
        {/* Record grooves */}
        <div className="absolute inset-0 rounded-full"
          style={{ background: 'conic-gradient(from 0deg, #1a1a2e 0deg, #16213e 10deg, #1a1a2e 20deg, #16213e 30deg, #1a1a2e 40deg, #16213e 50deg, #1a1a2e 60deg, #16213e 70deg, #1a1a2e 80deg, #16213e 90deg, #1a1a2e 100deg, #16213e 110deg, #1a1a2e 120deg, #16213e 130deg, #1a1a2e 140deg, #16213e 150deg, #1a1a2e 160deg, #16213e 170deg, #1a1a2e 180deg, #16213e 190deg, #1a1a2e 200deg, #16213e 210deg, #1a1a2e 220deg, #16213e 230deg, #1a1a2e 240deg, #16213e 250deg, #1a1a2e 260deg, #16213e 270deg, #1a1a2e 280deg, #16213e 290deg, #1a1a2e 300deg, #16213e 310deg, #1a1a2e 320deg, #16213e 330deg, #1a1a2e 340deg, #16213e 350deg, #1a1a2e 360deg)' }}
        />

        {/* Groove rings */}
        {[30, 50, 70, 90, 110, 130].map(r => (
          <div key={r} className="absolute rounded-full border border-white/5"
            style={{ inset: r, top: r, left: r, right: r, bottom: r }}
          />
        ))}

        {/* Center label */}
        <div className="absolute rounded-full flex items-center justify-center"
          style={{
            inset: '35%',
            background: 'linear-gradient(135deg, #7c6aff 0%, #ff6ab0 50%, #6affda 100%)',
            boxShadow: '0 0 20px rgba(124,106,255,0.5)'
          }}
        >
          {/* Center hole */}
          <div className="absolute w-4 h-4 rounded-full bg-void" />
          <AnimatePresence mode="wait">
            <motion.span
              key={track?.id ?? 'empty'}
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.5 }}
              className="font-display font-bold text-2xl text-white select-none z-10"
            >
              {initial}
            </motion.span>
          </AnimatePresence>
        </div>
      </div>

      {/* Needle arm */}
      <motion.div
        className="absolute"
        style={{ right: -10, top: '5%', transformOrigin: '90% 5%', zIndex: 10 }}
        animate={{ rotate: isPlaying ? 28 : 10 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
      >
        <svg width="50" height="80" viewBox="0 0 50 80">
          <line x1="45" y1="5" x2="15" y2="72" stroke="rgba(255,255,255,0.5)" strokeWidth="2" strokeLinecap="round" />
          <circle cx="45" cy="5" r="5" fill="rgba(255,255,255,0.2)" stroke="rgba(255,255,255,0.4)" strokeWidth="1" />
          <circle cx="14" cy="73" r="3" fill="#7c6aff" />
        </svg>
      </motion.div>
    </div>
  )
}

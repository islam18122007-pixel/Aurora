import { motion } from 'framer-motion'

export default function AuroraBackground({ isPlaying }) {
  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none" style={{ zIndex: 0 }}>
      {/* Base gradient */}
      <div
        className="absolute inset-0"
        style={{ background: 'radial-gradient(ellipse at 30% 20%, rgba(124,106,255,0.12) 0%, transparent 60%), radial-gradient(ellipse at 70% 80%, rgba(255,106,176,0.08) 0%, transparent 60%)' }}
      />

      {/* Animated orbs */}
      <motion.div
        className="aurora-orb"
        style={{ width: 400, height: 400, top: '-10%', left: '-10%', background: 'rgba(124,106,255,0.08)' }}
        animate={{ x: isPlaying ? [0, 30, 0] : 0, y: isPlaying ? [0, -20, 0] : 0, scale: isPlaying ? [1, 1.1, 1] : 1 }}
        transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className="aurora-orb"
        style={{ width: 300, height: 300, bottom: '10%', right: '-5%', background: 'rgba(255,106,176,0.07)', animationDelay: '2s' }}
        animate={{ x: isPlaying ? [0, -20, 0] : 0, y: isPlaying ? [0, 20, 0] : 0, scale: isPlaying ? [1, 1.15, 1] : 1 }}
        transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
      />
      <motion.div
        className="aurora-orb"
        style={{ width: 200, height: 200, top: '40%', right: '15%', background: 'rgba(106,255,218,0.05)' }}
        animate={{ x: isPlaying ? [0, 15, 0] : 0, y: isPlaying ? [0, -15, 0] : 0 }}
        transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
      />

      {/* Noise grain overlay */}
      <div
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='1'/%3E%3C/svg%3E")`,
          backgroundSize: '150px',
        }}
      />
    </div>
  )
}

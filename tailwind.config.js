/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        display: ['Syne', 'sans-serif'],
        body: ['Outfit', 'sans-serif'],
      },
      colors: {
        void: '#0a0a0f',
        surface: '#12121a',
        glass: 'rgba(255,255,255,0.04)',
        'glass-border': 'rgba(255,255,255,0.08)',
        aurora: '#7c6aff',
        'aurora-2': '#ff6ab0',
        'aurora-3': '#6affda',
        muted: '#5a5a7a',
        text: '#e8e8f0',
        'text-dim': '#9090b0',
      },
      backgroundImage: {
        'aurora-gradient': 'linear-gradient(135deg, #7c6aff 0%, #ff6ab0 50%, #6affda 100%)',
        'aurora-radial': 'radial-gradient(ellipse at center, rgba(124,106,255,0.15) 0%, transparent 70%)',
      },
      backdropBlur: { glass: '20px' },
      boxShadow: {
        glass: '0 8px 32px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.06)',
        glow: '0 0 40px rgba(124,106,255,0.3)',
        'glow-sm': '0 0 20px rgba(124,106,255,0.2)',
        'aurora-btn': '0 4px 24px rgba(124,106,255,0.4)',
      },
      animation: {
        'spin-slow': 'spin 8s linear infinite',
        'pulse-glow': 'pulseGlow 2s ease-in-out infinite',
        'float': 'float 6s ease-in-out infinite',
      },
      keyframes: {
        pulseGlow: {
          '0%, 100%': { opacity: 0.6 },
          '50%': { opacity: 1 },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-8px)' },
        }
      }
    },
  },
  plugins: [],
}

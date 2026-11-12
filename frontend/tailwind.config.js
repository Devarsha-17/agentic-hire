/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      colors: {
        brand: {
          50:  '#eff6ff',
          100: '#dbeafe',
          400: '#60a5fa',
          500: '#4f8ef7',
          600: '#2563eb',
          700: '#1d4ed8',
        },
        purple: {
          400: '#a78bfa',
          500: '#8b5cf6',
          600: '#7c3aed',
        },
        surface: {
          900: '#0a0a1a',
          800: '#0f0f2a',
          700: '#13132e',
          600: '#1a1a3e',
          500: '#1e1e4a',
        },
        glass: 'rgba(255,255,255,0.05)',
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'hero-gradient': 'linear-gradient(135deg, #0a0a1a 0%, #0f0f2a 50%, #13132e 100%)',
      },
      boxShadow: {
        'glow-blue':   '0 0 20px rgba(79,142,247,0.4), 0 0 40px rgba(79,142,247,0.2)',
        'glow-purple': '0 0 20px rgba(139,92,246,0.4), 0 0 40px rgba(139,92,246,0.2)',
        'glow-green':  '0 0 20px rgba(52,211,153,0.4)',
        'glow-red':    '0 0 20px rgba(239,68,68,0.4)',
        'card': '0 4px 24px rgba(0,0,0,0.4)',
      },
      animation: {
        'fade-in':       'fadeIn 0.4s ease-out',
        'slide-up':      'slideUp 0.4s ease-out',
        'slide-in-right':'slideInRight 0.3s ease-out',
        'pulse-glow':    'pulseGlow 2s ease-in-out infinite',
        'shimmer':       'shimmer 1.5s infinite',
        'spin-slow':     'spin 3s linear infinite',
        'score-ring':    'scoreRing 1.2s ease-out forwards',
      },
      keyframes: {
        fadeIn:       { from: { opacity: '0' },                    to: { opacity: '1' } },
        slideUp:      { from: { opacity: '0', transform: 'translateY(20px)' }, to: { opacity: '1', transform: 'translateY(0)' } },
        slideInRight: { from: { opacity: '0', transform: 'translateX(100%)' }, to: { opacity: '1', transform: 'translateX(0)' } },
        pulseGlow:    { '0%,100%': { boxShadow: '0 0 20px rgba(79,142,247,0.4)' }, '50%': { boxShadow: '0 0 40px rgba(79,142,247,0.8), 0 0 60px rgba(139,92,246,0.4)' } },
        shimmer:      { '0%': { backgroundPosition: '-200% 0' }, '100%': { backgroundPosition: '200% 0' } },
        scoreRing:    { from: { strokeDashoffset: '283' }, to: { strokeDashoffset: 'var(--dash-offset)' } },
      },
    },
  },
  plugins: [],
}
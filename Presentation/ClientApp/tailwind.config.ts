import type { Config } from 'tailwindcss';

const config: Config = {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        bg: {
          DEFAULT: '#faf6ec',
          dark: '#0a0c14',
        },
        panel: {
          DEFAULT: 'rgba(255, 255, 255, 0.72)',
          dark: 'rgba(28, 32, 50, 0.65)',
        },
        ink: {
          DEFAULT: '#15151c',
          dark: '#f5f7ff',
        },
        muted: {
          DEFAULT: '#7a7361',
          dark: '#b4bcd6',
        },
        accent: {
          DEFAULT: '#a77a4a',
          dark: '#e3b27f',
          glow: '#ffb87a',
        },
        regal: {
          DEFAULT: '#5b3fe5',
          dark: '#a08aff',
        },
        board: {
          light: '#f0e2c2',
          dark: '#9b7b51',
          'light-dm': '#4d5a82',
          'dark-dm': '#222c4f',
        },
        danger: '#ef4444',
        success: '#22c55e',
      },
      backgroundImage: {
        'mesh-light':
          'radial-gradient(at 18% 12%, #f5e6c4 0px, transparent 55%), radial-gradient(at 82% 8%, #e8d2a6 0px, transparent 55%), radial-gradient(at 8% 82%, #fbe7c0 0px, transparent 55%), radial-gradient(at 78% 88%, #d4b787 0px, transparent 55%), radial-gradient(at 50% 50%, #fef6e2 0px, transparent 70%)',
        'mesh-dark':
          'radial-gradient(at 18% 12%, #2a3a7a 0px, transparent 55%), radial-gradient(at 82% 8%, #4a2078 0px, transparent 55%), radial-gradient(at 8% 82%, #1a3568 0px, transparent 55%), radial-gradient(at 78% 88%, #321862 0px, transparent 55%), radial-gradient(at 50% 50%, #0a0c14 0px, transparent 70%)',
        'noise':
          "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='200' height='200'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 0.4 0'/></filter><rect width='200' height='200' filter='url(%23n)' opacity='0.5'/></svg>\")",
      },
      boxShadow: {
        glass:
          '0 20px 50px -20px rgba(20, 14, 0, 0.25), 0 8px 24px -8px rgba(20, 14, 0, 0.15), inset 0 1px 0 0 rgba(255, 255, 255, 0.55)',
        'glass-dark':
          '0 20px 60px -20px rgba(0, 0, 0, 0.85), 0 8px 24px -8px rgba(0, 0, 0, 0.6), inset 0 1px 0 0 rgba(255, 255, 255, 0.07)',
        glow: '0 0 32px 4px rgba(239, 68, 68, 0.55)',
        'glow-accent': '0 0 40px -4px rgba(167, 122, 74, 0.45)',
        'glow-regal': '0 0 60px -10px rgba(91, 63, 229, 0.55)',
        board:
          '0 30px 80px -20px rgba(20, 14, 0, 0.45), 0 10px 30px -10px rgba(20, 14, 0, 0.25), inset 0 0 0 1px rgba(255, 255, 255, 0.3)',
        'board-dark':
          '0 30px 80px -20px rgba(0, 0, 0, 0.9), 0 10px 30px -10px rgba(0, 0, 0, 0.7), inset 0 0 0 1px rgba(255, 255, 255, 0.06)',
      },
      keyframes: {
        'pulse-glow': {
          '0%, 100%': { boxShadow: '0 0 0 0 rgba(239, 68, 68, 0.55)' },
          '50%': { boxShadow: '0 0 32px 8px rgba(239, 68, 68, 0.55)' },
        },
        'pulse-ring': {
          '0%': { transform: 'scale(1)', opacity: '0.7' },
          '100%': { transform: 'scale(1.6)', opacity: '0' },
        },
        shake: {
          '0%, 100%': { transform: 'translateX(0)' },
          '25%': { transform: 'translateX(-4px)' },
          '75%': { transform: 'translateX(4px)' },
        },
        'mesh-drift': {
          '0%, 100%': { transform: 'translate3d(0,0,0) scale(1)' },
          '50%': { transform: 'translate3d(2%, -2%, 0) scale(1.05)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-6px)' },
        },
      },
      animation: {
        'pulse-glow': 'pulse-glow 1.6s ease-in-out infinite',
        'pulse-ring': 'pulse-ring 1.8s ease-out infinite',
        shake: 'shake 0.4s ease-in-out',
        'mesh-drift': 'mesh-drift 22s ease-in-out infinite',
        shimmer: 'shimmer 3s linear infinite',
        float: 'float 4s ease-in-out infinite',
      },
      fontFamily: {
        display: ['"Cormorant Garamond"', 'Georgia', 'serif'],
        sans: [
          'Inter',
          'ui-sans-serif',
          'system-ui',
          '-apple-system',
          'Segoe UI',
          'Roboto',
          'sans-serif',
        ],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'SFMono-Regular', 'Menlo', 'monospace'],
      },
    },
  },
  plugins: [],
};

export default config;

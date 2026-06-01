import type { Config } from 'tailwindcss';

const config: Config = {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        bg: {
          DEFAULT: '#f6f5ef',
          dark: '#0b0f1a',
        },
        panel: {
          DEFAULT: 'rgba(255, 255, 255, 0.78)',
          dark: 'rgba(20, 26, 40, 0.6)',
        },
        ink: {
          DEFAULT: '#1a1a1f',
          dark: '#e8eaf2',
        },
        muted: {
          DEFAULT: '#6f6a5e',
          dark: '#9aa3b8',
        },
        accent: {
          DEFAULT: '#85715c',
          dark: '#b89572',
        },
        board: {
          light: '#efe4cf',
          dark: '#8b6f4f',
          'light-dm': '#3a4256',
          'dark-dm': '#1a2238',
        },
        danger: '#dc2a2a',
      },
      backgroundImage: {
        'mesh-light':
          'radial-gradient(at 20% 10%, #f1e3c8 0px, transparent 50%), radial-gradient(at 80% 0%, #d8c8a3 0px, transparent 50%), radial-gradient(at 0% 80%, #ffe9c2 0px, transparent 50%), radial-gradient(at 80% 90%, #c9b893 0px, transparent 50%)',
        'mesh-dark':
          'radial-gradient(at 20% 10%, #1b2540 0px, transparent 50%), radial-gradient(at 80% 0%, #2c1f3f 0px, transparent 50%), radial-gradient(at 0% 80%, #15243d 0px, transparent 50%), radial-gradient(at 80% 90%, #251338 0px, transparent 50%)',
      },
      boxShadow: {
        glass: '0 10px 40px -10px rgba(0,0,0,0.25), inset 0 1px 0 0 rgba(255,255,255,0.4)',
        'glass-dark':
          '0 10px 40px -10px rgba(0,0,0,0.6), inset 0 1px 0 0 rgba(255,255,255,0.06)',
        glow: '0 0 24px 4px rgba(220, 42, 42, 0.55)',
      },
      keyframes: {
        'pulse-glow': {
          '0%, 100%': { boxShadow: '0 0 0 0 rgba(220,42,42,0.55)' },
          '50%': { boxShadow: '0 0 24px 6px rgba(220,42,42,0.55)' },
        },
        shake: {
          '0%, 100%': { transform: 'translateX(0)' },
          '25%': { transform: 'translateX(-3px)' },
          '75%': { transform: 'translateX(3px)' },
        },
        'mesh-drift': {
          '0%, 100%': { transform: 'translate3d(0,0,0) scale(1)' },
          '50%': { transform: 'translate3d(2%, -2%, 0) scale(1.04)' },
        },
      },
      animation: {
        'pulse-glow': 'pulse-glow 1.6s ease-in-out infinite',
        shake: 'shake 0.4s ease-in-out',
        'mesh-drift': 'mesh-drift 22s ease-in-out infinite',
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
      },
    },
  },
  plugins: [],
};

export default config;

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        syn: {
          bg: '#0a0a0a',
          dark: '#1a0a0a',
          crimson: '#dc2626',
          blood: '#7f1d1d',
          neon: '#ff00ff',
          purple: '#8b5cf6',
          pink: '#f472b6',
        },
        inv: {
          bg: '#0d1117',
          dark: '#0a1929',
          emerald: '#10b981',
          cyan: '#06b6d4',
          neon: '#00ffff',
          blue: '#3b82f6',
        }
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'scan': 'scan 2s linear infinite',
        'glitch': 'glitch 1s linear infinite',
      },
      keyframes: {
        scan: {
          '0%': { transform: 'translateY(-100%)' },
          '100%': { transform: 'translateY(100%)' },
        },
        glitch: {
          '0%, 100%': { opacity: '1' },
          '25%': { opacity: '0.8' },
          '50%': { opacity: '1' },
          '75%': { opacity: '0.9' },
        }
      }
    },
  },
  plugins: [],
}
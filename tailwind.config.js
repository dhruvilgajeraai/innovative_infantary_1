/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#ecfdf5',
          100: '#d1fae5',
          200: '#a7f3d0',
          300: '#6ee7b7',
          400: '#34d399',
          500: '#10b981', // Emerald primary
          600: '#059669',
          700: '#047857',
          800: '#065f46',
          900: '#064e3b',
          glow: '#10b98144',
        },
        cyan: {
          500: '#06b6d4',
          400: '#22d3ee',
          glow: '#06b6d444',
        },
        dark: {
          950: '#040711', // Deepest background
          900: '#070C18', // Base background
          850: '#0B1325', // Glass surface base
          800: '#0F1A30', // Card surface
          700: '#17233F', // Elevated / hover surface
          600: '#263554', // Border subtle
          500: '#3E5075', // Text muted
          400: '#64748B', // Neutral slate
        }
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'Outfit', 'system-ui', '-apple-system', 'sans-serif'],
        display: ['Outfit', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      boxShadow: {
        'glass': '0 8px 32px 0 rgba(0, 0, 0, 0.37)',
        'glass-glow': '0 0 25px rgba(16, 185, 129, 0.15), 0 8px 32px 0 rgba(0, 0, 0, 0.37)',
        'cyan-glow': '0 0 25px rgba(6, 182, 212, 0.18)',
        'card-glow': '0 10px 30px -10px rgba(0, 240, 255, 0.1)',
      },
      backdropBlur: {
        'xs': '2px',
      },
      animation: {
        'pulse-subtle': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float': 'float 6s ease-in-out infinite',
        'shimmer': 'shimmer 2.5s linear infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-6px)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        }
      }
    },
  },
  plugins: [],
}

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
        background: '#090a0f',
        card: '#12141d',
        'card-hover': '#1a1d2b',
        muted: '#1e2235',
        border: 'rgba(255, 255, 255, 0.08)',
        accent: {
          DEFAULT: '#E50914',
          hover: '#f40612',
          orange: '#FF5722',
        },
        cinema: {
          950: '#06070a',
          900: '#0d0f17',
          800: '#141724',
          700: '#1e2235',
          300: '#a0a7c2',
          100: '#e1e4ed',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      animation: {
        'fade-in': 'fadeIn 0.4s ease-out forwards',
        'slide-up': 'slideUp 0.4s ease-out forwards',
        'pulse-glow': 'pulseGlow 3s infinite alternate',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(12px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        pulseGlow: {
          '0%': { boxShadow: '0 0 15px rgba(229, 9, 20, 0.2)' },
          '100%': { boxShadow: '0 0 30px rgba(229, 9, 20, 0.6)' },
        }
      }
    },
  },
  plugins: [],
}

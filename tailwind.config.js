/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        obsidian: {
          950: '#07080b',
          900: '#0b0d12',
          850: '#10131a',
          800: '#161922',
          700: '#202430',
          600: '#2e3344',
        },
        slateText: {
          primary: '#f3f4f6',
          secondary: '#9ca3af',
          muted: '#6b7280',
          subtle: '#4b5563',
        },
        accent: {
          emerald: '#10b981',
          amber: '#f59e0b',
          rose: '#f43f5e',
          cyan: '#38bdf8',
          zinc: '#e4e4e7',
        }
      },
      boxShadow: {
        'hardware': '0 1px 1px rgba(0, 0, 0, 0.4), 0 8px 24px -4px rgba(0, 0, 0, 0.6), inset 0 1px 0 rgba(255, 255, 255, 0.08)',
        'hardware-hover': '0 1px 2px rgba(0, 0, 0, 0.4), 0 16px 36px -6px rgba(0, 0, 0, 0.7), inset 0 1px 0 rgba(255, 255, 255, 0.14)',
        'subtle-glow': '0 0 35px -10px rgba(255, 255, 255, 0.06)',
        'inner-bevel': 'inset 0 1px 0 rgba(255, 255, 255, 0.08)',
      },
      animation: {
        'radar-sweep': 'radarSweep 4s linear infinite',
      },
      keyframes: {
        radarSweep: {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' },
        }
      }
    },
  },
  plugins: [],
}

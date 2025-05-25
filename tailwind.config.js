/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Tetris 特有のカラーパレット
        tetris: {
          I: '#00FFFF',  // シアン (I-piece)
          O: '#FFFF00',  // イエロー (O-piece)
          T: '#800080',  // パープル (T-piece)
          S: '#00FF00',  // グリーン (S-piece)
          Z: '#FF0000',  // レッド (Z-piece)
          J: '#0000FF',  // ブルー (J-piece)
          L: '#FFA500',  // オレンジ (L-piece)
        },
        neon: {
          cyan: '#00FFFF',
          purple: '#FF00FF',
          blue: '#0080FF',
          green: '#00FF80',
        }
      },
      animation: {
        'fall': 'fall 1s ease-in infinite',
        'clear-line': 'clearLine 0.5s ease-out',
        'game-over': 'gameOver 1s ease-in-out',
        'level-up': 'levelUp 0.8s ease-out',
      },
      keyframes: {
        fall: {
          '0%': { transform: 'translateY(0)' },
          '100%': { transform: 'translateY(100%)' },
        },
        clearLine: {
          '0%': { opacity: '1', transform: 'scaleX(1)' },
          '50%': { opacity: '0.5', transform: 'scaleX(0.8)' },
          '100%': { opacity: '0', transform: 'scaleX(0)' },
        },
        gameOver: {
          '0%': { opacity: '1', transform: 'scale(1)' },
          '100%': { opacity: '0.3', transform: 'scale(0.9)' },
        },
        levelUp: {
          '0%': { transform: 'scale(1)', filter: 'brightness(1)' },
          '50%': { transform: 'scale(1.1)', filter: 'brightness(1.5)' },
          '100%': { transform: 'scale(1)', filter: 'brightness(1)' },
        },
      },
      fontFamily: {
        'game': ['Orbitron', 'monospace'],
      },
    },
  },
  plugins: [],
} 
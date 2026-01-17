// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      animation: {
        'terminal-blink': 'blink 1s steps(2) infinite',
      },
      keyframes: {
        blink: {
          '0%': { opacity: '1' },
          '50%': { opacity: '0' },
        }
      }
    },
  },
}
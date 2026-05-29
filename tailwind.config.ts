import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./app/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        uw: {
          // Primary Colors
          'husky-purple': '#32006e',
          'spirit-purple': '#4b2e83',
          'husky-gold': '#b7a57a',
          'husky-gold-web': '#e8e3d3',
          'heritage-gold': '#85754d',
          'spirit-gold': '#ffc700',

          // Accent Colors
          'accent-green': '#aadb1e',
          'accent-teal': '#2ad2c9',
          'accent-pink': '#e93cac',
          'accent-lavender': '#c5b4e3',
        },
        husky: {
          purple: '#4b2e83',
          gold: '#b7a57a',
          metallic: '#85754d',
        },
      },
      keyframes: {
        indeterminate: {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(200%)' },
        },
      },
      animation: {
        indeterminate: 'indeterminate 1.5s infinite linear',
      },
    },
  },
  plugins: [],
};

export default config;

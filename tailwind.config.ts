import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        husky: {
          purple: '#4b2e83',
          gold: '#b7a57a',
          metallic: '#85754d',
        },
      },
    },
  },
  plugins: [],
};

export default config;

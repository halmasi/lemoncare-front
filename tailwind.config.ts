import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        background: '#FAFAFA',
        foreground: '#333333',
        'lemon-yellow': '#FFEB3B',
        'accent-yellow': '#eab300',
        'accent-pink': '#E91E63',
        'accent-green': '#4CAF50',
      },
    },
    fontSize: {
      xs: '0.7rem',
      sm: '0.8rem',
      base: '1rem',
      lg: '1.125rem',
      xl: '1.25rem',
      '2xl': '1.563rem',
      '3xl': '1.953rem',
      '4xl': '2.441rem',
      '5xl': '3.052rem',
    },
  },
  plugins: [],
};
export default config;

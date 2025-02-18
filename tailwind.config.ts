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
  },
  plugins: [],
};
export default config;

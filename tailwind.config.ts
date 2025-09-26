import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./src/**/*.{js,ts,jsx,tsx}'], // src 하위만 스캔
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-pretendard)'],
      },
    },
  },
  plugins: [],
};

export default config;

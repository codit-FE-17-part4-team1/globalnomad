import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-pretendard)'],
      },
      colors: {
        blue: {
          DEFAULT: '#0065FF',
          light: '#2EB4FF',
          pale: '#E5F3FF',
        },
        yellow: '#FFC23D',
        black: {
          DEFAULT: '#1B1B1B',
          nomad: '#112211',
        },
        gray: {
          50: '#FAFAFA',
          100: '#EEEEEE',
          200: '#DDDDDD',
          300: '#CBCBCF',
          400: '#ADAEBD',
          500: '#A4A4AA',
          600: '#1A1A1A',
          700: '#79747E',
          800: '#4B4B4B',
        },
        green: {
          DEFAULT: '#00AC07',
          dark: '#063B2D',
          light: '#CEDBD5',
        },
        red: {
          DEFAULT: '#FF472E',
          light: '#FFC2BA',
          pale: '#FFE4E0',
        },
        orange: {
          DEFAULT: '#FF7C1D',
          pale: '#FFF4EB',
        },

        background: 'var(--background)',
        foreground: 'var(--foreground)',
      },
      fontSize: {
        '3xl': ['32px', '42px'],
        '2xl': ['24px', '32px'],
        xl: ['20px', '32px'],
        '2lg': ['18px', '26px'],
        lg: ['16px', '26px'],
        md: ['14px', '24px'],
        sm: ['13px', '22px'],
        xs: ['12px', '18px'],
      },
    },
  },
  plugins: [],
};

export default config;

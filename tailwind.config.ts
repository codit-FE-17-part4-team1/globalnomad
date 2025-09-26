// import type { Config } from 'tailwindcss';

// const config: Config = {
//   content: ['./src/**/*.{js,ts,jsx,tsx}'], // src 하위만 스캔
//   theme: {
//     extend: {
//       fontFamily: {
//         sans: ['var(--font-pretendard)'],
//       },
//     },
//   },
//   plugins: [],
// };

// export default config;

// tailwind.config.ts
import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        blue: 'var(--color-blue)',
        'blue-light': 'var(--color-blue-light)',
        'blue-pale': 'var(--color-blue-pale)',
        yellow: 'var(--color-yellow)',
        black: 'var(--color-black)',
        'black-nomad': 'var(--color-black-nomad)',
        'gray-50': 'var(--color-gray-50)',
        'gray-100': 'var(--color-gray-100)',
        'gray-200': 'var(--color-gray-200)',
        'gray-300': 'var(--color-gray-300)',
        'gray-400': 'var(--color-gray-400)',
        'gray-500': 'var(--color-gray-500)',
        'gray-600': 'var(--color-gray-600)',
        'gray-700': 'var(--color-gray-700)',
        'gray-800': 'var(--color-gray-800)',
        green: 'var(--color-green)',
        'green-dark': 'var(--color-green-dark)',
        'green-light': 'var(--color-green-light)',
        red: 'var(--color-red)',
        'red-light': 'var(--color-red-light)',
        'red-pale': 'var(--color-red-pale)',
        orange: 'var(--color-orange)',
        'orange-pale': 'var(--color-orange-pale)',
        background: 'var(--color-background)',
        foreground: 'var(--color-foreground)',
      },
      fontFamily: {
        sans: ['var(--font-pretendard)'],
      },
    },
  },
  plugins: [],
};

export default config;

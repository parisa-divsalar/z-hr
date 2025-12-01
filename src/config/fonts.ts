import localFont from 'next/font/local';

export const interphasesFont = localFont({
  src: [
    {
      path: '../assets/fonts/woff/Interphases.ttf',
    },
    {
      path: '../assets/fonts/woff2/Interphases.ttf',
    },
  ],
  variable: '--font-interphases',
  display: 'swap',
});

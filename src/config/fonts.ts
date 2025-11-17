import localFont from 'next/font/local';

export const interphasesFont = localFont({
  src: [
    {
      path: '../assets/fonts/woff2/Interphases.woff2',
      weight: '400',
      style: 'normal',
    },
  ],
  variable: '--font-interphases',
  display: 'swap',
});

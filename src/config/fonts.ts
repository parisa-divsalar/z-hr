import localFont from 'next/font/local';

export const interphasesFont = localFont({
  src: [
    {
      path: '../assets/fonts/interphases/variable.ttf',
      style: 'normal',
    },
  ],
  variable: '--font-interphases',
  weight: '100 900', // Variable font
  display: 'swap',
});

export const persianFont = localFont({
  src: [
    {
      path: '../assets/fonts/Persian/woff2/YekanBakh-FaNum-Regular.woff2',
      style: 'normal',
    },
  ],
  variable: '--font-persian',
  weight: '400',
  display: 'swap',
});

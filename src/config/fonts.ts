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

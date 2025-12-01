import localFont from 'next/font/local';

export const interphasesFont = localFont({
  src: [
    {
      path: '../assets/fonts/woff/Interphases.woff',
      weight: '400',
      style: 'normal',
    },
    {
      path: '../assets/fonts/woff/Interphases-bold.woff',
      weight: '600',
      style: 'bold',
    },
    {
      path: '../assets/fonts/woff/Interphases-extra-bold.woff',
      weight: '700',
      style: 'extrabold',
    },
    {
      path: '../assets/fonts/woff2/Interphases.woff2',
      weight: '400',
      style: 'normal',
    },
    {
      path: '../assets/fonts/woff2/Interphases-bold.woff2',
      weight: '600',
      style: 'bold',
    },
    {
      path: '../assets/fonts/woff2/Interphases-extra-bold.woff2',
      weight: '700',
      style: 'extrabold',
    },
  ],
  variable: '--font-interphases',
  display: 'swap',
});

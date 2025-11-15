import localFont from 'next/font/local';

export const yekanBakh = localFont({
  src: [
    {
      path: '../assets/fonts/woff2/YekanBakh-FaNum-Regular.woff2',
      weight: '400',
      style: 'normal',
    },
    {
      path: '../assets/fonts/woff2/YekanBakh-FaNum-Bold.woff2',
      weight: '600',
      style: 'normal',
    },
    {
      path: '../assets/fonts/woff2/YekanBakh-FaNum-ExtraBold.woff2',
      weight: '700',
      style: 'bold',
    },
  ],
  variable: '--font-yekanbakh', // For use in CSS variables
  display: 'swap', // Best mode for FCP
});

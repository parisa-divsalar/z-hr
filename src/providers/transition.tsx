'use client';

import { ReactNode } from 'react';

import { AnimatePresence, motion } from 'framer-motion';
import { usePathname } from 'next/navigation';

interface PageTransitionProps {
  children: ReactNode;
}

export default function AnimateTransition({ children }: PageTransitionProps) {
  const pathname = usePathname();

  return (
    <AnimatePresence mode='wait'>
      <motion.div
        key={pathname}
        initial={{
          x: 100,
          opacity: 0,
          scale: 0.98,
          filter: 'blur(6px)',
        }}
        animate={{
          x: 0,
          opacity: 1,
          scale: 1,
          filter: 'blur(0px)',
        }}
        exit={{
          x: -50,
          opacity: 0,
          scale: 0.98,
          filter: 'blur(4px)',
        }}
        transition={{
          duration: 0.4,
          ease: [0.22, 1, 0.36, 1],
        }}
        style={{
          position: 'relative',
          width: '100%',
          height: '100%',
          zIndex: 1,
        }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}

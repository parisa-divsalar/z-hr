import { Suspense } from 'react';

import { Stack } from '@mui/material';

import HeroSection from '@/components/Landing/Hero';

export default function LandingPage() {
  return (
    <Stack width='100%' p={3} textAlign='center'>
      <Suspense fallback={<div>loading</div>}>
        <HeroSection />
      </Suspense>
    </Stack>
  );
}

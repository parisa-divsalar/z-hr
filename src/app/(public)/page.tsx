'use client';
import { useEffect, useState } from 'react';

import { Stack } from '@mui/material';
import { useSearchParams } from 'next/navigation';

import IntroDialog from '@/components/Landing/IntroDialog';
import { AIStatus } from '@/components/Landing/type';
import Wizard from '@/components/Landing/Wizard';

export default function LandingPage() {
  const searchParams = useSearchParams();
  const [_aiStatus, setAiStatus] = useState<AIStatus>('START');
  const [initialStep, setInitialStep] = useState<number>(1);
  const [isIntroOpen, setIsIntroOpen] = useState<boolean>(true);

  useEffect(() => {
    const stepParam = searchParams.get('step');
    if (stepParam) {
      const step = parseInt(stepParam, 10);
      if (!isNaN(step) && step >= 1 && step <= 3) {
        setAiStatus('WIZARD');
        setInitialStep(step);
      }
    }
  }, [searchParams]);

  return (
    <Stack width='100%' height='100%'>
      <IntroDialog open={isIntroOpen} onClose={() => setIsIntroOpen(false)} />
      <Wizard setAiStatus={setAiStatus} initialStep={initialStep} />
    </Stack>
  );
}

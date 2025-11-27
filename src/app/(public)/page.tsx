'use client';
import { useEffect, useState } from 'react';

import { Stack } from '@mui/material';
import { useSearchParams } from 'next/navigation';

import AIInput from '@/components/Landing/AI';
import { AIStatus } from '@/components/Landing/type';
import Wizard from '@/components/Landing/Wizard';

export default function LandingPage() {
  const searchParams = useSearchParams();
  const [aiStatus, setAiStatus] = useState<AIStatus>('START');
  const [initialStep, setInitialStep] = useState<number>(1);

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
      {aiStatus === 'START' ? (
        <AIInput setAiStatus={setAiStatus} />
      ) : aiStatus === 'WIZARD' ? (
        <Wizard setAiStatus={setAiStatus} initialStep={initialStep} />
      ) : (
        <Stack />
      )}
    </Stack>
  );
}

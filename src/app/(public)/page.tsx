'use client';
import { useState } from 'react';

import { Stack } from '@mui/material';

import AIInput from '@/components/Landing/AI';
import { AIStatus } from '@/components/Landing/type';
import Wizard from '@/components/Landing/Wizard';

export default function LandingPage() {
  const [aiStatus, setAiStatus] = useState<AIStatus>('START');

  return (
    <Stack width='100%' height='100%'>
      {aiStatus === 'START' && <AIInput setAiStatus={setAiStatus} />}
      {aiStatus === 'WIZARD' && <Wizard />}
    </Stack>
  );
}

'use client';

import { useEffect, useState } from 'react';

import { Stack } from '@mui/material';
import { useSearchParams } from 'next/navigation';

import IntroDialog from '@/components/Landing/IntroDialog';
import { AIStatus } from '@/components/Landing/type';
import Wizard from '@/components/Landing/Wizard';

import { ResumeBuilderRoot } from './styled';

export default function ResumeBuilderPage() {
    const searchParams = useSearchParams();
    const [_aiStatus, setAiStatus] = useState<AIStatus>('START');
    const [initialStep, setInitialStep] = useState<number>(1);
    const [isIntroOpen, setIsIntroOpen] = useState<boolean>(true);

    // Ensure scrolling is confined to the resume builder container (internal scroll),
    // not the whole page/body.
    useEffect(() => {
        const prevBodyOverflow = document.body.style.overflow;
        const prevHtmlOverflow = document.documentElement.style.overflow;

        document.body.style.overflow = 'hidden';
        document.documentElement.style.overflow = 'hidden';

        return () => {
            document.body.style.overflow = prevBodyOverflow;
            document.documentElement.style.overflow = prevHtmlOverflow;
        };
    }, []);

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
        <ResumeBuilderRoot id='resume-builder-root'>
            <Stack width='100%' height='100%'>
                <IntroDialog open={isIntroOpen} onClose={() => setIsIntroOpen(false)} />
                <Wizard setAiStatus={setAiStatus} initialStep={initialStep} variant='resume-builder' />
            </Stack>
        </ResumeBuilderRoot>
    );
}

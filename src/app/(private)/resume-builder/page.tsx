'use client';

import { useEffect, useState } from 'react';

import { Stack } from '@mui/material';
import { useSearchParams } from 'next/navigation';

import IntroDialog from '@/components/Landing/IntroDialog';
import { AIStatus } from '@/components/Landing/type';
import Wizard from '@/components/Landing/Wizard';
import { trackEvent } from '@/lib/analytics';
import { useWizardStore } from '@/store/wizard';

import { ResumeBuilderRoot } from './styled';

export default function ResumeBuilderPage() {
    const searchParams = useSearchParams();
    const [_aiStatus, setAiStatus] = useState<AIStatus>('START');
    const [initialStep, setInitialStep] = useState<number>(1);
    const [isIntroOpen, setIsIntroOpen] = useState<boolean>(true);
    const setRequestId = useWizardStore((state) => state.setRequestId);

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

    useEffect(() => {
        const raw = searchParams.get('requestId') ?? searchParams.get('RequestId');
        if (!raw) return;
        const trimmed = raw.trim();
        if (!trimmed) return;
        const normalized = trimmed.startsWith('"') && trimmed.endsWith('"') ? trimmed.slice(1, -1).trim() : trimmed;
        if (normalized) setRequestId(normalized);
    }, [searchParams, setRequestId]);

    useEffect(() => {
        trackEvent('resume_started', {
            timestamp: new Date().toISOString(),
        });
    }, []);

    const layoutHeight =
        'calc(max(var(--app-height), 100vh) - var(--navbar-height) - var(--footer-height) - 2 * var(--children-padding))';

    return (
        <ResumeBuilderRoot
            id='resume-builder-root'
            sx={(theme) => ({
                height: layoutHeight,
                maxHeight: layoutHeight,
                minHeight: 0,
                [theme.breakpoints.down('md')]: {
                    height: 'auto',
                    maxHeight: 'none',
                    minHeight: 0,
                },
            })}
        >
            <Stack width='100%' height='100%'>
                <IntroDialog
                    open={isIntroOpen}
                    onClose={() => setIsIntroOpen(false)}
                    showBackToDashboard
                    backToDashboardHref='/dashboard'
                />
                <Wizard setAiStatus={setAiStatus} initialStep={initialStep} />
            </Stack>
        </ResumeBuilderRoot>
    );
}

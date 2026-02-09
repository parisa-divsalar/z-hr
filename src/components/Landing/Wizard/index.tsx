import { FunctionComponent, useEffect, useMemo, useRef, useState } from 'react';

import { Stack } from '@mui/material';

import { AIStatus } from '@/components/Landing/type';
import Step1 from '@/components/Landing/Wizard/Step1';
import Step2 from '@/components/Landing/Wizard/Step2';
import Step3 from '@/components/Landing/Wizard/Step3';
import StepWrapper from '@/components/Landing/Wizard/Stepper';
import { apiClientClient } from '@/services/api-client';
import { buildWizardSerializable, useWizardStore } from '@/store/wizard';

interface WizardProps {
    setAiStatus: (status: AIStatus) => void;
    initialStep?: number;
}

const Wizard: FunctionComponent<WizardProps> = ({ setAiStatus, initialStep = 1 }) => {
    const [activeStep, setActiveStep] = useState<number>(initialStep);
    const wizardData = useWizardStore((s) => s.data);
    const requestId = useWizardStore((s) => s.requestId);
    const setRequestId = useWizardStore((s) => s.setRequestId);

    const canAutoSave = activeStep === 1 || activeStep === 2;

    const ensureDraftRequestId = useMemo(() => {
        return () => {
            if (requestId) return requestId;
            const next = `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
            setRequestId(next);
            return next;
        };
    }, [requestId, setRequestId]);

    useEffect(() => {
        setActiveStep(initialStep);
    }, [initialStep]);

    const saveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const lastSavedKeyRef = useRef<string>('');

    useEffect(() => {
        if (!canAutoSave) return;

        const rid = ensureDraftRequestId();
        if (!rid) return;

        if (saveTimerRef.current) clearTimeout(saveTimerRef.current);

        // Debounce saves while user is typing.
        saveTimerRef.current = setTimeout(async () => {
            try {
                const serializable = buildWizardSerializable(wizardData);
                const payload = { ...serializable, step: String(activeStep) };
                const key = `${rid}:${payload.step}:${JSON.stringify(payload).length}`;
                if (key === lastSavedKeyRef.current) return;
                lastSavedKeyRef.current = key;
                await apiClientClient.post('wizard/save', {
                    requestId: rid,
                    wizardData: payload,
                });
            } catch {
                // ignore autosave failures (offline, auth expired, etc.)
            }
        }, 1200);

        return () => {
            if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
        };
    }, [wizardData, activeStep, canAutoSave, ensureDraftRequestId]);

    const getSubChildWizard = () => {
        switch (activeStep) {
            case 1:
                return <Step1 setAiStatus={setAiStatus} setActiveStep={setActiveStep} />;
            case 2:
                return <Step2 setActiveStep={setActiveStep} />;
            case 3:
                return <Step3 setActiveStep={setActiveStep} />;
            default:
                return <Stack />;
        }
    };

    return (
        <Stack
            id='resume-builder-scroll'
            width='100%'
            height='100%'
            alignItems='center'
            py={5}
            sx={{
                display: 'flex',
                flexDirection: 'column',
                gap: '1rem',
                minHeight: 0,
                overflowY: 'auto',
                overflowX: 'hidden',
                scrollbarGutter: 'stable',
            }}
        >
            <StepWrapper activeStep={activeStep} />
            {getSubChildWizard()}
        </Stack>
    );
};

export default Wizard;

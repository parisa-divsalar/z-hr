import { FunctionComponent, useState } from 'react';

import { Stack } from '@mui/material';

import { AIStatus } from '@/components/Landing/type';
import Step1 from '@/components/Landing/Wizard/Step1';
import Step2 from '@/components/Landing/Wizard/Step2';
import Step3 from '@/components/Landing/Wizard/Step3';
import StepWrapper from '@/components/Landing/Wizard/Stepper';

interface WizardProps {
    setAiStatus: (status: AIStatus) => void;
    initialStep?: number;
    variant?: 'landing' | 'resume-builder';
}

const Wizard: FunctionComponent<WizardProps> = (props) => {
    const { setAiStatus, initialStep = 1, variant = 'landing' } = props;
    const [activeStep, setActiveStep] = useState<number>(initialStep);

    const getSubChildWizard = () => {
        switch (activeStep) {
            case 1:
                return <Step1 setAiStatus={setAiStatus} setActiveStep={setActiveStep} />;
            case 2:
                return <Step2 setActiveStep={setActiveStep} />;
            case 3:
                return <Step3 setActiveStep={setActiveStep} variant={variant} />;
            default:
                return <Stack />;
        }
    };

    if (variant === 'resume-builder') {
        return (
            <Stack
                width='100%'
                height='100%'
                alignItems='center'
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    minHeight: 0,
                    overflow: 'hidden',
                }}
            >
                {/* Fixed header (not part of the scroll area) */}
                <Stack
                    width='100%'
                    alignItems='center'
                    sx={{
                        flex: '0 0 auto',
                        py: 2,
                        zIndex: 10,
                        backdropFilter: 'blur(10px)',
                    }}
                >
                    <StepWrapper activeStep={activeStep} />
                </Stack>

                {/* Scrollable content (starts under the stepper) */}
                <Stack
                    id='resume-builder-scroll'
                    width='100%'
                    flex={1}
                    minHeight={0}
                    alignItems='center'
                    py={5}
                    sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '1rem',
                        overflowY: 'auto',
                    }}
                >
                    {getSubChildWizard()}
                </Stack>
            </Stack>
        );
    }

    return (
        <Stack
            width='100%'
            height='100%'
            alignItems='center'
            py={5}
            sx={{
                display: 'flex',
                flexDirection: 'column',
                gap: '1rem',
                minHeight: 0,
                overflow: 'hidden',
            }}
        >
            <StepWrapper activeStep={activeStep} />
            {getSubChildWizard()}
        </Stack>
    );
};

export default Wizard;

import React, { FunctionComponent, useState } from 'react';

import { Stack, Typography } from '@mui/material';
import { usePathname } from 'next/navigation';

import ResumeBuilderMoreFeatures from '@/app/(private)/resume-builder/MoreFeatures';
import ResumeGeneratorFrame from '@/app/(private)/resume-builder/ResumeGeneratorFrame';
import WizardMoreFeatures from '@/components/Landing/Wizard/Step3/MoreFeatures';

import ResumeEditor from './ResumeEditor';

interface Step3Props {
    setActiveStep: (activeStep: number) => void;
}

const Step3: FunctionComponent<Step3Props> = ({ setActiveStep }) => {
    const [stage, setStage] = useState<'RESUME_EDITOR' | 'MORE_FEATURES' | 'RESUME_GENERATOR_FRAME'>('RESUME_EDITOR');
    const pathname = usePathname();

    const handleSubmitMoreFeatures = () => {
        // In resume-builder flow, "Submit" should continue to the in-wizard ResumeGeneratorFrame stage.
        setStage('RESUME_GENERATOR_FRAME');
    };

    if (stage === 'RESUME_EDITOR')
        return (
            <Stack alignItems='center' height='100%' p={2}>
                <Typography variant='h5' color='text.primary' fontWeight='584' mt={2}>
                    CV Preview
                </Typography>
                <Typography variant='h6' color='text.primary' my={1}>
                    You can view and edit resume
                </Typography>

                <ResumeEditor setStage={setStage} setActiveStep={setActiveStep} />
            </Stack>
        );

    if (stage === 'MORE_FEATURES') {
        if (pathname?.includes('/resume-builder')) {
            return (
                <ResumeBuilderMoreFeatures
                    onBack={() => setStage('RESUME_EDITOR')}
                    onSubmit={handleSubmitMoreFeatures}
                />
            );
        }
        // Landing/default flow keeps the existing MoreFeatures UI.
        return <WizardMoreFeatures setStage={setStage} />;
    }

    if (stage === 'RESUME_GENERATOR_FRAME') {
        return <ResumeGeneratorFrame setStage={setStage} setActiveStep={setActiveStep} />;
    }

    return null;
};

export default Step3;

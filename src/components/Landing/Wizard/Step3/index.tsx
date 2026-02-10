import React, { FunctionComponent, useState } from 'react';

import { Button, Stack, Typography } from '@mui/material';
import { usePathname } from 'next/navigation';

import ResumeBuilderMoreFeatures from '@/app/(private)/resume-builder/MoreFeatures';
import ResumeGeneratorFrame from '@/app/(private)/resume-builder/ResumeGeneratorFrame';
import WizardMoreFeatures from '@/components/Landing/Wizard/Step3/MoreFeatures';

import ResumeEditor from './ResumeEditor';
import ResumeEditorTemplate2 from './ResumeEditorTemplate2';
import ResumeEditorTemplate3 from './ResumeEditorTemplate3';

interface Step3Props {
    setActiveStep: (activeStep: number) => void;
}

const Step3: FunctionComponent<Step3Props> = ({ setActiveStep }) => {
    const [stage, setStage] = useState<'RESUME_EDITOR' | 'MORE_FEATURES' | 'RESUME_GENERATOR_FRAME'>('RESUME_EDITOR');
    const [activeTemplate, setActiveTemplate] = useState<'template1' | 'template2' | 'template3'>('template1');
    const pathname = usePathname();

    const handleSubmitMoreFeatures = () => {
        // In resume-builder flow, "Submit" should continue to the in-wizard ResumeGeneratorFrame stage.
        setStage('RESUME_GENERATOR_FRAME');
    };

    if (stage === 'RESUME_EDITOR')
        return (
            <Stack  alignItems='center' height='100%' p={2}>
                <Typography variant='h5' color='text.primary' fontWeight='584' mt={2}>
                    CV Preview
                </Typography>
                <Typography variant='h6' color='text.primary' my={1}>
                    You can view and edit resume
                </Typography>

                <Stack
                    direction={{ xs: 'column', sm: 'row' }}
                    spacing={1}
                    width='100%'
                    maxWidth={748}
                    mt={1.5}
                    mb={1.5}
                >
                    <Button
                        fullWidth
                        variant={activeTemplate === 'template1' ? 'contained' : 'outlined'}
                        onClick={() => setActiveTemplate('template1')}
                    >
                        Template 1
                    </Button>
                    <Button
                        fullWidth
                        variant={activeTemplate === 'template2' ? 'contained' : 'outlined'}
                        onClick={() => setActiveTemplate('template2')}
                    >
                        Template 2
                    </Button>

                    <Button
                        fullWidth
                        variant={activeTemplate === 'template3' ? 'contained' : 'outlined'}
                        onClick={() => setActiveTemplate('template3')}
                    >
                        Template 3
                    </Button>
                </Stack>

                {activeTemplate === 'template1' ? (
                    <ResumeEditor setStage={setStage} setActiveStep={setActiveStep} />
                ) : activeTemplate === 'template2' ? (
                    <ResumeEditorTemplate2 setStage={setStage} setActiveStep={setActiveStep} />
                ) : (
                    <ResumeEditorTemplate3 setStage={setStage} setActiveStep={setActiveStep} />
                )}
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

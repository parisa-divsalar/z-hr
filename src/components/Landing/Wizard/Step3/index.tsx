'use client';

import React, { FunctionComponent, useState } from 'react';

import { Box, Button, Stack, Typography } from '@mui/material';
import { alpha, useTheme } from '@mui/material/styles';
import { usePathname } from 'next/navigation';

import ResumeBuilderMoreFeatures from '@/app/(private)/resume-builder/MoreFeatures';
import ResumeGeneratorFrame from '@/app/(private)/resume-builder/ResumeGeneratorFrame';
import WizardMoreFeatures from '@/components/Landing/Wizard/Step3/MoreFeatures';
import { useResumeEditorController } from '@/components/Landing/Wizard/Step3/ResumeEditor/hooks/useResumeEditorController';

import ResumeEditor from './ResumeEditor';
import ResumeEditorTemplate2 from './ResumeEditorTemplate2';
import ResumeEditorTemplate3 from './ResumeEditorTemplate3';
import ResumeEditorTemplate4 from './ResumeEditorTemplate4';

interface Step3Props {
    setActiveStep: (activeStep: number) => void;
}

const ResumeEditorStage: FunctionComponent<{
    setStage: (stage: 'RESUME_EDITOR' | 'MORE_FEATURES' | 'RESUME_GENERATOR_FRAME') => void;
    setActiveStep: (activeStep: number) => void;
}> = ({ setStage, setActiveStep }) => {
    const theme = useTheme();
    const [activeTemplate, setActiveTemplate] = useState<'template1' | 'template2' | 'template3' | 'template4'>('template1');
    const controller = useResumeEditorController({});

    const pillBg = alpha(theme.palette.primary.main, 0.06);
    const pillBorder = alpha(theme.palette.text.primary, 0.12);
    const inactiveBorder = alpha(theme.palette.text.primary, 0.12);

    const renderButton = (key: 'template1' | 'template2' | 'template3' | 'template4', label: string) => {
        const isActive = activeTemplate === key;
        return (
            <Button
                key={key}
                onClick={() => setActiveTemplate(key)}
                variant='text'
                disableElevation
                sx={{
                    flex: 1,
                    minHeight: 44,
                    borderRadius: 999,
                    textTransform: 'none',
                    fontWeight: 600,
                    backgroundColor: '#fff',
                    border: '2px solid',
                    borderColor: isActive ? theme.palette.primary.main : inactiveBorder,
                    color: theme.palette.text.primary,
                    boxShadow: isActive ? '0 6px 18px rgba(15, 23, 42, 0.10)' : 'none',
                    '&:hover': {
                        backgroundColor: '#fff',
                        borderColor: isActive ? theme.palette.primary.main : alpha(theme.palette.text.primary, 0.22),
                    },
                }}
            >
                {label}
            </Button>
        );
    };

    return (
        <Stack alignItems='center' height='100%' p={2}>
            <Typography variant='h5' color='text.primary' fontWeight='584' mt={2}>
                CV Preview
            </Typography>
            <Typography variant='h6' color='text.primary' my={1}>
                You can view and edit resume
            </Typography>

            <Box
                sx={{
                    width: '100%',
                    maxWidth: 748,
                    mt: 1.5,
                    mb: 1.5,
                    p: 0.75,
                    borderRadius: 999,
                    backgroundColor: pillBg,
                    border: '1px solid',
                    borderColor: pillBorder,
                }}
            >
                <Stack direction='row' spacing={1}>
                    {renderButton('template1', 'Template 1')}
                    {renderButton('template2', 'Template 2')}
                    {renderButton('template3', 'Template 3')}
                    {renderButton('template4', 'Template 4')}
                </Stack>
            </Box>

            {activeTemplate === 'template1' ? (
                <ResumeEditor controller={controller} setStage={setStage} setActiveStep={setActiveStep} />
            ) : activeTemplate === 'template2' ? (
                <ResumeEditorTemplate2 controller={controller} setStage={setStage} setActiveStep={setActiveStep} />
            ) : activeTemplate === 'template3' ? (
                <ResumeEditorTemplate3 controller={controller} setStage={setStage} setActiveStep={setActiveStep} />
            ) : (
                <ResumeEditorTemplate4 controller={controller} setStage={setStage} setActiveStep={setActiveStep} />
            )}
        </Stack>
    );
};

const Step3: FunctionComponent<Step3Props> = ({ setActiveStep }) => {
    const [stage, setStage] = useState<'RESUME_EDITOR' | 'MORE_FEATURES' | 'RESUME_GENERATOR_FRAME'>('RESUME_EDITOR');
    const pathname = usePathname();

    const handleSubmitMoreFeatures = () => {
        // In resume-builder flow, "Submit" should continue to the in-wizard ResumeGeneratorFrame stage.
        setStage('RESUME_GENERATOR_FRAME');
    };

    if (stage === 'RESUME_EDITOR') return <ResumeEditorStage setStage={setStage} setActiveStep={setActiveStep} />;

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

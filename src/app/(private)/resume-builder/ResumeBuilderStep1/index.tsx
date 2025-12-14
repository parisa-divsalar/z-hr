'use client';

import React, { FunctionComponent, useState } from 'react';

import { Stack, Typography } from '@mui/material';

import { StageWizard, AIStatus } from '@/components/Landing/type';
import StepWrapper from '@/components/Landing/Wizard/Stepper';

interface ResumeBuilderStep1Props {
    setAiStatus: (status: AIStatus) => void;
    setActiveStep: (step: number) => void;
}

const ResumeBuilderStep1: FunctionComponent<ResumeBuilderStep1Props> = () => {
    const [stage, setStage] = useState<StageWizard>('RESULT');

    if (stage === 'RESULT') {
        return (
            <Stack width='100%' height='100%' alignItems='center' p={5}>
                <StepWrapper activeStep={1} />
                <Typography>jkjkjjlkj</Typography>
            </Stack>
        );
    }

    if (stage === 'SELECT_SKILL') {
        return (
            <Stack width='100%' height='100%' alignItems='center' p={5}>
                <StepWrapper activeStep={1} />
                <Typography>jkjkjjlkj</Typography>
            </Stack>
        );
    }

    if (stage === 'SKILL_INPUT') {
        return (
            <Stack width='100%' height='100%' alignItems='center' p={5}>
                <StepWrapper activeStep={1} />
                <Typography>jkjkjjlkj</Typography>
            </Stack>
        );
    }

    return (
        <Stack width='100%' height='100%' alignItems='center' p={5}>
            <StepWrapper activeStep={1} />
            <Typography>jkjkjjlkj</Typography>
        </Stack>
    );
};

export default ResumeBuilderStep1;

'use client';

import React, { FunctionComponent } from 'react';

import { Typography } from '@mui/material';

import { ResumeBuilderRoot } from './styled';

const ResumeBuilder: FunctionComponent = () => {
    return (
        <ResumeBuilderRoot>
            <Typography variant='h5' fontWeight='500' color='text.primary'>
                Resume Builder
            </Typography>
        </ResumeBuilderRoot>
    );
};

export default ResumeBuilder;

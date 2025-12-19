'use client';

import Grid from '@mui/material/Grid';

import { HistoryEditeRoot } from '@/app/(private)/history-edite/styled';

import GapSection from './Components/GapSection';
import PreviewEdite from './Components/PreviewEdite';

const HistoryEdite = () => {
    return (
        <HistoryEditeRoot>
            <Grid container spacing={3}>
                <Grid size={{ xs: 12, md: 12 }}>
                    <PreviewEdite />
                </Grid>

                {/*<Grid size={{ xs: 12, md: 12 }}>*/}
                {/*  <HistoryQuestions />*/}
                {/*</Grid>*/}

                <Grid size={{ xs: 12, md: 12 }}>
                    <GapSection />
                </Grid>
            </Grid>
        </HistoryEditeRoot>
    );
};

export default HistoryEdite;

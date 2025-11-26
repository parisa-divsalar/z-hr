'use client';

import Grid from '@mui/material/Grid';

import GapSection from './Components/GapSection';
import PreviewEdite from './Components/PreviewEdite';
import HistoryQuestions from './HistoryQuestionsDialog/HistoryQuestions';
import { HistoryEditeRoot } from './styled';

const HistoryEdite = () => {
  return (
    <HistoryEditeRoot>
      <Grid container spacing={3}>
        <Grid size={{ xs: 12, md: 12 }}>
          <PreviewEdite />
        </Grid>

        <Grid size={{ xs: 12, md: 12 }}>
          <HistoryQuestions />
        </Grid>

        <Grid size={{ xs: 12, md: 12 }}>
          <GapSection />
        </Grid>
      </Grid>
    </HistoryEditeRoot>
  );
};

export default HistoryEdite;

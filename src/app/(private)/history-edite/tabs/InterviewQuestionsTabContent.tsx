import React from 'react';

import Grid from '@mui/material/Grid';

import QuestionCard from '../Components/QuestionCard';

const InterviewQuestionsTabContent = () => {
  return (
    <Grid container spacing={3}>
      <Grid size={{ xs: 12, md: 12 }}>
        {[1, 2, 3, 4, 5].map((num) => (
          <QuestionCard
            key={num}
            number={num}
            name='Soft skill'
            question='Questions'
            answer='Access common and position-specific interview questions to prepare effectively.'
          />
        ))}
      </Grid>
    </Grid>
  );
};

export default InterviewQuestionsTabContent;

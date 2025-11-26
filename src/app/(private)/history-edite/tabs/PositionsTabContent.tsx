import React from 'react';

import Grid from '@mui/material/Grid';

import QuestionCard from '../Components/QuestionCard';

const PositionsTabContent = () => {
  return (
    <Grid container spacing={3}>
      <Grid size={{ xs: 12, md: 12 }}>
        {[1, 2, 3, 4, 5].map((num) => (
          <QuestionCard
            key={num}
            number={num}
            name='Position'
            question='Suggested Position'
            answer='Position details and requirements will be displayed here.'
          />
        ))}
      </Grid>
    </Grid>
  );
};

export default PositionsTabContent;

import React from 'react';

import Grid from '@mui/material/Grid';

import SkillGapCard from '../Components/SkillGapCard';

const mockSkillGapData = [
  { id: 1, title: 'Front-end', level: 'Mid-senior', price: '$20', isFree: true },
  { id: 2, title: 'Back-end', level: 'Senior', price: '$25', isFree: false },
  { id: 3, title: 'Full Stack', level: 'Mid-level', price: '$30', isFree: true },
  { id: 4, title: 'DevOps', level: 'Mid-senior', price: '$22', isFree: true },
  { id: 5, title: 'UI/UX Design', level: 'Junior', price: '$15', isFree: false },
  { id: 6, title: 'Mobile Development', level: 'Senior', price: '$28', isFree: true },
];

const SkillGapTabContent = () => {
  return (
    <Grid container spacing={3}>
      {mockSkillGapData.map((item) => (
        <Grid key={item.id} size={{ xs: 12, sm: 6, md: 4 }}>
          <SkillGapCard title={item.title} level={item.level} price={item.price} isFree={item.isFree} />
        </Grid>
      ))}
    </Grid>
  );
};

export default SkillGapTabContent;

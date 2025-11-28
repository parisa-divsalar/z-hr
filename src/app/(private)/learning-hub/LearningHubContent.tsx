import React from 'react';

import Grid from '@mui/material/Grid';

import SkillGapCard from '../history-edite/Components/SkillGapCard';

type LearningHubItem = {
  id: number;
  title: string;
  level: string;
  price: string;
  isFree: boolean;
};

export const mockLearningHubData: LearningHubItem[] = [
  { id: 1, title: 'Front-end Path', level: 'Mid-senior', price: '$20', isFree: true },
  { id: 2, title: 'Back-end Path', level: 'Senior', price: '$25', isFree: false },
  { id: 3, title: 'Full Stack Path', level: 'Mid-level', price: '$30', isFree: true },
  { id: 4, title: 'DevOps Path', level: 'Mid-senior', price: '$22', isFree: true },
  { id: 5, title: 'UI/UX Design Path', level: 'Junior', price: '$15', isFree: false },
  { id: 6, title: 'Mobile Development Path', level: 'Senior', price: '$28', isFree: true },
];

type LearningHubContentProps = {
  items?: LearningHubItem[];
};

const LearningHubContent: React.FC<LearningHubContentProps> = ({ items = mockLearningHubData }) => {
  return (
    <Grid container spacing={3}>
      {items.map((item) => (
        <Grid key={item.id} size={{ xs: 12, sm: 6, md: 4 }}>
          <SkillGapCard title={item.title} level={item.level} price={item.price} isFree={item.isFree} />
        </Grid>
      ))}
    </Grid>
  );
};

export default LearningHubContent;

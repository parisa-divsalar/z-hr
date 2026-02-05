import React from 'react';

import Grid from '@mui/material/Grid';

import SkillGapCard from '../history-edite/Components/SkillGapCard';

type LearningHubItem = {
  id: number;
  title: string;
  level: string;
  price: string;
  isFree: boolean;
  image?: string;
  isBookmarked?: boolean;
};

type LearningHubContentProps = {
  items: LearningHubItem[];
  onToggleBookmark?: (courseId: number, next: boolean) => void;
};

const LearningHubContent: React.FC<LearningHubContentProps> = ({ items, onToggleBookmark }) => {
  return (
    <Grid container spacing={3}>
      {items.map((item) => (
        <Grid key={item.id} size={{ xs: 12, sm: 6, md: 4 }}>
          <SkillGapCard
            title={item.title}
            level={item.level}
            price={item.price}
            isFree={item.isFree}
            image={item.image}
            isBookmarked={Boolean(item.isBookmarked)}
            onToggleBookmark={
              onToggleBookmark
                ? (next) => {
                    onToggleBookmark(item.id, next);
                  }
                : undefined
            }
          />
        </Grid>
      ))}
    </Grid>
  );
};

export default LearningHubContent;

import React from 'react';

import { Typography, Box } from '@mui/material';

import RectangleImage from '@/assets/images/design/RectangleImage.svg';
import MuiCheckbox from '@/components/UI/MuiCheckbox';

import {
  Container,
  LeftSection,
  TitleSection,
  Description,
  MoreButton,
  RightSection,
  ResumeCardGrid,
  ResumeCard,
  CardImage,
  CardContent,
  JobTitle,
  LevelTag,
  PriceTag,
  CardMoreButton,
  BookmarkIcon,
} from './styled';

interface ResumeTemplate {
  id: string;
  title: string;
  level: string;
  price: string;
  isBookmarked?: boolean;
}

interface ResumeTemplatesProps {
  templates?: ResumeTemplate[];
}

const defaultTemplates: ResumeTemplate[] = [
  {
    id: '1',
    title: '1Software',
    level: 'Mid-senior',
    price: 'Free',
  },
  {
    id: '2',
    title: '2Product',
    level: 'Senior',
    price: '$9.99',
  },
  {
    id: '3',
    title: '3UX Designer',
    level: 'Mid-level',
    price: 'Free',
  },
  {
    id: '4',
    title: '4Data Scientist',
    level: 'Senior',
    price: '$14.99',
  },
  {
    id: '4',
    title: '4Data Scientist',
    level: 'Senior',
    price: '$14.99',
  },
  {
    id: '4',
    title: '4Data Scientist',
    level: 'Senior',
    price: '$14.99',
  },
];

const ResumeTemplates: React.FC<ResumeTemplatesProps> = ({ templates = defaultTemplates }) => {
  return (
    <Container>
      <LeftSection>
        <TitleSection>
          <MuiCheckbox
            label={
              <Typography variant='h6' fontWeight='600' color='text.primary'>
                Resume Template
              </Typography>
            }
            helperText={
              <Description>
                <Typography variant='body2' color='text.secondary'>
                  Choose from our professionally designed resume templates to make your application stand out.
                </Typography>
              </Description>
            }
          />
        </TitleSection>
        <MoreButton>
          <Typography variant='body2' fontWeight='500' color='text.secondary'>
            More
          </Typography>
        </MoreButton>
      </LeftSection>

      <RightSection>
        <ResumeCardGrid>
          {templates.map((template, index) => (
            <ResumeCard key={template.id}>
              <CardImage>
                <RectangleImage />
              </CardImage>
              <CardContent>
                <Box display='flex' justifyContent='space-between' alignItems='flex-start'>
                  <Box flex={1}>
                    <JobTitle>
                      <Typography variant='caption' fontWeight='400' color='text.primary'>
                        {template.title}
                      </Typography>
                    </JobTitle>
                    <LevelTag>
                      <Typography variant='caption' fontWeight='400' color='text.secondary'>
                        {template.level}
                      </Typography>
                    </LevelTag>
                  </Box>
                  <BookmarkIcon>
                    <svg width='20' height='20' viewBox='0 0 24 24' fill='none' xmlns='http://www.w3.org/2000/svg'>
                      <path
                        d='M17 3H7C5.9 3 5 3.9 5 5V21L12 18L19 21V5C19 3.9 18.1 3 17 3Z'
                        fill={template.isBookmarked ? '#3b82f6' : '#d1d5db'}
                      />
                    </svg>
                  </BookmarkIcon>
                </Box>

                <Box display='flex' justifyContent='space-between' alignItems='center' mt={1}>
                  <PriceTag>
                    <Typography variant='caption' fontWeight='600' color='primary.main'>
                      {template.price}
                    </Typography>
                  </PriceTag>
                  <CardMoreButton>
                    <Typography variant='caption' fontWeight='500' color='text.secondary'>
                      More
                    </Typography>
                  </CardMoreButton>
                </Box>
              </CardContent>
            </ResumeCard>
          ))}
        </ResumeCardGrid>
      </RightSection>
    </Container>
  );
};

export default ResumeTemplates;

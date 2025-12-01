import React from 'react';

import { Typography } from '@mui/material';

import FrameFeaturesSvg from '@/assets/images/bg/frameFeatures.svg';
import MuiButton from '@/components/UI/MuiButton';
import MuiCheckbox from '@/components/UI/MuiCheckbox';

import { Container, LeftSection, TitleSection, RightSection, FrameFeaturesImage } from './styled';

const ResumeMoreTemplates: React.FC = () => (
  <Container>
    <LeftSection>
      <TitleSection>
        <MuiCheckbox
          label={
            <Typography variant='subtitle1' fontWeight='500' color='text.primary'>
              Resume Template
            </Typography>
          }
        />
        <Typography variant='subtitle2' color='text.primary' fontWeight='400' ml={1} mt={1}>
          Choose from our professionally designed resume templates to make your application stand out.
        </Typography>
      </TitleSection>
      <MuiButton
        text='More'
        sx={{ backgroundColor: '#F0F0F2', color: 'secondary.main' }}
        variant='contained'
        color='secondary'
      />
    </LeftSection>

    <RightSection>
      <FrameFeaturesImage>
        <FrameFeaturesSvg />
      </FrameFeaturesImage>
    </RightSection>
  </Container>
);

export default ResumeMoreTemplates;

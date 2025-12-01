import React, { useEffect, useRef, useState } from 'react';

import { Typography } from '@mui/material';

import FrameFeaturesSvg from '@/assets/images/bg/frameFeatures.svg';
import MuiButton from '@/components/UI/MuiButton';
import MuiCheckbox from '@/components/UI/MuiCheckbox';

import { Container, LeftSection, TitleSection, RightSection, FrameFeaturesImage } from './styled';

const ResumeMoreTemplates: React.FC = () => {
  const [offset, setOffset] = useState(0);
  const intervalRef = useRef<number | null>(null);

  const startRollingUp = () => {
    if (intervalRef.current !== null) return;

    intervalRef.current = window.setInterval(() => {
      setOffset((prev) => {
        const next = prev - 0.5;

        if (next <= -120) {
          return 0;
        }

        return next;
      });
    }, 50);
  };

  const stopRollingUp = () => {
    if (intervalRef.current !== null) {
      window.clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };

  useEffect(
    () => () => {
      stopRollingUp();
    },
    [],
  );

  return (
    <Container>
      <LeftSection>
        <TitleSection mt={1}>
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

      <RightSection onMouseEnter={startRollingUp} onMouseLeave={stopRollingUp}>
        <FrameFeaturesImage offset={offset}>
          <FrameFeaturesSvg />
        </FrameFeaturesImage>
      </RightSection>
    </Container>
  );
};

export default ResumeMoreTemplates;

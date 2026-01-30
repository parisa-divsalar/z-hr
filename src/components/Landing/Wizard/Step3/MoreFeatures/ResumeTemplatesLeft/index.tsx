import React, { useEffect, useRef, useState } from 'react';

import { Typography } from '@mui/material';

import FrameFeaturesSvg from '@/assets/images/bg/frameFeatures.svg';
import MuiCheckbox from '@/components/UI/MuiCheckbox';
import { MoreFeatureSuggestion } from '@/components/Landing/Wizard/Step3/MoreFeatures/ResumeTemplatesRight';

import { Container, LeftSection, TitleSection, RightSection, FrameFeaturesImage } from './styled';

interface ResumeMoreTemplatesProps {
  suggestion: Pick<MoreFeatureSuggestion, 'title' | 'description' | 'coin'>;
}

const ResumeMoreTemplates: React.FC<ResumeMoreTemplatesProps> = ({ suggestion }) => {
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
                {suggestion.title}
              </Typography>
            }
          />
          <Typography variant='subtitle2' color='text.primary' fontWeight='400' ml={1} mt={1}>
            {suggestion.description}
          </Typography>
        </TitleSection>
        <Typography variant='subtitle2' color='text.secondary' fontWeight='500'>
          Coin: {suggestion.coin ?? 0}
        </Typography>
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

import React, { useEffect, useRef, useState } from 'react';

import { Typography } from '@mui/material';

import FrameFeaturesSvg from '@/assets/images/bg/frameFeatures.svg';
import { MoreFeatureSuggestion } from '@/components/Landing/Wizard/Step3/MoreFeatures/ResumeTemplatesRight';
import MuiCheckbox from '@/components/UI/MuiCheckbox';
import { useTranslatedSummary } from '@/components/Landing/Wizard/Step3/ResumeEditor/hooks/useTranslatedSummary';

import { Container, LeftSection, TitleSection, RightSection, FrameFeaturesImage } from './styled';

type Locale = 'en' | 'fa';

interface ResumeMoreTemplatesProps {
  suggestion: Pick<MoreFeatureSuggestion, 'title' | 'description' | 'coin'>;
  checked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
  dir?: 'rtl' | 'ltr';
  coinLabel?: string;
  locale?: Locale;
}

const ResumeMoreTemplates: React.FC<ResumeMoreTemplatesProps> = ({
  suggestion,
  checked,
  onCheckedChange,
  dir = 'ltr',
  coinLabel = 'Coin:',
  locale = 'en',
}) => {
  const isRtl = dir === 'rtl';
  const { displayText: titleText } = useTranslatedSummary(suggestion.title, locale);
  const { displayText: descriptionText } = useTranslatedSummary(suggestion.description, locale);
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
    <Container dir={dir} sx={{ direction: dir, flexDirection: isRtl ? 'row-reverse' : undefined }}>
      <LeftSection sx={{ textAlign: isRtl ? 'right' : 'left' }}>
        <TitleSection mt={1}>
          <MuiCheckbox
            checked={checked}
            onChange={(_, next) => onCheckedChange?.(next)}
            label={
              <Typography variant='subtitle1' fontWeight='500' color='text.primary'>
                {titleText}
              </Typography>
            }
          />
          <Typography
            variant='subtitle2'
            color='text.primary'
            fontWeight='400'
            mt={1}
            sx={{ marginLeft: isRtl ? 0 : 8, marginRight: isRtl ? 8 : 0 }}
          >
            {descriptionText}
          </Typography>
        </TitleSection>
        <Typography variant='subtitle2' color='text.secondary' fontWeight='500'>
          {coinLabel} {suggestion.coin ?? 0}
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

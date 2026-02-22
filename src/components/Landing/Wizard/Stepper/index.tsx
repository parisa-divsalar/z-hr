import React, { FC, useMemo } from 'react';

import CheckRoundedIcon from '@mui/icons-material/CheckRounded';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

import { getMainTranslations } from '@/locales/main';
import { useLocaleStore } from '@/store/common';

import { Container, StepItem, StepCircle, Divider } from './styled';

interface StepWrapperProps {
  activeStep: number; // 1,2,3
}

const StepWrapper: FC<StepWrapperProps> = ({ activeStep }) => {
  const locale = useLocaleStore((s) => s.locale);
  const stepperT = getMainTranslations(locale).landing.stepper;
  const steps = useMemo(
    () => [
      { id: 1, label: stepperT.firstStep, subtitle: stepperT.firstSubtitle },
      { id: 2, label: stepperT.secondStep, subtitle: stepperT.secondSubtitle },
      { id: 3, label: stepperT.finalStep, subtitle: stepperT.finalSubtitle },
    ],
    [stepperT],
  );

  return (
    <Container>
      {steps.map((step, index) => {
        const isCompleted = activeStep > step.id;
        const isCurrent = activeStep === step.id;
        return (
          <React.Fragment key={step.id}>
            <StepItem key={step.id} active={isCurrent}>
              <StepCircle active={isCompleted} current={isCurrent}>
                {isCompleted ? <CheckRoundedIcon /> : step.id}
              </StepCircle>

            <Box>
              <Typography
                variant='body1'
                sx={{
                  fontWeight: 492,
                  color: (theme) => {
                    if (isCompleted || isCurrent) return theme.palette.primary.main;
                    if (activeStep + 1 === index + 1) return theme.palette.grey[700];
                    return theme.palette.grey[300];
                  },
                }}
              >
                {step.label}
              </Typography>

              <Typography variant='subtitle2' sx={{ color: (theme) => theme.palette.grey[300], fontWeight: 400 }}>
                {step.subtitle}
              </Typography>
            </Box>
          </StepItem>

          {index < steps.length - 1 && <Divider active={activeStep > step.id} />}
        </React.Fragment>
      );
    })}
    </Container>
  );
};

export default StepWrapper;

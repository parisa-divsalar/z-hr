import React, { FC } from 'react';

import CheckRoundedIcon from '@mui/icons-material/CheckRounded';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

import { Container, StepItem, StepCircle, Divider } from './styled';

interface StepWrapperProps {
  activeStep: number; // 1,2,3
}

const StepWrapper: FC<StepWrapperProps> = ({ activeStep }) => {
  const steps = [
    { id: 1, label: 'First Step', subtitle: 'User’s Prompt' },
    { id: 2, label: 'Second Step', subtitle: 'Answer questions' },
    { id: 3, label: 'Final Step', subtitle: 'Review and Submit' },
  ];

  return (
    <Container>
      {steps.map((step, index) => (
        <React.Fragment key={step.id}>
          <StepItem key={step.id} active={activeStep === step.id}>
            <StepCircle active={activeStep >= step.id}>
              {activeStep > step.id ? <CheckRoundedIcon /> : step.id}
            </StepCircle>
            <Box>
              <Typography
                variant='subtitle1'
                fontWeight={600}
                color={activeStep >= step.id ? 'primary.main' : 'text.primary'}
              >
                {step.label}
              </Typography>
              <Typography variant='subtitle2' color='text.secondary'>
                {step.subtitle}
              </Typography>
            </Box>
          </StepItem>

          {index < steps.length - 1 && <Divider active={activeStep > step.id} />}
        </React.Fragment>
      ))}
    </Container>
  );
};

export default StepWrapper;

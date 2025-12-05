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
    { id: 1, label: 'First Step', subtitle: 'Answer questions' },
    { id: 2, label: 'Second Step', subtitle: 'Review and Submit' },
    { id: 3, label: 'Final Step', subtitle: 'Download a resumet' },
  ];

  return (
    <Container>
      {steps.map((step, index) => (
        <React.Fragment key={step.id}>
          <StepItem key={step.id} active={activeStep === step.id}>
            <StepCircle active={activeStep >= step.id} current={activeStep + 1 === index + 1}>
              {activeStep >= step.id ? <CheckRoundedIcon /> : step.id}
            </StepCircle>

            <Box>
              <Typography
                variant='body1'
                sx={{
                  fontWeight: 492,
                  color: (theme) => {
                    if (activeStep >= step.id) return theme.palette.primary.main;
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
      ))}
    </Container>
  );
};

export default StepWrapper;

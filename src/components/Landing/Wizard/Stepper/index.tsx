import React, { FC } from 'react';

import CheckRoundedIcon from '@mui/icons-material/CheckRounded';
import Box from '@mui/material/Box';
import { styled } from '@mui/material/styles';
import Typography from '@mui/material/Typography';

interface StepWrapperProps {
  activeStep: number; // 1,2,3
}

const Container = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(4),
}));

const StepItem = styled(Box)<{ active?: boolean }>(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(1.5),
  transition: '0.2s ease',
}));

const StepCircle = styled(Box)<{ active?: boolean }>(({ theme, active }) => ({
  width: 40,
  height: 40,
  borderRadius: '50%',
  border: `2px solid ${active ? theme.palette.primary.main : '#F0F0F2'}`,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  background: active ? theme.palette.primary.main : '#F0F0F2',
  color: active ? '#fff' : theme.palette.text.primary,
  fontWeight: 600,
}));

const Divider = styled('div')<{ active?: boolean }>(({ theme, active }) => ({
  flex: '0 0 50px',
  height: 2,
  background: active ? theme.palette.primary.main : theme.palette.divider,
}));

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
                fontWeight={700}
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

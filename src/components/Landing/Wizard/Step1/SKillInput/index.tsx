import React, { FunctionComponent, useState } from 'react';

import { Stack, Typography } from '@mui/material';

import ArrowRightIcon from '@/assets/images/icons/arrow-right.svg';
import ArrowBackIcon from '@/assets/images/icons/Icon-back.svg';
import PropertyIcon from '@/assets/images/icons/property.svg';
import { StageWizard } from '@/components/Landing/type';
import MuiButton from '@/components/UI/MuiButton';

import { InputContainer, InputContent, MainContainer } from './styled';

interface SKillInputProps {
  setStage: (stage: StageWizard) => void;
}

const SKillInput: FunctionComponent<SKillInputProps> = ({ setStage }) => {
  const [answer, setAnswer] = useState('');

  return (
    <MainContainer>
      <Typography variant='h5' color='text.primary' fontWeight='600'>
        Very good Ayla 😊{' '}
      </Typography>
      <Typography variant='h5' color='text.primary' fontWeight='600'>
        You should answer a few questions about your resume.
      </Typography>

      <Typography variant='h5' color='text.primary' fontWeight='600' mt={6}>
        1. Your visa status?{' '}
      </Typography>

      <InputContainer direction='row' sx={{ borderColor: answer === '' ? 'grey.100' : 'primary.main' }}>
        <InputContent
          placeholder='Type your answer...'
          value={answer}
          onChange={(event: any) => setAnswer(event.target.value)}
        />
      </InputContainer>

      <Typography variant='h5' color='text.primary' fontWeight='600' mt={6}>
        2. Best way for employers to contact you?{' '}
      </Typography>

      <Stack mt={1} direction='row' alignItems='flex-start' gap={2} width='100%' maxWidth='588px'>
        <InputContainer
          direction='row'
          sx={{
            borderColor: answer === '' ? 'grey.100' : 'primary.main',
            flex: 1,
            mt: 0,
          }}
        >
          <InputContent
            placeholder='Type your answer...'
            value={answer}
            onChange={(event: any) => setAnswer(event.target.value)}
          />
        </InputContainer>
        <PropertyIcon />
      </Stack>

      <Stack mt={4} mb={6} direction='row' gap={3}>
        <MuiButton
          color='secondary'
          variant='outlined'
          size='large'
          startIcon={<ArrowBackIcon />}
          onClick={() => setStage('SELECT_SKILL')}
        >
          Back
        </MuiButton>

        <MuiButton
          color='secondary'
          endIcon={<ArrowRightIcon />}
          size='large'
          onClick={() => setStage('QUESTIONS')}
          disabled={answer === ''}
        >
          Next
        </MuiButton>
      </Stack>
    </MainContainer>
  );
};

export default SKillInput;

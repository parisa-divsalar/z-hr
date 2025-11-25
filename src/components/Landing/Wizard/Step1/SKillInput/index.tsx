import React, { FunctionComponent, useState } from 'react';

import { IconButton, Stack, Typography } from '@mui/material';

import ArrowRightIcon from '@/assets/images/icons/arrow-right.svg';
import ArrowTopIcon from '@/assets/images/icons/arrow-top.svg';
import ArrowBackIcon from '@/assets/images/icons/Icon-back.svg';
import { CircleContainer } from '@/components/Landing/AI/Text/styled';
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
      <Typography variant='h5' color='text.primary' fontWeight='700'>
        What is your main skill?
      </Typography>
      <InputContainer direction='row' sx={{ borderColor: answer === '' ? 'grey.100' : 'primary.main' }}>
        <InputContent
          placeholder='Type your answer...'
          value={answer}
          onChange={(event: any) => setAnswer(event.target.value)}
        />
        {answer !== '' ? (
          <IconButton onClick={() => setStage('QUESTIONS')}>
            <CircleContainer>
              <ArrowTopIcon color='white' />
            </CircleContainer>
          </IconButton>
        ) : (
          <IconButton>
            <ArrowTopIcon color='#8A8A91' />
          </IconButton>
        )}
      </InputContainer>

      <Stack mt={4} mb={6} direction='row' spacing={2}>
        <MuiButton
          color='secondary'
          variant='outlined'
          startIcon={<ArrowBackIcon />}
          onClick={() => setStage('SELECT_SKILL')}
        >
          Back
        </MuiButton>

        <MuiButton
          color='secondary'
          endIcon={<ArrowRightIcon />}
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

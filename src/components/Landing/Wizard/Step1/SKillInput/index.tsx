import React, { FunctionComponent, useState } from 'react';

import { Stack, Typography } from '@mui/material';

import ArrowRightIcon from '@/assets/images/icons/arrow-right.svg';
import MuiButton from '@/components/UI/MuiButton';

import { InputContainer, InputContent, MainContainer } from './styled';

interface SKillInputProps {
  onNext: () => void;
}

const SKillInput: FunctionComponent<SKillInputProps> = ({ onNext }) => {
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
      </InputContainer>

      <Stack direction='row' mt={6} gap={2}>
        <MuiButton color='secondary' endIcon={<ArrowRightIcon />} onClick={onNext} disabled={answer === ''}>
          Next
        </MuiButton>
      </Stack>
    </MainContainer>
  );
};

export default SKillInput;

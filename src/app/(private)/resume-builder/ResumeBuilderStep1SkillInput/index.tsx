'use client';

import React, { FunctionComponent, useState } from 'react';

import { IconButton, Stack, Typography } from '@mui/material';

import ArrowRightIcon from '@/assets/images/icons/arrow-right.svg';
import ArrowTopIcon from '@/assets/images/icons/arrow-top.svg';
import ArrowBackIcon from '@/assets/images/icons/Icon-back.svg';
import { StageWizard } from '@/components/Landing/type';
import MuiButton from '@/components/UI/MuiButton';

import { CircleContainer, SkillInputContainer, SkillInputContent, SkillInputMainContainer } from './styled';

interface ResumeBuilderStep1SkillInputProps {
  setStage: (stage: StageWizard) => void;
}

const ResumeBuilderStep1SkillInput: FunctionComponent<ResumeBuilderStep1SkillInputProps> = ({ setStage }) => {
  const [answer, setAnswer] = useState('');

  return (
    <SkillInputMainContainer>
      <Typography variant='h5' color='text.primary' fontWeight='600'>
        What is your main skill?
      </Typography>
      <SkillInputContainer direction='row' sx={{ borderColor: answer === '' ? 'grey.100' : 'primary.main' }}>
        <SkillInputContent
          placeholder='Type your answer...'
          value={answer}
          onChange={(event: React.ChangeEvent<HTMLTextAreaElement>) => setAnswer(event.target.value)}
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
      </SkillInputContainer>

      <Stack mt={30} mb={6} direction='row' spacing={2}>
        <MuiButton
          color='secondary'
          size='large'
          variant='outlined'
          startIcon={<ArrowBackIcon />}
          onClick={() => setStage('SELECT_SKILL')}
        >
          Back
        </MuiButton>

        <MuiButton
          color='secondary'
          size='large'
          endIcon={<ArrowRightIcon />}
          onClick={() => setStage('QUESTIONS')}
          disabled={answer === ''}
        >
          Next
        </MuiButton>
      </Stack>
    </SkillInputMainContainer>
  );
};

export default ResumeBuilderStep1SkillInput;

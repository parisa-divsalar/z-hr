import { useState, ChangeEvent } from 'react';

import { IconButton, Stack, Typography } from '@mui/material';

import ArrowRightIcon from '@/assets/images/icons/arrow-right.svg';
import ArrowTopIcon from '@/assets/images/icons/arrow-top.svg';
import ArrowBackIcon from '@/assets/images/icons/Icon-back.svg';
import { CircleContainer } from '@/components/Landing/AI/Text/styled';
import MuiButton from '@/components/UI/MuiButton';

import { CenterGrayBox, ChatInputContainer, ChatInputContent } from './styled';

interface RepeatSkillInputStepProps {
  initialAnswer?: string;
  onBack?: () => void;
  onNext?: (answer: string) => void;
}

const RepeatSkillInputStep = ({ initialAnswer = '', onBack, onNext }: RepeatSkillInputStepProps) => {
  const [answer, setAnswer] = useState(initialAnswer);

  const handleChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
    setAnswer(event.target.value);
  };

  const handleSubmit = () => {
    if (!answer) return;
    onNext?.(answer);
  };

  return (
    <CenterGrayBox>
      <Typography variant='h5' color='text.primary' fontWeight='500'>
        You can rewrite your answer if you want
      </Typography>

      <ChatInputContainer direction='row' hasValue={answer !== ''}>
        <ChatInputContent placeholder='Type your answer...' value={answer} onChange={handleChange} />

        {answer !== '' ? (
          <IconButton onClick={handleSubmit}>
            <CircleContainer>
              <ArrowTopIcon color='white' />
            </CircleContainer>
          </IconButton>
        ) : (
          <IconButton>
            <ArrowTopIcon color='#8A8A91' />
          </IconButton>
        )}
      </ChatInputContainer>

      <Stack mt={10} mb={5} direction='row' spacing={4}>
        <MuiButton color='secondary' variant='outlined' startIcon={<ArrowBackIcon />} onClick={onBack}>
          Backتتتتتتتتتتتت
        </MuiButton>

        <MuiButton color='secondary' endIcon={<ArrowRightIcon />} onClick={handleSubmit} disabled={answer === ''}>
          Next
        </MuiButton>
      </Stack>
    </CenterGrayBox>
  );
};

export default RepeatSkillInputStep;

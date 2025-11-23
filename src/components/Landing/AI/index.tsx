import { FunctionComponent } from 'react';

import { Stack, Typography } from '@mui/material';

import { MainContainer } from '@/components/Landing/AI/styled';
import AIInputPrompt from '@/components/Landing/AI/Text';
import VoiceBox from '@/components/Landing/AI/VoiceBox';
import { AIStatus } from '@/components/Landing/type';
import MuiButton from '@/components/UI/MuiButton';

interface AIInputProps {
  setAiStatus: (status: AIStatus) => void;
}

const AIInput: FunctionComponent<AIInputProps> = (props) => {
  const { setAiStatus } = props;

  return (
    <MainContainer>
      <Typography variant='h6' color='text.primary'>
        Create your resume with
      </Typography>
      <Typography variant='h5' color='text.primary' fontWeight='700' mt={0.5}>
        Voice, Video, Photo and Text
      </Typography>

      <VoiceBox />

      <AIInputPrompt setAiStatus={setAiStatus} />

      <Stack width='10rem' mt={6}>
        <MuiButton fullWidth color='secondary'>
          submit
        </MuiButton>
      </Stack>
    </MainContainer>
  );
};

export default AIInput;

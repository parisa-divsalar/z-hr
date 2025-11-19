import { FunctionComponent } from 'react';

import { Typography } from '@mui/material';

import AIInputBox from '@/components/Landing/AI/InputBox';
import { MainContainer } from '@/components/Landing/AI/styled';
import { AIStatus } from '@/components/Landing/type';

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

      <AIInputBox setAiStatus={setAiStatus} />
    </MainContainer>
  );
};

export default AIInput;

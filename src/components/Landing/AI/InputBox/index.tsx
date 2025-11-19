import { FunctionComponent, useState } from 'react';

import { IconButton } from '@mui/material';

import AddIcon from '@/assets/images/icons/add.svg';
import ArrowTopIcon from '@/assets/images/icons/arrow-top.svg';
import { CircleContainer, InputContainer, InputContent } from '@/components/Landing/AI/InputBox/styled';
import { AIStatus } from '@/components/Landing/type';

interface AIInputBoxProps {
  setAiStatus: (status: AIStatus) => void;
}

const AIInputBox: FunctionComponent<AIInputBoxProps> = (props) => {
  const { setAiStatus } = props;

  const [search, setSearch] = useState('');

  return (
    <InputContainer direction='row' sx={{ borderColor: search === '' ? 'grey.100' : 'primary.main' }}>
      <IconButton>
        <AddIcon />
      </IconButton>

      <InputContent
        placeholder='Type your prompt...'
        value={search}
        onChange={(event: any) => setSearch(event.target.value)}
      />

      {search !== '' ? (
        <IconButton onClick={() => setAiStatus('WIZARD')}>
          <CircleContainer>
            <ArrowTopIcon color='white' />
          </CircleContainer>
        </IconButton>
      ) : (
        <IconButton>
          <ArrowTopIcon color='#8A8A91' />
        </IconButton>
      )}

      {/*<VoiceRecording />*/}
    </InputContainer>
  );
};

export default AIInputBox;

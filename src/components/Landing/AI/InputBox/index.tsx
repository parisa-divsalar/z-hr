import { useState } from 'react';

import { IconButton } from '@mui/material';

import AddIcon from '@/assets/images/icons/add.svg';
import ArrowTopIcon from '@/assets/images/icons/arrow-top.svg';
import { CircleContainer, InputContainer, InputContent } from '@/components/Landing/AI/InputBox/styled';

const AIInputBox = () => {
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
        <IconButton>
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

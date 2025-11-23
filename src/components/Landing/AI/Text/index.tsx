import { FunctionComponent, useState } from 'react';

import { IconButton } from '@mui/material';

import ArrowTopIcon from '@/assets/images/icons/arrow-top.svg';
import AddAttachFile from '@/components/Landing/AI/Attach';
import { InputContainer, CircleContainer, InputContent } from '@/components/Landing/AI/Text/styled';
import { AIStatus } from '@/components/Landing/type';

interface AIInputPromptProps {
  setAiStatus: (status: AIStatus) => void;
}

const AIInputPrompt: FunctionComponent<AIInputPromptProps> = (props) => {
  const { setAiStatus } = props;
  const [search, setSearch] = useState('');

  return (
    <InputContainer direction='row' active={!!search}>
      <AddAttachFile />

      <InputContent
        placeholder='Type your prompt...'
        value={search}
        onChange={(event) => setSearch(event.target.value)}
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
    </InputContainer>
  );
};

export default AIInputPrompt;

import { FunctionComponent } from 'react';

import { IconButton } from '@mui/material';

import ArrowTopIcon from '@/assets/images/icons/arrow-top.svg';
import AddAttachFile from '@/components/Landing/AI/Attach';
import { InputContainer, CircleContainer, InputContent } from '@/components/Landing/AI/Text/styled';
import { AIStatus } from '@/components/Landing/type';

interface AIInputPromptProps {
  setAiStatus: (status: AIStatus) => void;
  search: string;
  setSearch: (search: string) => void;
}

const AIInputPrompt: FunctionComponent<AIInputPromptProps> = (props) => {
  const { setAiStatus, search, setSearch } = props;

  const handleInput = (e: any) => {
    e.target.style.height = 'auto';
    e.target.style.height = e.target.scrollHeight + 'px';
  };

  return (
    <InputContainer direction='row' active={!!search}>
      <AddAttachFile />

      <InputContent
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        onInput={handleInput}
        placeholder='Type your prompt...'
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

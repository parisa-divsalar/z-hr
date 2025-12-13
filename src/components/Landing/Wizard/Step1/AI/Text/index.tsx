import { FunctionComponent } from 'react';

import { IconButton } from '@mui/material';

import ArrowTopIcon from '@/assets/images/icons/arrow-top.svg';
import { AIStatus } from '@/components/Landing/type';
import AddAttachFile from '@/components/Landing/Wizard/Step1/AI/Attach';
import { CircleContainer, InputContainer, InputContent } from '@/components/Landing/Wizard/Step1/AI/Text/styled';

interface AIInputPromptProps {
  setAiStatus: (status: AIStatus) => void;
  search: string;
  setSearch: (search: string) => void;
  uploadedFiles: File[];
  setUploadedFiles: (value: File[] | ((prev: File[]) => File[])) => void;
}

const AIInputPrompt: FunctionComponent<AIInputPromptProps> = (props) => {
  const { setAiStatus, search, setSearch, uploadedFiles, setUploadedFiles } = props;

  return (
    <InputContainer direction='row' active={!!search}>
      <AddAttachFile uploadedFiles={uploadedFiles} setUploadedFiles={setUploadedFiles} />

      <InputContent
        value={search}
        onChange={(e) => setSearch(e.target.value)}
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

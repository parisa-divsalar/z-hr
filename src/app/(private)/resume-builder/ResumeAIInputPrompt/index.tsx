'use client';

import React, { FunctionComponent } from 'react';

import { IconButton } from '@mui/material';

import ArrowTopIcon from '@/assets/images/icons/arrow-top.svg';
import AddAttachFile from '@/components/Landing/Wizard/Step1/AI/Attach';
import { AIStatus } from '@/components/Landing/type';

import { CircleContainer, InputContainer, InputContent } from './styled';

interface ResumeAIInputPromptProps {
  setAiStatus: (status: AIStatus) => void;
  search: string;
  setSearch: (search: string) => void;
  uploadedFiles: File[];
  setUploadedFiles: (value: File[] | ((prev: File[]) => File[])) => void;
}

const ResumeAIInputPrompt: FunctionComponent<ResumeAIInputPromptProps> = ({
  setAiStatus,
  search,
  setSearch,
  uploadedFiles,
  setUploadedFiles,
}) => {
  const handleInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    e.target.style.height = 'auto';
    e.target.style.height = e.target.scrollHeight + 'px';
  };

  return (
    <InputContainer direction='row' active={!!search}>
      <AddAttachFile uploadedFiles={uploadedFiles} setUploadedFiles={setUploadedFiles} />

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

export default ResumeAIInputPrompt;

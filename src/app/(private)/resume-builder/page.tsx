'use client';

import React, { FunctionComponent, useState } from 'react';

import { IconButton, Stack, Typography } from '@mui/material';

import ArrowTopIcon from '@/assets/images/icons/arrow-top.svg';
import AttachView from '@/components/Landing/AI/Attach/View';
import AddAttachFile from '@/components/Landing/AI/Attach';
import { MainContainer } from '@/components/Landing/AI/styled';
import { CircleContainer, InputContainer, InputContent } from '@/components/Landing/AI/Text/styled';
import VoiceRecord from '@/components/Landing/Common/VoiceRecord';
import { AIStatus } from '@/components/Landing/type';
import MuiButton from '@/components/UI/MuiButton';
import { ResumeBuilderRoot } from '@/app/(private)/resume-builder/styled';

interface ResumeAIInputPromptProps {
  setAiStatus: (status: AIStatus) => void;
  search: string;
  setSearch: (search: string) => void;
  uploadedFiles: File[];
  setUploadedFiles: (value: File[] | ((prev: File[]) => File[])) => void;
}

const ResumeAIInputPrompt: FunctionComponent<ResumeAIInputPromptProps> = (props) => {
  const { setAiStatus, search, setSearch, uploadedFiles, setUploadedFiles } = props;

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
          <CircleContainer>
            <ArrowTopIcon color='#8A8A91' />
          </CircleContainer>
        </IconButton>
      )}
    </InputContainer>
  );
};

const ResumeAIInput: FunctionComponent = () => {
  const [aiStatus, setAiStatus] = useState<AIStatus>('START');
  const [search, setSearch] = useState('');
  const [voiceUrl, setVoiceUrl] = useState<string | null>(null);
  const [voiceBlob, setVoiceBlob] = useState<Blob | null>(null);
  const [showRecordingControls, setShowRecordingControls] = useState<boolean>(true);
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);

  const handleVoiceRecordingComplete = (url: string, blob: Blob) => {
    setVoiceUrl(url);
    setVoiceBlob(blob);
    setShowRecordingControls(false);
  };

  const handleClearVoiceRecording = () => {
    setVoiceUrl(null);
    setVoiceBlob(null);
    setShowRecordingControls(true);
  };

  return (
    <MainContainer>
      {!voiceUrl && uploadedFiles.length === 0 && (
        <Typography variant='h6' color='text.primary'>
          Create your resume with
        </Typography>
      )}

      {!voiceUrl && uploadedFiles.length === 0 && (
        <Typography variant='h5' color='text.primary' fontWeight='700' mt={0.5}>
          Voice, Video, Photo and Text
        </Typography>
      )}

      <AttachView uploadedFiles={uploadedFiles} setUploadedFiles={setUploadedFiles} />

      {voiceUrl && (
        <VoiceRecord
          initialAudioUrl={voiceUrl}
          initialAudioBlob={voiceBlob}
          showRecordingControls={showRecordingControls}
          onClearRecording={handleClearVoiceRecording}
        />
      )}

      {!voiceUrl && (
        <VoiceRecord onRecordingComplete={handleVoiceRecordingComplete} showRecordingControls={showRecordingControls} />
      )}

      <ResumeAIInputPrompt
        setAiStatus={setAiStatus}
        search={search}
        setSearch={setSearch}
        uploadedFiles={uploadedFiles}
        setUploadedFiles={setUploadedFiles}
      />

      {(search !== '' || voiceUrl) && (
        <Stack width='10rem' mt={6}>
          <MuiButton fullWidth color='secondary' onClick={() => setAiStatus('WIZARD')}>
            submit
          </MuiButton>
        </Stack>
      )}
    </MainContainer>
  );
};

const ResumeBuilder = () => {
  return (
    <ResumeBuilderRoot>
      <ResumeAIInput />
    </ResumeBuilderRoot>
  );
};

export default ResumeBuilder;

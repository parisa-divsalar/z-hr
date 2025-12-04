'use client';

import React, { FunctionComponent, useState } from 'react';

import { Stack, Typography } from '@mui/material';

import ResumeAIInputPrompt from '@/app/(private)/resume-builder/ResumeAIInputPrompt';
import { RecordingState } from '@/components/Landing/Wizard/Step1/AI';
import AttachView from '@/components/Landing/Wizard/Step1/AI/Attach/View';
import VoiceRecord from '@/components/Landing/Wizard/Step1/Common/VoiceRecord';
import { AIStatus } from '@/components/Landing/type';
import MuiButton from '@/components/UI/MuiButton';

import { MainContainer } from './styled';

const ResumeAIInput: FunctionComponent<{ setAiStatus: (status: AIStatus) => void }> = ({ setAiStatus }) => {
  const [search, setSearch] = useState('');
  const [recordingState, setRecordingState] = useState<RecordingState>('idle');
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
        <Typography variant='h6' color='text.primary' fontWeight='400'>
          Create your resume with
        </Typography>
      )}

      {!voiceUrl && uploadedFiles.length === 0 && (
        <Typography variant='h5' color='text.primary' fontWeight='600' mt={0.3}>
          Voice, Video, Photo and Text
        </Typography>
      )}

      <AttachView uploadedFiles={uploadedFiles} setUploadedFiles={setUploadedFiles} voiceUrl={voiceUrl} />

      {voiceUrl && (
        <VoiceRecord
          recordingState={recordingState}
          setRecordingState={setRecordingState}
          initialAudioUrl={voiceUrl}
          initialAudioBlob={voiceBlob}
          showRecordingControls={showRecordingControls}
          onClearRecording={handleClearVoiceRecording}
        />
      )}

      {!voiceUrl && (
        <VoiceRecord
          onRecordingComplete={handleVoiceRecordingComplete}
          showRecordingControls={showRecordingControls}
          recordingState={recordingState}
          setRecordingState={setRecordingState}
        />
      )}

      <ResumeAIInputPrompt
        setAiStatus={setAiStatus}
        search={search}
        setSearch={setSearch}
        uploadedFiles={uploadedFiles}
        setUploadedFiles={setUploadedFiles}
      />

      {(search !== '' || voiceUrl) && (
        <Stack width='10rem' mt={3}>
          <MuiButton fullWidth color='secondary' onClick={() => setAiStatus('WIZARD')}>
            submit
          </MuiButton>
        </Stack>
      )}
    </MainContainer>
  );
};

export default ResumeAIInput;

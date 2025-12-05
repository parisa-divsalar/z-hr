import React, { FunctionComponent, useState } from 'react';

import { Stack, Typography } from '@mui/material';

import { AIStatus } from '@/components/Landing/type';
import AttachView from '@/components/Landing/Wizard/Step1/AI/Attach/View';
import { MainContainer } from '@/components/Landing/Wizard/Step1/AI/styled';
import AIInputPrompt from '@/components/Landing/Wizard/Step1/AI/Text';
import VoiceRecord from '@/components/Landing/Wizard/Step1/Common/VoiceRecord';
import MuiButton from '@/components/UI/MuiButton';

interface AIInputProps {
  setAiStatus: (status: AIStatus) => void;
}

export type RecordingState = 'idle' | 'recording';

const AIInput: FunctionComponent<AIInputProps> = (props) => {
  const { setAiStatus } = props;
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
      {!voiceUrl && uploadedFiles.length === 0 && recordingState !== 'recording' && (
        <Typography variant='h6' color='text.primary'>
          Create your resume with
        </Typography>
      )}

      {!voiceUrl && uploadedFiles.length === 0 && recordingState !== 'recording' && (
        <Typography variant='h5' color='text.primary' fontWeight='600' mt={0.5}>
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

      <AIInputPrompt
        setAiStatus={setAiStatus}
        search={search}
        setSearch={setSearch}
        uploadedFiles={uploadedFiles}
        setUploadedFiles={setUploadedFiles}
      />

      {(search !== '' || voiceUrl) && (
        <Stack width='10rem' mt={6}>
          <MuiButton fullWidth color='secondary' size='large' onClick={() => setAiStatus('WIZARD')}>
            submit
          </MuiButton>
        </Stack>
      )}
    </MainContainer>
  );
};

export default AIInput;

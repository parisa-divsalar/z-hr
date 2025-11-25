import React, { FunctionComponent, useState } from 'react';

import { Stack, Typography } from '@mui/material';

import AttachView from '@/components/Landing/AI/Attach/View';
import { MainContainer } from '@/components/Landing/AI/styled';
import AIInputPrompt from '@/components/Landing/AI/Text';
import VoiceRecord from '@/components/Landing/Common/VoiceRecord';
import { AIStatus } from '@/components/Landing/type';
import MuiButton from '@/components/UI/MuiButton';

interface AIInputProps {
  setAiStatus: (status: AIStatus) => void;
}

const AIInput: FunctionComponent<AIInputProps> = (props) => {
  const { setAiStatus } = props;
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

      <AIInputPrompt
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

export default AIInput;

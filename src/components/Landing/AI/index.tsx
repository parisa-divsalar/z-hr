import React, { FunctionComponent, useState } from 'react';

import { Typography } from '@mui/material';

import { MainContainer } from '@/components/Landing/AI/styled';
import AIInputPrompt from '@/components/Landing/AI/Text';
import VoiceRecord from '@/components/Landing/Common/VoiceRecord';
import { AIStatus } from '@/components/Landing/type';

interface AIInputProps {
  setAiStatus: (status: AIStatus) => void;
}

const AIInput: FunctionComponent<AIInputProps> = (props) => {
  const { setAiStatus } = props;
  const [search, setSearch] = useState('');
  const [voiceUrl, setVoiceUrl] = useState<string | null>(null);
  const [voiceBlob, setVoiceBlob] = useState<Blob | null>(null);
  const [showRecordingControls, setShowRecordingControls] = useState<boolean>(true);

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
      {!voiceUrl && (
        <Typography variant='h6' color='text.primary'>
          Create your resume with
        </Typography>
      )}

      {!voiceUrl && (
        <Typography variant='h5' color='text.primary' fontWeight='700' mt={0.5}>
          Voice, Video, Photo and Text
        </Typography>
      )}

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

      <AIInputPrompt setAiStatus={setAiStatus} search={search} setSearch={setSearch} />

      {/*{search !== '' && (*/}
      {/*  <Stack width='10rem' mt={6}>*/}
      {/*    <MuiButton fullWidth color='secondary' disabled={search === ''}>*/}
      {/*      submit*/}
      {/*    </MuiButton>*/}
      {/*  </Stack>*/}
      {/*)}*/}
    </MainContainer>
  );
};

export default AIInput;

import React, { FunctionComponent, useState } from 'react';

import { Stack, Typography } from '@mui/material';

import ArrowLeftIcon from '@/assets/images/icons/arrow-left.svg';
import ArrowRightIcon from '@/assets/images/icons/arrow-right.svg';
import VoiceRecording from '@/components/Landing/Common/Voice';
import VoiceResult from '@/components/Landing/Wizard/Step2/Result';
import Thinking from '@/components/Landing/Wizard/Step2/Thinking';
import VoiceUploading from '@/components/Landing/Wizard/Step2/Uploading';
import MuiButton from '@/components/UI/MuiButton';

interface Step2Props {
  setActiveStep: (activeStep: number) => void;
}
const Step2: FunctionComponent<Step2Props> = (props) => {
  const { setActiveStep } = props;

  const [voiceUrl, setVoiceUrl] = useState<string | null>(null);
  const [voiceBlob, setVoiceBlob] = useState<Blob | null>(null);
  const [showRecordingControls, setShowRecordingControls] = useState<boolean>(true);
  const [uploading, setUploading] = useState<boolean>(false);
  const [showResult, setShowResult] = useState<boolean>(false);
  const [showThinking, setShowThinking] = useState<boolean>(false);

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

  if (showThinking) return <Thinking onCancel={() => setShowThinking(false)} setActiveStep={setActiveStep} />;

  if (showResult)
    return (
      <VoiceResult
        onSubmit={() => {
          setShowThinking(true);
          setShowResult(false);
        }}
      />
    );

  if (uploading)
    return (
      <VoiceUploading
        setUploading={setUploading}
        onComplete={() => {
          setShowResult(true);
          setUploading(false);
        }}
      />
    );

  return (
    <Stack alignItems='center' justifyContent='center' height='100%'>
      <Typography variant='h5' color='text.primary' fontWeight='700' mb={4}>
        Please Click on the Voice Icon for Record.
      </Typography>

      {voiceUrl && (
        <VoiceRecording
          initialAudioUrl={voiceUrl}
          initialAudioBlob={voiceBlob}
          showRecordingControls={showRecordingControls}
          onClearRecording={handleClearVoiceRecording}
        />
      )}

      {!voiceUrl && (
        <VoiceRecording
          onRecordingComplete={handleVoiceRecordingComplete}
          showRecordingControls={showRecordingControls}
        />
      )}

      <Stack direction='row' mt={6} gap={2}>
        <MuiButton color='secondary' startIcon={<ArrowLeftIcon />} onClick={() => setActiveStep(1)}>
          Prev
        </MuiButton>

        <MuiButton
          color='secondary'
          endIcon={<ArrowRightIcon />}
          onClick={() => setUploading(true)}
          disabled={voiceUrl === null}
        >
          Submit
        </MuiButton>
      </Stack>
    </Stack>
  );
};

export default Step2;

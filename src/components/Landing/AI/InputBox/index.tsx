import { FunctionComponent, useState } from 'react';

import { IconButton } from '@mui/material';

import AddIcon from '@/assets/images/icons/add.svg';
import ArrowTopIcon from '@/assets/images/icons/arrow-top.svg';
import { CircleContainer, InputContainer, InputContent } from '@/components/Landing/AI/InputBox/styled';
import VoiceRecording from '@/components/Landing/AI/voice/voice';
import Index from '@/components/Landing/AI/VoiceButtonCard';
import { AIStatus } from '@/components/Landing/type';

interface AIInputBoxProps {
  setAiStatus: (status: AIStatus) => void;
}

const AIInputBox: FunctionComponent<AIInputBoxProps> = (props) => {
  const { setAiStatus } = props;

  const [search, setSearch] = useState('');
  const [voiceUrl, setVoiceUrl] = useState<string | null>(null);
  const [voiceBlob, setVoiceBlob] = useState<Blob | null>(null);
  const [isVoiceMode, setIsVoiceMode] = useState(false);

  const handleVoiceRecordingComplete = (url: string, blob: Blob) => {
    setVoiceUrl(url);
    setVoiceBlob(blob);
    setSearch(''); // Clear text input when voice is recorded
  };

  const handleClearVoiceRecording = () => {
    setVoiceUrl(null);
    setVoiceBlob(null);
    setIsVoiceMode(false);
  };

  const handleVoiceButtonClick = () => {
    setIsVoiceMode(true);
  };

  return (
    <>
      <Index onClick={handleVoiceButtonClick} />

      {isVoiceMode && (
        <VoiceRecording
          onRecordingComplete={handleVoiceRecordingComplete}
          onRecordingStart={() => {}}
          onRecordingStop={() => {}}
          showRecordingControls={true}
          onClearRecording={handleClearVoiceRecording}
        />
      )}

      {voiceUrl && !isVoiceMode && (
        <VoiceRecording
          initialAudioUrl={voiceUrl}
          initialAudioBlob={voiceBlob}
          showRecordingControls={false}
          onClearRecording={handleClearVoiceRecording}
        />
      )}

      <InputContainer direction='row' sx={{ borderColor: search === '' ? 'grey.100' : 'primary.main' }}>
        <IconButton>
          <AddIcon />
        </IconButton>

        <InputContent
          placeholder='Type your prompt...'
          value={search}
          onChange={(event: any) => setSearch(event.target.value)}
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
    </>
  );
};

export default AIInputBox;

import React from 'react';

import VoiceIcon from '@/assets/images/icons/voice.svg';

import { CardContainer, VoiceLabel, GradientButton } from './styled';

interface VoiceBoxProps {
  onClick?: () => void;
}

const VoiceBoxRecording: React.FC<VoiceBoxProps> = ({ onClick }) => {
  return (
    <CardContainer>
      <GradientButton aria-label='Voice button' onClick={onClick}>
        <VoiceIcon />
      </GradientButton>

      <VoiceLabel color='text.primary'>Voice</VoiceLabel>
    </CardContainer>
  );
};

export default VoiceBoxRecording;

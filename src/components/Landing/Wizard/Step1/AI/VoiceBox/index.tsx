import React from 'react';

import FrameVoiceIcon from '@/assets/images/design/Frame-voice.svg';

import { CardContainer, VoiceButton } from './styled';

interface VoiceBoxProps {
  onClick?: () => void;
}

const VoiceBox: React.FC<VoiceBoxProps> = ({ onClick }) => {
  return (
    <CardContainer>
      <VoiceButton aria-label='Voice button' onClick={onClick}>
        ddddddddddddd <FrameVoiceIcon />
      </VoiceButton>
    </CardContainer>
  );
};

export default VoiceBox;

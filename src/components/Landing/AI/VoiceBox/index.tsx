import React from 'react';

import { Typography } from '@mui/material';

import FrameVoiceIcon from '@/assets/images/design/Frame-voice.svg';

import { CardContainer, VoiceButton, VoiceLabel, OrDivider, DividerLine } from './styled';

interface VoiceBoxProps {
  onClick?: () => void;
}

const VoiceBox: React.FC<VoiceBoxProps> = ({ onClick }) => {
  return (
    <CardContainer>
      <VoiceButton aria-label='Voice button' onClick={onClick}>
        <FrameVoiceIcon />
      </VoiceButton>

      <VoiceLabel color='text.primary'>Voice</VoiceLabel>

      <OrDivider>
        <DividerLine />
        <Typography variant='body2' color='text.primary' bgcolor='transparent' mx={1}>
          Or
        </Typography>
        <DividerLine />
      </OrDivider>
    </CardContainer>
  );
};

export default VoiceBox;

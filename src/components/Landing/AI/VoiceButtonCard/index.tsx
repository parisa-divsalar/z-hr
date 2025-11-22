import React from 'react';

import { Typography } from '@mui/material';

import FrameVoiceIcon from '@/assets/images/design/Frame-voice.svg';

import { CardContainer, VoiceButton, VoiceLabel, OrDivider, DividerLine } from './styled';

interface VoiceButtonCardProps {
  onClick?: () => void;
}

const VoiceButtonCard: React.FC<VoiceButtonCardProps> = ({ onClick }) => {
  return (
    <CardContainer>
      {/* Voice Button */}
      <VoiceButton aria-label='Voice button' onClick={onClick}>
        <FrameVoiceIcon />
      </VoiceButton>
      <VoiceLabel>Voice</VoiceLabel>
      {/* Divider with "Or" */}
      <OrDivider>
        <DividerLine />
        <Typography variant='body2' color='text.primary' px={2}>
          Or
        </Typography>
        <DividerLine />
      </OrDivider>
    </CardContainer>
  );
};

export default VoiceButtonCard;

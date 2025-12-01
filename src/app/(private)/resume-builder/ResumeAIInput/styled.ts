import { Stack } from '@mui/material';
import { styled } from '@mui/material/styles';

import bgAI from '@/assets/images/bg/Ellipse1.png';

export const MainContainer = styled(Stack)(() => ({
  width: '100%',
  height: '100%',
  backgroundImage: `url(${bgAI.src})`,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  padding: '1rem',
  backgroundRepeat: 'no-repeat',
  backgroundSize: 'cover',
  backgroundPosition: 'center center',
}));

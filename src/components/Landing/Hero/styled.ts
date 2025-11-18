import { Stack } from '@mui/material';
import { styled } from '@mui/material/styles';

import bgHero from '@/assets/images/bg/hero.png';

export const MainContainer = styled(Stack)(() => ({
  width: '100%',
  height: 'calc(100vh - 150px)',
  display: 'flex',
  alignItems: 'center',
  paddingBottom: '1rem',
  backgroundImage: `url(${bgHero.src})`,
  backgroundRepeat: 'no-repeat',
  backgroundSize: 'cover',
  backgroundPosition: 'center center',
}));

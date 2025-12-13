import { IconButton, Stack, Typography } from '@mui/material';

import { ThemeContainer } from '@/app/auth/login/styled';
import MoonIcon from '@/assets/images/icons/moon.svg';
import logo from '@/assets/images/logo/logo.png';
import { AppImage } from '@/components/AppImage';

const AuthHeader = () => {
  return (
    <Stack direction='row' justifyContent='space-between' alignItems='center'>
      <Stack direction='row' alignItems='center' gap={2}>
        <AppImage src={logo} width={24} height={34} />

        <Stack>
          <Typography variant='h4' fontWeight='700' color='text.primary'>
            Z-CV
          </Typography>

          <Typography variant='subtitle2' color='text.secondary'>
            AI Resume Maker
          </Typography>
        </Stack>
      </Stack>

      <ThemeContainer>
        <IconButton disabled color='inherit'>
          <MoonIcon />
        </IconButton>
      </ThemeContainer>
    </Stack>
  );
};

export default AuthHeader;

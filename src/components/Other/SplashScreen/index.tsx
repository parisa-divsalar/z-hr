'use client';

import { FunctionComponent, useEffect, useState } from 'react';

import { Box, keyframes } from '@mui/material';
import { styled } from '@mui/material/styles';

import logo from '@/assets/images/logo/logo.png';
import { AppImage } from '@/components/AppImage';
import { useInstallApp } from '@/store/common';
import isInStandaloneMode from '@/utils/isInstalledWebApp';

const fadeIn = keyframes`
    0% {
        opacity: 0;
    }
    100% {
        opacity: 1;
    }
`;

const zoomOutBlur = keyframes`
    0% {
        opacity: 1;
        transform: scale(1);
        filter: blur(0px);
    }
    100% {
        opacity: 0;
        transform: scale(2);
        filter: blur(10px);
    }
`;

const SplashContainer = styled(Box)(() => ({
  position: 'fixed',
  top: 0,
  left: 0,
  width: '100vw',
  height: '100vh',
  backgroundColor: '#1809E2',
  backgroundSize: 'cover',
  backgroundPosition: 'center',
  backgroundRepeat: 'no-repeat',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  zIndex: 999,
  overflow: 'hidden',
}));

const LogoContainer = styled(Box)(() => ({
  position: 'relative',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: '100%',
  height: '100%',
}));

const LogoImage = styled(AppImage)({
  objectFit: 'contain',
  padding: '20px',
  transition: 'all 0.3s ease',
  animation: `${fadeIn} 1s ease-out forwards`,
  '&:hover': {
    transform: 'scale(1.1)',
  },
  filter: 'brightness(100)',
});

const SplashScreen: FunctionComponent = () => {
  const [isExiting, setIsExiting] = useState(false);

  const { setOpen } = useInstallApp();

  const isInstalledApp = typeof window !== 'undefined' ? isInStandaloneMode() : null;

  useEffect(() => {
    document.body.style.overflow = 'hidden';

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsExiting(true);
      if (!isInstalledApp && !localStorage.getItem('installApp')) setOpen(true);
    }, 2_000);
    return () => clearTimeout(timer);
  }, []);

  if (isExiting) return null;

  return (
    <SplashContainer sx={{ animation: isExiting ? `${zoomOutBlur} 0.8s ease-in-out forwards` : 'none' }}>
      <LogoContainer>
        <LogoImage src={logo} alt='Logo' width={122} height={162} />
      </LogoContainer>
    </SplashContainer>
  );
};

export default SplashScreen;

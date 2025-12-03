'use client';
import React, { useEffect, useState } from 'react';

import AppleIcon from '@mui/icons-material/Apple';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import VisibilityOffRoundedIcon from '@mui/icons-material/VisibilityOffRounded';
import VisibilityRoundedIcon from '@mui/icons-material/VisibilityRounded';
import { IconButton, Stack, Typography } from '@mui/material';
import { useRouter } from 'next/navigation';

import { MainContainer, MainContent, FirstChild, LogoCard } from '@/app/(public)/login/styled';
import CheckCircleIcon from '@/assets/images/icons/check-circle.svg';
import InfoIcon from '@/assets/images/icons/info.svg';
import AdAuth from '@/components/Auth/AdAuth';
import AuthHeader from '@/components/Auth/Header';
import { DividerLine, OrDivider } from '@/components/Landing/AI/VoiceBox/styled';
import MuiButton from '@/components/UI/MuiButton';
import MuiInput from '@/components/UI/MuiInput';
import { PublicRoutes } from '@/config/routes';
import { checkPasswordLength, validateSpecialChar } from '@/utils/validation';

const RegisterPage = () => {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [typeInput, setTypeInput] = useState<'password' | 'text'>('password');
  const [disabled, setDisabled] = useState<boolean>(true);

  const [loading, setLoading] = useState<boolean>(false);

  const onSubmit = () => {
    setLoading(true);

    setTimeout(() => {
      setLoading(false);

      router.replace(PublicRoutes.congrats);
    }, 3000);
  };

  useEffect(() => {
    if (email !== '' && password.length > 4 && !validateSpecialChar(password) && checkPasswordLength(password))
      setDisabled(false);
    else setDisabled(true);
  }, [password, email]);

  return (
    <MainContainer>
      <MainContent direction='row'>
        <FirstChild>
          <Stack width='100%'>
            <AuthHeader />

            <Typography color='secondary.main' variant='h5' mt={3}>
              Sign up
            </Typography>
            <Typography color='grey.300' variant='subtitle2'>
              Start with 50 free credits.
            </Typography>
            <Typography color='secondary.main' variant='subtitle1'>
              Enter your email to register Z-CV
            </Typography>

            <Stack spacing={1} mt={3}>
              <MuiInput value={email} onChange={setEmail} label='Email' placeholder='Your email...' />

              <MuiInput
                value={password}
                onChange={setPassword}
                type={typeInput}
                label='Password'
                endIcon={
                  typeInput === 'password' ? (
                    <IconButton onClick={() => setTypeInput('text')}>
                      <VisibilityRoundedIcon color='primary' fontSize='small' />
                    </IconButton>
                  ) : (
                    <IconButton onClick={() => setTypeInput('password')}>
                      <VisibilityOffRoundedIcon color='primary' fontSize='small' />
                    </IconButton>
                  )
                }
                placeholder='Your password...'
              />
            </Stack>

            <Stack direction='row' alignItems='center' gap={0.5} mt={1}>
              {checkPasswordLength(password) ? <CheckCircleIcon /> : <InfoIcon color='#66666E' />}

              <Typography color={checkPasswordLength(password) ? 'success.main' : 'grey.300'} variant='subtitle2'>
                Must be at least 8 characters
              </Typography>
            </Stack>

            <Stack direction='row' alignItems='center' gap={0.5} mb={2}>
              {!validateSpecialChar(password) ? <CheckCircleIcon /> : <InfoIcon color='#66666E' />}
              <Typography color={!validateSpecialChar(password) ? 'success.main' : 'grey.300'} variant='subtitle2'>
                Must contain one special character
              </Typography>
            </Stack>

            <MuiButton color='secondary' fullWidth onClick={onSubmit} disabled={disabled} loading={loading}>
              Sign up
            </MuiButton>

            <Stack alignItems='center'>
              <OrDivider sx={{ marginTop: '0.75rem' }}>
                <DividerLine />
                <Typography variant='body2' color='text.primary' bgcolor='transparent' mx={1}>
                  Or
                </Typography>
                <DividerLine />
              </OrDivider>
            </Stack>

            <Stack direction='row' justifyContent='center' gap={2}>
              <LogoCard>
                <LinkedInIcon sx={{ fontSize: 24, color: '#0A66C2' }} />
              </LogoCard>

              <LogoCard>
                <AppleIcon sx={{ fontSize: 24 }} />
              </LogoCard>

              <LogoCard>
                <LinkedInIcon sx={{ fontSize: 24, color: '#0A66C2' }} />
              </LogoCard>
            </Stack>

            <Typography variant='subtitle1' color='secondary.main' mt={1.5}>
              By signing up to Z-CV, you agree to{' '}
              <Typography component='span' sx={{ textDecoration: 'underline', cursor: 'pointer' }}>
                our Services Agreement and Data Agreement.
              </Typography>
            </Typography>
          </Stack>

          <Stack direction='row' justifyContent='space-between' alignItems='center' mt={2}>
            <Typography color='grey.300' variant='subtitle1'>
              Already have an account?
            </Typography>

            <MuiButton color='secondary' variant='text' onClick={() => router.push(PublicRoutes.login)}>
              Sign in
            </MuiButton>
          </Stack>
        </FirstChild>
        <AdAuth />
      </MainContent>
    </MainContainer>
  );
};

export default RegisterPage;

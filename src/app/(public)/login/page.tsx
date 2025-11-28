'use client';
import React, { useState } from 'react';

import AppleIcon from '@mui/icons-material/Apple';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import VisibilityOffRoundedIcon from '@mui/icons-material/VisibilityOffRounded';
import VisibilityRoundedIcon from '@mui/icons-material/VisibilityRounded';
import { IconButton, Stack, Typography } from '@mui/material';
import { useRouter } from 'next/navigation';

import { MainContainer, MainContent, FirstChild, LogoCard } from '@/app/(public)/login/styled';
import { verifyCode } from '@/app/api/auth';
import Advertisement from '@/components/Auth/Advertisement';
import AuthHeader from '@/components/Auth/Header';
import { DividerLine, OrDivider } from '@/components/Landing/AI/VoiceBox/styled';
import MuiButton from '@/components/UI/MuiButton';
import MuiInput from '@/components/UI/MuiInput';
import { PrivateRoutes } from '@/config/routes';
import { useAuthStore } from '@/store/auth';

const LoginPage = () => {
  const router = useRouter();
  const { loginStart, loginFailure, loginSuccess } = useAuthStore();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [typeInput, setTypeInput] = useState<'password' | 'text'>('password');

  const [loading, setLoading] = useState<boolean>(false);

  const onSubmit = () => {
    loginStart();
    setLoading(true);

    verifyCode()
      .then((res: any) => {
        loginSuccess(res.accessToken, res.refreshToken);
        router.replace(PrivateRoutes.dashboard);
      })
      .catch(() => loginFailure())
      .finally(() => setLoading(false));
  };
  return (
    <MainContainer>
      <MainContent direction='row'>
        <FirstChild>
          <AuthHeader />
          <Typography color='secondary.main' variant='h5' mt={4}>
            Sign in
          </Typography>
          <Typography color='grey.300' variant='subtitle2'>
            Login to your account
          </Typography>
          <Typography color='secondary.main' variant='subtitle1'>
            Enter your email and password
          </Typography>

          <Stack spacing={1} mt={4}>
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

          <Stack mt={4} spacing={1}>
            <MuiButton color='secondary' fullWidth onClick={onSubmit} disabled={!email || !password} loading={loading}>
              Login
            </MuiButton>

            <MuiButton color='secondary' variant='text' fullWidth>
              Forget password
            </MuiButton>
          </Stack>

          <Stack alignItems='center'>
            <OrDivider sx={{ marginTop: '0.75rem' }}>
              <DividerLine />
              <Typography variant='body2' color='text.primary' bgcolor='transparent' mx={1}>
                Or
              </Typography>
              <DividerLine />
            </OrDivider>
          </Stack>

          <Stack direction='row' justifyContent='center' gap={2} mt={2}>
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

          <Stack direction='row' justifyContent='space-between' alignItems='center' mt={4}>
            <Typography color='grey.300' variant='subtitle1'>
              Already have an account?
            </Typography>

            <MuiButton color='secondary' variant='text'>
              Sign in
            </MuiButton>
          </Stack>
        </FirstChild>
        <Advertisement />
      </MainContent>
    </MainContainer>
  );
};

export default LoginPage;

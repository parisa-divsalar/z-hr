'use client';
import React, { useState } from 'react';

import { Stack, Typography } from '@mui/material';
import { useRouter } from 'next/navigation';

import { FirstChild, MainContainer, MainContent } from '@/app/auth/login/styled';
import AdAuth from '@/components/Auth/AdAuth';
import AuthHeader from '@/components/Auth/Header';
import MuiButton from '@/components/UI/MuiButton';
import MuiInput from '@/components/UI/MuiInput';
import { PublicRoutes } from '@/config/routes';

const ResetPasswordPage = () => {
  const router = useRouter();
  const [email, setEmail] = useState('');

  const onSubmit = () => {
    router.push(PublicRoutes.newPassword);
  };

  return (
    <MainContainer>
      <MainContent direction='row'>
        <FirstChild>
          <Stack width='100%'>
            <AuthHeader />
            <Typography color='secondary.main' variant='h5' mt={4}>
              Forget password
            </Typography>
            <Typography color='grey.300' variant='subtitle2'>
              Reset your password
            </Typography>
            <Typography color='secondary.main' variant='subtitle1'>
              Enter your email
            </Typography>

            <Stack spacing={1} mt={4}>
              <MuiInput value={email} onChange={setEmail} label='Email' placeholder='Email@email.com' />
            </Stack>

            <Stack mt={4} spacing={1}>
              <MuiButton color='secondary' fullWidth onClick={onSubmit} disabled={!email}>
                Reset password
              </MuiButton>
            </Stack>
          </Stack>

          <Stack direction='row' justifyContent='space-between' alignItems='center' mt={4}>
            <Typography color='grey.300' variant='subtitle1'>
              Already have an account?
            </Typography>

            <MuiButton color='secondary' variant='text'>
              Support
            </MuiButton>
          </Stack>
        </FirstChild>

        <AdAuth />
      </MainContent>
    </MainContainer>
  );
};

export default ResetPasswordPage;

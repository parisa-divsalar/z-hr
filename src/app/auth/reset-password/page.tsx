'use client';
import React, { useEffect, useRef, useState } from 'react';

import { Stack, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';
import { useRouter } from 'next/navigation';

import { FirstChild, MainContainer, MainContent } from '@/app/auth/login/styled';
import AdAuth from '@/components/Auth/AdAuth';
import AuthHeader from '@/components/Auth/Header';
import MuiAlert, { AlertWrapperProps } from '@/components/UI/MuiAlert';
import MuiButton from '@/components/UI/MuiButton';
import MuiInput from '@/components/UI/MuiInput';
import { PublicRoutes } from '@/config/routes';
import { apiClientClient } from '@/services/api-client';

type ToastSeverity = AlertWrapperProps['severity'];

type ToastInfo = {
  id: number;
  message: string;
  severity: ToastSeverity;
};

const ToastContainer = styled(Stack)(({ theme }) => ({
  width: '100%',
  maxWidth: '350px',
  marginTop: theme.spacing(2),
}));

const getErrorMessage = (error: any): string => {
  const maybe =
    error?.response?.data?.error?.message ??
    error?.response?.data?.message ??
    error?.message ??
    error?.toString?.();

  if (typeof maybe === 'string' && maybe.trim()) return maybe;
  return 'Something went wrong';
};

const ResetPasswordPage = () => {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [toastInfo, setToastInfo] = useState<ToastInfo | null>(null);
  const toastTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const showToast = (message: string, severity: ToastSeverity = 'error') => {
    if (toastTimerRef.current) clearTimeout(toastTimerRef.current);

    const id = Date.now();
    setToastInfo({ id, message, severity });

    toastTimerRef.current = setTimeout(() => {
      setToastInfo((current) => (current?.id === id ? null : current));
      toastTimerRef.current = null;
    }, 4000);
  };

  useEffect(() => {
    return () => {
      if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
    };
  }, []);

  const onSubmit = async () => {
    setIsLoading(true);

    const body = {
      email,
      username: email,
    };

    try {
      await apiClientClient.post('auth/forgot-password', body);
      setIsLoading(false);
      router.push(PublicRoutes.login);
    } catch (error: any) {
      console.error('Forgot password Error', error);
      showToast(getErrorMessage(error), 'error');
      setIsLoading(false);
    }
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

            {toastInfo && (
              <ToastContainer>
                <MuiAlert message={toastInfo.message} severity={toastInfo.severity} />
              </ToastContainer>
            )}

            <Stack spacing={1} mt={4}>
              <MuiInput value={email} onChange={setEmail} label='Email' placeholder='Email@email.com' />
            </Stack>

            <Stack mt={4} spacing={1}>
              <MuiButton color='secondary' fullWidth onClick={onSubmit} disabled={!email || isLoading} loading={isLoading}>
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

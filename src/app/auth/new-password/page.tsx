'use client';
import React, { useEffect, useRef, useState } from 'react';

import VisibilityOffRoundedIcon from '@mui/icons-material/VisibilityOffRounded';
import VisibilityRoundedIcon from '@mui/icons-material/VisibilityRounded';
import { IconButton, Stack, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';
import { useRouter, useSearchParams } from 'next/navigation';

import { MainContainer, MainContent, FirstChild } from '@/app/auth/login/styled';
import CheckCircleIcon from '@/assets/images/icons/check-circle.svg';
import InfoIcon from '@/assets/images/icons/info.svg';
import AdAuth from '@/components/Auth/AdAuth';
import AuthHeader from '@/components/Auth/Header';
import MuiAlert, { AlertWrapperProps } from '@/components/UI/MuiAlert';
import MuiButton from '@/components/UI/MuiButton';
import MuiInput from '@/components/UI/MuiInput';
import { PrivateRoutes, PublicRoutes } from '@/config/routes';
import { updatePassword } from '@/services/auth/update-password';
import { checkPasswordLength, validateSpecialChar } from '@/utils/validation';

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

const NewPasswordPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [code, setCode] = useState('');
  const [password, setPassword] = useState('');
  const [repeatPassword, setRepeatPassword] = useState('');
  const [typeInput, setTypeInput] = useState<'password' | 'text'>('password');
  const [disabled, setDisabled] = useState<boolean>(true);

  const [loading, setLoading] = useState<boolean>(false);
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
    setLoading(true);

    try {
      const userIdFromQuery = searchParams.get('userId');
      const userIdFromSession =
        typeof window !== 'undefined' ? sessionStorage.getItem('resetPasswordUserId') : null;
      const userId = userIdFromQuery || userIdFromSession;

      if (!userId) {
        showToast('Missing userId. Please restart the reset password flow.', 'warning');
        setLoading(false);
        return;
      }

      if (!code || !code.trim()) {
        showToast('Please enter the code sent to your email.', 'warning');
        setLoading(false);
        return;
      }

      await updatePassword({
        userId,
        code: code.trim(),
        password,
        confirmPassword: repeatPassword,
      });

      sessionStorage.removeItem('resetPasswordUserId');
      router.replace(PublicRoutes.login);
    } catch (error: any) {
      console.error('Update password Error', error);
      showToast(getErrorMessage(error), 'error');
      setLoading(false);
    }
  };

  useEffect(() => {
    if (
      !!code.trim() &&
      password.length > 4 &&
      !validateSpecialChar(password) &&
      checkPasswordLength(password) &&
      password === repeatPassword
    )
      setDisabled(false);
    else setDisabled(true);
  }, [code, password, repeatPassword]);

  return (
    <MainContainer>
      <MainContent direction='row'>
        <FirstChild>
          <Stack width='100%'>
            <AuthHeader />
            <Typography color='secondary.main' variant='h5' mt={4}>
              New password
            </Typography>
            <Typography color='grey.300' variant='subtitle2'>
              Enter your new password and save that in your mind
            </Typography>
            <Typography color='secondary.main' variant='subtitle1'>
              Enter your new password
            </Typography>

            {toastInfo && (
              <ToastContainer>
                <MuiAlert message={toastInfo.message} severity={toastInfo.severity} />
              </ToastContainer>
            )}

            <Stack spacing={1} mt={4}>
              <MuiInput
                value={code}
                onChange={setCode}
                label='Code'
                placeholder='Enter the code from your email'
              />

              <MuiInput
                value={password}
                onChange={setPassword}
                type={typeInput}
                label='Password'
                placeholder='Enter password'
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
              />

              <MuiInput
                value={repeatPassword}
                onChange={setRepeatPassword}
                type={typeInput}
                label='Re-enter Password'
                placeholder='Re-enter password'
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
              />
            </Stack>

            <Stack direction='row' alignItems='center' gap={0.5} mt={2}>
              {checkPasswordLength(password) ? <CheckCircleIcon /> : <InfoIcon color='#66666E' />}

              <Typography color={checkPasswordLength(password) ? 'success.main' : 'grey.300'} variant='subtitle2'>
                Must be at least 8 characters
              </Typography>
            </Stack>

            <Stack direction='row' alignItems='center' gap={0.5}>
              {!validateSpecialChar(password) ? <CheckCircleIcon /> : <InfoIcon color='#66666E' />}
              <Typography color={!validateSpecialChar(password) ? 'success.main' : 'grey.300'} variant='subtitle2'>
                Must contain one special character
              </Typography>
            </Stack>

            <Stack mt={4} spacing={1}>
              <MuiButton
                color='secondary'
                fullWidth
                onClick={onSubmit}
                disabled={disabled || loading}
                loading={loading}
              >
                Submit
              </MuiButton>
            </Stack>
          </Stack>

          <Stack direction='row' justifyContent='space-between' alignItems='center' mt={4}>
            <Typography color='grey.300' variant='subtitle1'>
              Already have an account?
            </Typography>

            <MuiButton color='secondary' variant='text' onClick={() => router.push(PrivateRoutes.support)}>
              Support
            </MuiButton>
          </Stack>
        </FirstChild>

        <AdAuth />
      </MainContent>
    </MainContainer>
  );
};

export default NewPasswordPage;

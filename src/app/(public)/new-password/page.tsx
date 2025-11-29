'use client';
import React, { useEffect, useState } from 'react';

import VisibilityOffRoundedIcon from '@mui/icons-material/VisibilityOffRounded';
import VisibilityRoundedIcon from '@mui/icons-material/VisibilityRounded';
import { IconButton, Stack, Typography } from '@mui/material';
import { useRouter } from 'next/navigation';

import { MainContainer, MainContent, FirstChild } from '@/app/(public)/login/styled';
import CheckCircleIcon from '@/assets/images/icons/check-circle.svg';
import InfoIcon from '@/assets/images/icons/info.svg';
import AdAuth from '@/components/Auth/AdAuth';
import AuthHeader from '@/components/Auth/Header';
import MuiButton from '@/components/UI/MuiButton';
import MuiInput from '@/components/UI/MuiInput';
import { PrivateRoutes } from '@/config/routes';
import { checkPasswordLength, validateSpecialChar } from '@/utils/validation';

const NewPasswordPage = () => {
  const router = useRouter();
  const [password, setPassword] = useState('');
  const [repeatPassword, setRepeatPassword] = useState('');
  const [typeInput, setTypeInput] = useState<'password' | 'text'>('password');
  const [disabled, setDisabled] = useState<boolean>(true);

  const [loading, setLoading] = useState<boolean>(false);

  const onSubmit = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      router.replace(PrivateRoutes.dashboard);
    }, 3000);
  };

  useEffect(() => {
    if (
      password.length > 4 &&
      !validateSpecialChar(password) &&
      checkPasswordLength(password) &&
      password === repeatPassword
    )
      setDisabled(false);
    else setDisabled(true);
  }, [password, repeatPassword]);

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

            <Stack spacing={1} mt={4}>
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
              <MuiButton color='secondary' fullWidth onClick={onSubmit} disabled={disabled} loading={loading}>
                Submit
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

export default NewPasswordPage;

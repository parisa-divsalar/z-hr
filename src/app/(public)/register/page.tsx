'use client';

import * as yup from 'yup';
import AdAuth from '@/components/Auth/AdAuth';
import MuiInput from '@/components/UI/MuiInput';
import InfoIcon from '@/assets/images/icons/info.svg';
import MuiButton from '@/components/UI/MuiButton';
import AppleIcon from '@mui/icons-material/Apple';
import AuthHeader from '@/components/Auth/Header';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import CheckCircleIcon from '@/assets/images/icons/check-circle.svg';
import VisibilityRoundedIcon from '@mui/icons-material/VisibilityRounded';
import VisibilityOffRoundedIcon from '@mui/icons-material/VisibilityOffRounded';
import { useState } from 'react';
import { useFormik } from 'formik';
import { useRouter } from 'next/navigation';
import { PublicRoutes } from '@/config/routes';
import { apiClientClient } from '@/services/api-client';
import { DividerLine, OrDivider } from '@/components/Landing/Wizard/Step1/AI/VoiceBox/styled';
import { IconButton, Stack, Typography } from '@mui/material';
import { checkPasswordLength, validateSpecialChar } from '@/utils/validation';
import { MainContainer, MainContent, FirstChild, LogoCard } from '@/app/(public)/login/styled';

const RegisterPage = () => {
  const router = useRouter();

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [typeInput, setTypeInput] = useState<'password' | 'text'>('password');

  const validationSchema = yup.object({
    email: yup.string().required('Email is required!'),
    password: yup.string().required('Password is required!'),
  });

  const formik = useFormik({
    validationSchema: validationSchema,
    initialValues: {
      firstName: '',
      lastName: '',
      username: '',
      password: '',
      email: '',
    },

    onSubmit: async (values) => {
      setIsLoading(true);

      const body = {
        email: values.email,
        lastName: 'lastName',
        firstName: 'lastName',
        username: values.email,
        password: values.password,
      };

      try {
        await apiClientClient.post('auth/register', body);
        router.push('/login');
      } catch (error: any) {
        setIsLoading(false);
        console.error('Register Error', error);
      }
    },
  });

  const isDisabled = !formik.isValid || isLoading || formik.values === formik.initialValues;

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
              <MuiInput
                label='Email'
                placeholder='Your email...'
                value={formik.values.email}
                onChange={(event) => formik.setFieldValue('email', event)}
              />

              <MuiInput
                label='Password'
                type={typeInput}
                placeholder='Your password...'
                value={formik.values.password}
                onChange={(event) => formik.setFieldValue('password', event)}
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

            <Stack direction='row' alignItems='center' gap={0.5} mt={1}>
              {checkPasswordLength(formik.values.password) ? <CheckCircleIcon /> : <InfoIcon color='#66666E' />}

              <Typography
                color={checkPasswordLength(formik.values.password) ? 'success.main' : 'grey.300'}
                variant='subtitle2'
              >
                Must be at least 8 characters
              </Typography>
            </Stack>

            <Stack direction='row' alignItems='center' gap={0.5} mb={2}>
              {!validateSpecialChar(formik.values.password) ? <CheckCircleIcon /> : <InfoIcon color='#66666E' />}
              <Typography
                color={!validateSpecialChar(formik.values.password) ? 'success.main' : 'grey.300'}
                variant='subtitle2'
              >
                Must contain one special character
              </Typography>
            </Stack>

            <MuiButton
              fullWidth
              color='secondary'
              loading={isLoading}
              disabled={isDisabled}
              onClick={() => formik.handleSubmit()}
            >
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

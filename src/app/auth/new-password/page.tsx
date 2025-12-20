'use client';

import { Stack, Typography } from '@mui/material';
import { useRouter, useSearchParams } from 'next/navigation';

import { MainContainer, MainContent, FirstChild } from '@/app/auth/login/styled';
import AdAuth from '@/components/Auth/AdAuth';
import AuthHeader from '@/components/Auth/Header';
import NewPasswordForm, { NewPasswordFormValues } from '@/components/Auth/NewPasswordForm';
import MuiButton from '@/components/UI/MuiButton';
import { PrivateRoutes, PublicRoutes } from '@/config/routes';
import { updatePassword } from '@/services/auth/update-password';

const NewPasswordPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleSubmit = async ({ code, password, repeatPassword }: NewPasswordFormValues) => {
    const userIdFromQuery = searchParams.get('userId');
    const userIdFromSession =
      typeof window !== 'undefined' ? sessionStorage.getItem('resetPasswordUserId') : null;
    const userId = userIdFromQuery || userIdFromSession;

    if (!userId) {
      throw new Error('Missing userId. Please restart the reset password flow.');
    }

    if (!code) {
      throw new Error('Please enter the code sent to your email.');
    }

    await updatePassword({
      userId,
      code,
      password,
      confirmPassword: repeatPassword,
    });

    if (typeof window !== 'undefined') {
      sessionStorage.removeItem('resetPasswordUserId');
    }

    router.replace(PublicRoutes.login);
  };

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

            <NewPasswordForm onSubmit={handleSubmit} />
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

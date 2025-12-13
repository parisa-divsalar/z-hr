'use client';

import { useState } from 'react';

import AppleIcon from '@mui/icons-material/Apple';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import VisibilityOffRoundedIcon from '@mui/icons-material/VisibilityOffRounded';
import VisibilityRoundedIcon from '@mui/icons-material/VisibilityRounded';
import { IconButton, Stack, Typography } from '@mui/material';
import { useFormik } from 'formik';
import { useRouter } from 'next/navigation';
import * as yup from 'yup';

import { MainContainer, MainContent, FirstChild, LogoCard } from '@/app/auth/login/styled';
import AdAuth from '@/components/Auth/AdAuth';
import AuthHeader from '@/components/Auth/Header';
import { DividerLine, OrDivider } from '@/components/Landing/Wizard/Step1/AI/VoiceBox/styled';
import MuiButton from '@/components/UI/MuiButton';
import MuiInput from '@/components/UI/MuiInput';
import { PublicRoutes } from '@/config/routes';
import { apiClientClient } from '@/services/api-client';
import { useAuthStore } from '@/store/auth';

const LoginPage = () => {
    const router = useRouter();

    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [typeInput, setTypeInput] = useState<'password' | 'text'>('password');

    const validationSchema = yup.object({
        username: yup.string().required('Email is required!'),
        password: yup.string().required('Password is required!'),
    });

    const formik = useFormik({
        validationSchema: validationSchema,
        initialValues: {
            username: '',
            password: '',
        },

        onSubmit: async (values) => {
            setIsLoading(true);

            try {
                const { data } = await apiClientClient.post('auth/login', values);
                const accessToken = data?.data.userId;
                useAuthStore.getState().loginSuccess(accessToken, '');
                router.push('/');
            } catch (error: any) {
                setIsLoading(false);
                console.error('login Error', error);
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
                            Sign in
                        </Typography>
                        <Typography color='grey.300' variant='subtitle2'>
                            Login to your account
                        </Typography>
                        <Typography color='secondary.main' variant='subtitle1'>
                            Enter your email and password
                        </Typography>

                        <Stack spacing={1} mt={3}>
                            <MuiInput
                                label='Email'
                                placeholder='Your email...'
                                value={formik.values.username}
                                onChange={(event) => formik.setFieldValue('username', event)}
                            />

                            <MuiInput
                                value={formik.values.password}
                                onChange={(event) => formik.setFieldValue('password', event)}
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
                            <MuiButton
                                fullWidth
                                color='secondary'
                                loading={isLoading}
                                disabled={isDisabled}
                                onClick={() => formik.handleSubmit()}
                            >
                                Login
                            </MuiButton>

                            <MuiButton
                                color='secondary'
                                variant='text'
                                fullWidth
                                onClick={() => router.push(PublicRoutes.forgetPassword)}
                            >
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
                    </Stack>

                    <Stack direction='row' justifyContent='space-between' alignItems='center' mt={4}>
                        <Typography color='grey.300' variant='subtitle1'>
                            Already have an account?
                        </Typography>

                        <MuiButton color='secondary' variant='text' onClick={() => router.push(PublicRoutes.register)}>
                            Sign up
                        </MuiButton>
                    </Stack>
                </FirstChild>

                <AdAuth />
            </MainContent>
        </MainContainer>
    );
};

export default LoginPage;

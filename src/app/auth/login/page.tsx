'use client';

import { useEffect, useRef, useState } from 'react';

import AppleIcon from '@mui/icons-material/Apple';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import VisibilityOffRoundedIcon from '@mui/icons-material/VisibilityOffRounded';
import VisibilityRoundedIcon from '@mui/icons-material/VisibilityRounded';
import { IconButton, Stack, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';
import { useFormik } from 'formik';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { z } from 'zod';

import { MainContainer, MainContent, FirstChild, LogoCard } from '@/app/auth/login/styled';
import AdAuth from '@/components/Auth/AdAuth';
import AuthHeader from '@/components/Auth/Header';
import { DividerLine, OrDivider } from '@/components/Landing/Wizard/Step1/AI/VoiceBox/styled';
import MuiAlert, { AlertWrapperProps } from '@/components/UI/MuiAlert';
import MuiButton from '@/components/UI/MuiButton';
import MuiInput from '@/components/UI/MuiInput';
import { PublicRoutes } from '@/config/routes';
import { apiClientClient } from '@/services/api-client';
import { useAuthStore } from '@/store/auth';

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
        error?.response?.data?.error ??
        error?.response?.data?.message ??
        error?.message ??
        error?.toString?.();

    if (typeof maybe === 'string' && maybe.trim()) return maybe;
    return 'Something went wrong';
};

const LoginPage = () => {
    const router = useRouter();

    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [typeInput, setTypeInput] = useState<'password' | 'text'>('password');
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

    const loginSchema = z.object({
        username: z.string().min(1, 'Email is required!').email('Please enter a valid email address'),
        password: z.string().min(1, 'Password is required!').min(7, 'Password must be at least 7 characters'),
    });

    const formik = useFormik({
        initialValues: {
            username: '',
            password: '',
        },
        validateOnMount: true,
        validate: (values) => {
            const parsed = loginSchema.safeParse(values);
            if (parsed.success) return {};

            const errors: Record<string, string> = {};
            for (const issue of parsed.error.issues) {
                const field = issue.path?.[0];
                if (typeof field === 'string' && !errors[field]) errors[field] = issue.message;
            }
            return errors;
        },

        onSubmit: async (values) => {
            setIsLoading(true);

            try {
                const { data } = await apiClientClient.post('auth/login', values);
                const accessToken = data?.data.userId;
                useAuthStore.getState().loginSuccess(accessToken, '');
                router.push('/landing');
            } catch (error: any) {
                console.error('login Error', error);
                showToast(getErrorMessage(error), 'error');
            } finally {
                setIsLoading(false);
            }
        },
    });

    const isDisabled = !formik.isValid || !formik.dirty || isLoading;
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

                        {toastInfo && (
                            <ToastContainer>
                                <MuiAlert message={toastInfo.message} severity={toastInfo.severity} />
                            </ToastContainer>
                        )}

                        <Stack spacing={1} mt={3}>
                            <MuiInput
                                label='Email'
                                placeholder='Your email...'
                                value={formik.values.username}
                                onChange={(event) => formik.setFieldValue('username', event)}
                                onBlur={() => formik.setFieldTouched('username', true)}
                                type='email'
                                error={Boolean(formik.touched.username && formik.errors.username)}
                                helperText={
                                    formik.touched.username && formik.errors.username
                                        ? String(formik.errors.username)
                                        : ''
                                }
                            />

                            <MuiInput
                                value={formik.values.password}
                                onChange={(event) => formik.setFieldValue('password', event)}
                                onBlur={() => formik.setFieldTouched('password', true)}
                                type={typeInput}
                                label='Password'
                                error={Boolean(formik.touched.password && formik.errors.password)}
                                helperText={
                                    formik.touched.password && formik.errors.password
                                        ? String(formik.errors.password)
                                        : ''
                                }
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

                    <Stack
                        direction='row'
                        justifyContent='space-between'
                        alignItems='center'
                        mt={4}
                        sx={{
                            flexWrap: { xs: 'wrap', sm: 'nowrap' },
                            rowGap: { xs: 1, sm: 0 },
                            columnGap: { xs: 2, sm: 0 },
                        }}
                    >
                        <Typography color='grey.300' variant='subtitle1'>
                            Already have an account?
                        </Typography>

                        <MuiButton
                            component={Link}
                            href={PublicRoutes.register}
                            color='secondary'
                            variant='text'
                            sx={{ textDecoration: 'none' }}
                        >
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

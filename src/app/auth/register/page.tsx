'use client';

import { useEffect, useRef, useState } from 'react';

import AppleIcon from '@mui/icons-material/Apple';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import VisibilityOffRoundedIcon from '@mui/icons-material/VisibilityOffRounded';
import VisibilityRoundedIcon from '@mui/icons-material/VisibilityRounded';
import { IconButton, Stack, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';
import { useFormik } from 'formik';
import { useRouter } from 'next/navigation';
import { z } from 'zod';

import { MainContainer, MainContent, FirstChild, LogoCard } from '@/app/auth/login/styled';
import CheckCircleIcon from '@/assets/images/icons/check-circle.svg';
import InfoIcon from '@/assets/images/icons/info.svg';
import AdAuth from '@/components/Auth/AdAuth';
import AuthHeader from '@/components/Auth/Header';
import { DividerLine, OrDivider } from '@/components/Landing/Wizard/Step1/AI/VoiceBox/styled';
import MuiAlert, { AlertWrapperProps } from '@/components/UI/MuiAlert';
import MuiButton from '@/components/UI/MuiButton';
import MuiInput from '@/components/UI/MuiInput';
import { PublicRoutes } from '@/config/routes';
import { apiClientClient } from '@/services/api-client';
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
        error?.response?.data?.error ??
        error?.response?.data?.message ??
        error?.message ??
        error?.toString?.();

    if (typeof maybe === 'string' && maybe.trim()) return maybe;
    return 'Something went wrong';
};

const RegisterPage = () => {
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

    const registerSchema = z.object({
        email: z.string().min(1, 'Email is required!').email('Please enter a valid email address'),
        password: z
            .string()
            .min(1, 'Password is required!')
            .min(8, 'Password must be at least 8 characters')
            .regex(/[!@#$%^&*_]/, 'Password must contain at least one special character'),
    });

    const formik = useFormik({
        initialValues: {
            firstName: '',
            lastName: '',
            username: '',
            password: '',
            email: '',
        },
        validateOnMount: true,
        validate: (values) => {
            const parsed = registerSchema.safeParse({
                email: values.email,
                password: values.password,
            });
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

            const body = {
                email: values.email,
                lastName: 'lastName',
                firstName: 'lastName',
                username: values.email,
                password: values.password,
            };

            try {
                await apiClientClient.post('auth/register', body);
                router.push('/auth/login');
            } catch (error: any) {
                console.error('Register Error', error);
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
                <FirstChild sx={{ justifyContent: 'flex-start' }}>
                    <Stack width='100%'>
                        <AuthHeader />

                        <Typography color='secondary.main' variant='h5' mt={2}>
                            Sign up
                        </Typography>
                        <Typography color='grey.300' variant='subtitle2'>
                            Start with 50 free credits.
                        </Typography>
                        <Typography color='secondary.main' variant='subtitle1'>
                            Enter your email to register Z-CV
                        </Typography>

                        {toastInfo && (
                            <ToastContainer>
                                <MuiAlert message={toastInfo.message} severity={toastInfo.severity} />
                            </ToastContainer>
                        )}

                        <Stack spacing={1} mt={2}>
                            <MuiInput
                                label='Email'
                                placeholder='Your email...'
                                value={formik.values.email}
                                onChange={(event) => formik.setFieldValue('email', event)}
                                onBlur={() => formik.setFieldTouched('email', true)}
                                type='email'
                                error={Boolean(formik.touched.email && formik.errors.email)}
                                helperText={
                                    formik.touched.email && formik.errors.email ? String(formik.errors.email) : ''
                                }
                            />

                            <MuiInput
                                label='Password'
                                type={typeInput}
                                placeholder='Your password...'
                                value={formik.values.password}
                                onChange={(event) => formik.setFieldValue('password', event)}
                                onBlur={() => formik.setFieldTouched('password', true)}
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
                            />
                        </Stack>

                        <Stack direction='row' alignItems='center' gap={0.5} mt={1}>
                            {checkPasswordLength(formik.values.password) ? (
                                <CheckCircleIcon />
                            ) : (
                                <InfoIcon color='#66666E' />
                            )}

                            <Typography
                                color={checkPasswordLength(formik.values.password) ? 'success.main' : 'grey.300'}
                                variant='subtitle2'
                            >
                                Must be at least 8 characters
                            </Typography>
                        </Stack>

                        <Stack direction='row' alignItems='center' gap={0.5} mb={2}>
                            {!validateSpecialChar(formik.values.password) ? (
                                <CheckCircleIcon />
                            ) : (
                                <InfoIcon color='#66666E' />
                            )}
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

                        <Stack
                            direction='row'
                            justifyContent='center'
                            gap={2}
                            sx={{
                                flexWrap: 'wrap',
                                rowGap: 1.5,
                            }}
                        >
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

                    <Stack
                        direction={{ xs: 'column', sm: 'row' }}
                        justifyContent='space-between'
                        alignItems={{ xs: 'flex-start', sm: 'center' }}
                        gap={{ xs: 1, sm: 0 }}
                    >
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

'use client';

import { useEffect, useRef, useState } from 'react';

import VisibilityOffRoundedIcon from '@mui/icons-material/VisibilityOffRounded';
import VisibilityRoundedIcon from '@mui/icons-material/VisibilityRounded';
import { Box, IconButton, Stack, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';

import CheckCircleIcon from '@/assets/images/icons/check-circle.svg';
import InfoIcon from '@/assets/images/icons/info.svg';
import MuiAlert, { AlertWrapperProps } from '@/components/UI/MuiAlert';
import MuiButton from '@/components/UI/MuiButton';
import MuiInput from '@/components/UI/MuiInput';
import { checkPasswordLength, validateSpecialChar } from '@/utils/validation';

type ToastSeverity = AlertWrapperProps['severity'];

type ToastInfo = {
    id: number;
    message: string;
    severity: ToastSeverity;
};

type NewPasswordFormValues = {
    code?: string;
    currentPassword?: string;
    password: string;
    repeatPassword: string;
};

type NewPasswordFormProps = {
    onSubmit: (values: NewPasswordFormValues) => Promise<void>;
    showCodeField?: boolean;
    showCurrentPassword?: boolean;
    buttonLabel?: string;
    successMessage?: string;
    clearOnSuccess?: boolean;
    onSuccess?: () => void;
    fieldGridSize?: number;
    showResetButton?: boolean;
    resetLabel?: string;
    primaryButtonWidth?: number | string;
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

const NewPasswordForm = ({
    onSubmit,
    showCodeField = true,
    showCurrentPassword = false,
    buttonLabel = 'Change password',
    successMessage,
    clearOnSuccess = true,
    onSuccess,
    fieldGridSize = 6,
    showResetButton = false,
    resetLabel = 'Reset',
    primaryButtonWidth,
}: NewPasswordFormProps) => {
    const [code, setCode] = useState('');
    const [currentPassword, setCurrentPassword] = useState('');
    const [password, setPassword] = useState('');
    const [repeatPassword, setRepeatPassword] = useState('');
    const [typeInput, setTypeInput] = useState<'password' | 'text'>('password');
    const [disabled, setDisabled] = useState(true);
    const [loading, setLoading] = useState(false);
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

    useEffect(() => {
        const hasCode = showCodeField ? Boolean(code.trim()) : true;
        const isCurrentPasswordValid = showCurrentPassword ? Boolean(currentPassword.trim()) : true;
        const isPasswordValid =
            password.length > 4 &&
            !validateSpecialChar(password) &&
            checkPasswordLength(password) &&
            password === repeatPassword;

        setDisabled(!(hasCode && isPasswordValid && isCurrentPasswordValid));
    }, [code, password, repeatPassword, currentPassword, showCodeField, showCurrentPassword]);

    const minFieldWidth = Math.max(180, Math.min(fieldGridSize * 32, 320));

    const handleSubmit = async () => {
        if (showCodeField && !code.trim()) {
            showToast('Please enter the code sent to your email.', 'warning');
            return;
        }
        if (showCurrentPassword && !currentPassword.trim()) {
            showToast('Please enter your current password.', 'warning');
            return;
        }

        setLoading(true);

        try {
            await onSubmit({
                code: showCodeField ? code.trim() : undefined,
                currentPassword: showCurrentPassword ? currentPassword.trim() : undefined,
                password,
                repeatPassword,
            });

            if (successMessage) showToast(successMessage, 'success');
            if (clearOnSuccess) {
                if (showCodeField) setCode('');
                if (showCurrentPassword) setCurrentPassword('');
                setPassword('');
                setRepeatPassword('');
            }
            onSuccess?.();
        } catch (error) {
            console.error('NewPasswordForm submit error', error);
            showToast(getErrorMessage(error));
        } finally {
            setLoading(false);
        }
    };

    const handleReset = () => {
        setCode('');
        setCurrentPassword('');
        setPassword('');
        setRepeatPassword('');
        setTypeInput('password');
    };

    const columnGridStyles = {
        display: 'grid',
        gridTemplateColumns: `repeat(auto-fit, minmax(${minFieldWidth}px, 1fr))`,
        gap: 12,
        mt: 2,
    };

    return (
        <>
            {toastInfo && (
                <ToastContainer>
                    <MuiAlert message={toastInfo.message} severity={toastInfo.severity} />
                </ToastContainer>
            )}

                <Box sx={columnGridStyles}>
                    {showCurrentPassword && (
                        <Box sx={{ width: '100%' }}>
                            <MuiInput
                                value={currentPassword}
                                onChange={setCurrentPassword}
                                type={typeInput}
                                label='Current Password'
                                placeholder='Your current password'
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
                        </Box>
                    )}

                    {showCodeField && (
                        <Box sx={{ width: '100%' }}>
                            <MuiInput
                                value={code}
                                onChange={setCode}
                                label='Code'
                                placeholder='Enter the code from your email'
                            />
                        </Box>
                    )}

                    <Box sx={{ width: '100%' }}>
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
                    </Box>

                    <Box sx={{ width: '100%' }}>
                        <MuiInput
                            value={repeatPassword}
                            onChange={setRepeatPassword}
                            type={typeInput}
                            label='Re-enter New Password'
                            placeholder='Re-enter new password'
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
                    </Box>
                </Box>

            <Stack direction='row' alignItems='center' gap={0.5} mt={2} flexWrap='wrap'>
                {checkPasswordLength(password) ? <CheckCircleIcon /> : <InfoIcon color='#66666E' />}

                <Typography color={checkPasswordLength(password) ? 'success.main' : 'grey.300'} variant='subtitle2'>
                    Must be at least 8 characters
                </Typography>
            </Stack>

            <Stack direction='row' alignItems='center' gap={0.5} flexWrap='wrap'>
                {!validateSpecialChar(password) ? <CheckCircleIcon /> : <InfoIcon color='#66666E' />}
                <Typography color={!validateSpecialChar(password) ? 'success.main' : 'grey.300'} variant='subtitle2'>
                    Must contain one special character
                </Typography>
            </Stack>

            <Stack mt={4} spacing={2} direction='row' alignItems='center' flexWrap='wrap' gap={2}>
                {showResetButton && (
                    <MuiButton variant='outlined' color='secondary' onClick={handleReset}>
                        {resetLabel}
                    </MuiButton>
                )}

                <MuiButton
                    color='secondary'
                    fullWidth={!showResetButton}
                    sx={[
                        showResetButton && { minWidth: 160, flex: { xs: '1 1 100%', sm: 'auto' } },
                        !showResetButton && { width: '100%' },
                        primaryButtonWidth && {
                            width: primaryButtonWidth,
                            maxWidth: '100%',
                        },
                    ]}
                    onClick={handleSubmit}
                    disabled={disabled || loading}
                    loading={loading}
                >
                    {buttonLabel}
                </MuiButton>
            </Stack>
        </>
    );
};

export type { NewPasswordFormValues };
export default NewPasswordForm;

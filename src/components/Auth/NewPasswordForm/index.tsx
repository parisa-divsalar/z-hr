'use client';

import { useEffect, useRef, useState } from 'react';

import VisibilityOffRoundedIcon from '@mui/icons-material/VisibilityOffRounded';
import VisibilityRoundedIcon from '@mui/icons-material/VisibilityRounded';
import { IconButton, Stack, Typography } from '@mui/material';
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
  password: string;
  repeatPassword: string;
};

type NewPasswordFormProps = {
  onSubmit: (values: NewPasswordFormValues) => Promise<void>;
  showCodeField?: boolean;
  buttonLabel?: string;
  successMessage?: string;
  clearOnSuccess?: boolean;
  onSuccess?: () => void;
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
  buttonLabel = 'Submit',
  successMessage,
  clearOnSuccess = true,
  onSuccess,
}: NewPasswordFormProps) => {
  const [code, setCode] = useState('');
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
    const isPasswordValid =
      password.length > 4 &&
      !validateSpecialChar(password) &&
      checkPasswordLength(password) &&
      password === repeatPassword;

    setDisabled(!(hasCode && isPasswordValid));
  }, [code, password, repeatPassword, showCodeField]);

  const handleSubmit = async () => {
    if (showCodeField && !code.trim()) {
      showToast('Please enter the code sent to your email.', 'warning');
      return;
    }

    setLoading(true);

    try {
      await onSubmit({
        code: showCodeField ? code.trim() : undefined,
        password,
        repeatPassword,
      });

      if (successMessage) showToast(successMessage, 'success');
      if (clearOnSuccess) {
        if (showCodeField) setCode('');
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

  return (
    <>
      {toastInfo && (
        <ToastContainer>
          <MuiAlert message={toastInfo.message} severity={toastInfo.severity} />
        </ToastContainer>
      )}

      <Stack spacing={1} mt={4}>
        {showCodeField && (
          <MuiInput value={code} onChange={setCode} label='Code' placeholder='Enter the code from your email' />
        )}

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
        <MuiButton color='secondary' fullWidth onClick={handleSubmit} disabled={disabled || loading} loading={loading}>
          {buttonLabel}
        </MuiButton>
      </Stack>
    </>
  );
};

export type { NewPasswordFormValues };
export default NewPasswordForm;


import { forwardRef, ReactNode } from 'react';

import { Alert, AlertProps as MuiAlertProps, Typography } from '@mui/material';

import MuiButton from '@/components/UI/MuiButton';

export type AlertWrapperProps = Omit<MuiAlertProps, 'onClose'> & {
  message?: ReactNode;
  severity?: 'info' | 'warning' | 'error' | 'success';
};

const MuiAlert = forwardRef<HTMLDivElement, AlertWrapperProps>(({ message, severity = 'info', sx, ...props }, ref) => {
  return (
    <Alert
      ref={ref}
      severity={severity}
      sx={{
        my: 1,
        padding: '0.25rem 0.75rem',
        borderRadius: '0.875rem',
        border: `1px solid ${severity === 'info' ? '#245BFF' : severity === 'success' ? '#106915' : severity === 'warning' ? '#FE8A15' : '#EC2C27'}`,
        backgroundColor:
          severity === 'info'
            ? 'info.light'
            : severity === 'success'
              ? 'success.light'
              : severity === 'warning'
                ? 'warning.light'
                : 'error.error',
        ...sx,
      }}
      action={
        <MuiButton size='small' variant='text' color={severity === 'error' ? 'error' : 'primary'}>
          <Typography
            variant='subtitle2'
            color={
              severity === 'info'
                ? 'info.main'
                : severity === 'success'
                  ? 'success.main'
                  : severity === 'warning'
                    ? 'warning.main'
                    : 'error.main'
            }
          >
            Button
          </Typography>
        </MuiButton>
      }
      {...props}
    >
      {message && (
        <Typography
          variant='subtitle2'
          color={
            severity === 'info'
              ? 'info.main'
              : severity === 'success'
                ? 'success.main'
                : severity === 'warning'
                  ? 'warning.main'
                  : 'error.main'
          }
        >
          {message}
        </Typography>
      )}
    </Alert>
  );
});

MuiAlert.displayName = 'AlertWrapper';

export default MuiAlert;

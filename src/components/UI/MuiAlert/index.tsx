import { forwardRef, ReactNode, useEffect, useState } from 'react';

import { Alert, AlertProps as MuiAlertProps, Typography } from '@mui/material';

import MuiButton from '@/components/UI/MuiButton';

export type AlertWrapperProps = Omit<MuiAlertProps, 'onClose'> & {
  message?: ReactNode;
  severity?: 'info' | 'warning' | 'error' | 'success';
  /**
   * Called when the user clicks the dismiss action button.
   * Typically used to clear the related error state in the parent.
   */
  onDismiss?: () => void;
  /** Label for the dismiss action button. */
  dismissLabel?: ReactNode;
  /** Hide the dismiss action button entirely. */
  hideDismissButton?: boolean;
};

const MuiAlert = forwardRef<HTMLDivElement, AlertWrapperProps>(
  ({ message, severity = 'info', sx, onDismiss, dismissLabel = 'Button', hideDismissButton = false, ...props }, ref) => {
    const [dismissed, setDismissed] = useState(false);

    // If a new message arrives, show the alert again even if the previous one was dismissed.
    useEffect(() => {
      setDismissed(false);
    }, [message, severity]);

    if (dismissed) return null;

    const handleDismiss = () => {
      onDismiss?.();
      setDismissed(true);
    };

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
        hideDismissButton ? undefined : (
          <MuiButton
            size='small'
            variant='text'
            color={severity === 'error' ? 'error' : 'primary'}
            onClick={handleDismiss}
          >
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
              {dismissLabel}
            </Typography>
          </MuiButton>
        )
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
  },
);

MuiAlert.displayName = 'AlertWrapper';

export default MuiAlert;

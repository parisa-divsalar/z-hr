import React, { forwardRef, ReactNode } from 'react';

import { Alert, AlertProps as MuiAlertProps, Typography } from '@mui/material';

export type AlertWrapperProps = Omit<MuiAlertProps, 'onClose'> & {
  message?: ReactNode;
  severity?: 'info' | 'warning' | 'danger' | 'success';
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
        border: `1px solid ${severity === 'success' ? '#AEE6E1' : severity === 'info' ? '#FFAB91' : ''}`,
        backgroundColor: severity === 'success' ? '#EEFFFD' : severity === 'info' ? '#FBE9E7' : 'inherit',

        '& .MuiSvgIcon-root': {
          fill: severity === 'success' ? '#028386' : severity === 'info' ? '#F4511E' : 'inherit',
        },
        ...sx,
      }}
      {...props}
    >
      {message && (
        <Typography
          variant='subtitle2'
          fontWeight='600'
          color={severity === 'success' ? 'action.active' : severity === 'info' ? '#F4511E' : 'inherit'}
        >
          {message}
        </Typography>
      )}
    </Alert>
  );
});

MuiAlert.displayName = 'AlertWrapper';

export default MuiAlert;

import { FunctionComponent } from 'react';

import { Box, BoxProps } from '@mui/material';
import { styled } from '@mui/material/styles';

export interface MuiBadgeProps extends Omit<BoxProps, 'color'> {
  label: string;
  color?: 'success' | 'pending' | 'failed' | 'primary' | 'secondary' | 'error' | 'warning' | 'info';
  border?: string;
  backgroundColor?: string;
  textColor?: string;
}

const StyledBadge = styled(Box, {
  shouldForwardProp: (prop) =>
    prop !== 'color' && prop !== 'border' && prop !== 'backgroundColor' && prop !== 'textColor',
})<Omit<MuiBadgeProps, 'label'>>(({ color, border, backgroundColor, textColor }) => ({
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  padding: '6px 12px',
  borderRadius: '8px',
  fontSize: '13px',
  fontWeight: 500,
  textTransform: 'capitalize',
  whiteSpace: 'nowrap',
  border: border || 'none',

  ...(backgroundColor && { backgroundColor }),
  ...(textColor && { color: textColor }),

  ...(!backgroundColor &&
    color === 'success' && {
      backgroundColor: '#E2FBE2',
      color: '#1F7A1F',
    }),
  ...(!backgroundColor &&
    color === 'pending' && {
      backgroundColor: '#FFE9D6',
      color: '#D9822B',
    }),
  ...(!backgroundColor &&
    color === 'failed' && {
      backgroundColor: '#FFE2E2',
      color: '#D14343',
    }),
  ...(!backgroundColor &&
    color === 'primary' && {
      backgroundColor: '#E3F2FD',
      color: '#1976D2',
    }),
  ...(!backgroundColor &&
    color === 'secondary' && {
      backgroundColor: '#F3E5F5',
      color: '#9C27B0',
    }),
  ...(!backgroundColor &&
    color === 'error' && {
      backgroundColor: '#FFEBEE',
      color: '#D32F2F',
    }),
  ...(!backgroundColor &&
    color === 'warning' && {
      backgroundColor: '#FFF3E0',
      color: '#F57C00',
    }),
  ...(!backgroundColor &&
    color === 'info' && {
      backgroundColor: '#E1F5FE',
      color: '#0288D1',
    }),
}));

const MuiBadge: FunctionComponent<MuiBadgeProps> = (props) => {
  const { label, color = 'primary', border, backgroundColor, textColor, sx, ...rest } = props;

  return (
    <StyledBadge
      color={color}
      border={border}
      backgroundColor={backgroundColor}
      textColor={textColor}
      sx={{ ...sx }}
      {...rest}
    >
      {label}
    </StyledBadge>
  );
};

export default MuiBadge;

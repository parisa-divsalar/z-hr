'use client';

import React, { FunctionComponent, ReactNode } from 'react';

import ChevronLeftRoundedIcon from '@mui/icons-material/ChevronLeftRounded';
import { CardActionArea, Stack, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';

interface MuiListItemProps {
  primary: string;
  secondary: string;
  disabled?: boolean;
  color?: 'error';
  onClick?: () => void;
  icon: ReactNode;
}

const ListActionContainer = styled(CardActionArea)(({ theme, disabled }) => ({
  width: '100%',
  textTransform: 'none',
  borderRadius: '0.25rem',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  borderBottom: `1px solid ${theme.palette.divider}`,
  transition: 'all 0.2s ease',
  opacity: disabled ? '0.5' : '1',
  padding: '0.5rem 0.25rem',
}));

const MuiListItem: FunctionComponent<MuiListItemProps> = (props) => {
  const { primary, secondary, icon, disabled = false, onClick, color } = props;

  return (
    <ListActionContainer disabled={disabled} onClick={onClick}>
      <Stack direction='row' alignItems='center' gap={2}>
        {icon && icon}

        <Stack>
          <Typography color={color === 'error' ? 'error.main' : 'text.primary'} variant='subtitle1' fontWeight='600'>
            {primary}
          </Typography>
          <Typography color={color === 'error' ? 'error.main' : 'text.secondary'} variant='subtitle2'>
            {secondary}
          </Typography>
        </Stack>
      </Stack>

      <ChevronLeftRoundedIcon color={color || 'secondary'} />
    </ListActionContainer>
  );
};

export default MuiListItem;

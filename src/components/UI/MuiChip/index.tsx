import React, { forwardRef, ReactNode } from 'react';

import Chip, { ChipProps } from '@mui/material/Chip';

export type MuiChipProps = Omit<ChipProps, 'onClick' | 'onDelete'> & {
  onClick?: (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => void;
  onDelete?: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
  icon?: ReactNode;
  deleteIcon?: ReactNode;
};

const MuiChip = forwardRef<HTMLDivElement, MuiChipProps>(
  (
    {
      label,
      color = 'default',
      variant = 'filled',
      size = 'medium',
      clickable = false,
      disabled = false,
      onClick,
      onDelete,
      icon,
      sx,
      ...props
    },
    ref,
  ) => {
    return (
      <Chip
        {...props}
        ref={ref}
        label={label}
        color={color}
        variant={variant}
        size={size}
        clickable={clickable}
        disabled={disabled}
        onClick={onClick}
        icon={icon}
        onDelete={onDelete}
        sx={{ ...sx }}
      />
    );
  },
);

MuiChip.displayName = 'MuiChip';

export default MuiChip;

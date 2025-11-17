import { ReactNode, MouseEvent, FunctionComponent } from 'react';

import { ChipProps, Chip } from '@mui/material';

export type MuiChipProps = Omit<ChipProps, 'onDelete'> & {
  onClick?: (event: MouseEvent<HTMLDivElement, MouseEvent>) => void;
  onDelete?: (event: MouseEvent<HTMLButtonElement, MouseEvent>) => void;
  icon?: ReactNode;
  deleteIcon?: ReactNode;
};

const MuiChip: FunctionComponent<MuiChipProps> = (props) => {
  const {
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
  } = props;

  return (
    <Chip
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
};

export default MuiChip;

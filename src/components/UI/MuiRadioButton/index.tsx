import { ChangeEvent, FunctionComponent, ReactNode, ReactElement } from 'react';

import { Radio, FormControlLabel, FormControl, FormHelperText, SxProps, Theme } from '@mui/material';

export type RadioColor = 'primary' | 'secondary' | 'default' | 'error' | 'info' | 'success' | 'warning';

export interface MuiRadioProps {
  id?: string;
  name?: string;
  value?: string;
  checked?: boolean; // controlled
  defaultChecked?: boolean; // uncontrolled
  onChange?: (event: ChangeEvent<HTMLInputElement>, value?: string) => void;
  label?: ReactNode;
  labelPlacement?: 'end' | 'start' | 'top' | 'bottom';
  size?: 'small' | 'medium' | 'large';
  color?: RadioColor;
  disabled?: boolean;
  required?: boolean;
  error?: boolean;
  helperText?: ReactNode;
  sx?: SxProps<Theme>;
  icon?: ReactElement;
  checkedIcon?: ReactElement;
}

const MuiRadioButton: FunctionComponent<MuiRadioProps> = ({
  id,
  name,
  value,
  checked,
  defaultChecked,
  onChange,
  label,
  labelPlacement = 'end',
  size = 'medium',
  color = 'primary',
  disabled = false,
  required = false,
  error = false,
  helperText,
  sx,
}) => {
  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (onChange) onChange(event, event.target.value);
  };

  const radio = (
    <Radio
      id={id}
      name={name}
      value={value}
      checked={checked}
      defaultChecked={defaultChecked}
      onChange={handleChange}
      size={size as any}
      color={color as any}
      disabled={disabled}
      sx={{ opacity: disabled ? '0.2' : '1' }}
      inputProps={{ 'aria-required': required }}
    />
  );

  if (!label && !helperText) return radio as ReactElement;

  return (
    <FormControl component='fieldset' error={error} sx={sx}>
      <FormControlLabel control={radio} label={label} labelPlacement={labelPlacement} disabled={disabled} />
      {helperText ? <FormHelperText>{helperText}</FormHelperText> : null}
    </FormControl>
  );
};

export default MuiRadioButton;

import { ChangeEvent, ReactNode } from 'react';

import { FormControl, FormControlLabel, FormGroup, FormHelperText, SwitchProps, Typography } from '@mui/material';

import IOSSwitch from '@/components/UI/IosSwitch';

export type MuiSwichButtonProps = Omit<SwitchProps, 'onChange'> & {
  label?: ReactNode;
  helperText?: ReactNode;
  error?: boolean;
  row?: boolean;
  labelPlacement?: 'end' | 'start' | 'top' | 'bottom';
  id?: string;
  onChange?: (event: ChangeEvent<HTMLInputElement>, checked: boolean) => void;
  describedBy?: string;
};

const MuiSwichButton = ({
  label,
  helperText,
  error = false,
  row = false,
  labelPlacement = 'end',
  id,
  onChange,
  describedBy,
  disabled,
  sx,
  ...switchProps
}: MuiSwichButtonProps) => {
  const inputId = id;
  const helperId = helperText && inputId ? `${inputId}-helper` : undefined;

  const handleChange = (event: ChangeEvent<HTMLInputElement>, checked: boolean) => {
    if (onChange) onChange(event, checked);
  };

  const switchControl = (
    <IOSSwitch
      {...(switchProps as SwitchProps)}
      id={inputId}
      onChange={handleChange}
      aria-describedby={helperId || describedBy}
      disabled={disabled}
      sx={{
        opacity: disabled ? '0.2' : '1',
        ...sx,
      }}
    />
  );

  const renderedLabel =
    typeof label === 'string' ? (
      <Typography color='text.primary' variant='subtitle1' fontWeight={400}>
        {label}
      </Typography>
    ) : (
      label
    );

  const inner = label ? (
    <FormControlLabel
      control={switchControl}
      label={renderedLabel}
      labelPlacement={labelPlacement}
      sx={{
        m: 0,
        columnGap: 0.75,
        '& .MuiFormControlLabel-label': {
          marginInlineStart: 1.5,
        },
      }}
    />
  ) : (
    switchControl
  );

  return (
    <FormControl component='fieldset' error={error} disabled={disabled} sx={{ width: 'fit-content' }}>
      <FormGroup row={row}>{inner}</FormGroup>
      {helperText ? <FormHelperText id={helperId}>{helperText}</FormHelperText> : null}
    </FormControl>
  );
};

export default MuiSwichButton;

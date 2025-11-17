import { ForwardedRef, forwardRef, ReactNode } from 'react';

import { InputAdornment, Stack, Typography } from '@mui/material';
import TextField from '@mui/material/TextField';

import InfoIcon from '@/assets/images/icons/info.svg';
import { commafy } from '@/utils/commafyHelper';
import { convertPersianNumbersToEnglish } from '@/utils/validation';

type InputModeType = 'tel' | 'numeric' | 'text' | 'email' | 'decimal' | undefined;
type VariantType = 'outlined' | 'filled' | 'standard';

interface MuiInputProps {
  label?: string;
  placeholder?: string;
  value?: any;
  error?: boolean;
  variant?: VariantType;
  maxLength?: number;
  helperText?: string;
  autoComplete?: string;
  type?: 'text' | 'password' | 'email' | 'numeric';
  size?: 'small' | 'medium' | 'large';
  inputMode?: InputModeType;
  disabled?: boolean;
  hidden?: boolean;
  required?: boolean;
  onChange?: (value: any) => void;
  onEnter?: () => void;
  rows?: number;
  startIcon?: ReactNode;
  endIcon?: ReactNode;
  autoFocus?: boolean;
  multiline?: boolean;
  readOnly?: boolean;
  onBlur?: () => void;
}

const MuiInput = forwardRef<HTMLInputElement, MuiInputProps>(
  (
    {
      label = '',
      variant = 'outlined',
      placeholder = '',
      value,
      error = false,
      helperText = '',
      type = 'text',
      maxLength = 100,
      inputMode,
      disabled,
      hidden = false,
      required = false,
      multiline = false,
      readOnly = false,
      rows = 1,
      onEnter,
      startIcon,
      endIcon,
      size = 'medium',
      autoComplete = 'off',
      autoFocus = false,
      onChange,
      onBlur,
      ...rest
    },
    ref: ForwardedRef<HTMLInputElement>,
  ) => {
    const handleChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const val = event.target.value;

      if (inputMode === 'decimal') {
        const rawValue = val.replace(/,/g, '');
        if (!/^\d*$/.test(rawValue)) return;
        onChange?.(rawValue);
      } else if (inputMode === 'numeric' && /\D/g.test(convertPersianNumbersToEnglish(val))) return;
      else {
        onChange?.(inputMode === 'numeric' ? parseInt(convertPersianNumbersToEnglish(val || '0')) : val);
      }
    };

    const handleKeyDown = (event: React.KeyboardEvent<any>) => {
      if (event.key === 'Enter') {
        onEnter?.();
      }
    };

    return (
      <Stack>
        <Typography variant='caption' color={disabled ? 'grey.100' : error ? 'error.main' : 'text.secondary'}>
          {label}
        </Typography>
        <TextField
          variant={variant}
          placeholder={placeholder}
          fullWidth
          label=''
          value={inputMode === 'decimal' ? (value ? commafy(value) : '') : value}
          error={error}
          required={required}
          rows={rows}
          size={size}
          onChange={handleChange}
          type={type}
          hidden={hidden}
          autoFocus={autoFocus}
          multiline={multiline}
          inputMode={inputMode}
          autoComplete={autoComplete}
          onKeyDown={handleKeyDown}
          onBlur={onBlur}
          disabled={disabled}
          inputRef={ref}
          InputLabelProps={{
            shrink: true,
          }}
          InputProps={{
            readOnly,
            startAdornment: startIcon ? <InputAdornment position='start'>{startIcon}</InputAdornment> : undefined,
            endAdornment: endIcon ? <InputAdornment position='end'>{endIcon}</InputAdornment> : undefined,
            inputProps: {
              maxLength,
              autoComplete: 'new-password',
              form: { autocomplete: 'off' },
            },
          }}
          {...rest}
        />

        <Stack direction='row' gap={1} alignItems='center'>
          <InfoIcon color={disabled ? '#D8D8DA' : error ? '#EC2C27' : '#66666E'} />
          <Typography variant='caption' color={disabled ? 'grey.100' : error ? 'error.main' : 'text.secondary'}>
            {helperText}
          </Typography>
        </Stack>
      </Stack>
    );
  },
);

MuiInput.displayName = 'MuiInput2';

export default MuiInput;

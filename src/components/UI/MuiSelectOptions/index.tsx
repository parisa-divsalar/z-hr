import React, { ForwardedRef, forwardRef, ReactNode, useMemo, useState } from 'react';

import { FormControl, MenuItem, Select, SelectProps, Stack, Typography } from '@mui/material';
import { useTheme } from '@mui/material/styles';

import InfoIcon from '@/assets/images/icons/info.svg';

import type { MenuProps } from '@mui/material/Menu';

type SelectOptionValue = string | number;

export interface SelectOption {
  value: SelectOptionValue;
  label: ReactNode;
  disabled?: boolean;
}

interface MuiSelectOptionsProps {
  label?: string;
  value?: SelectOptionValue;
  options?: SelectOption[];
  placeholder?: string;
  helperText?: string;
  error?: boolean;
  disabled?: boolean;
  required?: boolean;
  size?: SelectProps['size'];
  variant?: SelectProps['variant'];
  displayEmpty?: boolean;
  fullWidth?: boolean;
  menuProps?: SelectProps['MenuProps'];
  selectProps?: SelectProps;
  sx?: SelectProps['sx'];
  onChange?: (value: SelectOptionValue) => void;
}

type MenuPaperProps = NonNullable<MenuProps['PaperProps']>;

const MuiSelectOptions = forwardRef<HTMLInputElement, MuiSelectOptionsProps>(
  (
    {
      label = '',
      options = [],
      placeholder = '',
      value,
      helperText = '',
      error = false,
      disabled = false,
      required = false,
      size = 'medium',
      variant = 'outlined',
      displayEmpty,
      fullWidth = true,
      menuProps,
      selectProps,
      sx,
      onChange,
    },
    ref: ForwardedRef<HTMLInputElement>,
  ) => {
    const [focused, setFocused] = useState(false);

    const selectValue = useMemo(() => (value === undefined || value === null ? '' : value), [value]);

    const forceDisplayEmpty = displayEmpty ?? Boolean(placeholder);
    const labelColor = disabled ? 'grey.100' : error ? 'error.main' : focused ? 'primary.main' : 'text.secondary';

    const {
      displayEmpty: selectPropsDisplayEmpty,
      MenuProps: selectPropsMenuProps,
      fullWidth: _selectPropsFullWidth,
      onChange: selectPropsOnChange,
      onOpen: selectPropsOnOpen,
      onClose: selectPropsOnClose,
      onFocus: selectPropsOnFocus,
      onBlur: selectPropsOnBlur,
      sx: selectPropsSx,
      value: _selectPropsValue,
      ...restSelectProps
    } = selectProps ?? {};

    const theme = useTheme();
    const borderColor = theme.palette.grey[200] ?? theme.palette.grey[100];
    const defaultSelectSx: SelectProps['sx'] = {
      height: '52px',
      minHeight: '52px',
      borderRadius: '16px',
      '& .MuiOutlinedInput-root': {
        borderRadius: '16px',
        height: '100%',
      },
      '& .MuiOutlinedInput-notchedOutline': {
        borderColor,
        borderWidth: '1px',
      },
    };
    const selectSxValue: SelectProps['sx'] = selectPropsSx
      ? ([defaultSelectSx, selectPropsSx] as SelectProps['sx'])
      : defaultSelectSx;

    const defaultMenuPaperSx = {
      borderRadius: '8px',
      border: `1px solid ${theme.palette.grey[100]}`,
      bgcolor: theme.palette.common.white,
    };

    const defaultMenuProps = {
      PaperProps: {
        sx: defaultMenuPaperSx,
      },
    };

    const providedMenuProps = menuProps ?? selectPropsMenuProps;
    const providedMenuPropsWithPaper = providedMenuProps as MenuProps | undefined;
    const providedPaperProps = providedMenuPropsWithPaper?.PaperProps ?? {};
    const providedPaperSx = (providedPaperProps as any).sx;
    const mergedPaperSx = providedPaperSx
      ? ([defaultMenuPaperSx, providedPaperSx] as MenuPaperProps['sx'])
      : defaultMenuPaperSx;
    const menuPropsValue = providedMenuPropsWithPaper
      ? ({
          ...providedMenuPropsWithPaper,
          PaperProps: {
            ...providedPaperProps,
            sx: mergedPaperSx,
          },
        } as SelectProps['MenuProps'])
      : (defaultMenuProps as SelectProps['MenuProps']);

    const handleChange: SelectProps['onChange'] = (event, child) => {
      const nextValue = event.target.value as SelectOptionValue;
      onChange?.(nextValue);
      selectPropsOnChange?.(event, child);
    };

    return (
      <Stack gap={0.5} sx={{ width: '100%' }}>
        <Typography variant='caption' color={labelColor}>
          {label}
        </Typography>
        <FormControl
          fullWidth={fullWidth}
          error={error}
          disabled={disabled}
          required={required}
          variant={variant}
          sx={{ width: fullWidth ? '100%' : 'auto', ...sx }}
        >
          <Select
            {...restSelectProps}
            inputRef={ref}
            value={selectValue}
            error={error}
            disabled={disabled}
            required={required}
            size={size}
            variant={variant}
            fullWidth={fullWidth}
            displayEmpty={forceDisplayEmpty || selectPropsDisplayEmpty}
            MenuProps={menuPropsValue}
            onChange={handleChange}
            onOpen={(event) => {
              setFocused(true);
              selectPropsOnOpen?.(event);
            }}
            onClose={(event) => {
              setFocused(false);
              selectPropsOnClose?.(event);
            }}
            onFocus={(event) => {
              setFocused(true);
              selectPropsOnFocus?.(event);
            }}
            onBlur={(event) => {
              setFocused(false);
              selectPropsOnBlur?.(event);
            }}
            sx={selectSxValue}
          >
            {forceDisplayEmpty && placeholder && (
              <MenuItem value='' disabled>
                {placeholder}
              </MenuItem>
            )}
            {options.map((option, index) => (
              <MenuItem key={`${option.value}-${index}`} value={option.value} disabled={option.disabled}>
                {option.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        {error && helperText && (
          <Stack direction='row' gap={1} alignItems='center'>
            <InfoIcon color={disabled ? '#D8D8DAD8DA' : error ? '#EC2C27' : '#66666E'} />
            <Typography
              variant='subtitle1'
              fontWeight='400'
              color={disabled ? 'grey.100' : error ? 'error.main' : 'text.secondary'}
            >
              {helperText}
            </Typography>
          </Stack>
        )}
      </Stack>
    );
  },
);

MuiSelectOptions.displayName = 'MuiSelectOptions';

export default MuiSelectOptions;

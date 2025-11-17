import Checkbox, { CheckboxProps } from '@mui/material/Checkbox';
import FormControl from '@mui/material/FormControl';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormGroup from '@mui/material/FormGroup';
import FormHelperText from '@mui/material/FormHelperText';

export type MuiCheckboxProps = Omit<CheckboxProps, 'onChange'> & {
  label?: React.ReactNode;
  helperText?: React.ReactNode;
  error?: boolean;
  row?: boolean;
  labelPlacement?: 'end' | 'start' | 'top' | 'bottom';
  id?: string;
  onChange?: (event: React.ChangeEvent<HTMLInputElement>, checked: boolean) => void;
  describedBy?: string;
};

const MuiCheckbox = ({
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
  color = 'primary',
  ...checkboxProps
}: MuiCheckboxProps) => {
  const inputId = id; // فقط از props استفاده می‌کنیم
  const helperId = helperText && inputId ? `${inputId}-helper` : undefined;

  const checkbox = (
    <Checkbox
      {...(checkboxProps as CheckboxProps)}
      id={inputId}
      onChange={onChange}
      aria-describedby={helperId || describedBy}
      disabled={disabled}
      color={color}
    />
  );

  const inner = label ? (
    <FormControlLabel control={checkbox} label={label} labelPlacement={labelPlacement} sx={{ m: 0 }} />
  ) : (
    checkbox
  );

  return (
    <FormControl component='fieldset' error={error} disabled={disabled} sx={{ width: 'fit-content', ...sx }}>
      <FormGroup row={row}>{inner}</FormGroup>
      {helperText ? (
        <FormHelperText id={helperId} sx={{ mt: 0.5 }}>
          {helperText}
        </FormHelperText>
      ) : null}
    </FormControl>
  );
};

export default MuiCheckbox;

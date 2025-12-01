import { Button, CircularProgress } from '@mui/material';

type colorType = 'primary' | 'error' | 'secondary' | 'inherit';
type variantType = 'outlined' | 'contained' | 'text';
type sizeType = 'large' | 'small' | 'medium';
type buttonType = 'submit' | 'button';

interface PrimaryButtonProps {
  text?: string;
  onClick?: () => void;
  disabled?: boolean;
  loading?: boolean;
  color?: colorType;
  startIcon?: any;
  endIcon?: any;
  variant?: variantType;
  fullWidth?: boolean;
  size?: sizeType;
  type?: buttonType;
  children?: any;
  href?: string;
  theme?: 'default';
  sx?: any;
  [key: string]: any;
}

const MuiButton = (props: PrimaryButtonProps) => {
  const {
    text = '',
    variant = 'contained',
    size = 'medium',
    type,
    disabled,
    loading,
    color,
    startIcon,
    endIcon,
    onClick,
    fullWidth = false,
    children,
    href,
    sx,
    ...rest
  } = props;

  const mergedSx = {
    display: 'inline-flex',
    alignItems: 'center',
    '& .MuiButton-startIcon': {
      marginLeft: 0,
      marginRight: 0.5,
      display: 'inline-flex',
      alignItems: 'center',
    },
    '& .MuiButton-endIcon': {
      marginRight: 0,
      marginLeft: 0.5,
      display: 'inline-flex',
      alignItems: 'center',
      marginTop: '2px',
    },
    ...sx,
  };

  return (
    <Button
      variant={variant}
      onClick={onClick}
      type={type}
      color={color}
      fullWidth={fullWidth}
      startIcon={!loading && startIcon}
      endIcon={!loading && endIcon}
      size={size}
      disabled={disabled || loading}
      href={href}
      sx={mergedSx}
      {...rest}
    >
      {loading ? <CircularProgress size={16} color={color ? color : 'primary'} /> : text || children}
    </Button>
  );
};

export default MuiButton;

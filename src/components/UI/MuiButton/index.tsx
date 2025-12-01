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
    // ensure icons and text are vertically centered on one line
    '& .MuiButton-startIcon': {
      // a little space between start icon and label
      marginLeft: 0,
      marginRight: 0.5, // theme spacing unit (4px)
      display: 'inline-flex',
      alignItems: 'center',
    },
    '& .MuiButton-endIcon': {
      // a little space between label and end icon
      marginRight: 0,
      marginLeft: 0.5, // theme spacing unit (4px)
      display: 'inline-flex',
      alignItems: 'center',
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

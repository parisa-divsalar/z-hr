'use client';

import { createTheme, ThemeOptions } from '@mui/material/styles';

const commonSettings: ThemeOptions = {
  direction: 'rtl',
  breakpoints: {
    values: {
      xs: 444,
      sm: 600,
      md: 900,
      lg: 1200,
      xl: 1536,
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        sizeSmall: {
          height: 34,
          width: 'fit-content',
          fontSize: '0.875rem',
          padding: '0 0.75rem',

          '& > .MuiButton-startIcon, & > .MuiButton-endIcon': {
            fontSize: 16,
            width: 16,
            height: 16,
          },
        },
        sizeMedium: {
          height: 44,
          fontSize: '1rem',
          padding: '0 1rem',

          '& > .MuiButton-startIcon, & > .MuiButton-endIcon': {
            fontSize: 20,
            width: 20,
            height: 20,
          },
        },
        sizeLarge: {
          height: 56,
          fontSize: '1rem',
          padding: '0 1.25rem',

          '& > .MuiButton-startIcon, & > .MuiButton-endIcon': {
            fontSize: 24,
            width: 24,
            height: 24,
          },
        },
        root: {
          borderRadius: '0.5rem',
          width: 'fit-content',
          textTransform: 'none',
          minWidth: 'unset',
          boxShadow: 'none',
        },
        contained: {
          '&.Mui-disabled': {
            backgroundColor: '#EAEAFE',
          },
        },
        outlined: {
          borderWidth: '2px',
        },
        fullWidth: {
          width: '100%',
        },
      },
    },
    MuiTextField: {
      variants: [
        {
          props: { size: 'large' },
          style: {
            '& .MuiInputBase-root': {
              height: '52px',
              borderRadius: '1rem',
            },
            '& input': {
              padding: '0 12px',
              height: '100%',
              fontSize: '1rem',
              borderRadius: '1rem !important',
            },
            '& label': {
              fontSize: '1rem',
            },
          },
        },
      ],
      defaultProps: {
        autoComplete: 'off',
      },
      styleOverrides: {
        root: {
          width: '100%',
          height: '100%',
          margin: '0.25rem auto',

          '& .MuiInputBase-input': {
            lineHeight: '0',
            boxSizing: 'border-box',
            fontSize: '0.875rem !important',
          },
        },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        sizeSmall: {
          height: 34,
        },
        root: {
          height: 42,
          borderRadius: '0.5rem',
        },
      },
    },
    MuiInputLabel: {
      styleOverrides: {
        root: {
          letterSpacing: '0',
          fontSize: '0.875rem',
          fontWeight: '600',

          '&.MuiInputLabel-shrink': {
            width: 'auto',
            padding: '0 0.5rem',
          },
        },
      },
    },
    MuiFormControlLabel: {
      styleOverrides: {
        label: {
          fontSize: '0.875rem',
        },
      },
    },
    MuiSvgIcon: {
      styleOverrides: {
        fontSizeSmall: { fontSize: '16px' },
      },
    },
    MuiRadio: {
      variants: [
        {
          props: { size: 'small' },
          style: {
            width: 16,
            height: 16,
          },
        },
        {
          props: { size: 'medium' },
          style: {
            width: 20,
            height: 20,
          },
        },
        {
          props: { size: 'large' },
          style: {
            width: 24,
            height: 24,
          },
        },
      ],
      styleOverrides: {
        root: {
          // اگر بخوای بصورت عمومی تغییر بدی همه سایزها
          // مثلا رنگ یا padding
        },
      },
    },
    MuiCheckbox: {
      styleOverrides: {
        root: ({ ownerState }) => {
          switch (ownerState.size) {
            case 'small':
              return { width: 24, height: 24 };
            case 'medium':
              return { width: 32, height: 32 };
            case 'large':
              return { width: 40, height: 40 };
            default:
              return {};
          }
        },
      },
    },
  },
  typography: {
    fontFamily: 'var(--font-interphases), Arial, sans-serif',
    h1: {
      fontSize: '3rem', // 48px
    },

    h2: {
      fontSize: '2.5rem', // 40px
    },

    h3: {
      fontSize: '2rem', // 32px
    },

    h4: {
      fontSize: '1.5rem', // 24px
    },

    h5: {
      fontSize: '1.25rem', // 20px
    },

    h6: {
      fontSize: '1.125rem', // 18px
    },

    subtitle1: {
      fontSize: '1rem', // 16px
    },

    subtitle2: {
      fontSize: '0.875rem', // 14px
    },

    body1: {
      fontSize: '1rem', // 16px
    },

    body2: {
      fontSize: '0.875rem', // 14px
    },

    caption: {
      fontSize: '0.75rem', // 12px
    },

    overline: {
      fontSize: '0.625rem', // 10px
    },
  },
};

export const darkTheme = createTheme({
  ...commonSettings,
  palette: {
    mode: 'dark',
    primary: {
      main: '#4d49fc',
      light: '#F1F1FE',
      dark: '#090387',
      contrastText: '#fff',
    },
    secondary: {
      main: '#fca649',
      light: '#fddac3',
      dark: '#cd8220',
      contrastText: '#fff',
    },
    text: {
      primary: '#FAFAFA',
      secondary: '#ddd',
      disabled: '#dcdcdc',
    },
    divider: '#555',
    action: {
      active: '#028386',
      hover: '#0765680a',
      selected: '#02838614',
      focus: '#028386',
      disabled: '#2F2F3B',
      disabledBackground: '#0765681f',
    },
    error: {
      main: '#D93200',
      light: '#d9320017',
      dark: '#EA0341',
    },
    info: {
      main: '#245BFF',
      light: '#F5F7FF',
      dark: '#0031C3',
    },
    success: {
      main: '#1A9121',
      light: '#25BC2D',
      dark: '#106915',
    },
    warning: {
      main: '#EC2C27',
      light: '#F77A79',
      dark: '#AC1D19',
    },
    grey: {
      '50': '#1c1c1c',
      '100': '#90a4ae36',
    },
    background: {
      default: '#1e1e1e',
      paper: '#263238',
    },
  },
});

export const lightTheme = createTheme({
  ...commonSettings,
  palette: {
    mode: 'light',
    primary: {
      main: '#4d49fc',
      light: '#F1F1FE',
      dark: '#090387',
      contrastText: '#fff',
    },
    secondary: {
      main: '#111113',
      light: '#66666E',
      dark: '#080809',
      contrastText: '#fff',
    },
    text: {
      primary: '#111113',
      secondary: '#8A8A91',
      disabled: '#b0b0b3',
    },
    divider: '#07656814',
    action: {
      active: '#028386',
      hover: '#0765680a',
      selected: '#02838614',
      focus: '#0C5355',
      disabled: '#07656861',
      disabledBackground: '#0765681f',
    },
    error: {
      main: '#EC2C27',
      light: '#FDF3F3',
      dark: '#EA0341',
    },
    info: {
      main: '#245BFF',
      light: '#F5F7FF',
      dark: '#0031C3',
    },
    success: {
      main: '#106915',
      light: '#F4FEF4',
      dark: '#106915',
    },
    warning: {
      main: '#FE8A15',
      light: '#FFF7F5',
      dark: '#dd7002',
    },
    grey: {
      '50': '#FAFAFA',
      '100': '#D8D8DA',
      '200': '#b0b0b5',
      '300': '#8a8a91',
      '400': '#66666E',
      '500': '#44444C',
      '600': '#25252A',
      '700': '#111113',
    },
    background: {
      default: '#FFF',
      paper: '#FAFAFA',
    },
  },
});

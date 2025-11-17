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
      defaultProps: {
        autoComplete: 'off',
      },
      styleOverrides: {
        root: {
          width: '100%',
          height: '100%',
          margin: '0.5rem auto',

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
        root: {
          height: 40,
          borderRadius: '0.75rem',
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
  },
  typography: {
    fontFamily: 'var(--font-interphases), Arial, sans-serif',
    h1: {
      fontSize: '2rem', // 32px
    },

    h2: {
      fontSize: '1.875rem', // 30px
    },

    h3: {
      fontSize: '1.5rem', // 24px
    },

    h4: {
      fontSize: '1.375rem', // 22px
    },

    body1: {
      fontSize: '1.25rem', // 20px
    },

    body2: {
      fontSize: '1.125rem', // 18px
    },

    subtitle1: {
      fontSize: '1rem', // 16px
    },

    subtitle2: {
      fontSize: '0.875rem', // 14px
    },

    caption: {
      fontSize: '0.75rem', // 12px
    },
  },
};

export const darkTheme = createTheme({
  ...commonSettings,
  palette: {
    mode: 'dark',
    primary: {
      main: '#4d49fc',
      light: '#7d7bfd',
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
      disabled: '#07656861',
      disabledBackground: '#0765681f',
    },
    error: {
      main: '#D93200',
      light: '#d9320017',
      dark: '#EA0341',
    },
    info: {
      main: '#245BFF',
      light: '#85A3FF',
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
      light: '#7d7bfd',
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
      main: '#D93200',
      light: '#d9320017',
      dark: '#EA0341',
    },
    info: {
      main: '#245BFF',
      light: '#85A3FF',
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

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
          height: 30,
        },
        sizeMedium: {
          height: 36,
        },
        sizeLarge: {
          height: 42,
        },
        root: {
          width: 'fit-content',
          borderRadius: '0.75rem',
          fontSize: '0.875rem',
          padding: '0 1.5rem',
          fontWeight: '600',
        },
        fullWidth: {
          width: '100%',
        },
        contained: {
          boxShadow: '-3px 3px 0 0 #007b861f',
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
          borderRadius: '0.875rem',
        },
      },
    },
    MuiInputLabel: {
      styleOverrides: {
        root: {
          letterSpacing: '0',
          fontSize: '0.875rem',
          fontWeight: 'bold',

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
  },
  typography: {
    fontFamily: 'var(--font-yekanbakh), Arial, sans-serif',
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
      main: '#028386',
      light: '#00A3A5',
      dark: '#076568',
      contrastText: '#fff',
    },
    secondary: {
      main: '#37474F',
      light: '#455A64',
      dark: '#263238',
      contrastText: '#CFD8',
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
      main: '#3200D9',
      light: '#3A04EC',
      dark: '#3204CB',
    },
    success: {
      main: '#45D900',
      dark: '#3BBA00',
      light: '#4FEA06',
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
      main: '#028386',
      light: '#00A3A5',
      dark: '#076568',
      contrastText: '#fff',
    },
    secondary: {
      main: '#37474F',
      light: '#455A64',
      dark: '#263238',
      contrastText: '#CFD8DC',
    },
    text: {
      primary: '#1c133cf5',
      secondary: '#1c133c99',
      disabled: '#1c133c61',
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
      main: '#3200D9',
      light: '#3A04EC',
      dark: '#3204CB',
    },
    success: {
      main: '#45D900',
      dark: '#3BBA00',
      light: '#4FEA06',
    },
    grey: {
      '50': '#FAFAFA',
      '100': '#90a4ae36',
    },
    background: {
      default: '#FFF',
      paper: '#FAFAFA',
    },
  },
});

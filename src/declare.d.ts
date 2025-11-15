import '@mui/material/styles';

declare module '@mui/material/styles' {
  interface Palette {
    border: Palette['primary'];
  }
  interface PaletteOptions {
    border?: PaletteOptions['primary'];
  }
}

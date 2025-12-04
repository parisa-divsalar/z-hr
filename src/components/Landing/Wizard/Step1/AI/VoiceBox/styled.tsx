import { Box, CardActionArea, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';

export const CardContainer = styled(Box)(() => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  paddingTop: '2.5rem',
}));

export const VoiceButton = styled(CardActionArea)(() => ({
  width: 76,
  height: 76,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  borderRadius: 16,

  '&:hover': {
    background: `linear-gradient(
    135deg,
    #4d49fc,
    #0031C3,
    #ae3ec9,
    #EA0341
  )`,
    backgroundSize: '400% 400%',
    animation: `
    gradientMove 3s ease-in-out infinite,
    softScale 2s ease-in-out infinite
  `,

    boxShadow: '0 1px 25px rgba(120, 80, 255, 0.35)',

    '& svg': {
      color: '#fff',
      fontSize: 52,
    },

    '@keyframes gradientMove': {
      '0%': { backgroundPosition: '0% 50%' },
      '50%': { backgroundPosition: '100% 50%' },
      '100%': { backgroundPosition: '0% 50%' },
    },

    '@keyframes softScale': {
      '0%': { transform: 'scale(1)' },
      '50%': { transform: 'scale(1.06)' },
      '100%': { transform: 'scale(1)' },
    },
  },
}));

export const VoiceLabel = styled(Typography)(({ theme }) => ({
  marginTop: theme.spacing(1),
  fontWeight: 500,
  textAlign: 'center',
}));

export const OrDivider = styled(Box)(() => ({
  display: 'flex',
  alignItems: 'center',
  width: '11.5rem',
  marginTop: '2rem',
  marginBottom: '1rem',
}));

export const DividerLine = styled(Box)(({ theme }) => ({
  flex: 1,
  height: 1,
  backgroundColor: theme.palette.grey[100],
}));

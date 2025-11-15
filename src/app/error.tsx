'use client';

import HomeIcon from '@mui/icons-material/Home';
import RefreshIcon from '@mui/icons-material/Refresh';
import { Button, Container, Typography, Box, Paper } from '@mui/material';
import { useRouter } from 'next/navigation';

export default function Error({ error, reset }: { error: Error; reset: () => void }) {
  const router = useRouter();

  return (
    <Container maxWidth='xl' sx={{ mt: 10 }}>
      <Paper
        elevation={3}
        sx={{
          p: 4,
          textAlign: 'center',
          borderRadius: 3,
        }}
      >
        <Typography variant='h4' color='error' gutterBottom>
          An error occurred
        </Typography>
        <Typography variant='body1' color='text.secondary' sx={{ mb: 3 }}>
          {error.message || 'Something went wrong. Please try again.'}
        </Typography>

        <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2 }}>
          <Button variant='contained' color='primary' startIcon={<RefreshIcon />} onClick={() => reset()}>
            Try again
          </Button>
          <Button variant='outlined' color='secondary' startIcon={<HomeIcon />} onClick={() => router.push('/')}>
            Back to home
          </Button>
        </Box>
      </Paper>
    </Container>
  );
}

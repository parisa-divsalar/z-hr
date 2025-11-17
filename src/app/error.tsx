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
          خطایی رخ داد
        </Typography>
        <Typography variant='body1' color='text.secondary' sx={{ mb: 3 }}>
          {error.message || 'مشکلی پیش آمده است. لطفاً دوباره تلاش کنید.'}
        </Typography>

        <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2 }}>
          <Button variant='contained' color='primary' startIcon={<RefreshIcon />} onClick={() => reset()}>
            تلاش دوباره
          </Button>
          <Button variant='outlined' color='secondary' startIcon={<HomeIcon />} onClick={() => router.push('/')}>
            بازگشت به خانه
          </Button>
        </Box>
      </Paper>
    </Container>
  );
}

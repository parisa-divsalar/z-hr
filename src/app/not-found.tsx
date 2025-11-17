'use client';

import HomeIcon from '@mui/icons-material/Home';
import SearchOffIcon from '@mui/icons-material/SearchOff';
import { Button, Container, Typography, Box, Paper } from '@mui/material';
import { useRouter } from 'next/navigation';

export default function NotFound() {
  const router = useRouter();

  return (
    <Container maxWidth='sm' sx={{ mt: 10 }}>
      <Paper
        elevation={3}
        sx={{
          p: 4,
          textAlign: 'center',
          borderRadius: 3,
        }}
      >
        <SearchOffIcon color='error' sx={{ fontSize: 60, mb: 2 }} />
        <Typography variant='h4' gutterBottom>
          صفحه پیدا نشد
        </Typography>
        <Typography variant='body1' color='text.secondary' sx={{ mb: 3 }}>
          متأسفانه صفحه‌ای که دنبال آن هستید وجود ندارد یا حذف شده است.
        </Typography>

        <Box sx={{ display: 'flex', justifyContent: 'center' }}>
          <Button variant='contained' color='primary' startIcon={<HomeIcon />} onClick={() => router.push('/')}>
            بازگشت به خانه
          </Button>
        </Box>
      </Paper>
    </Container>
  );
}

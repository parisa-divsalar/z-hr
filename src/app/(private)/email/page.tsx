'use client';

import { Box } from '@mui/material';
import { useRouter } from 'next/navigation';

import MuiButton from '@/components/UI/MuiButton';
import { PublicRoutes } from '@/config/routes';

const EmailPage = () => {
  const router = useRouter();

  return (
 <Box>

     <MuiButton
         color='secondary'
         variant='text'
         fullWidth
         onClick={() => router.push(PublicRoutes.activateSubscription)}
     >
   send Email
     </MuiButton>

     <MuiButton
         color='secondary'
         variant='text'
         fullWidth
         onClick={() => router.push(PublicRoutes.activateSubscription)}
     >
         50 free coins
     </MuiButton>

 </Box>
  );
};

export default EmailPage;

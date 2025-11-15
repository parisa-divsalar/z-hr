import { Stack, Typography } from '@mui/material';
import Link from 'next/link';

import CustomButton from 'src/components/UI/MuiButton';

export default function LandingPage() {
  return (
    <Stack p={2} textAlign='center'>
      <Typography variant='subtitle1'>🏡 Welcome</Typography>

      <Link href='/uikit'>
        <CustomButton>UI Kit</CustomButton>
      </Link>
    </Stack>
  );
}

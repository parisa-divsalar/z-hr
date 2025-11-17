import { Stack, Typography } from '@mui/material';
import Link from 'next/link';

import MuiButton from 'src/components/UI/MuiButton';

export default function LandingPage() {
  return (
    <Stack p={2} textAlign='center'>
      <Typography variant='subtitle1'>🏡 Landing</Typography>

      <Link href='/uikit'>
        <MuiButton>UiKit</MuiButton>
      </Link>
    </Stack>
  );
}

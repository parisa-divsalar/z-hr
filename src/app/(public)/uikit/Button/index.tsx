import { Stack, Typography } from '@mui/material';

import { ArrowRight } from '@/components/Icons';
import MuiButton from '@/components/UI/MuiButton';

const AllButton = () => {
  return (
    <>
      <Typography variant='subtitle1' color='text.primary' fontWeight='600'>
        Different button states:
      </Typography>

      <Stack gap={2}>
        <MuiButton fullWidth startIcon={<ArrowRight />}>
          Title
        </MuiButton>

        <MuiButton fullWidth variant='outlined' startIcon={<ArrowRight />}>
          Title
        </MuiButton>
      </Stack>

      <Stack direction='row' gap={1} mt={2}>
        <MuiButton size='small'>Title</MuiButton>

        <MuiButton size='small' color='secondary'>
          Title
        </MuiButton>

        <MuiButton size='small' color='error'>
          Title
        </MuiButton>

        <MuiButton size='small' variant='outlined'>
          Title
        </MuiButton>

        <MuiButton size='small' variant='text'>
          Title
        </MuiButton>

        <MuiButton size='small' variant='outlined' fullWidth>
          Title
        </MuiButton>
      </Stack>

      <Stack direction='row' gap={1} mt={2}>
        <MuiButton>Title</MuiButton>

        <MuiButton color='secondary'>Title</MuiButton>

        <MuiButton color='error'>Title</MuiButton>

        <MuiButton variant='outlined'>Title</MuiButton>

        <MuiButton variant='text' color='secondary'>
          Title
        </MuiButton>

        <MuiButton variant='outlined' fullWidth color='secondary'>
          Title
        </MuiButton>
      </Stack>

      <Stack direction='row' gap={1} mt={2}>
        <MuiButton size='large'>Title</MuiButton>

        <MuiButton size='large' color='secondary'>
          Title
        </MuiButton>

        <MuiButton size='large' color='error'>
          Title
        </MuiButton>

        <MuiButton size='large' variant='outlined'>
          Title
        </MuiButton>

        <MuiButton size='large' variant='text' color='error'>
          Title
        </MuiButton>

        <MuiButton size='large' variant='outlined' fullWidth color='error'>
          Title
        </MuiButton>
      </Stack>

      <Stack direction='row' gap={1} mt={2}>
        <MuiButton disabled>Title</MuiButton>

        <MuiButton variant='outlined' disabled>
          Title
        </MuiButton>

        <MuiButton variant='text' disabled>
          Title
        </MuiButton>

        <MuiButton disabled fullWidth>
          Title
        </MuiButton>

        <MuiButton disabled loading fullWidth>
          Title
        </MuiButton>

        <MuiButton disabled loading>
          Title
        </MuiButton>
      </Stack>
    </>
  );
};

export default AllButton;

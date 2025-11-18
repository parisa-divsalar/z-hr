import { Stack, Typography } from '@mui/material';

import { Edit } from '@/components/Icons';
import MuiButton from '@/components/UI/MuiButton';

const AllButton = () => {
  return (
    <>
      <Typography variant='subtitle1' color='text.primary' fontWeight='600'>
        Buttons
      </Typography>

      <Stack gap={2}>
        <MuiButton fullWidth>Title</MuiButton>

        <MuiButton fullWidth variant='outlined'>
          Title
        </MuiButton>

        <Stack direction='row' gap={1} alignItems='end'>
          <MuiButton size='large' startIcon={<Edit />} endIcon={<Edit />}>
            Title
          </MuiButton>

          <MuiButton size='medium' startIcon={<Edit />} endIcon={<Edit />}>
            Title
          </MuiButton>

          <MuiButton size='small' startIcon={<Edit />} endIcon={<Edit />}>
            Title
          </MuiButton>
        </Stack>

        <Stack direction='row' gap={1} alignItems='end'>
          <MuiButton size='large' startIcon={<Edit />} endIcon={<Edit />} color='secondary'>
            Title
          </MuiButton>

          <MuiButton size='medium' startIcon={<Edit />} endIcon={<Edit />} color='secondary'>
            Title
          </MuiButton>

          <MuiButton size='small' startIcon={<Edit />} endIcon={<Edit />} color='secondary'>
            Title
          </MuiButton>
        </Stack>

        <Stack direction='row' gap={1} alignItems='end'>
          <MuiButton size='large' startIcon={<Edit />} endIcon={<Edit />} color='secondary' variant='outlined'>
            Title
          </MuiButton>

          <MuiButton size='medium' startIcon={<Edit />} endIcon={<Edit />} color='secondary' variant='outlined'>
            Title
          </MuiButton>

          <MuiButton size='small' startIcon={<Edit />} endIcon={<Edit />} color='secondary' variant='outlined'>
            Title
          </MuiButton>
        </Stack>

        <Stack direction='row' gap={1} alignItems='end'>
          <MuiButton size='large' startIcon={<Edit />} endIcon={<Edit />} color='error'>
            Title
          </MuiButton>

          <MuiButton size='medium' startIcon={<Edit />} endIcon={<Edit />} color='error'>
            Title
          </MuiButton>

          <MuiButton size='small' startIcon={<Edit />} endIcon={<Edit />} color='error'>
            Title
          </MuiButton>
        </Stack>

        <Stack direction='row' gap={1} alignItems='end'>
          <MuiButton size='large' startIcon={<Edit />} endIcon={<Edit />} disabled>
            Title
          </MuiButton>

          <MuiButton size='medium' startIcon={<Edit />} endIcon={<Edit />} disabled>
            Title
          </MuiButton>

          <MuiButton size='small' startIcon={<Edit />} endIcon={<Edit />} disabled>
            Title
          </MuiButton>
        </Stack>

        <Stack direction='row' gap={1} alignItems='end'>
          <MuiButton size='large' startIcon={<Edit />} endIcon={<Edit />} variant='outlined'>
            Title
          </MuiButton>

          <MuiButton size='medium' startIcon={<Edit />} endIcon={<Edit />} variant='outlined'>
            Title
          </MuiButton>

          <MuiButton size='small' startIcon={<Edit />} endIcon={<Edit />} variant='outlined'>
            Title
          </MuiButton>
        </Stack>

        <Stack direction='row' gap={1} alignItems='end'>
          <MuiButton size='large' startIcon={<Edit />} endIcon={<Edit />} variant='outlined' disabled>
            Title
          </MuiButton>

          <MuiButton size='medium' startIcon={<Edit />} endIcon={<Edit />} variant='outlined' disabled>
            Title
          </MuiButton>

          <MuiButton size='small' startIcon={<Edit />} endIcon={<Edit />} variant='outlined' disabled>
            Title
          </MuiButton>
        </Stack>

        <Stack direction='row' gap={1} alignItems='end'>
          <MuiButton size='large' startIcon={<Edit />} endIcon={<Edit />} variant='text'>
            Title
          </MuiButton>

          <MuiButton size='medium' startIcon={<Edit />} endIcon={<Edit />} variant='text'>
            Title
          </MuiButton>

          <MuiButton size='small' startIcon={<Edit />} endIcon={<Edit />} variant='text'>
            Title
          </MuiButton>
        </Stack>

        <Stack direction='row' gap={1} alignItems='end'>
          <MuiButton size='large' startIcon={<Edit />} endIcon={<Edit />} variant='text' disabled>
            Title
          </MuiButton>

          <MuiButton size='medium' startIcon={<Edit />} endIcon={<Edit />} variant='text' disabled>
            Title
          </MuiButton>

          <MuiButton size='small' startIcon={<Edit />} endIcon={<Edit />} variant='text' disabled>
            Title
          </MuiButton>
        </Stack>
      </Stack>
    </>
  );
};

export default AllButton;

import { Stack, Typography } from '@mui/material';

import AddIcon from '@/assets/images/icons/add.svg';
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
          <MuiButton size='large' startIcon={<AddIcon />} endIcon={<AddIcon />}>
            Title
          </MuiButton>

          <MuiButton size='medium' startIcon={<AddIcon />} endIcon={<AddIcon />}>
            Title
          </MuiButton>

          <MuiButton size='small' startIcon={<AddIcon />} endIcon={<AddIcon />}>
            Title
          </MuiButton>
        </Stack>

        <Stack direction='row' gap={1} alignItems='end'>
          <MuiButton size='large' startIcon={<AddIcon />} endIcon={<AddIcon />} color='secondary'>
            Title
          </MuiButton>

          <MuiButton size='medium' startIcon={<AddIcon />} endIcon={<AddIcon />} color='secondary'>
            Title
          </MuiButton>

          <MuiButton size='small' startIcon={<AddIcon />} endIcon={<AddIcon />} color='secondary'>
            Title
          </MuiButton>
        </Stack>

        <Stack direction='row' gap={1} alignItems='end'>
          <MuiButton size='large' startIcon={<AddIcon />} endIcon={<AddIcon />} color='secondary' variant='outlined'>
            Title
          </MuiButton>

          <MuiButton size='medium' startIcon={<AddIcon />} endIcon={<AddIcon />} color='secondary' variant='outlined'>
            Title
          </MuiButton>

          <MuiButton size='small' startIcon={<AddIcon />} endIcon={<AddIcon />} color='secondary' variant='outlined'>
            Title
          </MuiButton>
        </Stack>

        <Stack direction='row' gap={1} alignItems='end'>
          <MuiButton size='large' startIcon={<AddIcon />} endIcon={<AddIcon />} color='error'>
            Title
          </MuiButton>

          <MuiButton size='medium' startIcon={<AddIcon />} endIcon={<AddIcon />} color='error'>
            Title
          </MuiButton>

          <MuiButton size='small' startIcon={<AddIcon />} endIcon={<AddIcon />} color='error'>
            Title
          </MuiButton>
        </Stack>

        <Stack direction='row' gap={1} alignItems='end'>
          <MuiButton size='large' startIcon={<AddIcon />} endIcon={<AddIcon />} disabled>
            Title
          </MuiButton>

          <MuiButton size='medium' startIcon={<AddIcon />} endIcon={<AddIcon />} disabled>
            Title
          </MuiButton>

          <MuiButton size='small' startIcon={<AddIcon />} endIcon={<AddIcon />} disabled>
            Title
          </MuiButton>
        </Stack>

        <Stack direction='row' gap={1} alignItems='end'>
          <MuiButton size='large' startIcon={<AddIcon />} endIcon={<AddIcon />} variant='outlined'>
            Title
          </MuiButton>

          <MuiButton size='medium' startIcon={<AddIcon />} endIcon={<AddIcon />} variant='outlined'>
            Title
          </MuiButton>

          <MuiButton size='small' startIcon={<AddIcon />} endIcon={<AddIcon />} variant='outlined'>
            Title
          </MuiButton>
        </Stack>

        <Stack direction='row' gap={1} alignItems='end'>
          <MuiButton size='large' startIcon={<AddIcon />} endIcon={<AddIcon />} variant='outlined' disabled>
            Title
          </MuiButton>

          <MuiButton size='medium' startIcon={<AddIcon />} endIcon={<AddIcon />} variant='outlined' disabled>
            Title
          </MuiButton>

          <MuiButton size='small' startIcon={<AddIcon />} endIcon={<AddIcon />} variant='outlined' disabled>
            Title
          </MuiButton>
        </Stack>

        <Stack direction='row' gap={1} alignItems='end'>
          <MuiButton size='large' startIcon={<AddIcon />} endIcon={<AddIcon />} variant='text'>
            Title
          </MuiButton>

          <MuiButton size='medium' startIcon={<AddIcon />} endIcon={<AddIcon />} variant='text'>
            Title
          </MuiButton>

          <MuiButton size='small' startIcon={<AddIcon />} endIcon={<AddIcon />} variant='text'>
            Title
          </MuiButton>
        </Stack>

        <Stack direction='row' gap={1} alignItems='end'>
          <MuiButton size='large' startIcon={<AddIcon />} endIcon={<AddIcon />} variant='text' disabled>
            Title
          </MuiButton>

          <MuiButton size='medium' startIcon={<AddIcon />} endIcon={<AddIcon />} variant='text' disabled>
            Title
          </MuiButton>

          <MuiButton size='small' startIcon={<AddIcon />} endIcon={<AddIcon />} variant='text' disabled>
            Title
          </MuiButton>
        </Stack>
      </Stack>
    </>
  );
};

export default AllButton;

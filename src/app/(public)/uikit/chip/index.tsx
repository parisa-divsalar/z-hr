import AccessTimeRoundedIcon from '@mui/icons-material/AccessTimeRounded';
import { Stack, Typography } from '@mui/material';

import MuiChip from '@/components/UI/MuiChip';

const AllChip = () => {
  return (
    <>
      <Typography variant='subtitle1' color='text.primary' fontWeight='600' mt={1}>
        Chip
      </Typography>

      <Stack direction='row' gap={1} mt={2}>
        <MuiChip size='small' label='label' />
        <MuiChip size='small' label='label' color='secondary' />
        <MuiChip size='small' label='label' color='success' />
        <MuiChip size='small' label='label' color='error' />
        <MuiChip size='small' label='label' color='info' />
        <MuiChip size='small' label='label' variant='outlined' />
        <MuiChip size='small' label='label' color='secondary' variant='outlined' />
        <MuiChip size='small' label='label' color='error' variant='outlined' />
      </Stack>

      <Stack direction='row' gap={1} mt={1}>
        <MuiChip label='label' clickable icon={<AccessTimeRoundedIcon fontSize='small' />} />
        <MuiChip label='label' clickable color='secondary' onDelete={() => console.log('delete')} />
        <MuiChip label='label' clickable color='success' />
        <MuiChip label='label' clickable color='error' />
        <MuiChip label='label' clickable variant='outlined' />
        <MuiChip label='label' color='primary' variant='outlined' onDelete={() => console.log('delete')} />
        <MuiChip label='label' clickable color='error' variant='outlined' />
      </Stack>

      <Stack direction='row' gap={1} mt={1}>
        <MuiChip disabled label='label' />
        <MuiChip disabled label='label' color='secondary' />
        <MuiChip disabled label='label' color='success' />
        <MuiChip disabled label='label' color='error' />
        <MuiChip disabled label='label' color='info' />
        <MuiChip disabled label='label' variant='outlined' />
        <MuiChip disabled label='label' color='secondary' variant='outlined' />
        <MuiChip disabled label='label' color='error' variant='outlined' />
      </Stack>
    </>
  );
};

export default AllChip;
